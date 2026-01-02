import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { parseConfirmationEmails } from "@/functions/parseConfirmationEmails";
import { getGmailAuthUrl } from "@/functions/getGmailAuthUrl";

import TripBasicInfo from "../components/trip/TripBasicInfo";
import TripTravelDetails from "../components/trip/TripTravelDetails";

export default function NewTrip() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isParsingEmails, setIsParsingEmails] = useState(false);
  const [createdTripId, setCreatedTripId] = useState(null);

  const [tripData, setTripData] = useState({
    trip_name: "",
    destination: "",
    destination_country: "",
    start_date: "",
    end_date: "",
    travelers_count: 1,
    trip_cost: 0,
    airline: "",
    flight_number: "",
    hotel_name: "",
    hotel_booking_number: "",
    car_rental_company: "",
    car_rental_booking_number: "",
    cruise_line: "",
    cruise_booking_number: "",
    status: "planning"
  });
  const [emailData, setEmailData] = useState(null);

  const createTripMutation = useMutation({
    mutationFn: async (data) => {
      const trip = await base44.entities.Trip.create(data);
      setCreatedTripId(trip.id);
      
      setIsAnalyzing(true);
      const riskAnalysis = await analyzeRisk(trip);
      
      await base44.entities.Trip.update(trip.id, {
        risk_assessment: riskAnalysis.risk_assessment,
        recommended_coverage: riskAnalysis.recommended_coverage
      });
      
      return trip;
    },
    onSuccess: (trip) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      navigate(createPageUrl(`TripDetail?id=${trip.id}`));
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
        
        // Generate trip name from destination
        if (bookings.flights?.length > 0) {
          const flight = bookings.flights[0];
          updates.destination = flight.arrival_airport || "";
          updates.trip_name = `Trip to ${flight.arrival_airport || 'Destination'}`;
          updates.airline = flight.airline;
          updates.flight_number = flight.flight_number;
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
        
        // Auto-advance to step 2 if we have required fields
        if (updates.destination && updates.start_date && updates.end_date) {
          setTimeout(() => setStep(2), 500);
        }
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
    const prompt = `Analyze the travel risk for this trip and provide recommendations:
    
Destination: ${trip.destination}, ${trip.destination_country}
Travel Dates: ${trip.start_date} to ${trip.end_date}
Airline: ${trip.airline || 'Not specified'}
Hotel: ${trip.hotel_name || 'Not specified'}
Travelers: ${trip.travelers_count}
Trip Cost: $${trip.trip_cost}

Assess the following risks on a scale of 0-100:
1. Flight delay risk (based on airline, season, destination)
2. Crime risk (based on destination safety data)
3. General disruption risk (weather, political stability, etc.)
4. Health risk (disease outbreaks, healthcare quality)

Also recommend which insurance coverage types would be most important for this trip.

Provide detailed reasoning for each risk score.`;

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
              crime_risk: { type: "number" },
              disruption_risk: { type: "number" },
              health_risk: { type: "number" },
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
              crime_reasoning: { type: "string" },
              disruption_reasoning: { type: "string" },
              health_reasoning: { type: "string" }
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

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Add New Trip</h1>
          <p className="text-gray-600 mt-2">
            Tell us about your travel plans and we'll assess the risks and recommend coverage
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
                onParseEmails={handleParseEmailsOnStep1}
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