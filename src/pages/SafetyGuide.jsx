import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Shield, Download, Phone, AlertTriangle, MapPin, Heart, FileText, Sparkles, Loader2, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { generateSafetyGuide } from "@/functions/generateSafetyGuide";

export default function SafetyGuide() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedTripId, setSelectedTripId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: trips = [] } = useQuery({
    queryKey: ['trips'],
    queryFn: () => base44.entities.Trip.list('-created_date')
  });

  const { data: guides = [] } = useQuery({
    queryKey: ['safety-guides'],
    queryFn: () => base44.entities.SafetyGuide.list('-created_date')
  });

  const { data: purchases = [] } = useQuery({
    queryKey: ['checklist-purchases'],
    queryFn: () => base44.entities.ChecklistPurchase.list()
  });

  const hasPurchased = purchases.some(p => 
    p.product_id === 'safety-guide' || 
    p.product_type === 'travel_aide_bundle'
  );

  const selectedGuide = guides.find(g => g.trip_id === selectedTripId);

  const generateMutation = useMutation({
    mutationFn: async (tripId) => {
      setIsGenerating(true);
      const response = await generateSafetyGuide({ tripId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safety-guides'] });
      setIsGenerating(false);
    },
    onError: () => {
      setIsGenerating(false);
    }
  });

  const handleGenerate = () => {
    if (selectedTripId) {
      generateMutation.mutate(selectedTripId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-6">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("TravelAides"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Travel Aides
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full mb-4">
            <Shield className="w-4 h-4 text-red-600" />
            <span className="text-red-700 text-sm font-medium">AI-Powered Safety Intel</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Safety & Security Guide</h1>
          <p className="text-xl text-gray-600">Comprehensive safety protocols for your destination</p>
        </div>

        {!hasPurchased && (
          <Card className="mb-8 border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-yellow-600" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Purchase Required</h3>
              <p className="text-gray-600 mb-4">
                This feature requires a one-time purchase of $3.99
              </p>
              <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
                Purchase Now - $3.99
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              Select Your Trip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select value={selectedTripId} onValueChange={setSelectedTripId} disabled={!hasPurchased}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose a trip to generate safety guide..." />
                </SelectTrigger>
                <SelectContent>
                  {trips.map(trip => (
                    <SelectItem key={trip.id} value={trip.id}>
                      {trip.trip_name} - {trip.destination}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleGenerate}
                disabled={!selectedTripId || isGenerating || !hasPurchased || selectedGuide}
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : selectedGuide ? (
                  "Already Generated"
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Guide
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {isGenerating && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="p-6 text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-3" />
              <p className="text-lg font-medium text-blue-900">Analyzing safety protocols...</p>
              <p className="text-sm text-blue-700">This may take 30-60 seconds</p>
            </CardContent>
          </Card>
        )}

        {selectedGuide && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>

            {/* Emergency Contacts */}
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedGuide.generated_content.emergency_contacts?.map((contact, idx) => (
                    <div key={idx} className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                      <h4 className="font-bold text-gray-900 mb-1">{contact.service}</h4>
                      <p className="text-2xl font-bold text-red-600 mb-1">{contact.number}</p>
                      {contact.notes && <p className="text-sm text-gray-600">{contact.notes}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Common Scams */}
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Common Scams & How to Avoid Them
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {selectedGuide.generated_content.common_scams?.map((scam, idx) => (
                    <div key={idx} className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded">
                      <h4 className="font-bold text-gray-900 mb-2">{scam.scam_type}</h4>
                      <p className="text-sm text-gray-700 mb-2">{scam.description}</p>
                      <div className="flex items-start gap-2 mt-2 p-2 bg-white rounded">
                        <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700"><strong>How to avoid:</strong> {scam.how_to_avoid}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Transportation Safety */}
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Transportation Safety
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2">
                  {selectedGuide.generated_content.transportation_safety?.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">🚗</span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Health Precautions */}
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Health Precautions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2">
                  {selectedGuide.generated_content.health_precautions?.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">💉</span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Areas to Avoid */}
            {selectedGuide.generated_content.areas_to_avoid?.length > 0 && (
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Areas to Exercise Caution
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {selectedGuide.generated_content.areas_to_avoid.map((area, idx) => (
                      <div key={idx} className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                        <h4 className="font-bold text-gray-900 mb-1">{area.area}</h4>
                        <p className="text-sm text-gray-700">{area.reason}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Document Backup */}
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Document Backup Strategies
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2">
                  {selectedGuide.generated_content.document_backup_tips?.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">📄</span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Local Laws */}
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Important Local Laws
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2">
                  {selectedGuide.generated_content.local_laws?.map((law, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-1">⚖️</span>
                      <span className="text-gray-700">{law}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {!selectedTripId && !isGenerating && (
          <Card className="border-none shadow-lg">
            <CardContent className="p-12 text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Trip Selected</h3>
              <p className="text-gray-600">Select a trip above to generate your safety guide</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}