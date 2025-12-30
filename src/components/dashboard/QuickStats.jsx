import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PlaneTakeoff, Shield, AlertTriangle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function QuickStats({ activeTripsCount, policiesCount, highRiskCount, upcomingCount }) {
  const stats = [
    {
      label: "Active Trips",
      value: activeTripsCount,
      icon: PlaneTakeoff,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-500"
    },
    {
      label: "Active Policies",
      value: policiesCount,
      icon: Shield,
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-100",
      iconBg: "bg-green-500"
    },
    {
      label: "High Risk Alerts",
      value: highRiskCount,
      icon: AlertTriangle,
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-50 to-red-100",
      iconBg: "bg-orange-500"
    },
    {
      label: "Upcoming",
      value: upcomingCount,
      icon: TrendingUp,
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-50 to-pink-100",
      iconBg: "bg-purple-500"
    }
  ];

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
          <Card className={`border-none shadow-lg hover:shadow-2xl transition-all overflow-hidden relative bg-gradient-to-br ${stat.bgGradient}`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/30 rounded-full -mr-12 -mt-12"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.iconBg} shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-700 font-medium mb-1">{stat.label}</p>
              <p className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}