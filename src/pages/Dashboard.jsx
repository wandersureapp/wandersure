import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield,
  Plus,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Bell,
  RefreshCw
} from "lucide-react";
import { format, differenceInDays, isFuture } from "date-fns";
import { motion } from "framer-motion";

import ActiveTripsGrid from "../components/dashboard/ActiveTripsGrid";
import RiskAlerts from "../components/dashboard/RiskAlerts";
import QuickStats from "../components/dashboard/QuickStats";
import AuthGuard from "../components/AuthGuard";
import AlertList from "../components/alerts/AlertList";
import PullToRefreshIndicator from "../components/ui/PullToRefreshIndicator";
import { usePullToRefresh } from "../components/hooks/usePullToRefresh";

export default function Dashboard() {
  const { data: trips = [], isLoading: tripsLoading, refetch: refetchTrips } = useQuery({
    queryKey: ['trips'],
    queryFn: () => base44.entities.Trip.list('-created_date'),
  });

  const [user, setUser] = React.useState(null);

  const { isRefreshing, pullDistance } = usePullToRefresh(refetchTrips);

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const { data: notificationPrefs = [] } = useQuery({
    queryKey: ['notification-preferences'],
    queryFn: () => base44.entities.UserNotificationPreferences.list(),
    enabled: !!user?.email
  });

  const userPrefs = Array.isArray(notificationPrefs) ? notificationPrefs.find(p => p.user_email === user?.email) : null;
  const hasActiveSubscription = userPrefs && (userPrefs.subscription_tier === 'premium' || userPrefs.subscription_tier === 'elite');
  const subscriptionTier = userPrefs?.subscription_tier || 'free';

  const activeTrips = trips.filter(trip => 
    trip.status === 'active' || trip.status === 'booked'
  );

  const upcomingTrips = trips.filter(trip => 
    isFuture(new Date(trip.start_date))
  ).slice(0, 3);

  const highRiskTrips = trips.filter(trip => 
    (trip.status === 'active' || trip.status === 'booked') && 
    isFuture(new Date(trip.end_date)) &&
    trip.risk_assessment?.overall_score > 75
  );

  return (
    <AuthGuard>
      <PullToRefreshIndicator pullDistance={pullDistance} isRefreshing={isRefreshing} />
    <div className="min-h-screen relative">
      {/* AI Intelligence Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80"
            alt="Travel Dashboard"
            className="w-full h-full object-cover opacity-20"
            loading="eager"
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-cyan-900/80 to-teal-900/80"></div>
        </div>

        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Logo */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center"
            >
              <div className="relative">
                {/* Blue glow effect */}
                <div className="absolute inset-0 bg-blue-400/30 blur-[100px] rounded-full"></div>
                {/* Circular logo with border */}
                <div className="relative">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f24e9d50db61a8178058b4/1c7001d0e_Untitleddesign.png" 
                    alt="WanderSure"
                    className="w-[350px] h-[350px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] object-cover rounded-full shadow-2xl"
                    loading="eager"
                    fetchpriority="high"
                  />
                </div>
              </div>
            </motion.div>

            {/* Right Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-white text-sm font-medium">AI-Powered Travel Intelligence</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Your AI Travel
                <br />
                <span className="text-cyan-200">Intelligence Platform</span>
              </h1>

              <p className="text-xl text-blue-50 mb-8 leading-relaxed">
                Real-time flight tracking, TSA wait times, weather alerts, and AI-powered risk monitoring. 
                Travel smarter with instant updates that matter.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to={createPageUrl("NewTrip")}>
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-2xl text-lg px-8 py-6 group">
                    <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    {hasActiveSubscription ? 'Continue Planning' : 'Start Monitoring'}
                  </Button>
                </Link>
                <Link to={createPageUrl("CustomizeInsurance")}>
                  <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-2xl text-lg px-8 py-6 group">
                    <Shield className="w-5 h-5 mr-2" />
                    Smart Insurance Builder
                  </Button>
                </Link>
                <Link to={createPageUrl("NotificationSettings")}>
                  <Button size="lg" variant="outline" className="border-2 border-white bg-transparent text-white hover:bg-white/20 hover:text-white text-lg px-8 py-6 backdrop-blur-sm">
                    {hasActiveSubscription ? (
                      <>
                        <Bell className="w-5 h-5 mr-2" />
                        {subscriptionTier === 'elite' ? 'Globetrotter Active' : 'Explorer Active'}
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 mr-2" />
                        Enable Smart Alerts
                      </>
                    )}
                  </Button>
                </Link>
              </div>


            </motion.div>
          </div>
        </div>


      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Quick Stats - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <QuickStats 
            activeTripsCount={activeTrips.length}
            subscriptionActive={hasActiveSubscription}
            highRiskCount={highRiskTrips.length}
            upcomingCount={upcomingTrips.length}
            isLoading={tripsLoading}
          />
        </motion.div>

        {/* Main Content */}
        <div className="space-y-6 mt-8">
          {/* Active Trips - Full Width */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ActiveTripsGrid trips={activeTrips} isLoading={tripsLoading} />
          </motion.div>

          {/* Enhanced Travel Aides Card - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-none shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300">
              <div className="relative h-80 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600"
                  alt="Travel Planning Tools"
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 via-blue-600/80 to-cyan-600/80"></div>
                
                {/* Animated elements */}
                <div className="absolute top-8 right-8 animate-pulse">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                </div>
                <div className="absolute bottom-8 left-8 animate-pulse" style={{ animationDelay: '0.5s' }}>
                  <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                </div>
                <div className="absolute top-20 left-20 animate-pulse" style={{ animationDelay: '1s' }}>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-24 h-24 mb-6 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border-2 border-white/30 shadow-2xl"
                  >
                    <Sparkles className="w-12 h-12 text-white" />
                  </motion.div>
                  
                  <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                    Travel Aides
                  </h3>
                  
                  <p className="text-white/95 text-lg mb-8 max-w-2xl leading-relaxed drop-shadow-md">
                    Unlock powerful checklists, destination guides, safety playbooks, budget planners & more to make your journey seamless
                  </p>
                  
                  <Link to={createPageUrl("TravelAides")}>
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-2xl font-bold text-lg px-12 py-7 group">
                      Explore All Tools
                      <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                    </Button>
                  </Link>
                  
                  <div className="mt-6 flex items-center gap-2 text-white/90 text-base">
                    <Shield className="w-5 h-5" />
                    <span>Premium features available</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}