import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, Sparkles, ArrowRight, Award, ExternalLink } from "lucide-react";
import { buildAffiliateUrl, trackAffiliateClick } from "../components/utils/affiliateTracking";
import { openExternalLink } from "../components/utils/openExternalLink";

export default function BrowsePlans() {
  const providers = [
    {
      name: "World Nomads",
      logo: "🌍",
      website: "https://www.worldnomads.com",
      description: "Best for adventure travelers and backpackers",
      features: [
        "Adventure sports coverage",
        "Flexible policies",
        "24/7 emergency assistance",
        "Medical & evacuation coverage"
      ],
      rating: 4.5,
      priceRange: "$$"
    },
    {
      name: "Allianz Travel",
      logo: "🛡️",
      website: "https://www.allianztravelinsurance.com",
      description: "Comprehensive coverage from a trusted brand",
      features: [
        "Trip cancellation for any reason",
        "Flight accident coverage",
        "Rental car protection",
        "Medical expense coverage"
      ],
      rating: 4.7,
      priceRange: "$$$",
      popular: true
    },
    {
      name: "Travel Guard",
      logo: "✈️",
      website: "https://www.travelguard.com",
      description: "Great all-around protection",
      features: [
        "Medical expense coverage",
        "Baggage protection",
        "Travel delay reimbursement",
        "Concierge services"
      ],
      rating: 4.3,
      priceRange: "$$"
    },
    {
      name: "Seven Corners",
      logo: "⭐",
      website: "https://www.sevencorners.com",
      description: "Affordable plans with solid coverage",
      features: [
        "Customizable coverage",
        "Pre-existing condition coverage",
        "Cancel for work reasons",
        "Excellent value"
      ],
      rating: 4.4,
      priceRange: "$"
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="bg-blue-100 text-blue-800 mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Recommendations
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Compare Top Travel Insurance Providers
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            We analyze your trip and find you the best coverage from trusted partners. 
            Get personalized quotes based on your destination, dates, and risk level.
          </p>
          <Link to={createPageUrl("NewTrip")}>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-lg px-8">
              Get Personalized Quotes
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        {/* How It Works */}
        <Card className="mb-12 border-none shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="text-2xl text-center">How WanderSure Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
                <h3 className="font-bold text-lg mb-2">Add Your Trip</h3>
                <p className="text-gray-600 text-sm">Tell us your destination, dates, and travel details</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
                <h3 className="font-bold text-lg mb-2">AI Analyzes Risks</h3>
                <p className="text-gray-600 text-sm">We assess flight delays, weather, crime, and health risks</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
                <h3 className="font-bold text-lg mb-2">Compare & Choose</h3>
                <p className="text-gray-600 text-sm">See personalized quotes from top providers instantly</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Provider Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Our Partner Providers</h2>
          <p className="text-gray-600 text-center mb-8">Trusted insurance companies we work with</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {providers.map((provider) => (
              <Card 
                key={provider.name}
                className={`border-none shadow-xl hover:shadow-2xl transition-all ${
                  provider.popular ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {provider.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-1">
                      <Award className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{provider.logo}</span>
                      <div>
                        <CardTitle className="text-xl mb-1">{provider.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm text-gray-600">{provider.rating} rating</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-gray-700">
                      {provider.priceRange}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{provider.description}</p>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {provider.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => {
                      const affiliateUrl = buildAffiliateUrl(provider.website, provider.name, {
                        source: 'browse_plans'
                      });
                      trackAffiliateClick(provider.name, null, null);
                      openExternalLink(affiliateUrl);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Visit {provider.name}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Choose WanderSure */}
        <Card className="border-none shadow-xl bg-gradient-to-br from-teal-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Why Use WanderSure?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: "🤖",
                  title: "AI-Powered Analysis",
                  description: "Smart risk assessment based on real-time data for your specific destination"
                },
                {
                  icon: "💰",
                  title: "Best Price Guarantee",
                  description: "Compare multiple providers instantly to find the best deal for your needs"
                },
                {
                  icon: "🎯",
                  title: "Personalized Coverage",
                  description: "Recommendations tailored to your trip's unique risk profile"
                },
                {
                  icon: "⚡",
                  title: "Instant Quotes",
                  description: "Get quotes from top providers in seconds, not hours"
                },
                {
                  icon: "🔔",
                  title: "Real-Time Alerts",
                  description: "Stay informed with flight, weather, and safety notifications"
                },
                {
                  icon: "🛡️",
                  title: "Trusted Partners",
                  description: "Work with established, reputable insurance providers"
                }
              ].map((item, index) => (
                <div key={index} className="text-center p-4">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Card className="border-2 border-blue-300 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
            <CardContent className="p-8">
              <Shield className="w-16 h-16 mx-auto mb-4 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">Ready to Get Protected?</h2>
              <p className="text-blue-100 mb-6 text-lg max-w-2xl mx-auto">
                Create your trip and get personalized insurance quotes from top providers in minutes
              </p>
              <Link to={createPageUrl("NewTrip")}>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8">
                  Start Your Trip
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}