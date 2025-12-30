import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { format, differenceInDays, isFuture } from "date-fns";

export default function TripCard({ trip }) {
  const getRiskColor = (score) => {
    if (!score) return { bg: "bg-gray-100", text: "text-gray-800" };
    if (score < 30) return { bg: "bg-green-100", text: "text-green-800" };
    if (score < 60) return { bg: "bg-yellow-100", text: "text-yellow-800" };
    return { bg: "bg-red-100", text: "text-red-800" };
  };

  const getStatusColor = (status) => {
    const colors = {
      planning: "bg-gray-100 text-gray-800",
      booked: "bg-blue-100 text-blue-800",
      active: "bg-green-100 text-green-800",
      completed: "bg-purple-100 text-purple-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || colors.planning;
  };

  const riskInfo = getRiskColor(trip.risk_assessment?.overall_score);
  const daysUntil = differenceInDays(new Date(trip.start_date), new Date());
  const isTripUpcoming = isFuture(new Date(trip.start_date));

  return (
    <Link to={createPageUrl(`TripDetail?id=${trip.id}`)}>
      <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden">
        <div className="h-40 bg-gradient-to-br from-blue-500 via-teal-500 to-cyan-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800')] bg-cover bg-center opacity-30"></div>
          <div className="relative h-full p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <Badge className={getStatusColor(trip.status)}>
                {trip.status}
              </Badge>
              {trip.risk_assessment && (
                <Badge className={`${riskInfo.bg} ${riskInfo.text} border-0`}>
                  Risk: {trip.risk_assessment.overall_score}
                </Badge>
              )}
            </div>
            <h3 className="text-xl font-bold text-white group-hover:scale-105 transition-transform">
              {trip.trip_name}
            </h3>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{trip.destination}, {trip.destination_country}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {format(new Date(trip.start_date), "MMM d")} - {format(new Date(trip.end_date), "MMM d, yyyy")}
              </span>
            </div>

            {isTripUpcoming && daysUntil >= 0 && (
              <div className="pt-3 border-t">
                <p className="text-sm font-medium text-blue-600">
                  {daysUntil === 0 ? "Departing today!" : `Departing in ${daysUntil} days`}
                </p>
              </div>
            )}

            <div className="flex items-center justify-end pt-2">
              <span className="text-sm text-blue-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                View Details
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}