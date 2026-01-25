import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, ArrowRight, Sparkles, Zap } from "lucide-react";

export default function InsuranceRecommendations({ tripId, recommendedCoverage, tripCost }) {
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
    natural_disaster: "Natural Disaster"
  };

  // Calculate realistic estimate based on trip cost
  const estimateMin = Math.max(49, Math.round(tripCost * 0.03));
  const estimateMax = Math.max(149, Math.round(tripCost * 0.08));

  return (
    <div className="space-y-6">
      {/* AI-Powered Customization CTA */}
      <Card className="border-none shadow-xl bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800')] bg-cover bg-center opacity-10"></div>
        <CardContent className="p-6 relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Smart Coverage Builder</h3>
              <p className="text-sm text-blue-100">AI-Powered for Your Trip</p>
            </div>
          </div>
          
          <p className="text-sm text-white/90 mb-4">
            Get personalized insurance based on your trip's unique risk profile. 
            Pay only for what you need, nothing more.
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-300" />
              <span>Tailored to your destination risks</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-300" />
              <span>Dynamic pricing based on analysis</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-300" />
              <span>No unnecessary coverage costs</span>
            </div>
          </div>

          <Link to={createPageUrl("CustomizeInsurance")}>
            <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg group">
              <Zap className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              See WanderSure's Recommendations
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* World Nomads Travel Insurance */}
      <Card className="border-none shadow-lg overflow-hidden">
        <div className="relative h-24 bg-gradient-to-r from-orange-500 to-yellow-500">
          <div className="absolute inset-0 flex items-center px-6">
            <Shield className="w-8 h-8 text-white mr-3" />
            <div>
              <h3 className="text-lg font-bold text-white">Travel Insurance</h3>
              <p className="text-sm text-white/90">Get coverage from World Nomads</p>
            </div>
          </div>
        </div>
        <CardContent className="p-6 text-center">
          <a href="https://www.dpbolvw.net/click-101622714-15379546" target="_blank" rel="noopener noreferrer">
            <img src="https://www.awltovhc.com/image-101622714-15379546" width={250} height={250} alt="World Nomads Travel Insurance" border={0} className="mx-auto" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
}