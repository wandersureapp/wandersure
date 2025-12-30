import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";

export default function ClaimsList({ claims, policies, trips, isLoading }) {
  const getStatusColor = (status) => {
    const colors = {
      submitted: "bg-blue-100 text-blue-800",
      under_review: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      denied: "bg-red-100 text-red-800",
      paid: "bg-purple-100 text-purple-800"
    };
    return colors[status] || colors.submitted;
  };

  const getClaimTypeLabel = (type) => {
    return type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
  };

  const getTripName = (tripId) => {
    const trip = trips.find(t => t.id === tripId);
    return trip?.trip_name || 'Unknown Trip';
  };

  if (isLoading) {
    return (
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>Your Claims</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Your Claims
        </CardTitle>
      </CardHeader>
      <CardContent>
        {claims.length > 0 ? (
          <div className="space-y-4">
            {claims.map(claim => (
              <div
                key={claim.id}
                className="p-5 rounded-xl border-2 hover:border-blue-300 bg-white hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {getClaimTypeLabel(claim.claim_type)}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{getTripName(claim.trip_id)}</p>
                  </div>
                  <Badge className={getStatusColor(claim.status)}>
                    {claim.status.replace(/_/g, ' ')}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 mb-3">{claim.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Incident: {format(new Date(claim.incident_date), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">${claim.claim_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>Filed: {format(new Date(claim.created_date), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Claims Yet</h3>
            <p className="text-gray-600">You haven't filed any claims. We hope you won't need to!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}