import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  CheckCircle, 
  Download,
  BookOpen,
  ListChecks,
  Map,
  Plane,
  Shield,
  Wallet,
  Camera,
  Users,
  Check
} from "lucide-react";

export default function TravelAides() {
  const { data: purchases = [] } = useQuery({
    queryKey: ['checklist-purchases'],
    queryFn: () => base44.entities.ChecklistPurchase.list()
  });

  const hasPurchased = (productId) => {
    return purchases.some(p => 
      p.product_id === productId || 
      p.product_type === 'travel_aide_bundle'
    );
  };

  const aides = [
    {
      id: 'interactive-checklist',
      icon: ListChecks,
      title: "Interactive Smart Checklist",
      description: "AI-powered checklist with timeline alerts and progress tracking",
      price: "$4.99",
      color: "from-blue-500 to-cyan-500",
      features: [
        "AI-generated custom items for your trip",
        "Timeline-based smart reminders",
        "Push notifications for overdue tasks",
        "Auto-populate from booking data",
        "Print or use in-app",
        "Track completion progress"
      ],
      badge: "Most Popular",
      comingSoon: false
    },
    {
      id: 'destination-playbook',
      icon: BookOpen,
      title: "Destination Playbook",
      description: "In-depth guide with local insights, customs, and tips",
      price: "$4.99",
      color: "from-purple-500 to-pink-500",
      features: [
        "Local customs & etiquette",
        "Phrases & language tips",
        "Hidden gems & local spots",
        "Safety & health guidance",
        "Money-saving strategies"
      ],
      comingSoon: true
    },
    {
      id: 'safety-guide',
      icon: Shield,
      title: "Safety & Security Guide",
      description: "Comprehensive safety protocols for every destination",
      price: "$3.99",
      color: "from-red-500 to-orange-500",
      features: [
        "Emergency contacts",
        "Scam awareness",
        "Safe transportation tips",
        "Health precautions",
        "Document backup strategies"
      ],
      comingSoon: true
    },
    {
      id: 'budget-planner',
      icon: Wallet,
      title: "Budget Planner",
      description: "Track expenses and stay on budget throughout your trip",
      price: "$2.99",
      color: "from-green-500 to-teal-500",
      features: [
        "Daily expense tracker",
        "Currency conversion helper",
        "Budget alerts",
        "Expense categories",
        "Post-trip analysis"
      ],
      comingSoon: true
    },
    {
      id: 'photography-guide',
      icon: Camera,
      title: "Travel Photography Guide",
      description: "Capture memories like a pro with expert tips",
      price: "$4.99",
      color: "from-indigo-500 to-blue-500",
      features: [
        "Best photo spots",
        "Golden hour timing",
        "Composition tips",
        "Mobile photography hacks",
        "Photo organization"
      ],
      comingSoon: true
    },
    {
      id: 'group-coordinator',
      icon: Users,
      title: "Group Travel Coordinator",
      description: "Keep everyone organized for multi-person trips",
      price: "$5.99",
      color: "from-yellow-500 to-orange-500",
      features: [
        "Shared itinerary",
        "Group expense splitting",
        "Communication hub",
        "Voting on activities",
        "Shared packing lists"
      ],
      comingSoon: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-purple-700 text-sm font-medium">Your Travel Command Center</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Travel Aides</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert-crafted checklists, playbooks, and planning tools to make every journey stress-free and unforgettable
          </p>
        </div>

        <Card className="mb-8 border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardContent className="p-6 text-center">
            <ListChecks className="w-12 h-12 mx-auto mb-3 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Interactive Checklist Now Available!</h3>
            <p className="text-gray-600 mb-4">
              AI-powered checklist with smart reminders and progress tracking. Never miss a travel task again!
            </p>
          </CardContent>
        </Card>

        {/* Aides Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aides.map((aide) => (
            <Card key={aide.id} className="border-none shadow-lg hover:shadow-xl transition-all relative overflow-hidden group">
              <div className={`h-32 bg-gradient-to-br ${aide.color} relative`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                <div className="relative h-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <aide.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                {aide.badge && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-yellow-400 text-gray-900 border-0">
                      {aide.badge}
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-xl">{aide.title}</CardTitle>
                  <Badge variant="outline" className="font-bold">
                    {aide.price}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{aide.description}</p>
              </CardHeader>

              <CardContent>
                <div className="space-y-2 mb-4">
                  {aide.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {hasPurchased(aide.id) ? (
                  <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                    <Check className="w-4 h-4 mr-2" />
                    Purchased
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    variant={aide.comingSoon ? "outline" : "default"}
                    disabled={aide.comingSoon}
                  >
                    {aide.comingSoon ? "Coming Soon" : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Get for {aide.price}
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Card className="border-none shadow-lg text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Map className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Expert Crafted</h3>
              <p className="text-sm text-gray-600">
                Created by seasoned travelers and destination experts
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Always Accessible</h3>
              <p className="text-sm text-gray-600">
                Download once, access offline anytime during your trip
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Regularly Updated</h3>
              <p className="text-sm text-gray-600">
                Get the latest tips and updates as travel evolves
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="mt-12 border-none shadow-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
          <CardContent className="p-12 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Bundle & Save</h2>
            <p className="text-xl text-blue-100 mb-6">
              Get all Travel Aides (when available) for just $24.99 - save 40%
            </p>
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-blue-50" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}