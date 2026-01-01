import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Sparkles, Download, MapPin, Globe, DollarSign, Utensils, AlertCircle, Languages, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { generateDestinationPlaybook } from "@/functions/generateDestinationPlaybook";

export default function DestinationPlaybook() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedTripId, setSelectedTripId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: trips = [] } = useQuery({
    queryKey: ['trips'],
    queryFn: () => base44.entities.Trip.list('-created_date')
  });

  const { data: playbooks = [] } = useQuery({
    queryKey: ['playbooks'],
    queryFn: () => base44.entities.DestinationPlaybook.list('-created_date')
  });

  const { data: purchases = [] } = useQuery({
    queryKey: ['checklist-purchases'],
    queryFn: () => base44.entities.ChecklistPurchase.list()
  });

  const hasPurchased = purchases.some(p => 
    p.product_id === 'destination-playbook' || 
    p.product_type === 'travel_aide_bundle'
  );

  const selectedPlaybook = playbooks.find(p => p.trip_id === selectedTripId);

  const generateMutation = useMutation({
    mutationFn: async (tripId) => {
      setIsGenerating(true);
      const response = await generateDestinationPlaybook({ tripId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playbooks'] });
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-purple-700 text-sm font-medium">AI-Powered Research</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Destination Playbook</h1>
          <p className="text-xl text-gray-600">Custom insider guides generated for your trip</p>
        </div>

        {!hasPurchased && (
          <Card className="mb-8 border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-yellow-600" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Purchase Required</h3>
              <p className="text-gray-600 mb-4">
                This feature requires a one-time purchase of $4.99
              </p>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Purchase Now - $4.99
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              Select Your Trip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select value={selectedTripId} onValueChange={setSelectedTripId} disabled={!hasPurchased}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose a trip to generate playbook..." />
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
                disabled={!selectedTripId || isGenerating || !hasPurchased || selectedPlaybook}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : selectedPlaybook ? (
                  "Already Generated"
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Playbook
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
              <p className="text-lg font-medium text-blue-900">Researching your destination...</p>
              <p className="text-sm text-blue-700">This may take 30-60 seconds</p>
            </CardContent>
          </Card>
        )}

        {selectedPlaybook && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>

            {/* Local Customs */}
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Local Customs & Etiquette
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 whitespace-pre-line">{selectedPlaybook.generated_content.local_customs}</p>
              </CardContent>
            </Card>

            {/* Language Tips */}
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Languages className="w-5 h-5" />
                  Essential Phrases
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {selectedPlaybook.generated_content.language_tips?.map((tip, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-bold text-gray-900">{tip.phrase}</p>
                      <p className="text-gray-700">{tip.translation}</p>
                      <p className="text-sm text-gray-500 italic">{tip.pronunciation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hidden Gems */}
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Hidden Gems
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedPlaybook.generated_content.hidden_gems?.map((gem, idx) => (
                    <div key={idx} className="p-4 border rounded-lg hover:border-green-300 transition-colors">
                      <Badge className="mb-2">{gem.category}</Badge>
                      <h4 className="font-bold text-gray-900 mb-1">{gem.name}</h4>
                      <p className="text-sm text-gray-600">{gem.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Food Recommendations */}
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="w-5 h-5" />
                  Must-Try Foods
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {selectedPlaybook.generated_content.food_recommendations?.map((food, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-1">{food.dish}</h4>
                      <p className="text-sm text-gray-600">{food.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Money Saving Tips */}
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Money-Saving Strategies
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2">
                  {selectedPlaybook.generated_content.money_saving_tips?.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-1">💰</span>
                      <span className="text-gray-700">{tip}</span>
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
              <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Trip Selected</h3>
              <p className="text-gray-600">Select a trip above to generate your custom playbook</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}