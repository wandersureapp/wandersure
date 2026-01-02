import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Bell, 
  Plane, 
  Cloud, 
  Shield,
  MapPin,
  Clock,
  ArrowRight
} from "lucide-react";
import { format, isFuture } from "date-fns";
import AuthGuard from "../components/AuthGuard";

export default function Alerts() {
  const { data: trips = [], isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: () => base44.entities.Trip.list('-created_date'),
  });

  // Filter for active and upcoming trips only
  const activeTrips = trips.filter(trip => 
    (trip.status === 'active' || trip.status === 'booked') && 
    isFuture(new Date(trip.end_date))
  );

  // Get high risk trips
  const highRiskTrips = activeTrips.filter(trip => 
    trip.risk_assessment?.overall_score > 60
  );

  // Get medium risk trips
  const mediumRiskTrips = activeTrips.filter(trip => 
    trip.risk_assessment?.overall_score >= 30 && 
    trip.risk_assessment?.overall_score <= 60
  );

  const getRiskColor = (score) => {
    if (score >= 60) return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
    if (score >= 30) return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' };
    return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' };
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading alerts...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Travel Alerts</h1>
                <p className="text-gray-600">Monitor risks and updates for your trips</p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-900">{highRiskTrips.length}</p>
                    <p className="text-sm text-red-700">High Risk Alerts</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4 flex items-center gap-3">
                  <Clock className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-900">{mediumRiskTrips.length}</p>
                    <p className="text-sm text-yellow-700">Medium Risk Alerts</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4 flex items-center gap-3">
                  <Plane className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-900">{activeTrips.length}</p>
                    <p className="text-sm text-blue-700">Monitored Trips</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Alerts List */}
          {highRiskTrips.length === 0 && mediumRiskTrips.length === 0 ? (
            <Card className="border-none shadow-lg">
              <CardContent className="p-12 text-center">
                <Shield className="w-16 h-16 mx-auto mb-4 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">All Clear!</h2>
                <p className="text-gray-600 mb-6">
                  No high-risk alerts for your trips. We're monitoring everything 24/7.
                </p>
                <Link to={createPageUrl("NotificationSettings")}>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Bell className="w-4 h-4 mr-2" />
                    Configure Alert Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* High Risk Alerts */}
              {highRiskTrips.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    High Risk Alerts
                  </h2>
                  <div className="space-y-4">
                    {highRiskTrips.map(trip => {
                      const riskColor = getRiskColor(trip.risk_assessment.overall_score);
                      return (
                        <Card key={trip.id} className={`border-2 ${riskColor.border} hover:shadow-lg transition-shadow`}>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-xl mb-2">{trip.trip_name}</CardTitle>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span>{trip.destination}, {trip.destination_country}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 mt-1">
                                  <Clock className="w-4 h-4" />
                                  <span>
                                    {format(new Date(trip.start_date), "MMM d")} - {format(new Date(trip.end_date), "MMM d, yyyy")}
                                  </span>
                                </div>
                              </div>
                              <Badge className={`${riskColor.bg} ${riskColor.text} border-0 text-lg px-4 py-2`}>
                                Risk: {trip.risk_assessment.overall_score}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {trip.risk_assessment.flight_delay_risk > 60 && (
                                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                                  <Plane className="w-5 h-5 text-red-600 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-red-900">High Flight Delay Risk</p>
                                    <p className="text-sm text-red-700">Score: {trip.risk_assessment.flight_delay_risk}/100</p>
                                  </div>
                                </div>
                              )}
                              
                              {trip.risk_assessment.disruption_risk > 60 && (
                                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                                  <Cloud className="w-5 h-5 text-red-600 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-red-900">High Disruption Risk</p>
                                    <p className="text-sm text-red-700">Weather or political instability concerns</p>
                                  </div>
                                </div>
                              )}

                              {trip.risk_assessment.crime_risk > 60 && (
                                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                                  <Shield className="w-5 h-5 text-red-600 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-red-900">Safety Concerns</p>
                                    <p className="text-sm text-red-700">Higher crime risk in destination</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            <Link to={createPageUrl(`TripDetail?id=${trip.id}`)}>
                              <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
                                View Trip Details
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Medium Risk Alerts */}
              {mediumRiskTrips.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    Medium Risk Alerts
                  </h2>
                  <div className="space-y-4">
                    {mediumRiskTrips.map(trip => {
                      const riskColor = getRiskColor(trip.risk_assessment.overall_score);
                      return (
                        <Card key={trip.id} className={`border ${riskColor.border}`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-bold text-gray-900 mb-1">{trip.trip_name}</h3>
                                <p className="text-sm text-gray-600">{trip.destination}</p>
                              </div>
                              <Link to={createPageUrl(`TripDetail?id=${trip.id}`)}>
                                <Button variant="outline" size="sm">
                                  View Details
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Alert Settings CTA */}
          <Card className="mt-8 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Bell className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Stay Informed</h3>
                    <p className="text-sm text-gray-600">
                      Enable smart alerts to get real-time notifications about your trips
                    </p>
                  </div>
                </div>
                <Link to={createPageUrl("NotificationSettings")}>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Manage Alerts
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}