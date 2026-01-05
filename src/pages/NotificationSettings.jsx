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
  Train,
  Rss,
  Copy
} from "lucide-react";
import { toast } from "sonner";
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

  const handleUpgrade = async (tier) => {
    // Map tier to Stripe price IDs
    const priceMapping = {
      'premium_monthly': 'price_1SkuAWDAiWHJZCc7cYYkBp09',
      'premium_yearly': 'price_PREMIUM_YEARLY_ID', // Replace with actual Stripe price ID
      'elite_monthly': 'price_1SkuB1DAiWHJZCc7Qg57Y5zZ',
      'elite_yearly': 'price_ELITE_YEARLY_ID' // Replace with actual Stripe price ID
    };
    
    const priceId = priceMapping[tier];
    const plan = tier.includes('elite') ? 'elite' : 'premium';
    
    if (!priceId) {
      alert('Invalid plan selected');
      return;
    }
    
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

        {/* Subscription Tiers Comparison */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Free - Traveler Tier */}
          <Card className="border-2 border-gray-200">
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Traveler</CardTitle>
                <Badge className="bg-gray-200 text-gray-800">FREE</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>🔴 Critical alerts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Trip reminders</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Email (6hr delay)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Premium - Explorer Tier */}
          <Card className="border-2 border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Explorer
                </CardTitle>
                {formData.subscription_tier === 'premium' ? (
                  <Badge className="bg-green-600">ACTIVE</Badge>
                ) : (
                  <Badge className="bg-white text-blue-600">$9.99/mo</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 mb-3">Everything in Traveler, plus:</p>
              <ul className="space-y-2 text-sm mb-4">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>🟡 Caution alerts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Plane className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Flight tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <Cloud className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Weather alerts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Hourly monitoring</span>
                </li>
              </ul>
              {formData.subscription_tier !== 'premium' && formData.subscription_tier !== 'elite' && (
                <div className="space-y-2">
                  <Button 
                    size="sm"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                    onClick={() => handleUpgrade('premium_monthly')}
                  >
                    $9.99/month
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                    onClick={() => handleUpgrade('premium_yearly')}
                  >
                    $94.99/year <Badge className="ml-2 bg-green-600 text-white text-xs">Save 20%</Badge>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Elite - Globetrotter Tier */}
          <Card className="border-2 border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Globetrotter
                </CardTitle>
                {formData.subscription_tier === 'elite' ? (
                  <Badge className="bg-green-600">ACTIVE</Badge>
                ) : (
                  <Badge className="bg-white text-purple-600">$19.99/mo</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 mb-3">Everything in Explorer, plus:</p>
              <ul className="space-y-2 text-sm mb-4">
                <li className="flex items-start gap-2">
                  <Smartphone className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span><strong>SMS alerts</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Escalation priority</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Group coordination</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>24/7 support</span>
                </li>
              </ul>
              {formData.subscription_tier !== 'elite' && (
                <div className="space-y-2">
                  <Button 
                    size="sm"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                    onClick={() => handleUpgrade('elite_monthly')}
                  >
                    $19.99/month
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                    onClick={() => handleUpgrade('elite_yearly')}
                  >
                    $180.00/year <Badge className="ml-2 bg-green-600 text-white text-xs">Save 25%</Badge>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {(formData.subscription_tier === 'premium' || formData.subscription_tier === 'elite') && (
          <Card className="mb-6 border-2 border-green-300 bg-green-50">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-bold text-gray-900">
                    {formData.subscription_tier === 'elite' ? 'Globetrotter Active' : 'Explorer Active'}
                  </p>
                  <p className="text-sm text-gray-600">All real-time features unlocked</p>
                </div>
              </div>
              <Badge className="bg-green-600 text-white">
                <Crown className="w-3 h-3 mr-1" />
                {formData.subscription_tier === 'elite' ? 'Globetrotter' : 'Explorer'}
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
              {/* RSS Feed */}
              <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Rss className="w-5 h-5 text-orange-600 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">RSS Feed Alerts</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Subscribe to your personal RSS feed in any RSS reader (Feedly, Inoreader, etc.) for instant alerts
                    </p>
                    <div className="flex items-center gap-2">
                      <Input 
                        readOnly 
                        value={`${window.location.origin}/getTripAlertsRSS`}
                        className="text-xs"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/getTripAlertsRSS`);
                          toast.success('RSS feed URL copied!');
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
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
                    <Smartphone className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">SMS Alerts</p>
                      <p className="text-sm text-gray-600">
                        {formData.subscription_tier === 'elite' ? 'Critical alerts via SMS' : 'Globetrotter feature'}
                      </p>
                    </div>
                  </div>
                  {formData.subscription_tier !== 'elite' && (
                    <Badge className="bg-purple-100 text-purple-800">Globetrotter</Badge>
                  )}
                  {formData.subscription_tier === 'elite' && (
                    <Switch
                      checked={formData.sms_enabled}
                      onCheckedChange={(checked) => setFormData({...formData, sms_enabled: checked})}
                    />
                  )}
                </div>
                {formData.subscription_tier === 'elite' && formData.sms_enabled && (
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

          {/* Premium/Elite Alert Types */}
          <Card className={formData.subscription_tier === 'free' ? 'opacity-60' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                Explorer & Globetrotter Alerts
                {formData.subscription_tier === 'free' && (
                  <Badge className="bg-blue-100 text-blue-800 ml-2">Upgrade Required</Badge>
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
                  disabled={formData.subscription_tier === 'free'}
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
                  disabled={formData.subscription_tier === 'free'}
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
                  disabled={formData.subscription_tier === 'free'}
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
                  disabled={formData.subscription_tier === 'free'}
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
                  disabled={formData.subscription_tier === 'free'}
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
                  disabled={formData.subscription_tier === 'free'}
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
                  disabled={formData.subscription_tier === 'free'}
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
                  disabled={formData.subscription_tier === 'free'}
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
                  disabled={formData.subscription_tier === 'free'}
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
                  disabled={formData.subscription_tier === 'free'}
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