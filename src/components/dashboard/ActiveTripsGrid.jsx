import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, 
  Calendar, 
  Plane, 
  Hotel,
  ArrowRight
} from "lucide-react";
import { format, differenceInDays } from "date-fns";

export default function ActiveTripsGrid({ trips, isLoading }) {
  if (isLoading) {
    return (
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>Active Trips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map(i => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const getRiskColor = (score) => {
    if (!score) return { bg: "bg-gray-100", text: "text-gray-800", label: "Unknown" };
    if (score < 30) return { bg: "bg-green-100", text: "text-green-800", label: "Low Risk" };
    if (score < 60) return { bg: "bg-yellow-100", text: "text-yellow-800", label: "Medium Risk" };
    return { bg: "bg-red-100", text: "text-red-800", label: "High Risk" };
  };

  return (
    <Card className="border-none shadow-lg overflow-hidden">
      <div className="relative h-24 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800"
          alt="Active Trips"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-teal-600/90"></div>
        <div className="absolute inset-0 flex items-center px-6">
          <Plane className="w-6 h-6 text-white mr-3" />
          <h3 className="text-xl font-bold text-white">Active Trips</h3>
        </div>
      </div>
      <CardContent className="p-6">
        {trips.length > 0 ? (
          <div className="space-y-4">
            {trips.map(trip => {
              const riskInfo = getRiskColor(trip.risk_assessment?.overall_score);
              const daysUntil = differenceInDays(new Date(trip.start_date), new Date());
              
              return (
                <Link
                  key={trip.id}
                  to={createPageUrl(`TripDetail?id=${trip.id}`)}
                  className="block group"
                >
                  <div className="p-5 rounded-xl border-2 border-gray-100 hover:border-blue-300 bg-white hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {trip.trip_name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{trip.destination}</span>
                        </div>
                      </div>
                      <Badge className={`${riskInfo.bg} ${riskInfo.text} border-0`}>
                        {riskInfo.label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(trip.start_date), "MMM d")}</span>
                      </div>
                      {trip.airline && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Plane className="w-4 h-4" />
                          <span>{trip.airline}</span>
                        </div>
                      )}
                      {trip.hotel_name && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Hotel className="w-4 h-4" />
                          <span className="truncate">{trip.hotel_name}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-sm text-gray-500">
                        {daysUntil > 0 ? `Departing in ${daysUntil} days` : 'In progress'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Plane className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Trips</h3>
            <p className="text-gray-500 mb-6">Start planning your next adventure!</p>
            <Link to={createPageUrl("NewTrip")}>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Add Your First Trip
              </button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}