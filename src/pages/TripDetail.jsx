import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Bell
} from "lucide-react";
import { Link } from "react-router-dom";
import { format, differenceInDays } from "date-fns";

import RiskGauges from "../components/trip/RiskGauges";
import InsuranceRecommendations from "../components/trip/InsuranceRecommendations";
import EnableAlertsPrompt from "../components/trip/EnableAlertsPrompt";
import AlertList from "../components/alerts/AlertList";
import SocialShare from "../components/social/SocialShare";
import TripAccessManager from "../components/trip/TripAccessManager";
import { trackEvent } from "../components/analytics/MetaPixel";

export default function TripDetail() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const tripId = urlParams.get('id');

  const { data: trip, isLoading, error } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: async () => {
      if (!tripId) return null;
      const trips = await base44.entities.Trip.list();
      const foundTrip = trips.find(t => t.id === tripId);
      if (!foundTrip) {
        console.error('Trip not found. Trip ID:', tripId, 'Available trips:', trips.length);
      }
      return foundTrip || null;
    },
    enabled: !!tripId,
    retry: 1
  });

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
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Dashboard"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

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
              <Badge className={`${riskLevel.bg} ${riskLevel.color} border-0 text-base px-4 py-2`}>
                {riskLevel.label}
              </Badge>
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
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-lg font-semibold capitalize">{trip.status}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Risk Assessment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Access Manager */}
            <TripAccessManager trip={trip} />

            <EnableAlertsPrompt trip={trip} />

            {/* Social Share */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-6">
                <SocialShare trip={trip} />
              </CardContent>
            </Card>

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

            {/* Travel Checklist Card */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ListChecks className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Travel Checklist</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Track your pre-departure tasks with our interactive checklist
                    </p>
                    <Link to={createPageUrl(`TripChecklist?id=${trip.id}`)}>
                      <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                        <ListChecks className="w-4 h-4 mr-2" />
                        View Checklist
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Summary Card */}
            {trip.risk_assessment && (
              <Card className="border-none shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🎯 Initial Risk Assessment
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Based on your trip details at the time of planning
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    {trip.risk_assessment.flight_delay_risk > 0 && (
                      <div className={`p-4 rounded-lg border-2 ${getRiskColorClasses(trip.risk_assessment.flight_delay_risk).bg}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Plane className={`w-5 h-5 ${getRiskColorClasses(trip.risk_assessment.flight_delay_risk).text}`} />
                          <span className="font-semibold text-gray-900">Flight Risk</span>
                        </div>
                        <div className="text-2xl font-bold mb-1">{Math.round(trip.risk_assessment.flight_delay_risk)}/100</div>
                        <p className="text-xs text-gray-600">{getRiskColorClasses(trip.risk_assessment.flight_delay_risk).label} Risk</p>
                      </div>
                    )}

                    {trip.risk_assessment.weather_risk > 0 && (
                      <div className={`p-4 rounded-lg border-2 ${getRiskColorClasses(trip.risk_assessment.weather_risk).bg}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">🌤️</span>
                          <span className="font-semibold text-gray-900">Weather</span>
                        </div>
                        <div className="text-2xl font-bold mb-1">{Math.round(trip.risk_assessment.weather_risk)}/100</div>
                        <p className="text-xs text-gray-600">{getRiskColorClasses(trip.risk_assessment.weather_risk).label} Risk</p>
                      </div>
                    )}

                    {trip.risk_assessment.crime_risk > 0 && (
                      <div className={`p-4 rounded-lg border-2 ${getRiskColorClasses(trip.risk_assessment.crime_risk).bg}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">🛡️</span>
                          <span className="font-semibold text-gray-900">Safety</span>
                        </div>
                        <div className="text-2xl font-bold mb-1">{Math.round(trip.risk_assessment.crime_risk)}/100</div>
                        <p className="text-xs text-gray-600">{getRiskColorClasses(trip.risk_assessment.crime_risk).label} Risk</p>
                      </div>
                    )}

                    {trip.risk_assessment.political_risk > 0 && (
                      <div className={`p-4 rounded-lg border-2 ${getRiskColorClasses(trip.risk_assessment.political_risk).bg}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">🏛️</span>
                          <span className="font-semibold text-gray-900">Political</span>
                        </div>
                        <div className="text-2xl font-bold mb-1">{Math.round(trip.risk_assessment.political_risk)}/100</div>
                        <p className="text-xs text-gray-600">{getRiskColorClasses(trip.risk_assessment.political_risk).label} Risk</p>
                      </div>
                    )}

                    {trip.risk_assessment.health_risk > 0 && (
                      <div className={`p-4 rounded-lg border-2 ${getRiskColorClasses(trip.risk_assessment.health_risk).bg}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">🏥</span>
                          <span className="font-semibold text-gray-900">Health</span>
                        </div>
                        <div className="text-2xl font-bold mb-1">{Math.round(trip.risk_assessment.health_risk)}/100</div>
                        <p className="text-xs text-gray-600">{getRiskColorClasses(trip.risk_assessment.health_risk).label} Risk</p>
                      </div>
                    )}

                    {trip.risk_assessment.disruption_risk > 0 && (
                      <div className={`p-4 rounded-lg border-2 ${getRiskColorClasses(trip.risk_assessment.disruption_risk).bg}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">⚠️</span>
                          <span className="font-semibold text-gray-900">Disruptions</span>
                        </div>
                        <div className="text-2xl font-bold mb-1">{Math.round(trip.risk_assessment.disruption_risk)}/100</div>
                        <p className="text-xs text-gray-600">{getRiskColorClasses(trip.risk_assessment.disruption_risk).label} Risk</p>
                      </div>
                    )}
                  </div>

                  {/* Upgrade to Live Monitoring CTA */}
                  <div className="mt-6 p-5 bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-300 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Bell className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-2">Want More Detailed Travel Intelligence?</h4>
                        <p className="text-sm text-gray-700 mb-3">
                          You already get <strong>critical alerts for free</strong> (severe weather, major safety, trip reminders). 
                          Upgrade for <strong>hourly updates</strong> on flights, airport conditions, hotel changes, and more.
                        </p>
                        <Link to={createPageUrl("NotificationSettings")}>
                          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                            <Bell className="w-4 h-4 mr-2" />
                            View Alert Plans
                          </Button>
                        </Link>
                        <p className="text-xs text-gray-600 mt-2">
                          ✓ Critical alerts free forever • Explorer from $9.99/mo for comprehensive monitoring
                        </p>
                      </div>
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

            <RiskGauges riskAssessment={trip.risk_assessment} />

            {/* Risk Details & Reasoning - Only show reasoning for initial assessment */}
            {trip.risk_details && (
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📊 Initial Risk Analysis Details
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Analysis from: {trip.risk_assessment?.last_updated ? format(new Date(trip.risk_assessment.last_updated), "MMM d, yyyy 'at' h:mm a") : 'trip creation'}
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
                      <p className="text-sm text-gray-700">{trip.risk_details.flight_delay_reasoning}</p>
                    </div>
                  )}

                  {trip.risk_details.weather_reasoning && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">🌤️ Weather Conditions</h4>
                      <p className="text-sm text-gray-700">{trip.risk_details.weather_reasoning}</p>
                    </div>
                  )}

                  {trip.risk_details.airport_intel && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">🏢 Airport Intelligence</h4>
                      <p className="text-sm text-gray-700">{trip.risk_details.airport_intel}</p>
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
                      <p className="text-sm text-gray-700">{trip.risk_details.crime_reasoning}</p>
                    </div>
                  )}

                  {trip.risk_details.political_reasoning && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">🏛️ Political Stability</h4>
                      <p className="text-sm text-gray-700">{trip.risk_details.political_reasoning}</p>
                    </div>
                  )}

                  {trip.risk_details.health_reasoning && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">🏥 Health & Medical</h4>
                      <p className="text-sm text-gray-700">{trip.risk_details.health_reasoning}</p>
                    </div>
                  )}

                  {trip.risk_details.disruption_reasoning && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">⚠️ Travel Disruptions</h4>
                      <p className="text-sm text-gray-700">{trip.risk_details.disruption_reasoning}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Travel Bookings */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="w-5 h-5" />
                  Travel Bookings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trip.airline && (
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
                )}

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

                {!trip.airline && !trip.hotel_name && !trip.car_rental_company && (
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
          </div>

          {/* Right Column - Insurance Recommendations */}
          <div>
            <InsuranceRecommendations 
              tripId={trip.id}
              recommendedCoverage={trip.recommended_coverage}
              tripCost={trip.trip_cost}
            />
          </div>
        </div>
      </div>
    </div>
  );
}