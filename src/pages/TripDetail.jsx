import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Plane,
  Hotel,
  Car,
  Activity
} from "lucide-react";
import { format, differenceInDays } from "date-fns";

import RiskGauges from "../components/trip/RiskGauges";
import InsuranceRecommendations from "../components/trip/InsuranceRecommendations";

export default function TripDetail() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const tripId = urlParams.get('id');

  const { data: trip, isLoading } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => base44.entities.Trip.list().then(trips => trips.find(t => t.id === tripId)),
    enabled: !!tripId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Trip not found</p>
          <Button onClick={() => navigate(createPageUrl("Dashboard"))} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const riskScore = trip.risk_assessment?.overall_score || 0;
  const getRiskLevel = (score) => {
    if (score < 30) return { label: "Low Risk", color: "text-green-600", bg: "bg-green-50" };
    if (score < 60) return { label: "Medium Risk", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { label: "High Risk", color: "text-red-600", bg: "bg-red-50" };
  };
  const riskLevel = getRiskLevel(riskScore);

  const daysUntil = differenceInDays(new Date(trip.start_date), new Date());

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Dashboard"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Hero Card */}
        <Card className="border-none shadow-2xl overflow-hidden mb-8">
          <div className="relative h-48 bg-gradient-to-br from-blue-600 via-blue-500 to-teal-500">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200')] bg-cover bg-center opacity-20"></div>
            <div className="relative h-full flex items-end p-6 md:p-8">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {trip.trip_name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{trip.destination}, {trip.destination_country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>
                      {format(new Date(trip.start_date), "MMM d")} - {format(new Date(trip.end_date), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
              <Badge className={`${riskLevel.bg} ${riskLevel.color} border-0 text-base px-4 py-2`}>
                {riskLevel.label}
              </Badge>
            </div>
          </div>

          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Travelers</p>
                  <p className="text-lg font-semibold">{trip.travelers_count}</p>
                </div>
              </div>

              {trip.trip_cost > 0 && (
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Trip Cost</p>
                    <p className="text-lg font-semibold">${trip.trip_cost.toLocaleString()}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-lg font-semibold">
                    {differenceInDays(new Date(trip.end_date), new Date(trip.start_date))} days
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-lg font-semibold capitalize">{trip.status}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Risk Assessment */}
          <div className="lg:col-span-2 space-y-6">
            <RiskGauges riskAssessment={trip.risk_assessment} />

            {/* Travel Bookings */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="w-5 h-5" />
                  Travel Bookings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trip.airline && (
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <Plane className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Flight</p>
                      <p className="text-sm text-gray-600">{trip.airline}</p>
                      {trip.flight_number && (
                        <p className="text-sm text-gray-500">Flight {trip.flight_number}</p>
                      )}
                    </div>
                  </div>
                )}

                {trip.hotel_name && (
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <Hotel className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Hotel</p>
                      <p className="text-sm text-gray-600">{trip.hotel_name}</p>
                    </div>
                  </div>
                )}

                {trip.car_rental_company && (
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <Car className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Car Rental</p>
                      <p className="text-sm text-gray-600">{trip.car_rental_company}</p>
                    </div>
                  </div>
                )}

                {!trip.airline && !trip.hotel_name && !trip.car_rental_company && (
                  <div className="text-center py-8 text-gray-500">
                    <Plane className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No travel bookings added yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Insurance Recommendations */}
          <div>
            <InsuranceRecommendations 
              tripId={trip.id}
              recommendedCoverage={trip.recommended_coverage}
              tripCost={trip.trip_cost}
            />
          </div>
        </div>
      </div>
    </div>
  );
}