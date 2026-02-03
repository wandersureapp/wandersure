import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaneTakeoff, Shield, AlertTriangle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function QuickStats({ activeTripsCount, subscriptionActive, highRiskCount, upcomingCount, isLoading }) {
  const stats = [
    {
      label: "Active Trips",
      value: activeTripsCount,
      icon: PlaneTakeoff,
      gradient: "from-blue-500 to-blue-600",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400",
      link: createPageUrl("MyTrips")
    },
    {
      label: "Active Subscription",
      value: subscriptionActive ? 1 : 0,
      icon: Shield,
      gradient: "from-green-500 to-emerald-600",
      image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400",
      link: createPageUrl("NotificationSettings")
    },
    {
      label: "High Risk Alerts",
      value: highRiskCount,
      icon: AlertTriangle,
      gradient: "from-orange-500 to-red-600",
      image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400",
      link: createPageUrl("Alerts")
    },
    {
      label: "Upcoming",
      value: upcomingCount,
      icon: TrendingUp,
      gradient: "from-blue-500 to-cyan-600",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400",
      link: createPageUrl("MyTrips")
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="border-none shadow-lg overflow-hidden">
            <Skeleton className="h-28 w-full" />
            <CardContent className="p-6 text-center space-y-2">
              <Skeleton className="h-4 w-24 mx-auto" />
              <Skeleton className="h-10 w-16 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <Link to={stat.link}>
            <Card className="border-none shadow-lg hover:shadow-2xl transition-all overflow-hidden cursor-pointer">
              <div className="relative h-28 overflow-hidden">
                <img 
                  src={stat.image}
                  alt={stat.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <stat.icon className="w-10 h-10 text-white opacity-20" />
                </div>
              </div>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-gray-600 font-medium mb-1">{stat.label}</p>
                <p className="text-4xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}