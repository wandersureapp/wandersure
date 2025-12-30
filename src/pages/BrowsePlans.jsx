import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, Star } from "lucide-react";

export default function BrowsePlans() {
  const plans = [
    {
      name: "Basic Protection",
      price: 49,
      description: "Essential coverage for budget-conscious travelers",
      features: [
        "Trip Cancellation up to $5,000",
        "Baggage Loss up to $1,000",
        "Flight Delay (6+ hours)",
        "24/7 Emergency Assistance",
        "Travel Accident Insurance"
      ],
      popular: false
    },
    {
      name: "Standard Coverage",
      price: 89,
      description: "Comprehensive protection for most travelers",
      features: [
        "Trip Cancellation up to $10,000",
        "Trip Interruption up to $10,000",
        "Baggage Loss/Delay up to $2,500",
        "Medical Emergency up to $50,000",
        "Flight Delay (4+ hours)",
        "Missed Connection Coverage",
        "24/7 Emergency Assistance"
      ],
      popular: true
    },
    {
      name: "Premium Shield",
      price: 149,
      description: "Maximum protection for worry-free travel",
      features: [
        "Trip Cancellation up to $25,000",
        "Trip Interruption up to $25,000",
        "Baggage Loss/Delay up to $5,000",
        "Medical Emergency up to $100,000",
        "Medical Evacuation up to $250,000",
        "Theft Protection",
        "Rental Car Damage",
        "Natural Disaster Coverage",
        "Cancel for Any Reason (75% refund)",
        "Priority Claims Processing"
      ],
      popular: false
    },
    {
      name: "Ultimate Protection",
      price: 249,
      description: "Luxury coverage with zero compromise",
      features: [
        "Trip Cancellation up to $50,000",
        "Trip Interruption up to $50,000",
        "Baggage Loss/Delay up to $10,000",
        "Medical Emergency up to $250,000",
        "Medical Evacuation up to $500,000",
        "Complete Theft Protection",
        "Adventure Sports Coverage",
        "Pre-existing Conditions Coverage",
        "Cancel for Any Reason (100% refund)",
        "Concierge Services",
        "VIP Claims Processing"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Protection Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive travel insurance designed to protect what matters most. 
            Select the plan that fits your journey.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`border-none shadow-xl hover:shadow-2xl transition-all relative ${
                plan.popular ? 'lg:scale-105 ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1 inline" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="mb-2">
                  <Shield className="w-10 h-10 text-blue-600 mb-3" />
                </div>
                <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <div className="mb-6">
                  <p className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                    <span className="text-lg text-gray-500 font-normal">/trip</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">One-time premium</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Select Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coverage Details */}
        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle>What's Covered?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Trip Cancellation",
                  description: "Get reimbursed if you need to cancel your trip due to covered reasons like illness, injury, or natural disasters."
                },
                {
                  title: "Medical Emergency",
                  description: "Coverage for emergency medical expenses while traveling, including hospital stays and emergency treatments."
                },
                {
                  title: "Baggage Protection",
                  description: "Reimbursement for lost, stolen, or delayed baggage during your trip."
                },
                {
                  title: "Flight Delays",
                  description: "Compensation for extended flight delays, including meals and accommodation expenses."
                },
                {
                  title: "Medical Evacuation",
                  description: "Coverage for emergency medical transportation to the nearest adequate facility."
                },
                {
                  title: "24/7 Assistance",
                  description: "Round-the-clock support for emergencies, travel arrangements, and medical referrals."
                }
              ].map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}