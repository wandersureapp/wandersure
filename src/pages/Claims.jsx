import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, FileText, CheckCircle, Clock } from "lucide-react";

import ClaimsList from "../components/claims/ClaimsList";
import NewClaimDialog from "../components/claims/NewClaimDialog";

export default function Claims() {
  const [showNewClaim, setShowNewClaim] = useState(false);
  const queryClient = useQueryClient();

  const { data: claims = [], isLoading } = useQuery({
    queryKey: ['claims'],
    queryFn: () => base44.entities.Claim.list('-created_date'),
  });

  const { data: policies = [] } = useQuery({
    queryKey: ['policies'],
    queryFn: () => base44.entities.Policy.list(),
  });

  const { data: trips = [] } = useQuery({
    queryKey: ['trips'],
    queryFn: () => base44.entities.Trip.list(),
  });

  const stats = [
    {
      label: "Total Claims",
      value: claims.length,
      icon: FileText,
      color: "blue"
    },
    {
      label: "Approved",
      value: claims.filter(c => c.status === 'approved' || c.status === 'paid').length,
      icon: CheckCircle,
      color: "green"
    },
    {
      label: "Under Review",
      value: claims.filter(c => c.status === 'under_review').length,
      icon: Clock,
      color: "yellow"
    },
    {
      label: "Total Amount",
      value: `$${claims.reduce((sum, c) => sum + c.claim_amount, 0).toFixed(0)}`,
      icon: FileText,
      color: "purple"
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Claims Center</h1>
            <p className="text-gray-600 mt-1">File and track your insurance claims</p>
          </div>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowNewClaim(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            File New Claim
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <stat.icon className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Claims List */}
        <ClaimsList 
          claims={claims}
          policies={policies}
          trips={trips}
          isLoading={isLoading}
        />

        {/* New Claim Dialog */}
        <NewClaimDialog
          open={showNewClaim}
          onClose={() => setShowNewClaim(false)}
          policies={policies}
          trips={trips}
        />
      </div>
    </div>
  );
}