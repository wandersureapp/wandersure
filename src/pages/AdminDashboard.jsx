import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  PlaneTakeoff, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Shield,
  Activity,
  UserPlus,
  Zap,
  RefreshCw
} from "lucide-react";
import { format, subDays, isAfter } from "date-fns";
import { toast } from "sonner";
import AuthGuard from "../components/AuthGuard";

export default function AdminDashboard() {
  const [manualEmail, setManualEmail] = useState('');
  const [manualTier, setManualTier] = useState('premium');
  
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
    retry: 1
  });

  const isAdmin = !userLoading && user?.role === 'admin';

  const activateSubscriptionMutation = useMutation({
    mutationFn: async ({ user_email, subscription_tier }) => {
      const response = await base44.functions.invoke('manualSubscriptionActivation', {
        user_email,
        subscription_tier
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Subscription activated successfully');
      setManualEmail('');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to activate subscription');
    }
  });

  const refreshRisksMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('refreshTripRisks', {});
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(`Refreshed ${data.trips_analyzed} trips successfully`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to refresh risks');
    }
  });

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => base44.entities.User.list('-created_date'),
    enabled: isAdmin
  });

  const { data: trips = [] } = useQuery({
    queryKey: ['admin-trips'],
    queryFn: () => base44.entities.Trip.list('-created_date'),
    enabled: isAdmin
  });

  const { data: purchases = [] } = useQuery({
    queryKey: ['admin-purchases'],
    queryFn: () => base44.entities.ChecklistPurchase.list('-created_date'),
    enabled: isAdmin
  });

  const { data: tripAccess = [] } = useQuery({
    queryKey: ['admin-trip-access'],
    queryFn: () => base44.entities.TripAccess.list('-created_date'),
    enabled: isAdmin
  });

  const { data: notificationPrefs = [] } = useQuery({
    queryKey: ['admin-notification-prefs'],
    queryFn: () => base44.entities.UserNotificationPreferences.list('-created_date'),
    enabled: isAdmin
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ['admin-recommendations'],
    queryFn: () => base44.entities.Recommendation.list('-created_date'),
    enabled: isAdmin
  });

  if (userLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600">This page is only available to administrators.</p>
            </CardContent>
          </Card>
        </div>
      </AuthGuard>
    );
  }

  // Calculate metrics
  const last7Days = subDays(new Date(), 7);
  const last30Days = subDays(new Date(), 30);

  const newUsersLast7Days = users.filter(u => {
    try {
      return u.created_date && isAfter(new Date(u.created_date), last7Days);
    } catch {
      return false;
    }
  }).length;

  const newUsersLast30Days = users.filter(u => {
    try {
      return u.created_date && isAfter(new Date(u.created_date), last30Days);
    } catch {
      return false;
    }
  }).length;

  const tripsLast7Days = trips.filter(t => {
    try {
      return t.created_date && isAfter(new Date(t.created_date), last7Days);
    } catch {
      return false;
    }
  }).length;

  const tripsLast30Days = trips.filter(t => {
    try {
      return t.created_date && isAfter(new Date(t.created_date), last30Days);
    } catch {
      return false;
    }
  }).length;

  const checklistRevenue = purchases.reduce((sum, p) => sum + (p.amount_paid || 0), 0);
  const tripAccessRevenue = tripAccess.reduce((sum, p) => sum + (p.amount_paid || 0), 0);
  const subscriptionRevenue = notificationPrefs
    .filter(p => p.subscription_tier === 'premium' || p.subscription_tier === 'elite')
    .length * 9.99; // Approximate monthly revenue
  const totalRevenue = checklistRevenue + tripAccessRevenue + subscriptionRevenue;

  const activeTrips = trips.filter(t => 
    t.status === 'active' || t.status === 'booked'
  ).length;

  const highRiskTrips = trips.filter(t => 
    t.risk_assessment?.overall_score > 75
  ).length;

  const recentUsers = users.slice(0, 10);
  const recentTrips = trips.slice(0, 10);
  const allPurchases = [
    ...purchases.map(p => ({ ...p, source: 'checklist', date: p.created_date })),
    ...tripAccess.map(p => ({ ...p, source: 'trip_access', date: p.created_date }))
  ].filter(p => p.date).sort((a, b) => {
    try {
      return new Date(b.date) - new Date(a.date);
    } catch {
      return 0;
    }
  });
  const recentPurchases = allPurchases.slice(0, 10);

  return (
    <AuthGuard>
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">App performance and user analytics</p>
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-none shadow-lg bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  Manual Subscription Activation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    placeholder="User email"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={manualTier} onValueChange={setManualTier}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premium">Explorer</SelectItem>
                      <SelectItem value="elite">Globetrotter</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => activateSubscriptionMutation.mutate({ 
                      user_email: manualEmail, 
                      subscription_tier: manualTier 
                    })}
                    disabled={!manualEmail || activateSubscriptionMutation.isPending}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {activateSubscriptionMutation.isPending ? 'Activating...' : 'Activate'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-cyan-50 to-teal-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-cyan-600" />
                  Refresh Risk Assessments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Manually trigger risk data refresh for all active trips
                  </p>
                  <Button
                    onClick={() => refreshRisksMutation.mutate()}
                    disabled={refreshRisksMutation.isPending}
                    className="bg-cyan-600 hover:bg-cyan-700 w-full"
                  >
                    {refreshRisksMutation.isPending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Refreshing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh All Trips
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                    <p className="text-xs text-green-600 mt-1">
                      +{newUsersLast7Days} last 7 days
                    </p>
                  </div>
                  <Users className="w-10 h-10 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Trips</p>
                    <p className="text-3xl font-bold text-gray-900">{trips.length}</p>
                    <p className="text-xs text-green-600 mt-1">
                      +{tripsLast7Days} last 7 days
                    </p>
                  </div>
                  <PlaneTakeoff className="w-10 h-10 text-cyan-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${totalRevenue.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {purchases.length + tripAccess.length} purchases
                    </p>
                  </div>
                  <DollarSign className="w-10 h-10 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Trips</p>
                    <p className="text-3xl font-bold text-gray-900">{activeTrips}</p>
                    <p className="text-xs text-red-600 mt-1">
                      {highRiskTrips} high risk
                    </p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 30-Day Growth */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  30-Day User Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-700">New Users</span>
                    <Badge className="bg-blue-600">{newUsersLast30Days}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Total Users</span>
                    <Badge variant="outline">{users.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Growth Rate</span>
                    <Badge variant="outline">
                      {users.length > 0 ? ((newUsersLast30Days / users.length) * 100).toFixed(1) : 0}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlaneTakeoff className="w-5 h-5 text-cyan-600" />
                  30-Day Trip Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                    <span className="text-sm text-gray-700">New Trips</span>
                    <Badge className="bg-cyan-600">{tripsLast30Days}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Active Trips</span>
                    <Badge variant="outline">{activeTrips}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Avg per User</span>
                    <Badge variant="outline">
                      {users.length > 0 ? (trips.length / users.length).toFixed(1) : 0}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Users */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Recent Signups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentUsers.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {u.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{u.email}</p>
                      </div>
                      <span className="text-xs text-gray-400 ml-2">
                        {u.created_date ? format(new Date(u.created_date), "MMM d") : 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Trips */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Recent Trips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentTrips.map(t => (
                    <div key={t.id} className="p-2 rounded-lg hover:bg-gray-50">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {t.trip_name}
                      </p>
                      <p className="text-xs text-gray-500">{t.destination}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {t.status}
                        </Badge>
                        {t.risk_assessment?.overall_score && (
                          <Badge 
                            className={`text-xs ${
                              t.risk_assessment.overall_score > 75 
                                ? 'bg-red-100 text-red-700' 
                                : t.risk_assessment.overall_score > 50 
                                ? 'bg-orange-100 text-orange-700'
                                : t.risk_assessment.overall_score > 25 
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            Risk: {Math.round(t.risk_assessment.overall_score)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Purchases */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Recent Purchases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentPurchases.length > 0 ? (
                    recentPurchases.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {p.source === 'trip_access' 
                              ? `${p.access_level} - ${p.payment_type === 'one_time' ? 'One-Time' : 'Subscription'}`
                              : p.product_type?.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{p.user_email}</p>
                        </div>
                        <div className="text-right ml-2">
                          <p className="text-sm font-bold text-green-600">
                            ${p.amount_paid?.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {p.date ? format(new Date(p.date), "MMM d") : 'N/A'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No purchases yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}