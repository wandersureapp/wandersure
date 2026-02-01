import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil } from "lucide-react";
import { 
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Plane,
  Hotel,
  Car,
  Activity,
  ListChecks,
  Bell,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

import RiskGauges from "../components/trip/RiskGauges";
import InsuranceRecommendations from "../components/trip/InsuranceRecommendations";
import EnableAlertsPrompt from "../components/trip/EnableAlertsPrompt";
import AlertList from "../components/alerts/AlertList";
import SocialShare from "../components/social/SocialShare";
import TripAccessManager from "../components/trip/TripAccessManager";
import { trackEvent } from "../components/analytics/MetaPixel";

export default function TripDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const tripId = urlParams.get('id');

  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const { data: trip, isLoading, error } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: async () => {
      if (!tripId) return null;
      try {
        const trips = await base44.entities.Trip.filter({ id: tripId });
        return trips[0] || null;
      } catch (err) {
        console.error('Error fetching trip:', err);
        throw err;
      }
    },
    enabled: !!tripId,
    retry: 2,
    staleTime: 30000,
    refetchInterval: 60000
  });

  const { data: notificationPrefs = [] } = useQuery({
    queryKey: ['notification-preferences'],
    queryFn: () => base44.entities.UserNotificationPreferences.list(),
    enabled: !!user
  });

  const { data: tripAccess = [] } = useQuery({
    queryKey: ['trip-access', tripId],
    queryFn: () => base44.entities.TripAccess.filter({ trip_id: tripId }),
    enabled: !!tripId
  });

  const refreshRiskMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('refreshSingleTripRisk', {
        trip_id: tripId
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
      if (data.new_score !== undefined) {
        toast.success(`Risk data refreshed! Score: ${Math.round(data.new_score)}`);
      } else {
        toast.success('Risk data refreshed successfully!');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to refresh risk data');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus) => {
      await base44.entities.Trip.update(tripId, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
      toast.success('Trip status updated');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update status');
    }
  });

  const userPrefs = React.useMemo(() => {
    return Array.isArray(notificationPrefs) ? notificationPrefs.find(p => p.user_email === user?.email) : null;
  }, [notificationPrefs, user]);

  const userTripAccess = React.useMemo(() => {
    return Array.isArray(tripAccess) ? tripAccess.find(ta => ta.user_email === user?.email) : null;
  }, [tripAccess, user]);
  
  const hasSubscription = userPrefs && (userPrefs.subscription_tier === 'premium' || userPrefs.subscription_tier === 'elite');
  const hasTripAccess = userTripAccess !== undefined && userTripAccess !== null;
  const hasActiveAccess = hasSubscription || hasTripAccess;
  const alertsEnabled = userPrefs?.in_app_enabled || userPrefs?.email_enabled;
  
  const tierName = React.useMemo(() => {
    if (userPrefs?.subscription_tier === 'elite') return 'Globetrotter';
    if (userPrefs?.subscription_tier === 'premium') return 'Explorer';
    if (hasTripAccess && userTripAccess) {
      return userTripAccess.access_level === 'globetrotter' ? 'Globetrotter' : 'Explorer';
    }
    return null;
  }, [userPrefs, hasTripAccess, userTripAccess]);

  React.useEffect(() => {
    if (trip) {
      trackEvent('ViewContent', {
        content_name: trip.trip_name,
        content_category: 'trip',
        content_ids: [trip.id],
        value: trip.trip_cost || 0,
        currency: 'USD'
      });
    }
  }, [trip]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading trip</p>
          <p className="text-sm text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => navigate(createPageUrl("Dashboard"))} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Trip not found</p>
          <Button onClick={() => navigate(createPageUrl("Dashboard"))} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const riskScore = trip.risk_assessment?.overall_score || 0;
  const getRiskLevel = (score) => {
    if (score <= 25) return { label: "Low Risk", color: "text-green-600", bg: "bg-green-50" };
    if (score <= 50) return { label: "Moderate Risk", color: "text-yellow-600", bg: "bg-yellow-50" };
    if (score <= 75) return { label: "High Risk", color: "text-orange-600", bg: "bg-orange-50" };
    return { label: "Critical Risk", color: "text-red-600", bg: "bg-red-50" };
  };
  const riskLevel = getRiskLevel(riskScore);

  const getRiskColorClasses = (score) => {
    if (score <= 25) return { bg: 'bg-green-100 border-green-300', text: 'text-green-600', label: 'Low' };
    if (score <= 50) return { bg: 'bg-yellow-100 border-yellow-300', text: 'text-yellow-600', label: 'Moderate' };
    if (score <= 75) return { bg: 'bg-orange-100 border-orange-300', text: 'text-orange-600', label: 'High' };
    return { bg: 'bg-red-100 border-red-300', text: 'text-red-600', label: 'Critical' };
  };

  const safeDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const daysUntil = trip.start_date && safeDate(trip.start_date) 
    ? differenceInDays(safeDate(trip.start_date), new Date()) 
    : 0;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("Dashboard"))}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl(`NewTrip?edit=${tripId}`))}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Trip
          </Button>
        </div>

        {/* Hero Card */}
        <Card className="border-none shadow-2xl overflow-hidden mb-8">
          <div className="relative h-48 bg-gradient-to-br from-blue-600 via-blue-500 to-teal-500">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200')] bg-cover bg-center opacity-20"></div>
            <div className="relative h-full flex items-end p-6 md:p-8">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {trip.trip_name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{trip.destination}, {trip.destination_country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>
                      {trip.start_date && safeDate(trip.start_date) && trip.end_date && safeDate(trip.end_date)
                        ? `${format(safeDate(trip.start_date), "MMM d")} - ${format(safeDate(trip.end_date), "MMM d, yyyy")}`
                        : 'Dates TBD'}
                    </span>
                  </div>
                </div>
              </div>
              <Link to={createPageUrl("NotificationSettings")}>
                <div className={`${riskLevel.bg} ${riskLevel.color} border-2 ${riskLevel.color.replace('text-', 'border-')} rounded-lg px-5 py-3 cursor-pointer hover:scale-105 transition-all shadow-lg hover:shadow-xl`}>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium opacity-90">Trip Risk Level</span>
                      <span className="text-2xl font-bold">{riskLevel.label.replace(' Risk', '')}</span>
                    </div>
                    <div className="h-10 w-px bg-current opacity-30"></div>
                    <div className="flex flex-col items-center bg-white/20 px-3 py-1 rounded-lg">
                      <Bell className="w-5 h-5 mb-1" />
                      <span className="text-xs font-bold whitespace-nowrap">
                        {hasActiveAccess && alertsEnabled ? 'Active' : 'Enable Alerts'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Travelers</p>
                  <p className="text-lg font-semibold">{trip.travelers_count}</p>
                </div>
              </div>

              {trip.trip_cost > 0 && (
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Trip Cost</p>
                    <p className="text-lg font-semibold">${trip.trip_cost.toLocaleString()}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-lg font-semibold">
                    {trip.start_date && trip.end_date && safeDate(trip.start_date) && safeDate(trip.end_date)
                      ? `${differenceInDays(safeDate(trip.end_date), safeDate(trip.start_date))} days`
                      : 'TBD'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <Select value={trip.status} onValueChange={(value) => updateStatusMutation.mutate(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="booked">Booked</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Risk Assessment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Alerts */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AlertList tripId={trip.id} limit={5} />
              </CardContent>
            </Card>

            {/* Active Access Banner - MOVED UNDER RECENT ALERTS */}
            {hasActiveAccess && alertsEnabled && (
              <Card className="border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-green-900">
                          {tierName} Active - Smart Alerts Enabled
                        </p>
                        <p className="text-sm text-green-700">
                          You're receiving real-time monitoring and updates
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-600 text-white">ACTIVE</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Per-Destination Risk Cards */}
            {trip.destinations && trip.destinations.length > 0 && trip.destinations.some(d => d.risk_assessment) && (
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📍 Risk by Location
                  </CardTitle>
                  <p className="text-sm text-gray-600">Risk assessment for each stop on your trip</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trip.destinations.filter(d => d.risk_assessment).map((dest, idx) => {
                    const destRisk = getRiskColorClasses(dest.risk_assessment.overall_score || 0);
                    return (
                      <div key={idx} className={`p-4 rounded-lg border-2 ${destRisk.bg}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900">{dest.city}, {dest.country}</h4>
                            <p className="text-sm text-gray-600">{dest.arrival_date} to {dest.departure_date}</p>
                            <Badge variant="outline" className="mt-1 text-xs">{dest.purpose}</Badge>
                          </div>
                          <div className="text-center">
                            <div className={`text-3xl font-bold ${destRisk.text}`}>
                              {Math.round(dest.risk_assessment.overall_score || 0)}
                            </div>
                            <p className="text-xs text-gray-600">{destRisk.label} Risk</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-3">
                          <div className="text-center p-2 bg-white/50 rounded">
                            <div className="text-lg font-bold">{Math.round(dest.risk_assessment.crime_risk || 0)}</div>
                            <div className="text-xs text-gray-600">Safety</div>
                          </div>
                          <div className="text-center p-2 bg-white/50 rounded">
                            <div className="text-lg font-bold">{Math.round(dest.risk_assessment.weather_risk || 0)}</div>
                            <div className="text-xs text-gray-600">Weather</div>
                          </div>
                          <div className="text-center p-2 bg-white/50 rounded">
                            <div className="text-lg font-bold">{Math.round(dest.risk_assessment.health_risk || 0)}</div>
                            <div className="text-xs text-gray-600">Health</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Risk Summary Card with Overall Score */}
            {trip.risk_assessment && (
              <Card className="border-none shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        🎯 Risk Assessment
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Last updated: {trip.risk_assessment?.last_updated && safeDate(trip.risk_assessment.last_updated) 
                          ? format(safeDate(trip.risk_assessment.last_updated), "MMM d 'at' h:mm a") 
                          : 'at creation'}
                      </p>
                    </div>
                    <Button
                      onClick={() => refreshRiskMutation.mutate()}
                      disabled={refreshRiskMutation.isPending}
                      variant="outline"
                      size="sm"
                      className="bg-white hover:bg-orange-50"
                    >
                      {refreshRiskMutation.isPending ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Refresh
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Overall Score */}
                  <div className="text-center p-6 bg-white rounded-lg border-2 border-orange-200">
                    <p className="text-sm text-gray-600 mb-2">Overall Risk Score</p>
                    <div className={`text-5xl font-bold ${riskLevel.color} mb-3`}>
                      {Math.round(riskScore)}
                      <span className="text-2xl text-gray-500">/100</span>
                    </div>
                  </div>

                  {/* Risk Scoring Tiles */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg border-2 ${getRiskColorClasses(trip.risk_assessment.flight_delay_risk || 0).bg}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Plane className={`w-5 h-5 ${getRiskColorClasses(trip.risk_assessment.flight_delay_risk || 0).text}`} />
                        <span className="font-semibold text-gray-900">Flight Risk</span>
                      </div>
                      <div className="text-2xl font-bold mb-1">{Math.round(trip.risk_assessment.flight_delay_risk || 0)}/100</div>
                      <p className="text-xs text-gray-600">{getRiskColorClasses(trip.risk_assessment.flight_delay_risk || 0).label} Risk</p>
                    </div>

                    <div className={`p-4 rounded-lg border-2 ${getRiskColorClasses(trip.risk_assessment.weather_risk || 0).bg}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🌤️</span>
                        <span className="font-semibold text-gray-900">Weather</span>
                      </div>
                      <div className="text-2xl font-bold mb-1">{Math.round(trip.risk_assessment.weather_risk || 0)}/100</div>
                      <p className="text-xs text-gray-600">{getRiskColorClasses(trip.risk_assessment.weather_risk || 0).label} Risk</p>
                    </div>

                    <div className={`p-4 rounded-lg border-2 ${getRiskColorClasses(trip.risk_assessment.crime_risk || 0).bg}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🛡️</span>
                        <span className="font-semibold text-gray-900">Safety</span>
                      </div>
                      <div className="text-2xl font-bold mb-1">{Math.round(trip.risk_assessment.crime_risk || 0)}/100</div>
                      <p className="text-xs text-gray-600">{getRiskColorClasses(trip.risk_assessment.crime_risk || 0).label} Risk</p>
                    </div>

                    <div className={`p-4 rounded-lg border-2 ${getRiskColorClasses(trip.risk_assessment.political_risk || 0).bg}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🏛️</span>
                        <span className="font-semibold text-gray-900">Political</span>
                      </div>
                      <div className="text-2xl font-bold mb-1">{Math.round(trip.risk_assessment.political_risk || 0)}/100</div>
                      <p className="text-xs text-gray-600">{getRiskColorClasses(trip.risk_assessment.political_risk || 0).label} Risk</p>
                    </div>

                    <div className={`p-4 rounded-lg border-2 ${getRiskColorClasses(trip.risk_assessment.health_risk || 0).bg}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🏥</span>
                        <span className="font-semibold text-gray-900">Health</span>
                      </div>
                      <div className="text-2xl font-bold mb-1">{Math.round(trip.risk_assessment.health_risk || 0)}/100</div>
                      <p className="text-xs text-gray-600">{getRiskColorClasses(trip.risk_assessment.health_risk || 0).label} Risk</p>
                    </div>

                    <div className={`p-4 rounded-lg border-2 ${getRiskColorClasses(trip.risk_assessment.disruption_risk || 0).bg}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">⚠️</span>
                        <span className="font-semibold text-gray-900">Disruptions</span>
                      </div>
                      <div className="text-2xl font-bold mb-1">{Math.round(trip.risk_assessment.disruption_risk || 0)}/100</div>
                      <p className="text-xs text-gray-600">{getRiskColorClasses(trip.risk_assessment.disruption_risk || 0).label} Risk</p>
                    </div>
                  </div>

                  {/* Airline Risk - Flight Affiliate Opportunity */}
                  {trip.airline && trip.risk_assessment.flight_delay_risk > 50 && (
                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Plane className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">Flight Risk Detected</h4>
                          <p className="text-sm text-gray-700 mb-3">
                            {trip.airline} has elevated delay risk. Consider alternative flights or travel insurance.
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <a 
                              href="https://www.anrdoezrs.net/click-101622714-17223836" 
                              target="_top" 
                              rel="noopener noreferrer"
                            >
                              <Button className="bg-blue-600 hover:bg-blue-700">
                                ✈️ Find Better Flights on Expedia
                              </Button>
                            </a>
                            <img src="https://www.lduhtrp.net/image-101622714-17223836" width={1} height={1} border={0} alt="" className="hidden" />
                            <a 
                              href="https://www.anrdoezrs.net/click-101622714-17100505" 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <img src="https://www.lduhtrp.net/image-101622714-17100505" width={320} height={50} alt="Travel Insurance" border={0} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Safety Guide Upsell */}
                  {trip.risk_assessment.overall_score > 40 && (
                    <div className="p-5 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <span className="text-3xl">🛡️</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-gray-900 text-lg">Want to Travel Safer?</h4>
                            <Badge className="bg-purple-600 text-white">Premium Guide</Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">
                            Get our <strong>AI-generated Safety Guide</strong> with local emergency contacts, common scams to avoid, 
                            safe neighborhoods, hospital locations, and insider tips from travelers who've been there. 
                            <strong> Know before you go.</strong>
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline" className="text-xs">🚨 Emergency Contacts</Badge>
                            <Badge variant="outline" className="text-xs">🎭 Scam Alerts</Badge>
                            <Badge variant="outline" className="text-xs">🗺️ Safe Areas</Badge>
                            <Badge variant="outline" className="text-xs">🏥 Medical Info</Badge>
                          </div>
                          <div className="flex flex-wrap gap-2 items-center">
                            <Link to={createPageUrl(`SafetyGuide?tripId=${trip.id}`)}>
                              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg">
                                🛡️ Generate My Safety Guide ($4.99)
                              </Button>
                            </Link>
                            <a 
                              href="https://www.anrdoezrs.net/click-101622714-17100505" 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <img src="https://www.lduhtrp.net/image-101622714-17100505" width={320} height={50} alt="Travel Insurance from World Nomads" border={0} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Risk Details & Reasoning */}
            {trip.risk_details && (
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📊 Initial Risk Analysis Details
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Analysis from: {trip.risk_assessment?.last_updated && safeDate(trip.risk_assessment.last_updated) ? format(safeDate(trip.risk_assessment.last_updated), "MMM d, yyyy 'at' h:mm a") : 'trip creation'}
                  </p>
                  <p className="text-xs text-blue-600 font-medium mt-1">
                    💡 Subscribe to Smart Alerts for live hourly updates and detailed analysis
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trip.risk_details.critical_alerts?.length > 0 && (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                      <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                        🚨 Critical Alerts
                      </h4>
                      <ul className="space-y-2">
                        {trip.risk_details.critical_alerts.map((alert, idx) => (
                          <li key={idx} className="text-sm text-red-800">{alert}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {trip.risk_details.flight_delay_reasoning && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">✈️ Flight Delays & Cancellations</h4>
                      <ReactMarkdown className="text-sm text-gray-700 prose prose-sm max-w-none">{trip.risk_details.flight_delay_reasoning}</ReactMarkdown>
                    </div>
                  )}

                  {trip.risk_details.weather_reasoning && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">🌤️ Weather Conditions</h4>
                      <ReactMarkdown className="text-sm text-gray-700 prose prose-sm max-w-none">{trip.risk_details.weather_reasoning}</ReactMarkdown>
                    </div>
                  )}

                  {trip.risk_details.airport_intel && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">🏢 Airport Intelligence</h4>
                      <ReactMarkdown className="text-sm text-gray-700 prose prose-sm max-w-none">{trip.risk_details.airport_intel}</ReactMarkdown>
                      {trip.risk_assessment?.tsa_wait_times && (
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>TSA Wait Times:</strong> {trip.risk_assessment.tsa_wait_times}
                        </p>
                      )}
                    </div>
                  )}

                  {trip.risk_details.crime_reasoning && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">🛡️ Safety & Crime</h4>
                      <ReactMarkdown className="text-sm text-gray-700 prose prose-sm max-w-none">{trip.risk_details.crime_reasoning}</ReactMarkdown>
                    </div>
                  )}

                  {trip.risk_details.political_reasoning && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">🏛️ Political Stability</h4>
                      <ReactMarkdown className="text-sm text-gray-700 prose prose-sm max-w-none">{trip.risk_details.political_reasoning}</ReactMarkdown>
                    </div>
                  )}

                  {trip.risk_details.health_reasoning && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">🏥 Health & Medical</h4>
                      <ReactMarkdown className="text-sm text-gray-700 prose prose-sm max-w-none">{trip.risk_details.health_reasoning}</ReactMarkdown>
                    </div>
                  )}

                  {trip.risk_details.disruption_reasoning && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">⚠️ Travel Disruptions</h4>
                      <ReactMarkdown className="text-sm text-gray-700 prose prose-sm max-w-none">{trip.risk_details.disruption_reasoning}</ReactMarkdown>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}



            {/* Travel Bookings - MOVED TO RIGHT COLUMN */}
          </div>

          {/* Right Column - Insurance & Quick Actions */}
          <div className="space-y-6">
            <InsuranceRecommendations 
              tripId={trip.id}
              recommendedCoverage={trip.recommended_coverage}
              tripCost={trip.trip_cost}
            />

            {/* Travel Checklist Card */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ListChecks className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">Travel Checklist</h3>
                    <p className="text-xs text-gray-600 mb-3">
                      Track your pre-departure tasks
                    </p>
                    <Link to={createPageUrl(`TripChecklist?id=${trip.id}`)}>
                      <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                        <ListChecks className="w-4 h-4 mr-2" />
                        View Checklist
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Travel Bookings - MOVED HERE */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="w-5 h-5" />
                  Travel Bookings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trip.flights && trip.flights.length > 0 ? (
                  trip.flights.map((flight, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <Plane className="w-5 h-5 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Flight {idx + 1}</p>
                        {flight.airline && <p className="text-sm text-gray-600">{flight.airline}</p>}
                        {flight.flight_number && (
                          <p className="text-sm text-gray-500">Flight #{flight.flight_number}</p>
                        )}
                        {flight.departure_airport && flight.arrival_airport && (
                          <p className="text-sm text-gray-500">{flight.departure_airport} → {flight.arrival_airport}</p>
                        )}
                        {flight.departure_date && (
                          <p className="text-sm text-gray-500">Departure: {flight.departure_date}</p>
                        )}
                        {idx === 0 && (
                          <>
                            <a 
                              href="https://www.anrdoezrs.net/click-101622714-17223836" 
                              target="_top"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
                            >
                              Compare flight options on Expedia →
                            </a>
                            <img src="https://www.lduhtrp.net/image-101622714-17223836" width={1} height={1} border={0} alt="" className="hidden" />
                          </>
                        )}
                      </div>
                    </div>
                  ))
                ) : trip.airline ? (
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <Plane className="w-5 h-5 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Flight</p>
                      <p className="text-sm text-gray-600">{trip.airline}</p>
                      {trip.flight_number && (
                        <p className="text-sm text-gray-500">Flight {trip.flight_number}</p>
                      )}
                      <a 
                        href="https://www.anrdoezrs.net/click-101622714-17223836" 
                        target="_top"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
                      >
                        Compare flight options on Expedia →
                      </a>
                      <img src="https://www.lduhtrp.net/image-101622714-17223836" width={1} height={1} border={0} alt="" className="hidden" />
                    </div>
                  </div>
                ) : null}

                {trip.hotel_name && (
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <Hotel className="w-5 h-5 text-purple-600 mt-1" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Hotel</p>
                      <p className="text-sm text-gray-600">{trip.hotel_name}</p>
                      <a 
                        href="https://www.dpbolvw.net/click-101622714-15734399" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium mt-2 inline-block"
                      >
                        Find better hotel deals on HOTELS.COM® →
                      </a>
                      <img src="https://www.ftjcfx.com/image-101622714-15734399" width={1} height={1} border={0} alt="" className="hidden" />
                    </div>
                  </div>
                )}

                {!trip.hotel_name && (
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Hotel className="w-5 h-5 text-purple-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-2">Need a place to stay in {trip.destination}?</p>
                        <a 
                          href="https://www.dpbolvw.net/click-101622714-15734399" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <Button className="bg-purple-600 hover:bg-purple-700">
                            <Hotel className="w-4 h-4 mr-2" />
                            Search Hotels on HOTELS.COM®
                          </Button>
                        </a>
                        <img src="https://www.ftjcfx.com/image-101622714-15734399" width={1} height={1} border={0} alt="" className="hidden" />
                        <p className="text-xs text-gray-500 mt-2">HOTELS.COM is a trademark or registered trademark of Expedia, Inc.</p>
                      </div>
                    </div>
                  </div>
                )}

                {trip.car_rental_company && (
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <Car className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Car Rental</p>
                      <p className="text-sm text-gray-600">{trip.car_rental_company}</p>
                    </div>
                  </div>
                )}

                {!trip.car_rental_company && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-3">Need a rental car for your trip?</p>
                    <a href="https://www.jdoqocy.com/click-101622714-17126276" target="_blank" rel="noopener noreferrer" className="block">
                      <img src="https://www.ftjcfx.com/image-101622714-17126276" width={728} height={90} alt="Car Rentals with Full Coverage Insurance" border={0} className="mx-auto" />
                    </a>
                  </div>
                )}

                {(!trip.flights || trip.flights.length === 0) && !trip.airline && !trip.hotel_name && !trip.car_rental_company && (
                  <div className="text-center py-8">
                    <Plane className="w-12 h-12 mx-auto mb-3 opacity-30 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-4">No travel bookings added yet</p>
                    <div className="flex flex-col gap-2 max-w-xs mx-auto">
                      <a href="https://www.anrdoezrs.net/click-101622714-17223836" target="_top" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full">Book on Expedia</Button>
                      </a>
                      <img src="https://www.lduhtrp.net/image-101622714-17223836" width={1} height={1} border={0} alt="" className="hidden" />
                      <a href="https://www.dpbolvw.net/click-101622714-15734399" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full">Book Hotels on HOTELS.COM®</Button>
                      </a>
                      <img src="https://www.ftjcfx.com/image-101622714-15734399" width={1} height={1} border={0} alt="" className="hidden" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Share */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-3">Share Your Trip</h3>
                <SocialShare trip={trip} variant="compact" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}