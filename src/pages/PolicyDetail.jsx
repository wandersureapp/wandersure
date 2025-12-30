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
  Shield,
  FileText,
  Phone,
  Mail,
  Download,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";

export default function PolicyDetail() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const policyId = urlParams.get('id');

  const { data: policy, isLoading } = useQuery({
    queryKey: ['policy', policyId],
    queryFn: () => base44.entities.Policy.list().then(policies => policies.find(p => p.id === policyId)),
    enabled: !!policyId
  });

  const { data: trip } = useQuery({
    queryKey: ['trip', policy?.trip_id],
    queryFn: () => base44.entities.Trip.list().then(trips => trips.find(t => t.id === policy.trip_id)),
    enabled: !!policy?.trip_id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading policy details...</p>
        </div>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Policy not found</p>
          <Button onClick={() => navigate(createPageUrl("Dashboard"))} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      expired: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || colors.active;
  };

  const coverageLabels = {
    trip_cancellation: "Trip Cancellation",
    trip_interruption: "Trip Interruption",
    baggage_loss: "Baggage Loss",
    baggage_delay: "Baggage Delay",
    medical_emergency: "Medical Emergency",
    medical_evacuation: "Medical Evacuation",
    theft_protection: "Theft Protection",
    flight_delay: "Flight Delay",
    rental_car_damage: "Rental Car Damage",
    missed_connection: "Missed Connection",
    natural_disaster: "Natural Disaster Coverage"
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Dashboard"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Policy Header */}
        <Card className="border-none shadow-xl mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-teal-600 p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{policy.plan_name}</h1>
                <p className="text-blue-100">Policy #{policy.policy_number}</p>
                {trip && <p className="text-blue-100 mt-1">{trip.trip_name}</p>}
              </div>
              <Badge className={getStatusColor(policy.status)}>
                {policy.status}
              </Badge>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Premium Paid</p>
                <p className="text-2xl font-bold text-gray-900">${policy.premium_amount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Coverage Limit</p>
                <p className="text-2xl font-bold text-gray-900">${policy.coverage_limit?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Expires</p>
                <p className="text-xl font-semibold text-gray-900">
                  {format(new Date(policy.expiry_date), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Provider Information */}
          {policy.provider_name && (
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Insurance Provider
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-lg text-gray-900">{policy.provider_name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Provider Policy ID: {policy.provider_policy_id}
                  </p>
                </div>

                {policy.provider_contact && (
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-semibold text-gray-900">Contact Information</h4>
                    {policy.provider_contact.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{policy.provider_contact.phone}</span>
                      </div>
                    )}
                    {policy.provider_contact.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{policy.provider_contact.email}</span>
                      </div>
                    )}
                    {policy.provider_contact.claims_phone && (
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <p className="text-xs font-medium text-orange-900 mb-1">Claims Hotline</p>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-orange-600" />
                          <span className="font-semibold text-orange-900">
                            {policy.provider_contact.claims_phone}
                          </span>
                        </div>
                      </div>
                    )}
                    {policy.provider_contact.emergency_phone && (
                      <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-xs font-medium text-red-900 mb-1">Emergency Assistance</p>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <span className="font-semibold text-red-900">
                            {policy.provider_contact.emergency_phone}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Policy Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {policy.policy_document_url && (
                <a
                  href={policy.policy_document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Policy Certificate</p>
                      <p className="text-xs text-gray-500">Download your policy document</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              )}

              {policy.terms_document_url && (
                <a
                  href={policy.terms_document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Terms & Conditions</p>
                      <p className="text-xs text-gray-500">Full policy terms</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              )}

              {!policy.policy_document_url && !policy.terms_document_url && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No documents available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coverage Details */}
        <Card className="border-none shadow-lg mt-6">
          <CardHeader>
            <CardTitle>Coverage Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {policy.coverage_types.map((coverage, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-900">{coverageLabels[coverage] || coverage}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}