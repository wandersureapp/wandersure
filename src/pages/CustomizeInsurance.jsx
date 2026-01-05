import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  CheckCircle, 
  Sparkles,
  ArrowLeft,
  Plane,
  Cloud,
  AlertTriangle,
  Activity,
  TrendingUp,
  Brain
} from "lucide-react";

export default function CustomizeInsurance() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const tripId = urlParams.get("tripId");

  const { data: trip, isLoading: loadingTrip } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: async () => {
      const trips = await base44.entities.Trip.list();
      return trips.find(t => t.id === tripId);
    },
    enabled: !!tripId
  });

  const coverageLabels = {
    trip_cancellation: { name: "Trip Cancellation", icon: "🚫", description: "Reimburses non-refundable costs if you must cancel" },
    trip_interruption: { name: "Trip Interruption", icon: "✂️", description: "Covers costs if your trip is cut short" },
    baggage_loss: { name: "Baggage Loss", icon: "🧳", description: "Reimbursement for lost or stolen luggage" },
    baggage_delay: { name: "Baggage Delay", icon: "⏰", description: "Coverage for essentials if baggage is delayed" },
    medical_emergency: { name: "Medical Emergency", icon: "🏥", description: "Emergency medical expenses while traveling" },
    medical_evacuation: { name: "Medical Evacuation", icon: "🚁", description: "Emergency transportation to medical facilities" },
    theft_protection: { name: "Theft Protection", icon: "🔒", description: "Protection against theft and robbery" },
    flight_delay: { name: "Flight Delay", icon: "✈️", description: "Compensation for significant delays" },
    rental_car_damage: { name: "Rental Car Damage", icon: "🚗", description: "Coverage for rental vehicle damage" },
    missed_connection: { name: "Missed Connection", icon: "🔄", description: "Covers costs from missed connections" },
    natural_disaster: { name: "Natural Disaster", icon: "🌪️", description: "Weather-related disruption protection" },
    political_risk: { name: "Political Unrest Coverage", icon: "🏛️", description: "Protection during civil unrest" },
    health_risk: { name: "Health & Disease Coverage", icon: "💊", description: "Protection against health outbreaks" },
    disruption_risk: { name: "Travel Disruption Insurance", icon: "⚠️", description: "Coverage for unexpected travel interruptions" }
  };

  if (loadingTrip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">Trip not found</p>
            <Button onClick={() => navigate(createPageUrl("MyTrips"))}>
              Return to My Trips
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const riskScore = trip.risk_assessment?.overall_score || 0;
  const riskAssessment = trip.risk_assessment || {};
  const riskDetails = trip.risk_details || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl(`TripDetail?id=${tripId}`))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Trip
        </Button>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            WanderSure's AI Insurance Analysis
          </h1>
          <p className="text-xl text-gray-600">
            Real-time risk analysis for {trip.trip_name}
          </p>
        </div>

        {/* Main Analysis Card */}
        <Card className="border-2 border-purple-300 bg-gradient-to-br from-white to-purple-50 mb-6 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="w-6 h-6" />
              Your Trip's Unique Risk Profile
            </CardTitle>
            <p className="text-purple-100 text-sm mt-2">
              Unlike generic insurance sites, WanderSure uses live data to analyze your specific journey
            </p>
          </CardHeader>
          <CardContent className="p-8">
            {/* Overall Risk Score */}
            <div className="text-center mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-purple-200">
              <p className="text-sm text-gray-600 mb-2">Overall Risk Assessment</p>
              <div className="flex items-center justify-center gap-4">
                <div className={`text-6xl font-bold ${
                  riskScore < 30 ? 'text-green-600' :
                  riskScore < 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {riskScore}
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-gray-900">
                    {riskScore < 30 ? 'Low Risk' : riskScore < 60 ? 'Moderate Risk' : 'High Risk'}
                  </p>
                  <p className="text-sm text-gray-600">{trip.destination}, {trip.destination_country}</p>
                </div>
              </div>
            </div>

            {/* Risk Breakdown */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Live Risk Analysis Breakdown
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {riskAssessment.flight_delay_risk > 0 && (
                  <div className={`p-5 rounded-lg border-2 ${
                    riskAssessment.flight_delay_risk > 60 ? 'bg-red-50 border-red-300' :
                    riskAssessment.flight_delay_risk > 30 ? 'bg-yellow-50 border-yellow-300' :
                    'bg-green-50 border-green-300'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <Plane className={`w-6 h-6 ${
                        riskAssessment.flight_delay_risk > 60 ? 'text-red-600' :
                        riskAssessment.flight_delay_risk > 30 ? 'text-yellow-600' :
                        'text-green-600'
                      }`} />
                      <div>
                        <p className="font-bold text-gray-900">Flight Delays</p>
                        <p className="text-2xl font-bold">{Math.round(riskAssessment.flight_delay_risk)}/100</p>
                      </div>
                    </div>
                    {riskDetails.flight_delay_reasoning && (
                      <p className="text-xs text-gray-700">{riskDetails.flight_delay_reasoning}</p>
                    )}
                  </div>
                )}

                {riskAssessment.weather_risk > 0 && (
                  <div className={`p-5 rounded-lg border-2 ${
                    riskAssessment.weather_risk > 60 ? 'bg-red-50 border-red-300' :
                    riskAssessment.weather_risk > 30 ? 'bg-yellow-50 border-yellow-300' :
                    'bg-green-50 border-green-300'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <Cloud className={`w-6 h-6 ${
                        riskAssessment.weather_risk > 60 ? 'text-red-600' :
                        riskAssessment.weather_risk > 30 ? 'text-yellow-600' :
                        'text-green-600'
                      }`} />
                      <div>
                        <p className="font-bold text-gray-900">Weather</p>
                        <p className="text-2xl font-bold">{Math.round(riskAssessment.weather_risk)}/100</p>
                      </div>
                    </div>
                    {riskDetails.weather_reasoning && (
                      <p className="text-xs text-gray-700">{riskDetails.weather_reasoning}</p>
                    )}
                  </div>
                )}

                {riskAssessment.crime_risk > 0 && (
                  <div className={`p-5 rounded-lg border-2 ${
                    riskAssessment.crime_risk > 60 ? 'bg-red-50 border-red-300' :
                    riskAssessment.crime_risk > 30 ? 'bg-yellow-50 border-yellow-300' :
                    'bg-green-50 border-green-300'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className={`w-6 h-6 ${
                        riskAssessment.crime_risk > 60 ? 'text-red-600' :
                        riskAssessment.crime_risk > 30 ? 'text-yellow-600' :
                        'text-green-600'
                      }`} />
                      <div>
                        <p className="font-bold text-gray-900">Safety</p>
                        <p className="text-2xl font-bold">{Math.round(riskAssessment.crime_risk)}/100</p>
                      </div>
                    </div>
                    {riskDetails.crime_reasoning && (
                      <p className="text-xs text-gray-700">{riskDetails.crime_reasoning}</p>
                    )}
                  </div>
                )}

                {riskAssessment.health_risk > 0 && (
                  <div className={`p-5 rounded-lg border-2 ${
                    riskAssessment.health_risk > 60 ? 'bg-red-50 border-red-300' :
                    riskAssessment.health_risk > 30 ? 'bg-yellow-50 border-yellow-300' :
                    'bg-green-50 border-green-300'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle className={`w-6 h-6 ${
                        riskAssessment.health_risk > 60 ? 'text-red-600' :
                        riskAssessment.health_risk > 30 ? 'text-yellow-600' :
                        'text-green-600'
                      }`} />
                      <div>
                        <p className="font-bold text-gray-900">Health</p>
                        <p className="text-2xl font-bold">{Math.round(riskAssessment.health_risk)}/100</p>
                      </div>
                    </div>
                    {riskDetails.health_reasoning && (
                      <p className="text-xs text-gray-700">{riskDetails.health_reasoning}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Critical Alerts */}
            {riskDetails.critical_alerts && riskDetails.critical_alerts.length > 0 && (
              <div className="mb-8 p-6 bg-red-50 border-2 border-red-300 rounded-lg">
                <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2 text-lg">
                  <AlertTriangle className="w-5 h-5" />
                  Critical Alerts Detected
                </h4>
                <ul className="space-y-2">
                  {riskDetails.critical_alerts.map((alert, idx) => (
                    <li key={idx} className="text-sm text-red-800 flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>{alert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended Coverage */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                AI-Recommended Coverage
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Based on the analysis above, our AI recommends the following protection:
              </p>
              {trip.recommended_coverage && trip.recommended_coverage.length > 0 ? (
                <div className="grid gap-3">
                  {trip.recommended_coverage.map((coverage) => {
                    const coverageInfo = coverageLabels[coverage] || { name: coverage, icon: "📋", description: "" };
                    return (
                      <div key={coverage} className="flex items-start gap-4 p-4 bg-white rounded-lg border-2 border-green-200 hover:border-green-400 transition-colors">
                        <span className="text-3xl">{coverageInfo.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{coverageInfo.name}</h4>
                          <p className="text-sm text-gray-600">{coverageInfo.description}</p>
                        </div>
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>Calculating personalized recommendations...</p>
                </div>
              )}
            </div>

            {/* What Makes Us Different */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Why WanderSure Is Different
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Real-time data:</strong> Live flight status, current weather, breaking news—not outdated statistics</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Trip-specific:</strong> Analysis tailored to YOUR dates, destination, and itinerary</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>AI-powered:</strong> Machine learning that considers hundreds of risk factors simultaneously</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Dynamic recommendations:</strong> Coverage suggestions that adapt to changing conditions</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Partner CTA */}
        <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-teal-50 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Get Protected Now</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Now that you know your specific risks, get comprehensive coverage through our trusted insurance partner.
              They'll tailor a plan based on WanderSure's analysis.
            </p>
            <a 
              href="https://www.anrdoezrs.net/click-101622714-17100505" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mb-4"
            >
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-lg px-8 py-6 shadow-xl">
                <Shield className="w-5 h-5 mr-2" />
                Shop Insurance with World Nomads
              </Button>
            </a>
            <p className="text-xs text-gray-600">
              WanderSure analyzes risks. Our partners provide the coverage.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}