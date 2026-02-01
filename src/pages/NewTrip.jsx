import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { parseConfirmationEmails } from "@/functions/parseConfirmationEmails";
import { getGmailAuthUrl } from "@/functions/getGmailAuthUrl";

import TripBasicInfo from "../components/trip/TripBasicInfo";
import TripTravelDetails from "../components/trip/TripTravelDetails";
import { trackEvent } from "../components/analytics/MetaPixel";

export default function NewTrip() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const editTripId = urlParams.get('edit');
  const isEditMode = !!editTripId;
  
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isParsingEmails, setIsParsingEmails] = useState(false);
  const [createdTripId, setCreatedTripId] = useState(null);

  const [tripData, setTripData] = useState({
    trip_name: "",
    destination: "",
    destination_country: "",
    destinations: [],
    start_date: "",
    end_date: "",
    travelers_count: 1,
    trip_cost: 0,
    flights: [],
    hotel_name: "",
    hotel_booking_number: "",
    car_rental_company: "",
    car_rental_booking_number: "",
    cruise_line: "",
    cruise_booking_number: "",
    status: "planning"
  });
  const [emailData, setEmailData] = useState(null);

  // Load existing trip data if in edit mode
  const { data: existingTrip, isLoading: loadingTrip } = useQuery({
    queryKey: ['trip', editTripId],
    queryFn: () => base44.entities.Trip.filter({ id: editTripId }).then(trips => trips[0]),
    enabled: isEditMode,
    retry: 1
  });

  React.useEffect(() => {
    if (existingTrip) {
      setTripData(existingTrip);
    }
  }, [existingTrip]);

  const createTripMutation = useMutation({
    mutationFn: async (data) => {
      try {
        let trip;
        
        if (isEditMode) {
          // Update existing trip
          await base44.entities.Trip.update(editTripId, data);
          trip = { ...data, id: editTripId };
        } else {
          // Create new trip
          trip = await base44.entities.Trip.create(data);
          setCreatedTripId(trip.id);
          
          trackEvent('Lead', {
            content_name: 'Trip Created',
            content_category: 'trip',
            value: data.trip_cost || 0,
            currency: 'USD'
          });
        }
        
        // Only run risk analysis for new trips
        if (!isEditMode) {
          setIsAnalyzing(true);
          
          try {
            const riskAnalysis = await Promise.race([
              analyzeRisk(trip),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Risk analysis timeout')), 60000)
              )
            ]);
            
            await base44.entities.Trip.update(trip.id, {
              risk_assessment: riskAnalysis.risk_assessment,
              recommended_coverage: riskAnalysis.recommended_coverage,
              risk_details: riskAnalysis.risk_details
            });
          } catch (analysisError) {
            console.error('Risk analysis failed:', analysisError);
          }
        }
        
        return trip;
      } catch (error) {
        console.error('Trip operation failed:', error);
        throw error;
      }
    },
    onSuccess: (trip) => {
      setIsAnalyzing(false);
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trip', trip.id] });
      navigate(createPageUrl(`TripDetail?id=${trip.id}`));
    },
    onError: (error) => {
      console.error('Trip mutation error:', error);
      setIsAnalyzing(false);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} trip: ` + (error.message || 'Unknown error'));
    }
  });

  const handleParseEmailsOnStep1 = async () => {
    setIsParsingEmails(true);
    try {
      const user = await base44.auth.me();
      
      if (!user.gmail_access_token || (user.gmail_token_expiry && user.gmail_token_expiry < Date.now())) {
        const { data } = await getGmailAuthUrl();
        window.location.href = data.authUrl;
        return;
      }
      
      // Create a temporary trip to parse against
      const tempTrip = await base44.entities.Trip.create({
        trip_name: "Temp Trip",
        destination: "TBD",
        destination_country: "TBD",
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        status: "planning"
      });
      
      const response = await parseConfirmationEmails({ 
        tripId: tempTrip.id,
        accessToken: user.gmail_access_token 
      });
      
      // Delete temp trip
      await base44.entities.Trip.delete(tempTrip.id);
      
      if (response.data.success && response.data.bookings) {
        setEmailData(response.data.bookings);
        
        // Auto-populate form fields
        const bookings = response.data.bookings;
        const updates = {};
        
        // Generate trip name from destination and map flights
        if (bookings.flights?.length > 0) {
          const flight = bookings.flights[0];
          updates.destination = flight.arrival_airport || "";
          updates.trip_name = `Trip to ${flight.arrival_airport || 'Destination'}`;
          updates.flights = bookings.flights.map(f => ({
            airline: f.airline,
            flight_number: f.flight_number,
            departure_airport: f.departure_airport || '',
            arrival_airport: f.arrival_airport || '',
            departure_date: '',
            departure_time: ''
          }));
        }
        
        if (bookings.hotels?.length > 0) {
          const hotel = bookings.hotels[0];
          updates.hotel_name = hotel.hotel_name;
          updates.hotel_booking_number = hotel.booking_number;
          updates.start_date = hotel.check_in;
          updates.end_date = hotel.check_out;
          if (!updates.destination && hotel.address) {
            updates.destination = hotel.address.split(',')[0];
            updates.trip_name = `Trip to ${hotel.address.split(',')[0]}`;
          }
        }
        
        if (bookings.car_rentals?.length > 0) {
          const rental = bookings.car_rentals[0];
          updates.car_rental_company = rental.company;
          updates.car_rental_booking_number = rental.booking_number;
        }
        
        if (bookings.cruises?.length > 0) {
          const cruise = bookings.cruises[0];
          updates.cruise_line = cruise.cruise_line;
          updates.cruise_booking_number = cruise.booking_number;
          if (!updates.destination) {
            updates.destination = cruise.departure_port || "";
            updates.trip_name = `Cruise from ${cruise.departure_port || 'Port'}`;
          }
        }
        
        setTripData(prev => ({ ...prev, ...updates }));
        
        // Show success message
        const totalBookings = (bookings.flights?.length || 0) + (bookings.hotels?.length || 0) + 
                             (bookings.car_rentals?.length || 0) + (bookings.cruises?.length || 0);
        
        if (totalBookings > 0) {
          alert(`Found ${totalBookings} booking(s)! Your trip details have been populated.`);
        } else {
          alert('No booking confirmations found in your recent emails. Please enter details manually.');
        }
        
        // Auto-advance to step 2 if we have required fields
        if (updates.destination && updates.start_date && updates.end_date) {
          setTimeout(() => setStep(2), 500);
        }
      } else {
        alert('No booking emails found. Please enter details manually.');
      }
    } catch (error) {
      if (error.response?.data?.needsAuth) {
        const { data } = await getGmailAuthUrl();
        window.location.href = data.authUrl;
      } else {
        alert('Failed to parse emails. Please enter details manually.');
      }
    } finally {
      setIsParsingEmails(false);
    }
  };

  const analyzeRisk = async (trip) => {
      const flightDetails = trip.flights && trip.flights.length > 0 
        ? trip.flights.map((f, i) => `Flight ${i+1}: ${f.airline} ${f.flight_number} (${f.departure_airport} → ${f.arrival_airport})`).join('\n  ')
        : 'Not specified';

      const destinationsDetails = trip.destinations && trip.destinations.length > 0
        ? trip.destinations.map((d, i) => `Stop ${i+1}: ${d.city}, ${d.country} (${d.arrival_date} to ${d.departure_date}) - Purpose: ${d.purpose}`).join('\n  ')
        : 'Not specified';

      const prompt = `You are a travel risk analyst with access to live data sources. Provide a COMPREHENSIVE real-time risk assessment for this MULTI-DESTINATION trip:

  Trip Name: ${trip.trip_name}
  Overall Travel Dates: ${trip.start_date} to ${trip.end_date}
  
  DESTINATIONS (analyze risk for EACH location):
  ${destinationsDetails}
  
  Flights:
  ${flightDetails}
  Hotel: ${trip.hotel_name || 'Not specified'}
  Travelers: ${trip.travelers_count}
  Trip Cost: $${trip.trip_cost}

  CRITICAL: Assess risk for EACH destination separately, then provide an overall score that reflects the HIGHEST risk across all locations.

  CRITICAL: Check these OFFICIAL real-time sources:

  GOVERNMENT & TRAVEL ADVISORIES (check for ALL destinations):
  - US State Department travel advisories for each country visited
  - CDC health notices and vaccination requirements for each destination
  - TSA updates and security alerts
  - Local government official websites for each city

  CRIME & SAFETY (check for ALL destinations):
  - Current crime statistics for each city
  - Recent incidents affecting tourists in each location
  - Police reports and safety databases for all destinations
  - Travel safety forums and recent traveler experiences

  FLIGHT & AIRPORT INTELLIGENCE:
  - Live flight status for all flights listed above
  - FlightAware/FlightRadar24 current delay patterns for these routes
  - Real-time TSA wait times at departure airports
  - Airport websites for closures, construction, critical updates
  - Current traffic conditions to airports
  - Parking availability and shuttle status

  WEATHER CONDITIONS:
  - Current weather at departure and arrival airports
  - Hour-by-hour forecast for travel dates
  - Severe weather alerts or warnings
  - Historical weather patterns for these dates
  - Storm tracking and precipitation forecasts

  NEWS & CURRENT EVENTS (check for ALL destinations):
  - Breaking news in each destination city
  - Political protests or civil unrest in any location
  - Natural disasters or emergencies at any stop
  - Local events causing disruptions in any destination

  AIRLINE SPECIFIC:
  - Recent cancellations and delays for the airlines listed above
  - Baggage handling issues or lost luggage rates
  - Customer service problems or labor disputes

  DESTINATION SPECIFIC (for ALL destinations):
  - Local laws travelers should know in each location
  - Scams targeting tourists in each city
  - Healthcare quality and hospital access for all destinations
  - Communication (wifi/phone service) in each location

  Score each risk 0-100 (0=no risk, 100=extreme risk). The overall_score should be the MAXIMUM risk across all destinations. Be detailed and specific with reasoning based on ACTUAL current data for EACH location.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            risk_assessment: {
              type: "object",
              properties: {
                overall_score: { type: "number" },
                flight_delay_risk: { type: "number" },
                weather_risk: { type: "number" },
                crime_risk: { type: "number" },
                political_risk: { type: "number" },
                health_risk: { type: "number" },
                disruption_risk: { type: "number" },
                airport_conditions: { type: "string" },
                tsa_wait_times: { type: "string" },
                last_updated: { type: "string" }
              }
            },
            recommended_coverage: {
              type: "array",
              items: { type: "string" }
            },
            risk_details: {
              type: "object",
              properties: {
                flight_delay_reasoning: { type: "string" },
                weather_reasoning: { type: "string" },
                crime_reasoning: { type: "string" },
                political_reasoning: { type: "string" },
                health_reasoning: { type: "string" },
                disruption_reasoning: { type: "string" },
                airport_intel: { type: "string" },
                critical_alerts: { 
                  type: "array",
                  items: { type: "string" }
                }
              }
            }
          }
        }
      });

      return {
        ...result,
        risk_assessment: {
          ...result.risk_assessment,
          last_updated: new Date().toISOString()
        }
      };
    };

  const handleSubmit = () => {
    createTripMutation.mutate(tripData);
  };

  const updateTripData = (field, value) => {
    setTripData(prev => ({ ...prev, [field]: value }));
  };

  if (isEditMode && loadingTrip) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading trip data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(isEditMode ? createPageUrl(`TripDetail?id=${editTripId}`) : createPageUrl("Dashboard"))}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isEditMode ? 'Back to Trip' : 'Back to Dashboard'}
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Trip' : 'Add New Trip'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditMode 
              ? 'Update your trip details' 
              : 'Tell us about your travel plans and we\'ll assess the risks and recommend coverage'}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="hidden sm:inline font-medium">Basic Info</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="hidden sm:inline font-medium">Travel Details</span>
            </div>
          </div>
        </div>

        <Card className="border-none shadow-xl">
          <CardContent className="p-6 md:p-8">
            {step === 1 && (
              <TripBasicInfo 
                tripData={tripData}
                updateTripData={updateTripData}
                onNext={() => setStep(2)}
                onParseEmails={isEditMode ? null : handleParseEmailsOnStep1}
                isParsingEmails={isParsingEmails}
              />
            )}

            {step === 2 && (
              <TripTravelDetails 
                tripData={tripData}
                updateTripData={updateTripData}
                onBack={() => setStep(1)}
                onSubmit={handleSubmit}
                isSubmitting={createTripMutation.isPending || isAnalyzing}
              />
            )}
          </CardContent>
        </Card>

        {isAnalyzing && (
          <Card className="mt-6 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Analyzing your trip...</p>
                  <p className="text-sm text-blue-700">
                    We're assessing risks and generating personalized recommendations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}