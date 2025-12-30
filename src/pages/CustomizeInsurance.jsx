
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert"; 
import { format } from "date-fns"; // Added for date formatting
import insuranceProvider from "../components/insurance/InsuranceProviderService"; // Added import

import { 
  ArrowLeft,
  Shield,
  CheckCircle,
  AlertTriangle,
  Info,
  Sparkles,
  TrendingUp,
  Loader2,
  DollarSign
} from "lucide-react";
import { motion } from "framer-motion";

export default function CustomizeInsurance() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const tripId = urlParams.get('tripId');

  const [selectedCoverages, setSelectedCoverages] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [providerQuote, setProviderQuote] = useState(null); // Added state
  const [isGettingQuote, setIsGettingQuote] = useState(false); // Added state

  const { data: trip, isLoading } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => base44.entities.Trip.list().then(trips => trips.find(t => t.id === tripId)),
    enabled: !!tripId
  });

  // Coverage options with base pricing and risk factors
  const coverageOptions = [
    {
      id: "trip_cancellation",
      name: "Trip Cancellation",
      description: "Get reimbursed if you need to cancel due to illness, injury, or other covered reasons",
      basePrice: 0.025, // 2.5% of trip cost
      riskFactor: "overall_score",
      icon: Shield,
      category: "essential"
    },
    {
      id: "trip_interruption",
      name: "Trip Interruption",
      description: "Coverage if your trip is cut short due to emergencies",
      basePrice: 0.02, // 2% of trip cost
      riskFactor: "disruption_risk",
      icon: AlertTriangle,
      category: "essential"
    },
    {
      id: "flight_delay",
      name: "Flight Delay Protection",
      description: "Compensation for delays over 4 hours including meals and accommodation",
      basePrice: 18,
      riskFactor: "flight_delay_risk",
      icon: TrendingUp,
      category: "travel"
    },
    {
      id: "baggage_loss",
      name: "Baggage Loss",
      description: "Reimbursement for lost or stolen baggage up to coverage limit",
      basePrice: 22,
      riskFactor: "overall_score",
      icon: Shield,
      category: "travel"
    },
    {
      id: "baggage_delay",
      name: "Baggage Delay",
      description: "Coverage for essential items if baggage is delayed 12+ hours",
      basePrice: 12,
      riskFactor: "disruption_risk",
      icon: Shield,
      category: "travel"
    },
    {
      id: "medical_emergency",
      name: "Medical Emergency",
      description: "Emergency medical expenses coverage up to $100,000",
      basePrice: 32,
      riskFactor: "health_risk",
      icon: Shield,
      category: "medical"
    },
    {
      id: "medical_evacuation",
      name: "Medical Evacuation",
      description: "Emergency medical transportation to nearest adequate facility",
      basePrice: 42,
      riskFactor: "health_risk",
      icon: Shield,
      category: "medical"
    },
    {
      id: "theft_protection",
      name: "Theft Protection",
      description: "Coverage for stolen personal belongings and identity theft assistance",
      basePrice: 24,
      riskFactor: "crime_risk",
      icon: Shield,
      category: "security"
    },
    {
      id: "rental_car_damage",
      name: "Rental Car Damage",
      description: "Coverage for rental car damage or theft",
      basePrice: 28,
      riskFactor: "overall_score",
      icon: Shield,
      category: "travel"
    },
    {
      id: "missed_connection",
      name: "Missed Connection",
      description: "Coverage for additional expenses due to missed connections",
      basePrice: 16,
      riskFactor: "flight_delay_risk",
      icon: Shield,
      category: "travel"
    },
    {
      id: "natural_disaster",
      name: "Natural Disaster Coverage",
      description: "Protection against trip disruptions from natural disasters",
      basePrice: 35,
      riskFactor: "disruption_risk",
      icon: Shield,
      category: "essential"
    }
  ];

  // Get real-time quote from insurance provider
  const getProviderQuote = async () => {
    if (selectedCoverages.length === 0 || !trip) {
      setProviderQuote(null); // Clear quote if no coverages selected or trip data missing
      return;
    }
    
    setIsGettingQuote(true);
    try {
      // Pass trip details and selected coverage IDs to the provider service
      const quote = await insuranceProvider.getQuote(trip, selectedCoverages);
      setProviderQuote(quote);
    } catch (error) {
      console.error("Error getting provider quote:", error);
      setProviderQuote(null);
    }
    setIsGettingQuote(false);
  };

  // Update quote when coverage selection or trip data changes
  useEffect(() => {
    // Only attempt to get a quote if a trip is loaded
    if (trip) {
      getProviderQuote();
    }
  }, [selectedCoverages, trip]); // Rerun when selectedCoverages or trip changes

  const createPolicyMutation = useMutation({
    mutationFn: async (policyData) => {
      // Get customer data for the insurance provider
      const user = await base44.auth.me();
      
      // Purchase policy from external insurance provider using the obtained quote
      const providerPolicy = await insuranceProvider.purchasePolicy(
        providerQuote, // Use the real-time quote
        {
          email: user.email,
          full_name: user.full_name,
          trip_details: trip
        },
        {
          // In a real implementation, this would include payment details (e.g., tokenized card data)
          method: "credit_card" // Placeholder payment method
        }
      );
      
      // Create policy record in our database with provider details for tracking and management
      return base44.entities.Policy.create({
        ...policyData,
        provider_name: providerPolicy.provider_name,
        provider_policy_id: providerPolicy.provider_policy_id,
        provider_quote_id: providerPolicy.provider_quote_id,
        policy_document_url: providerPolicy.policy_document_url,
        terms_document_url: providerPolicy.terms_document_url,
        provider_contact: providerPolicy.provider_contact,
        // Potentially store other provider-specific fields if necessary
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      navigate(createPageUrl("Dashboard"));
    }
  });

  // Coverage options with base pricing and risk factors (already exists)
  // ...

  // Analyze coverage recommendations based on risk
  const getCoverageRecommendation = (coverage) => {
    if (!trip?.risk_assessment) return { priority: "optional", reason: "No risk data available" };

    const riskScore = trip.risk_assessment[coverage.riskFactor] || trip.risk_assessment.overall_score;
    
    if (riskScore >= 60) {
      return {
        priority: "highly_recommended",
        reason: `High ${coverage.riskFactor.replace('_', ' ')} detected (${riskScore}/100)`,
        color: "red"
      };
    } else if (riskScore >= 30) {
      return {
        priority: "recommended",
        reason: `Moderate ${coverage.riskFactor.replace('_', ' ')} (${riskScore}/100)`,
        color: "yellow"
      };
    } else {
      return {
        priority: "optional",
        reason: `Low ${coverage.riskFactor.replace('_', ' ')} (${riskScore}/100)`,
        color: "gray"
      };
    }
  };

  // Calculate dynamic pricing (for display/fallback if provider quote not available)
  const calculateCoveragePrice = (coverage) => {
    if (!trip) return coverage.basePrice;
    
    if (coverage.basePrice < 1) {
      // Percentage-based pricing
      return Math.round(trip.trip_cost * coverage.basePrice);
    }
    
    // Fixed price with reduced risk multiplier
    const riskScore = trip.risk_assessment?.[coverage.riskFactor] || 0;
    const multiplier = 1 + (riskScore / 300); // Up to 1.33x for high risk (reduced from 1.5x)
    return Math.round(coverage.basePrice * multiplier);
  };

  // Initialize with highly recommended coverages
  useEffect(() => {
    if (trip?.risk_assessment) {
      const highlyRecommended = coverageOptions
        .filter(cov => getCoverageRecommendation(cov).priority === "highly_recommended")
        .map(cov => cov.id);
      setSelectedCoverages(highlyRecommended);
    }
  }, [trip]);

  const toggleCoverage = (coverageId) => {
    setSelectedCoverages(prev => 
      prev.includes(coverageId)
        ? prev.filter(id => id !== coverageId)
        : [...prev, coverageId]
    );
  };

  const totalPremium = selectedCoverages.reduce((sum, covId) => {
    const coverage = coverageOptions.find(c => c.id === covId);
    return sum + (coverage ? calculateCoveragePrice(coverage) : 0);
  }, 0);

  const handlePurchase = async () => {
    setIsAnalyzing(true);
    
    // Determine plan name based on coverage count
    let planName = "Custom Plan";
    if (selectedCoverages.length <= 3) planName = "Basic Protection";
    else if (selectedCoverages.length <= 6) planName = "Standard Coverage";
    else if (selectedCoverages.length <= 9) planName = "Premium Shield";
    else planName = "Ultimate Protection";

    // Use provider quote if available, otherwise calculate using our internal logic
    const premium = providerQuote?.premium_amount || totalPremium;
    const coverageLimit = providerQuote?.coverage_limit || (premium * 50); // Fallback to 50x if provider doesn't specify

    const policyData = {
      trip_id: tripId,
      policy_number: `WS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      plan_name: planName,
      coverage_types: selectedCoverages,
      premium_amount: premium,
      coverage_limit: coverageLimit,
      status: "active",
      purchase_date: new Date().toISOString().split('T')[0],
      expiry_date: trip?.end_date
    };

    try {
      await createPolicyMutation.mutateAsync(policyData);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Trip not found</p>
          <Button onClick={() => navigate(createPageUrl("Dashboard"))} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Group coverages by recommendation priority
  const highlyRecommended = coverageOptions.filter(c => getCoverageRecommendation(c).priority === "highly_recommended");
  const recommended = coverageOptions.filter(c => getCoverageRecommendation(c).priority === "recommended");
  const optional = coverageOptions.filter(c => getCoverageRecommendation(c).priority === "optional");

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customize Your Insurance</h1>
              <p className="text-gray-600">{trip.trip_name}</p>
            </div>
          </div>
          
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="w-4 h-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              Based on your trip's risk analysis, we've pre-selected the most important coverages for you. 
              Adjust as needed to create your perfect protection plan.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coverage Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Highly Recommended */}
            {highlyRecommended.length > 0 && (
              <Card className="border-2 border-red-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="w-5 h-5" />
                    Highly Recommended for Your Trip
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {highlyRecommended.map((coverage) => {
                      const recommendation = getCoverageRecommendation(coverage);
                      const price = calculateCoveragePrice(coverage);
                      const isSelected = selectedCoverages.includes(coverage.id);

                      return (
                        <motion.div
                          key={coverage.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => toggleCoverage(coverage.id)}
                        >
                          <div className="flex items-start gap-4">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleCoverage(coverage.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{coverage.name}</h3>
                                  <p className="text-sm text-gray-600 mt-1">{coverage.description}</p>
                                </div>
                                <div className="text-right ml-4">
                                  <p className="text-lg font-bold text-gray-900">${price}</p>
                                  <p className="text-xs text-gray-500">per trip</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className="bg-red-100 text-red-800 border-0 text-xs">
                                  {recommendation.reason}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommended */}
            {recommended.length > 0 && (
              <Card className="border-2 border-yellow-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50">
                  <CardTitle className="flex items-center gap-2 text-yellow-800">
                    <CheckCircle className="w-5 h-5" />
                    Recommended Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recommended.map((coverage) => {
                      const recommendation = getCoverageRecommendation(coverage);
                      const price = calculateCoveragePrice(coverage);
                      const isSelected = selectedCoverages.includes(coverage.id);

                      return (
                        <motion.div
                          key={coverage.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => toggleCoverage(coverage.id)}
                        >
                          <div className="flex items-start gap-4">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleCoverage(coverage.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{coverage.name}</h3>
                                  <p className="text-sm text-gray-600 mt-1">{coverage.description}</p>
                                </div>
                                <div className="text-right ml-4">
                                  <p className="text-lg font-bold text-gray-900">${price}</p>
                                  <p className="text-xs text-gray-500">per trip</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className="bg-yellow-100 text-yellow-800 border-0 text-xs">
                                  {recommendation.reason}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Optional */}
            {optional.length > 0 && (
              <Card className="border-gray-200 shadow-lg">
                <CardHeader className="bg-gray-50">
                  <CardTitle className="flex items-center gap-2 text-gray-700">
                    <Info className="w-5 h-5" />
                    Optional Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {optional.map((coverage) => {
                      const recommendation = getCoverageRecommendation(coverage);
                      const price = calculateCoveragePrice(coverage);
                      const isSelected = selectedCoverages.includes(coverage.id);

                      return (
                        <motion.div
                          key={coverage.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => toggleCoverage(coverage.id)}
                        >
                          <div className="flex items-start gap-4">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleCoverage(coverage.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{coverage.name}</h3>
                                  <p className="text-sm text-gray-600 mt-1">{coverage.description}</p>
                                </div>
                                <div className="text-right ml-4">
                                  <p className="text-lg font-bold text-gray-900">${price}</p>
                                  <p className="text-xs text-gray-500">per trip</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {recommendation.reason}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-xl sticky top-24">
              <CardHeader className="bg-gradient-to-br from-blue-600 to-teal-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Your Custom Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Provider Info - Display only if a quote is available */}
                  {providerQuote && (
                    <div className="pb-4 border-b">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Provider</span>
                        <Badge variant="secondary" className="font-semibold bg-blue-100 text-blue-800">
                          {providerQuote.provider_name}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        Quote valid until {format(new Date(providerQuote.valid_until), "MMM d, yyyy")}
                      </p>
                    </div>
                  )}

                  <div className="pb-4 border-b">
                    <p className="text-sm text-gray-600 mb-2">Selected Coverage</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedCoverages.length} {selectedCoverages.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>

                  {isGettingQuote ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                      <span className="ml-2 text-sm text-gray-600">Getting live quote...</span>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        {selectedCoverages.map(covId => {
                          const coverage = coverageOptions.find(c => c.id === covId);
                          if (!coverage) return null;
                          const price = calculateCoveragePrice(coverage); // Display our calculated price even if provider quote is different for individual items
                          
                          return (
                            <div key={covId} className="flex justify-between text-sm">
                              <span className="text-gray-600">{coverage.name}</span>
                              <span className="font-medium">${price}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-900 font-semibold">Total Premium</span>
                          {/* Display provider's premium if available, otherwise our calculated premium */}
                          <span className="text-3xl font-bold text-blue-600">
                            ${providerQuote?.premium_amount || totalPremium}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">One-time payment for entire trip</p>
                      </div>
                    </>
                  )}

                  <div className="pt-4">
                    <div className="p-3 bg-green-50 rounded-lg mb-4">
                      <p className="text-sm text-green-800 font-medium">
                        {/* Display provider's coverage limit if available, otherwise our calculated limit */}
                        ✓ Coverage up to ${((providerQuote?.coverage_limit || (totalPremium * 50))).toLocaleString()}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        24/7 emergency assistance included
                      </p>
                      {/* Display provider name if quote available */}
                      {providerQuote && (
                        <p className="text-xs text-green-600 mt-1">
                          Backed by {providerQuote.provider_name}
                        </p>
                      )}
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-lg py-6"
                      onClick={handlePurchase}
                      disabled={selectedCoverages.length === 0 || isAnalyzing || isGettingQuote || !providerQuote}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Shield className="w-5 h-5 mr-2" />
                          Purchase Protection
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why WanderSure */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Why WanderSure?</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>AI-powered risk analysis for your specific trip</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Pay only for coverage you actually need</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Real-time travel alerts and updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Fast claims processing with support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
