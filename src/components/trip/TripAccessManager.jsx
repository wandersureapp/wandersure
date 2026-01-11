import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Crown, Zap, ArrowRight, Lock } from "lucide-react";
import { createCheckoutSession } from "@/functions/createCheckoutSession";

export default function TripAccessManager({ trip }) {
  const [loading, setLoading] = React.useState(false);

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: preferences } = useQuery({
    queryKey: ['notification-preferences'],
    queryFn: async () => {
      const prefs = await base44.entities.UserNotificationPreferences.list();
      return prefs.find(p => p.user_email === user?.email) || null;
    },
    enabled: !!user
  });

  const { data: tripAccess } = useQuery({
    queryKey: ['trip-access', trip.id],
    queryFn: async () => {
      const access = await base44.entities.TripAccess.filter({ trip_id: trip.id });
      return access.find(a => a.user_email === user?.email && new Date(a.access_end_date) > new Date()) || null;
    },
    enabled: !!user
  });

  const hasSubscription = preferences?.subscription_tier === 'premium' || preferences?.subscription_tier === 'elite';
  const hasOneTimeAccess = !!tripAccess;
  const hasAnyAccess = hasSubscription || hasOneTimeAccess;

  const handlePurchase = async (plan, amount, priceId) => {
    setLoading(true);
    try {
      const { data } = await createCheckoutSession({
        priceId,
        plan,
        tripId: trip.id
      });
      window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
      setLoading(false);
    }
  };

  if (hasSubscription) {
    return (
      <Card className="border-2 border-green-300 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">
                {preferences.subscription_tier === 'elite' ? 'Globetrotter' : 'Explorer'} Active
              </p>
              <p className="text-sm text-gray-600">All features unlocked for this trip</p>
            </div>
            <Badge className="bg-green-600 text-white">ACTIVE</Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hasOneTimeAccess) {
    const daysLeft = Math.ceil((new Date(tripAccess.access_end_date) - new Date()) / (1000 * 60 * 60 * 24));
    
    return (
      <Card className="border-2 border-blue-300 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">
                {tripAccess.access_level === 'globetrotter' ? 'Globetrotter' : 'Explorer'} Access Active
              </p>
              <p className="text-sm text-gray-600">Monitoring through {new Date(tripAccess.access_end_date).toLocaleDateString()} ({daysLeft} days left)</p>
            </div>
            <Badge className="bg-blue-600 text-white">ACTIVE</Badge>
          </div>

          {tripAccess.access_level === 'explorer' && (
            <div className="p-4 bg-purple-50 border-2 border-purple-300 rounded-lg">
              <p className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Crown className="w-5 h-5 text-purple-600" />
                Enjoying these features? Upgrade to Globetrotter!
              </p>
              <p className="text-sm text-gray-700 mb-3">
                Add SMS alerts, priority support, and escalation for just <strong>+$10</strong> ($29.99 total)
              </p>
              <Button 
                onClick={() => handlePurchase('globetrotter', 29.99, 'price_GLOBETROTTER_ONETIME')}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Crown className="w-4 h-4 mr-2" />
                {loading ? 'Processing...' : 'Upgrade to Globetrotter (+$10)'}
              </Button>
            </div>
          )}

          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg">
            <p className="font-bold text-gray-900 mb-2">Love these alerts? Go unlimited!</p>
            <p className="text-sm text-gray-700 mb-3">
              Frequent traveler? Get <strong>unlimited monitoring</strong> for all your trips with a subscription — more cost-effective and less worry!
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={() => window.location.href = '/NotificationSettings'}
                variant="outline"
                className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                View Subscription Plans
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-orange-300 bg-orange-50">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-lg">Unlock Live Trip Monitoring</p>
            <p className="text-sm text-gray-600">Get real-time alerts and hourly risk updates for this trip</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="p-4 bg-white rounded-lg border-2 border-blue-300">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <p className="font-bold text-gray-900">Explorer Access</p>
              </div>
              <Badge className="bg-blue-600 text-white">$19.99</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              ✓ Real-time flight, weather, hotel alerts<br />
              ✓ Hourly risk monitoring<br />
              ✓ Coverage through {new Date(new Date(trip.end_date).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
            <Button 
              onClick={() => handlePurchase('explorer', 19.99, 'price_1QomwOKHr9Xz6M8pQOuN7W9i')}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              {loading ? 'Processing...' : 'Get Explorer Access - $19.99'}
            </Button>
          </div>

          <div className="p-4 bg-white rounded-lg border-2 border-purple-300">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-purple-600" />
                <p className="font-bold text-gray-900">Globetrotter Access</p>
              </div>
              <Badge className="bg-purple-600 text-white">$29.99</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              ✓ Everything in Explorer<br />
              ✓ <strong>SMS critical alerts</strong><br />
              ✓ Priority support & escalation<br />
              ✓ Coverage through {new Date(new Date(trip.end_date).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
            <Button 
              onClick={() => handlePurchase('globetrotter', 29.99, 'price_GLOBETROTTER_ONETIME')}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Crown className="w-4 h-4 mr-2" />
              {loading ? 'Processing...' : 'Get Globetrotter Access - $29.99'}
            </Button>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-lg">
          <p className="font-bold text-gray-900 mb-2">🎯 Frequent Traveler?</p>
          <p className="text-sm text-gray-700 mb-3">
            Save money with a subscription! Just <strong>2 trips = subscription pays for itself</strong>
          </p>
          <Button 
            onClick={() => window.location.href = '/NotificationSettings'}
            variant="outline"
            className="w-full border-cyan-600 text-cyan-600 hover:bg-cyan-50"
          >
            See Subscription Plans <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}