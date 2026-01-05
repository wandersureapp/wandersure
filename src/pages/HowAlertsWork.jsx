import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Shield, 
  Eye, 
  Lock, 
  Settings,
  CheckCircle,
  AlertCircle,
  Info,
  Zap
} from "lucide-react";

export default function HowAlertsWork() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full mb-6 shadow-xl">
            <Bell className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How WanderSure Keeps You Informed
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Without Overwhelming You
          </p>
        </div>

        {/* Main Message */}
        <Card className="border-none shadow-2xl mb-8 bg-white">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                WanderSure doesn't send alerts for everything.
              </h2>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                We send alerts for what matters.
              </p>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed">
              Our AI continuously monitors global data sources — including weather systems, 
              security advisories, transportation networks, and health alerts — and filters 
              them through intelligent risk models designed specifically for travelers.
            </p>
          </CardContent>
        </Card>

        {/* Severity Levels */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Alert Severity Levels
          </h2>
          <div className="grid gap-6">
            {/* Informational */}
            <Card className="border-2 border-gray-200 hover:border-gray-300 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Info className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">🟢 Informational</h3>
                      <Badge variant="outline">In-App Only</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">
                      Awareness-level updates that don't require action
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                      <strong>Example:</strong> "Local festival expected to increase crowds this evening."
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Caution */}
            <Card className="border-2 border-yellow-200 hover:border-yellow-300 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">🟡 Caution</h3>
                      <Badge className="bg-yellow-100 text-yellow-800">Review Recommended</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">
                      Conditions that may impact your plans or safety
                    </p>
                    <div className="bg-yellow-50 p-4 rounded-lg text-sm text-gray-700 space-y-2">
                      <div><strong>Example:</strong> "Increased pickpocketing reports near tourist areas."</div>
                      <div><strong>Delivery:</strong> In-app + Email (Premium/Elite)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Critical */}
            <Card className="border-2 border-red-300 hover:border-red-400 transition-colors bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">🔴 Critical</h3>
                      <Badge className="bg-red-600 text-white">Immediate Action</Badge>
                    </div>
                    <p className="text-gray-700 mb-3">
                      <strong>Immediate or escalating risk requiring urgent attention</strong>
                    </p>
                    <div className="bg-white p-4 rounded-lg text-sm text-gray-700 space-y-2">
                      <div><strong>Example:</strong> "Avoid Area X — active security incident reported."</div>
                      <div><strong>Delivery:</strong> Email (All) + SMS (Elite tier)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* What Makes Us Different */}
        <Card className="border-none shadow-xl mb-8 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              What Makes Our Alerts Different
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: Shield, text: "Personalized to your trip" },
                { icon: Eye, text: "Location-aware" },
                { icon: CheckCircle, text: "Severity-based" },
                { icon: Zap, text: "Actionable, not alarming" },
                { icon: Bell, text: "Designed to prevent alert fatigue" },
                { icon: Settings, text: "Fully customizable" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* You Stay in Control */}
        <Card className="border-none shadow-xl mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              You Stay in Control
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Choose alert types</p>
                  <p className="text-gray-600 text-sm">Select which notifications you want to receive</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Adjust notification channels</p>
                  <p className="text-gray-600 text-sm">Email, RSS feed, or SMS (Elite)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Pause or resume alerts anytime</p>
                  <p className="text-gray-600 text-sm">Full control at your fingertips</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="border-none shadow-xl mb-8 bg-gray-900 text-white">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Your Privacy Comes First</h2>
            </div>
            <div className="space-y-3 text-gray-300">
              <p className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                No data sold
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                No location tracking outside active trips
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                No unnecessary retention
              </p>
            </div>
            <p className="mt-6 text-gray-400 text-sm">
              WanderSure exists to inform, not intrude — so you can travel confidently.
            </p>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Link to={createPageUrl("NotificationSettings")}>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg px-8 py-6 shadow-xl">
              <Settings className="w-5 h-5 mr-2" />
              Configure Your Alerts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}