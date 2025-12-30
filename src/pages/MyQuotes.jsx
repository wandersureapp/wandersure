import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Calendar, 
  MapPin, 
  ExternalLink,
  Shield,
  DollarSign,
  Clock
} from "lucide-react";
import { format } from "date-fns";

export default function MyQuotes() {
  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => base44.entities.Recommendation.list('-created_date'),
  });

  const { data: trips = [] } = useQuery({
    queryKey: ['trips'],
    queryFn: () => base44.entities.Trip.list(),
  });

  const getTripForRecommendation = (tripId) => {
    return trips.find(t => t.id === tripId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your quotes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Insurance Quotes</h1>
          <p className="text-xl text-gray-600">View your saved quotes and recommendations</p>
        </div>

        {recommendations.length === 0 ? (
          <Card className="border-none shadow-xl">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Quotes Yet</h3>
              <p className="text-gray-600 mb-6">
                Start by creating a trip and getting personalized insurance recommendations
              </p>
              <Link to={createPageUrl("NewTrip")}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Create Your First Trip
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {recommendations.map((rec) => {
              const trip = getTripForRecommendation(rec.trip_id);
              
              return (
                <Card key={rec.id} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">
                          {trip ? trip.trip_name : 'Unknown Trip'}
                        </CardTitle>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          {trip && (
                            <>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {trip.destination}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(trip.start_date), "MMM d")} - {format(new Date(trip.end_date), "MMM d, yyyy")}
                              </div>
                            </>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Saved {format(new Date(rec.created_date), "MMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                      {trip && (
                        <Link to={createPageUrl(`TripDetail?id=${trip.id}`)}>
                          <Button variant="outline" size="sm">
                            View Trip
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Recommended Coverage */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-blue-600" />
                          Recommended Coverage
                        </h4>
                        {rec.recommended_coverages && rec.recommended_coverages.length > 0 ? (
                          <div className="space-y-2">
                            {rec.recommended_coverages.map((coverage, idx) => (
                              <Badge key={idx} variant="outline" className="mr-2 mb-2">
                                {coverage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No specific coverage selected</p>
                        )}

                        {rec.estimated_premium_range && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Estimated Range</p>
                            <p className="text-2xl font-bold text-blue-600">
                              ${rec.estimated_premium_range.min} - ${rec.estimated_premium_range.max}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Provider Referrals */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          Provider Quotes
                        </h4>
                        {rec.provider_referrals && rec.provider_referrals.length > 0 ? (
                          <div className="space-y-3">
                            {rec.provider_referrals.map((provider, idx) => (
                              <div key={idx} className="p-3 bg-gray-50 rounded-lg border">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="font-medium text-gray-900">{provider.provider_name}</p>
                                  {provider.clicked && (
                                    <Badge className="bg-green-100 text-green-800 text-xs">Visited</Badge>
                                  )}
                                </div>
                                {provider.estimated_premium && (
                                  <p className="text-lg font-bold text-gray-900 mb-2">
                                    ${provider.estimated_premium.toFixed(0)}
                                  </p>
                                )}
                                {provider.referral_url && (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => window.open(provider.referral_url, '_blank')}
                                  >
                                    View Quote
                                    <ExternalLink className="w-3 h-3 ml-2" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No provider quotes saved</p>
                        )}
                      </div>
                    </div>

                    {rec.notes && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-gray-700">{rec.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}