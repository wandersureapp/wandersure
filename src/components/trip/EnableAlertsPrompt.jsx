import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Sparkles, CheckCircle } from "lucide-react";

export default function EnableAlertsPrompt({ trip }) {
  return (
    <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900">Enable Smart Travel Alerts</h3>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-gray-700 mb-4">
              Get AI-powered notifications about flight delays, weather changes, and safety updates for {trip.destination}
            </p>
            
            <div className="grid md:grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Real-time risk monitoring</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Flight & weather updates</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Destination safety alerts</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Smart insurance recommendations</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link to={createPageUrl("NotificationSettings")}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Enable Alerts
                </Button>
              </Link>
              <p className="text-sm text-gray-600">
                Free basic alerts • Premium from $4.99/mo
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}