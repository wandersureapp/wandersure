import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Shield, 
  CheckCircle, 
  ExternalLink,
  TrendingUp,
  Award,
  Sparkles,
  ArrowLeft
} from "lucide-react";

export default function CustomizeInsurance() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const tripId = urlParams.get("tripId");

  const [selectedCoverages, setSelectedCoverages] = useState([]);

  const { data: trip, isLoading: loadingTrip } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: async () => {
      const trips = await base44.entities.Trip.list();
      return trips.find(t => t.id === tripId);
    },
    enabled: !!tripId
  });

  const saveRecommendationMutation = useMutation({
    mutationFn: (data) => base44.entities.Recommendation.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    }
  });

  const coverageOptions = {
    essential: [
      { id: "trip_cancellation", name: "Trip Cancellation", basePrice: 45, description: "Reimburses non-refundable trip costs if you need to cancel" },
      { id: "medical_emergency", name: "Medical Emergency", basePrice: 35, description: "Covers emergency medical expenses while traveling" },
      { id: "trip_interruption", name: "Trip Interruption", basePrice: 30, description: "Covers costs if your trip is cut short" }
    ],
    recommended: [
      { id: "baggage_loss", name: "Baggage Loss", basePrice: 25, description: "Reimbursement for lost or stolen luggage" },
      { id: "flight_delay", name: "Flight Delay", basePrice: 20, description: "Compensation for significant flight delays" },
      { id: "medical_evacuation", name: "Medical Evacuation", basePrice: 40, description: "Emergency transportation to medical facilities" }
    ],
    optional: [
      { id: "baggage_delay", name: "Baggage Delay", basePrice: 15, description: "Reimbursement for essentials if baggage is delayed" },
      { id: "rental_car_damage", name: "Rental Car Damage", basePrice: 28, description: "Coverage for rental vehicle damage" },
      { id: "missed_connection", name: "Missed Connection", basePrice: 18, description: "Covers costs from missed connections" },
      { id: "natural_disaster", name: "Natural Disaster", basePrice: 35, description: "Protection against weather-related disruptions" }
    ]
  };

  const toggleCoverage = (coverageId) => {
    setSelectedCoverages(prev => 
      prev.includes(coverageId) 
        ? prev.filter(id => id !== coverageId)
        : [...prev, coverageId]
    );
  };

  const calculateTotal = () => {
    const allCoverages = [...coverageOptions.essential, ...coverageOptions.recommended, ...coverageOptions.optional];
    return selectedCoverages.reduce((sum, id) => {
      const coverage = allCoverages.find(c => c.id === id);
      return sum + (coverage?.basePrice || 0);
    }, 0);
  };

  const insuranceProviders = [
    {
      name: "World Nomads",
      logo: "🌍",
      referralUrl: "https://www.worldnomads.com",
      estimatedPremium: calculateTotal() * 0.95,
      features: ["Adventure sports coverage", "24/7 emergency assistance", "Flexible policies"],
      rating: 4.5
    },
    {
      name: "Allianz Travel",
      logo: "🛡️",
      referralUrl: "https://www.allianztravelinsurance.com",
      estimatedPremium: calculateTotal() * 1.1,
      features: ["Trip cancellation for any reason", "Flight accident coverage", "Rental car protection"],
      rating: 4.7
    },
    {
      name: "Travel Guard",
      logo: "✈️",
      referralUrl: "https://www.travelguard.com",
      estimatedPremium: calculateTotal() * 1.05,
      features: ["Medical expense coverage", "Baggage protection", "Travel delay reimbursement"],
      rating: 4.3
    },
    {
      name: "Seven Corners",
      logo: "⭐",
      referralUrl: "https://www.sevencorners.com",
      estimatedPremium: calculateTotal() * 0.92,
      features: ["Customizable coverage", "Pre-existing condition coverage", "Cancel for work reasons"],
      rating: 4.4
    }
  ].sort((a, b) => a.estimatedPremium - b.estimatedPremium);

  const handleGetQuote = async (provider) => {
    // Save recommendation before redirecting
    await saveRecommendationMutation.mutateAsync({
      trip_id: tripId,
      recommended_coverages: selectedCoverages,
      estimated_premium_range: {
        min: calculateTotal() * 0.9,
        max: calculateTotal() * 1.15
      },
      provider_referrals: [{
        provider_name: provider.name,
        referral_url: provider.referralUrl,
        estimated_premium: provider.estimatedPremium,
        clicked: true
      }],
      notes: `User selected ${selectedCoverages.length} coverage options for ${trip?.destination}`
    });

    // Open provider website in new tab
    window.open(provider.referralUrl, '_blank');
  };

  if (loadingTrip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">Trip not found</p>
            <Button onClick={() => navigate(createPageUrl("MyTrips"))}>
              Return to My Trips
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const riskScore = trip.risk_assessment?.overall_score || 0;
  const estimatedSavings = calculateTotal() * 0.4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl(`TripDetail?id=${tripId}`))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Trip
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Compare Insurance Plans
          </h1>
          <p className="text-xl text-gray-600">
            AI-powered recommendations for {trip.trip_name}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coverage Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Info */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{trip.destination}</h3>
                    <p className="text-gray-700">
                      {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 mt-1">
                      {trip.travelers_count} {trip.travelers_count === 1 ? 'traveler' : 'travelers'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Risk Score</p>
                    <Badge className={`text-lg ${
                      riskScore < 30 ? 'bg-green-100 text-green-800' :
                      riskScore < 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {riskScore}/100
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Essential Coverage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  Essential Coverage
                  <Badge className="bg-red-100 text-red-800">Highly Recommended</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {coverageOptions.essential.map(coverage => (
                  <div
                    key={coverage.id}
                    className="flex items-start gap-4 p-4 rounded-lg border-2 hover:border-blue-300 transition-colors cursor-pointer"
                    onClick={() => toggleCoverage(coverage.id)}
                  >
                    <Checkbox
                      checked={selectedCoverages.includes(coverage.id)}
                      onCheckedChange={() => toggleCoverage(coverage.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{coverage.name}</h4>
                        <span className="text-blue-600 font-bold">${coverage.basePrice}</span>
                      </div>
                      <p className="text-sm text-gray-600">{coverage.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommended Coverage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-600" />
                  AI Recommended for Your Trip
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {coverageOptions.recommended.map(coverage => (
                  <div
                    key={coverage.id}
                    className="flex items-start gap-4 p-4 rounded-lg border-2 hover:border-blue-300 transition-colors cursor-pointer"
                    onClick={() => toggleCoverage(coverage.id)}
                  >
                    <Checkbox
                      checked={selectedCoverages.includes(coverage.id)}
                      onCheckedChange={() => toggleCoverage(coverage.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{coverage.name}</h4>
                        <span className="text-blue-600 font-bold">${coverage.basePrice}</span>
                      </div>
                      <p className="text-sm text-gray-600">{coverage.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Optional Coverage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-gray-600" />
                  Optional Add-Ons
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {coverageOptions.optional.map(coverage => (
                  <div
                    key={coverage.id}
                    className="flex items-start gap-4 p-4 rounded-lg border-2 hover:border-blue-300 transition-colors cursor-pointer"
                    onClick={() => toggleCoverage(coverage.id)}
                  >
                    <Checkbox
                      checked={selectedCoverages.includes(coverage.id)}
                      onCheckedChange={() => toggleCoverage(coverage.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{coverage.name}</h4>
                        <span className="text-blue-600 font-bold">${coverage.basePrice}</span>
                      </div>
                      <p className="text-sm text-gray-600">{coverage.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Provider Comparison */}
          <div className="space-y-6">
            <Card className="sticky top-6 border-2 border-blue-300">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
                <CardTitle>Provider Comparison</CardTitle>
                <p className="text-sm text-blue-100">Based on your selected coverage</p>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Estimated Total</p>
                  <p className="text-4xl font-bold text-blue-600">${calculateTotal()}</p>
                  <p className="text-xs text-gray-500 mt-2">{selectedCoverages.length} coverages selected</p>
                </div>

                {selectedCoverages.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {insuranceProviders.map((provider, index) => (
                        <Card key={provider.name} className={`${index === 0 ? 'border-2 border-green-400 bg-green-50' : ''}`}>
                          <CardContent className="p-4">
                            {index === 0 && (
                              <Badge className="bg-green-600 text-white mb-2">
                                <Award className="w-3 h-3 mr-1" />
                                Best Value
                              </Badge>
                            )}
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-3xl">{provider.logo}</span>
                              <div>
                                <h4 className="font-bold text-gray-900">{provider.name}</h4>
                                <div className="flex items-center gap-1">
                                  <span className="text-yellow-500">★</span>
                                  <span className="text-sm text-gray-600">{provider.rating}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <p className="text-2xl font-bold text-blue-600">
                                ${provider.estimatedPremium.toFixed(0)}
                              </p>
                              <p className="text-xs text-gray-500">Estimated premium</p>
                            </div>

                            <ul className="space-y-1 mb-4">
                              {provider.features.map(feature => (
                                <li key={feature} className="text-xs text-gray-600 flex items-start gap-1">
                                  <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>

                            <Button
                              onClick={() => handleGetQuote(provider)}
                              className={`w-full ${index === 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                              Get Quote
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200">
                      <CardContent className="p-4 text-center">
                        <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-700 font-medium">Potential Savings</p>
                        <p className="text-2xl font-bold text-green-600">
                          ~${estimatedSavings.toFixed(0)}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">vs. traditional packages</p>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">Select coverage to see provider options</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}