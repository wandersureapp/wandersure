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
  ArrowRight
} from "lucide-react";
import { format, differenceInDays, isFuture } from "date-fns";
import { motion } from "framer-motion";

import ActiveTripsGrid from "../components/dashboard/ActiveTripsGrid";
import RiskAlerts from "../components/dashboard/RiskAlerts";
import QuickStats from "../components/dashboard/QuickStats";
import AuthGuard from "../components/AuthGuard";

export default function Dashboard() {
  const { data: trips = [], isLoading: tripsLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: () => base44.entities.Trip.list('-created_date'),
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => base44.entities.Recommendation.list('-created_date'),
  });

  const activeTrips = trips.filter(trip => 
    trip.status === 'active' || trip.status === 'booked'
  );

  const upcomingTrips = trips.filter(trip => 
    isFuture(new Date(trip.start_date))
  ).slice(0, 3);

  const highRiskTrips = trips.filter(trip => 
    (trip.status === 'active' || trip.status === 'booked') && 
    isFuture(new Date(trip.end_date)) &&
    trip.risk_assessment?.overall_score > 60
  );

  return (
    <AuthGuard>
    <div className="min-h-screen">
      {/* AI Intelligence Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80"
            alt="Travel Dashboard"
            className="w-full h-full object-cover opacity-20"
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
                    Start Monitoring
                  </Button>
                </Link>
                <Link to={createPageUrl("NotificationSettings")}>
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 backdrop-blur-sm">
                    <Shield className="w-5 h-5 mr-2" />
                    Enable Smart Alerts
                  </Button>
                </Link>
              </div>

              {/* Real-time stats */}
              <div className="mt-12 grid grid-cols-3 gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  <p className="text-4xl font-bold text-gray-900 mb-1">{activeTrips.length}</p>
                  <p className="text-gray-700 text-sm font-medium">Live Monitoring</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <p className="text-4xl font-bold text-gray-900 mb-1">{highRiskTrips.length}</p>
                  <p className="text-gray-700 text-sm font-medium">Active Alerts</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-center"
                >
                  <p className="text-4xl font-bold text-gray-900 mb-1">{upcomingTrips.length}</p>
                  <p className="text-gray-700 text-sm font-medium">Upcoming</p>
                </motion.div>
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
            policiesCount={recommendations.length}
            highRiskCount={highRiskTrips.length}
            upcomingCount={upcomingTrips.length}
          />
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* Active Trips - Takes 2 columns */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ActiveTripsGrid trips={activeTrips} isLoading={tripsLoading} />
          </motion.div>

          {/* Sidebar - Risk Alerts */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <RiskAlerts trips={highRiskTrips} />

            {/* Upcoming Trips */}
            <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-24 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800"
                  alt="Upcoming Trips"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/70 to-cyan-600/70"></div>
                <div className="absolute inset-0 flex items-center px-6">
                  <Calendar className="w-6 h-6 text-white mr-3" />
                  <h3 className="text-xl font-bold text-white">Upcoming Trips</h3>
                </div>
              </div>
              <CardContent className="p-4">
                {upcomingTrips.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingTrips.map(trip => (
                      <Link
                        key={trip.id}
                        to={createPageUrl(`TripDetail?id=${trip.id}`)}
                        className="block p-3 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{trip.trip_name}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {trip.destination}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {differenceInDays(new Date(trip.start_date), new Date())} days
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {format(new Date(trip.start_date), "MMM d")} - {format(new Date(trip.end_date), "MMM d, yyyy")}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No upcoming trips</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Travel Aides Card */}
            <Card className="border-none shadow-lg overflow-hidden">
              <div className="relative h-32 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800"
                  alt="Travel Aides"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/60 to-cyan-600/60"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-white/30" />
                </div>
              </div>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg -mt-14 border-4 border-white">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Travel Aides</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Checklists, playbooks, and planning guides for stress-free travel
                </p>
                <Link to={createPageUrl("TravelAides")}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg group">
                    Explore Aides
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}