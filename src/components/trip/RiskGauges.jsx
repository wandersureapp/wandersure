import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Plane, Shield, Activity } from "lucide-react";

export default function RiskGauges({ riskAssessment }) {
  if (!riskAssessment) {
    return (
      <Card className="border-none shadow-lg">
        <CardContent className="p-12 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600">Risk assessment not available</p>
        </CardContent>
      </Card>
    );
  }

  const risks = [
    {
      label: "Flight Delay Risk",
      value: riskAssessment.flight_delay_risk,
      icon: Plane,
      color: "blue"
    },
    {
      label: "Crime Risk",
      value: riskAssessment.crime_risk,
      icon: Shield,
      color: "red"
    },
    {
      label: "Disruption Risk",
      value: riskAssessment.disruption_risk,
      icon: AlertTriangle,
      color: "orange"
    },
    {
      label: "Health Risk",
      value: riskAssessment.health_risk,
      icon: Activity,
      color: "purple"
    }
  ];

  const getProgressColor = (value) => {
    if (value < 30) return "bg-green-500";
    if (value < 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTextColor = (color) => {
    const colors = {
      blue: "text-blue-600",
      red: "text-red-600",
      orange: "text-orange-600",
      purple: "text-purple-600"
    };
    return colors[color] || "text-gray-600";
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Risk Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Risk Score */}
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 mb-2">Overall Risk Score</p>
            <div className="text-5xl font-bold text-gray-900 mb-1">
              {riskAssessment.overall_score}
              <span className="text-2xl text-gray-500">/100</span>
            </div>
          </div>
          <Progress 
            value={riskAssessment.overall_score} 
            className="h-3"
          />
        </div>

        {/* Individual Risk Metrics */}
        <div className="grid gap-4">
          {risks.map((risk) => (
            <div key={risk.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <risk.icon className={`w-4 h-4 ${getTextColor(risk.color)}`} />
                  <span className="text-sm font-medium text-gray-700">{risk.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{risk.value}/100</span>
              </div>
              <div className="relative">
                <Progress value={risk.value} className="h-2" />
                <div 
                  className={`absolute top-0 left-0 h-2 rounded-full ${getProgressColor(risk.value)} transition-all`}
                  style={{ width: `${risk.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}