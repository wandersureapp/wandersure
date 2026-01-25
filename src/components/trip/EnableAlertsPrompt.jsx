import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Sparkles, CheckCircle, Crown, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export default function EnableAlertsPrompt({ trip }) {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const { data: notificationPrefs = [] } = useQuery({
    queryKey: ['notification-preferences'],
    queryFn: () => base44.entities.UserNotificationPreferences.list(),
    enabled: !!user?.email
  });

  const { data: tripAccess = [] } = useQuery({
    queryKey: ['trip-access', trip.id],
    queryFn: () => base44.entities.TripAccess.filter({ trip_id: trip.id }),
    enabled: !!trip.id
  });

  const userPrefs = Array.isArray(notificationPrefs) ? notificationPrefs.find(p => p.user_email === user?.email) : null;
  const userTripAccess = Array.isArray(tripAccess) ? tripAccess.find(ta => ta.user_email === user?.email) : null;
  
  // Check if user has active subscription or trip access
  const hasSubscription = userPrefs && (userPrefs.subscription_tier === 'premium' || userPrefs.subscription_tier === 'elite');
  const hasTripAccess = userTripAccess !== undefined && userTripAccess !== null;
  const hasActiveAccess = hasSubscription || hasTripAccess;

  // Check if alerts are enabled
  const alertsEnabled = userPrefs?.in_app_enabled || userPrefs?.email_enabled;

  // If they have access AND alerts are enabled, don't show this card
  if (hasActiveAccess && alertsEnabled) {
    return null;
  }

  // Determine subscription tier name
  const getTierName = () => {
    if (userPrefs?.subscription_tier === 'elite') return 'Globetrotter';
    if (userPrefs?.subscription_tier === 'premium') return 'Explorer';
    if (hasTripAccess) {
      return userTripAccess.access_level === 'globetrotter' ? 'Globetrotter' : 'Explorer';
    }
    return null;
  };

  const tierName = getTierName();

  // If they have access but alerts are NOT enabled
  if (hasActiveAccess && !alertsEnabled) {
    return (
      <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
              {tierName === 'Globetrotter' ? <Crown className="w-6 h-6 text-white" /> : <Shield className="w-6 h-6 text-white" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900">Welcome, {tierName}!</h3>
                <Badge className={tierName === 'Globetrotter' ? "bg-purple-600 text-white" : "bg-blue-600 text-white"}>
                  {tierName}
                </Badge>
              </div>
              <p className="text-gray-700 mb-4">
                We see you haven't enabled your alert features yet! Your {tierName} plan includes powerful real-time monitoring 
                for flight delays, weather changes, and safety updates.
              </p>
              
              <div className="grid md:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Hourly risk monitoring</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Flight & weather updates</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Airport intelligence</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Destination safety alerts</span>
                </div>
              </div>

              <Link to={createPageUrl("NotificationSettings")}>
                <Button className={tierName === 'Globetrotter' ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" : "bg-blue-600 hover:bg-blue-700"}>
                  <Bell className="w-4 h-4 mr-2" />
                  Enable Your Alerts Now
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default: No subscription or access - show upgrade prompt
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
                  <Bell className="w-4 h-4 mr-2" />
                  View Alert Plans
                </Button>
              </Link>
              <p className="text-sm text-gray-600">
                Free basic alerts • Explorer from $9.99/mo
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}