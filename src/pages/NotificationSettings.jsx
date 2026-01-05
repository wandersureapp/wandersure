import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Shield,
  Sparkles,
  CheckCircle,
  Crown,
  CreditCard,
  X,
  Check,
  Plane,
  Cloud,
  AlertTriangle,
  Hotel,
  Car,
  Ship,
  Train
} from "lucide-react";
import { createCheckoutSession } from "@/functions/createCheckoutSession";
import AuthGuard from "../components/AuthGuard";

export default function NotificationSettings() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['notification-preferences'],
    queryFn: async () => {
      const prefs = await base44.entities.UserNotificationPreferences.list();
      return prefs.find(p => p.user_email === user?.email) || null;
    },
    enabled: !!user
  });

  const [formData, setFormData] = useState({
    email_enabled: true,
    in_app_enabled: true,
    sms_enabled: false,
    sms_number: "",
    premium_subscription: false,
    alert_types: {
      trip_reminders: true,
      major_risk_alerts: true,
      flight_updates: false,
      airport_intelligence: false,
      weather_updates: false,
      destination_safety: false,
      hotel_updates: false,
      car_rental_updates: false,
      cruise_updates: false,
      rail_updates: false,
      insurance_recommendations: false,
      price_drop_alerts: false
    }
  });

  React.useEffect(() => {
    if (preferences) {
      setFormData(preferences);
    }
  }, [preferences]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (preferences) {
        return base44.entities.UserNotificationPreferences.update(preferences.id, data);
      } else {
        return base44.entities.UserNotificationPreferences.create({
          ...data,
          user_email: user.email
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
    }
  });

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  const handleUpgrade = async (plan) => {
    const priceId = plan === 'monthly' 
        ? 'price_1SkuAWDAiWHJZCc7cYYkBp09' 
        : 'price_1SkuB1DAiWHJZCc7Qg57Y5zZ';
    
    try {
      const response = await createCheckoutSession({ 
        priceId, 
        plan 
      });
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment setup failed. Please try again.');
    }
  };

  const freeFeatures = [
    { icon: Bell, label: "Trip countdown reminders" },
    { icon: AlertTriangle, label: "Major safety warnings" },
    { icon: Cloud, label: "Severe weather alerts" }
  ];

  const premiumFeatures = [
    { icon: Plane, label: "Real-time flight delays & gate changes" },
    { icon: AlertTriangle, label: "Live TSA wait times & airport traffic" },
    { icon: Cloud, label: "Hour-by-hour weather tracking" },
    { icon: Shield, label: "Political & safety updates" },
    { icon: Hotel, label: "Hotel status & room changes" },
    { icon: Car, label: "Rental car availability alerts" },
    { icon: Ship, label: "Cruise departure & port updates" },
    { icon: Train, label: "Rail delays & platform changes" },
    { icon: CreditCard, label: "Insurance price drop alerts" },
    { icon: Smartphone, label: "SMS alerts included" }
  ];

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Travel Alerts</h1>
          <p className="text-xl text-gray-600">Real-time monitoring and intelligent notifications</p>
        </div>

        {/* Free vs Premium Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Free Tier */}
          <Card className="border-2 border-gray-200">
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Basic Alerts</CardTitle>
                <Badge className="bg-gray-200 text-gray-800">FREE</Badge>
              </div>
              <p className="text-gray-600 text-sm mt-2">Essential notifications for every traveler</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {freeFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <feature.icon className="w-4 h-4 text-gray-500 mb-1" />
                      <p className="text-sm text-gray-700">{feature.label}</p>
                    </div>
                  </div>
                ))}
              </div>
              {!formData.premium_subscription && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600 text-center">
                    You're currently on Basic Alerts
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Premium Tier */}
          <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300/30 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Crown className="w-6 h-6 text-yellow-600" />
                  Premium Intelligence
                </CardTitle>
                {formData.premium_subscription ? (
                  <Badge className="bg-green-600 text-white">ACTIVE</Badge>
                ) : (
                  <Badge className="bg-yellow-600 text-white">UPGRADE</Badge>
                )}
              </div>
              <p className="text-gray-700 text-sm mt-2">Complete real-time travel intelligence</p>
            </CardHeader>
            <CardContent className="p-6 relative">
              <div className="space-y-3 mb-6">
                {premiumFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <feature.icon className="w-4 h-4 text-gray-600 mb-1" />
                      <p className="text-sm text-gray-800 font-medium">{feature.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {!formData.premium_subscription && (
                <div className="mt-6 pt-6 border-t border-yellow-200">
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold text-gray-900">$4.99<span className="text-lg text-gray-600">/mo</span></p>
                    <p className="text-sm text-gray-600">or $49/year (save 18%)</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                      onClick={() => handleUpgrade('monthly')}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Monthly
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 border-2 border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                      onClick={() => handleUpgrade('yearly')}
                    >
                      Yearly (Save 18%)
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    💳 Secure payment via Stripe • Cancel anytime
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {formData.premium_subscription && (
          <Card className="mb-6 border-2 border-green-300 bg-green-50">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-bold text-gray-900">Premium Intelligence Active</p>
                  <p className="text-sm text-gray-600">All real-time features unlocked</p>
                </div>
              </div>
              <Badge className="bg-green-600 text-white">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {/* Notification Channels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <Switch
                  checked={formData.email_enabled}
                  onCheckedChange={(checked) => setFormData({...formData, email_enabled: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">In-App Notifications</p>
                    <p className="text-sm text-gray-600">Show alerts in the app</p>
                  </div>
                </div>
                <Switch
                  checked={formData.in_app_enabled}
                  onCheckedChange={(checked) => setFormData({...formData, in_app_enabled: checked})}
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">SMS Alerts</p>
                      <p className="text-sm text-gray-600">
                        {formData.premium_subscription ? 'Critical alerts via SMS' : 'Premium feature'}
                      </p>
                    </div>
                  </div>
                  {!formData.premium_subscription && (
                    <Badge className="bg-yellow-100 text-yellow-800">Premium</Badge>
                  )}
                  {formData.premium_subscription && (
                    <Switch
                      checked={formData.sms_enabled}
                      onCheckedChange={(checked) => setFormData({...formData, sms_enabled: checked})}
                    />
                  )}
                </div>
                {formData.premium_subscription && formData.sms_enabled && (
                  <div>
                    <Label htmlFor="sms_number">Phone Number</Label>
                    <Input
                      id="sms_number"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.sms_number || ""}
                      onChange={(e) => setFormData({...formData, sms_number: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Free Alert Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Basic Alerts (Free)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Trip Reminders</p>
                  <p className="text-sm text-gray-600">Departure countdowns and travel prep tips</p>
                </div>
                <Switch
                  checked={formData.alert_types.trip_reminders}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    alert_types: {...formData.alert_types, trip_reminders: checked}
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Major Risk Alerts</p>
                  <p className="text-sm text-gray-600">Critical safety warnings and severe weather</p>
                </div>
                <Switch
                  checked={formData.alert_types.major_risk_alerts}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    alert_types: {...formData.alert_types, major_risk_alerts: checked}
                  })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Premium Alert Types */}
          <Card className={!formData.premium_subscription ? 'opacity-60' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Premium Intelligence Alerts
                {!formData.premium_subscription && (
                  <Badge className="bg-yellow-100 text-yellow-800 ml-2">Upgrade Required</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Plane className="w-4 h-4" />
                    Flight Updates
                  </p>
                  <p className="text-sm text-gray-600">Real-time delays, cancellations, gate changes</p>
                </div>
                <Switch
                  checked={formData.alert_types.flight_updates}
                  disabled={!formData.premium_subscription}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    alert_types: {...formData.alert_types, flight_updates: checked}
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Airport Intelligence
                  </p>
                  <p className="text-sm text-gray-600">Live TSA wait times, traffic, parking availability</p>
                </div>
                <Switch
                  checked={formData.alert_types.airport_intelligence}
                  disabled={!formData.premium_subscription}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    alert_types: {...formData.alert_types, airport_intelligence: checked}
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Cloud className="w-4 h-4" />
                    Weather Intelligence
                  </p>
                  <p className="text-sm text-gray-600">Hour-by-hour forecasts and storm tracking</p>
                </div>
                <Switch
                  checked={formData.alert_types.weather_updates}
                  disabled={!formData.premium_subscription}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    alert_types: {...formData.alert_types, weather_updates: checked}
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Destination Safety
                  </p>
                  <p className="text-sm text-gray-600">Political updates, crime alerts, health advisories</p>
                </div>
                <Switch
                  checked={formData.alert_types.destination_safety}
                  disabled={!formData.premium_subscription}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    alert_types: {...formData.alert_types, destination_safety: checked}
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Hotel className="w-4 h-4" />
                    Hotel Updates
                  </p>
                  <p className="text-sm text-gray-600">Check-in status, room changes, facility alerts</p>
                </div>
                <Switch
                  checked={formData.alert_types.hotel_updates}
                  disabled={!formData.premium_subscription}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    alert_types: {...formData.alert_types, hotel_updates: checked}
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Car Rental Updates
                  </p>
                  <p className="text-sm text-gray-600">Availability, pickup location changes</p>
                </div>
                <Switch
                  checked={formData.alert_types.car_rental_updates}
                  disabled={!formData.premium_subscription}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    alert_types: {...formData.alert_types, car_rental_updates: checked}
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Ship className="w-4 h-4" />
                    Cruise Updates
                  </p>
                  <p className="text-sm text-gray-600">Departure times, port changes, excursion alerts</p>
                </div>
                <Switch
                  checked={formData.alert_types.cruise_updates}
                  disabled={!formData.premium_subscription}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    alert_types: {...formData.alert_types, cruise_updates: checked}
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Train className="w-4 h-4" />
                    Rail & Train Updates
                  </p>
                  <p className="text-sm text-gray-600">Delays, platform changes, service disruptions</p>
                </div>
                <Switch
                  checked={formData.alert_types.rail_updates}
                  disabled={!formData.premium_subscription}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    alert_types: {...formData.alert_types, rail_updates: checked}
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Insurance Recommendations</p>
                  <p className="text-sm text-gray-600">Smart coverage suggestions when risks change</p>
                </div>
                <Switch
                  checked={formData.alert_types.insurance_recommendations}
                  disabled={!formData.premium_subscription}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    alert_types: {...formData.alert_types, insurance_recommendations: checked}
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Price Drop Alerts</p>
                  <p className="text-sm text-gray-600">Insurance premium discounts for your trips</p>
                </div>
                <Switch
                  checked={formData.alert_types.price_drop_alerts}
                  disabled={!formData.premium_subscription}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    alert_types: {...formData.alert_types, price_drop_alerts: checked}
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 px-8"
          >
            {saveMutation.isPending ? "Saving..." : "Save Preferences"}
          </Button>
        </div>

        {saveMutation.isSuccess && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800">Alert preferences saved successfully!</p>
          </div>
        )}
      </div>
    </div>
    </AuthGuard>
  );
}