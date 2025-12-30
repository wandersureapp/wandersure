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
    trip.risk_assessment?.overall_score > 60
  );

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-teal-500">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200')] bg-cover bg-center opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-white text-sm font-medium">Smart Travel Protection</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Welcome Back!
                <br />
                <span className="text-blue-100">Your Journey Awaits</span>
              </h1>
              
              <p className="text-xl text-blue-50 mb-8 leading-relaxed">
                Monitor your trips in real-time, assess risks with AI-powered insights, 
                and stay protected wherever you wander.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to={createPageUrl("NewTrip")}>
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-2xl text-lg px-8 py-6 group">
                    <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    Add New Trip
                  </Button>
                </Link>
                <Link to={createPageUrl("BrowsePlans")}>
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 backdrop-blur-sm">
                    <Shield className="w-5 h-5 mr-2" />
                    Compare Insurance Plans
                  </Button>
                </Link>
              </div>

              {/* Quick Stats Preview */}
              <div className="mt-12 grid grid-cols-3 gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <p className="text-4xl font-bold text-white mb-1">{activeTrips.length}</p>
                  <p className="text-blue-100 text-sm">Active Trips</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <p className="text-4xl font-bold text-white mb-1">{recommendations.length}</p>
                  <p className="text-blue-100 text-sm">Recommendations</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  <p className="text-4xl font-bold text-white mb-1">{upcomingTrips.length}</p>
                  <p className="text-blue-100 text-sm">Upcoming</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column - Logo Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative">
                {/* Glowing effect */}
                <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full"></div>
                
                {/* Logo container */}
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-12 border-2 border-white/20 shadow-2xl">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f24e9d50db61a8178058b4/b6c0bc4b2_ChatGPTImageOct17202512_05_29PM.png" 
                    alt="WanderSure"
                    className="w-80 h-80 object-contain drop-shadow-2xl animate-float"
                  />
                </div>

                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-8 -right-8 bg-green-500 text-white px-4 py-2 rounded-full shadow-xl font-semibold"
                >
                  ✓ AI-Powered
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute -bottom-8 -left-8 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full shadow-xl font-semibold"
                >
                  24/7 Protection
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(249, 250, 251)"/>
          </svg>
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
              <CardHeader className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Trips
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {upcomingTrips.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingTrips.map(trip => (
                      <Link
                        key={trip.id}
                        to={createPageUrl(`TripDetail?id=${trip.id}`)}
                        className="block p-3 rounded-lg border hover:border-purple-300 hover:bg-purple-50 transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">{trip.trip_name}</p>
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

            {/* Quick Action - Enhanced */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-teal-50 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <CardContent className="p-6 text-center relative">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Need Coverage?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get AI-powered recommendations and compare top providers
                </p>
                <Link to={createPageUrl("BrowsePlans")}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-lg group">
                    Compare Plans
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}