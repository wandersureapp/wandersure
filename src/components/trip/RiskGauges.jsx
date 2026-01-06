import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Plane, Cloud, Shield, Building2, Heart, AlertCircle } from "lucide-react";

export default function RiskGauges({ riskAssessment }) {
  if (!riskAssessment) {
    return (
      <Card className="border-none shadow-lg bg-yellow-50">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
          <p className="text-gray-600">No risk assessment available yet</p>
        </CardContent>
      </Card>
    );
  }

  const overallScore = riskAssessment.overall_score || 0;
  
  const getScoreColor = (score) => {
    if (score <= 25) return "text-green-600";
    if (score <= 50) return "text-yellow-600";
    if (score <= 75) return "text-orange-600";
    return "text-red-600";
  };

  const getProgressColor = (score) => {
    if (score <= 25) return "bg-green-500";
    if (score <= 50) return "bg-yellow-500";
    if (score <= 75) return "bg-orange-500";
    return "bg-red-500";
  };

  const riskMetrics = [
    { 
      key: 'flight_delay_risk', 
      label: 'Flight Risk', 
      icon: Plane, 
      iconColor: 'text-blue-600' 
    },
    { 
      key: 'weather_risk', 
      label: 'Weather', 
      icon: Cloud, 
      iconColor: 'text-sky-600' 
    },
    { 
      key: 'crime_risk', 
      label: 'Safety', 
      icon: Shield, 
      iconColor: 'text-purple-600' 
    },
    { 
      key: 'political_risk', 
      label: 'Political', 
      icon: Building2, 
      iconColor: 'text-indigo-600' 
    },
    { 
      key: 'health_risk', 
      label: 'Health', 
      icon: Heart, 
      iconColor: 'text-pink-600' 
    },
    { 
      key: 'disruption_risk', 
      label: 'Disruptions', 
      icon: AlertCircle, 
      iconColor: 'text-orange-600' 
    }
  ];

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎯 Risk Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Overall Risk Score</p>
          <div className={`text-5xl font-bold ${getScoreColor(overallScore)} mb-3`}>
            {Math.round(overallScore)}
            <span className="text-2xl text-gray-500">/100</span>
          </div>
          <Progress 
            value={overallScore} 
            className="h-3"
            indicatorClassName={getProgressColor(overallScore)}
          />
        </div>

        {/* Individual Risk Metrics - All 6 Categories */}
        <div className="space-y-4">
          {riskMetrics.map(({ key, label, icon: Icon, iconColor }) => {
            const score = riskAssessment[key] || 0;
            if (score === 0) return null;
            
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <span className={`text-sm font-semibold ${getScoreColor(score)}`}>
                    {Math.round(score)}
                  </span>
                </div>
                <Progress 
                  value={score} 
                  className="h-2"
                  indicatorClassName={getProgressColor(score)}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}