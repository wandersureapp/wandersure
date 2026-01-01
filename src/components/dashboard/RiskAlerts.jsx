import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

export default function RiskAlerts({ trips }) {
  const getAlerts = () => {
    const alerts = [];
    
    trips.forEach(trip => {
      const risk = trip.risk_assessment;
      if (!risk) return;

      if (risk.flight_delay_risk > 70) {
        alerts.push({
          trip: trip.trip_name,
          type: "warning",
          message: "High flight delay probability",
          icon: AlertTriangle
        });
      }
      
      if (risk.crime_risk > 60) {
        alerts.push({
          trip: trip.trip_name,
          type: "danger",
          message: "Elevated crime risk in destination",
          icon: AlertCircle
        });
      }

      if (risk.disruption_risk > 65) {
        alerts.push({
          trip: trip.trip_name,
          type: "warning",
          message: "Potential travel disruptions",
          icon: Info
        });
      }
    });

    return alerts;
  };

  const alerts = getAlerts();

  const getAlertStyle = (type) => {
    if (type === "danger") return { bg: "bg-red-50", border: "border-red-200", text: "text-red-800" };
    if (type === "warning") return { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-800" };
    return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800" };
  };

  return (
    <Card className="border-none shadow-lg overflow-hidden">
      <div className="relative h-24 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800"
          alt="Risk Monitoring"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 to-red-600/90"></div>
        <div className="absolute inset-0 flex items-center px-6">
          <AlertTriangle className="w-6 h-6 text-white mr-3" />
          <h3 className="text-xl font-bold text-white">Risk Alerts</h3>
        </div>
      </div>
      <CardContent className="p-4">
        {alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map((alert, index) => {
              const style = getAlertStyle(alert.type);
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${style.border} ${style.bg}`}
                >
                  <div className="flex items-start gap-3">
                    <alert.icon className={`w-5 h-5 mt-0.5 ${style.text}`} />
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${style.text}`}>
                        {alert.message}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{alert.trip}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-green-500 opacity-30" />
            <p className="text-sm text-gray-500">All clear! No high-risk alerts.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}