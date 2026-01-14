import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ArrowRight, Trash2 } from "lucide-react";
import { format, differenceInDays, isFuture } from "date-fns";

export default function TripCard({ trip, onDelete }) {
  const getRiskColor = (score) => {
    if (!score) return { bg: "bg-gray-100", text: "text-gray-800" };
    if (score <= 25) return { bg: "bg-green-100", text: "text-green-800" };
    if (score <= 50) return { bg: "bg-yellow-100", text: "text-yellow-800" };
    if (score <= 75) return { bg: "bg-orange-100", text: "text-orange-800" };
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
  
  const startDate = trip.start_date ? new Date(trip.start_date) : null;
  const daysUntil = startDate && !isNaN(startDate) ? differenceInDays(startDate, new Date()) : null;
  const isTripUpcoming = startDate && !isNaN(startDate) ? isFuture(startDate) : false;

  return (
    <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 z-10 bg-white hover:bg-red-50 hover:text-red-600 rounded-full shadow-md opacity-80 hover:opacity-100 transition-all"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (confirm(`Delete "${trip.trip_name}"?`)) {
            onDelete(trip.id);
          }
        }}
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      <Link to={createPageUrl(`TripDetail?id=${trip.id}`)}>
        <div className="h-48 bg-gradient-to-br from-blue-500 via-teal-500 to-cyan-500 relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800" 
            alt={trip.destination}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
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
                {startDate && !isNaN(startDate) ? format(startDate, "MMM d") : "TBD"} - {trip.end_date && !isNaN(new Date(trip.end_date)) ? format(new Date(trip.end_date), "MMM d, yyyy") : "TBD"}
              </span>
            </div>

            {isTripUpcoming && daysUntil !== null && daysUntil >= 0 && (
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
      </Link>
    </Card>
  );
}