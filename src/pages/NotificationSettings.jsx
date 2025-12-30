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
  CreditCard
} from "lucide-react";

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
      weather_updates: false,
      destination_safety: false,
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

  const premiumFeatures = [
    { icon: "✈️", label: "Real-time flight delay alerts" },
    { icon: "🌦️", label: "Detailed weather forecasts" },
    { icon: "🚨", label: "Live destination safety updates" },
    { icon: "💰", label: "Insurance price drop notifications" },
    { icon: "🎯", label: "Smart coverage recommendations" },
    { icon: "📱", label: "SMS alerts included" }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Notification Settings</h1>
          <p className="text-xl text-gray-600">Stay informed with AI-powered travel alerts</p>
        </div>

        {!formData.premium_subscription && (
          <Card className="mb-6 border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Upgrade to Premium Alerts
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Get real-time risk intelligence, flight updates, and smart insurance recommendations
                  </p>
                  <div className="grid md:grid-cols-3 gap-3 mb-4">
                    {premiumFeatures.map(feature => (
                      <div key={feature.label} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-lg">{feature.icon}</span>
                        <span>{feature.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">$4.99<span className="text-lg text-gray-600">/mo</span></p>
                      <p className="text-sm text-gray-600">or $49/year (save 18%)</p>
                    </div>
                    <Button 
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                      onClick={() => {
                        alert("Payment integration requires backend functions to be enabled.\n\nOnce enabled, you'll be able to process payments securely through Stripe.");
                      }}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Upgrade Now
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    💳 Secure payment via Stripe • Cancel anytime
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {formData.premium_subscription && (
          <Card className="mb-6 border-2 border-green-300 bg-green-50">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-bold text-gray-900">Premium Alerts Active</p>
                  <p className="text-sm text-gray-600">All features unlocked</p>
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
                Free Alerts
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
                Premium Alerts
                {!formData.premium_subscription && (
                  <Badge className="bg-yellow-100 text-yellow-800 ml-2">Upgrade Required</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Flight Updates</p>
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
                  <p className="font-medium text-gray-900">Weather Updates</p>
                  <p className="text-sm text-gray-600">Detailed forecasts and storm warnings</p>
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
                  <p className="font-medium text-gray-900">Destination Safety</p>
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
            <p className="text-green-800">Notification preferences saved successfully!</p>
          </div>
        )}
      </div>
    </div>
  );
}