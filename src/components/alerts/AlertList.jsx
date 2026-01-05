import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Info, Flag } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { acknowledgeAlert } from "@/functions/acknowledgeAlert";
import { reportFalsePositive } from "@/functions/reportFalsePositive";

export default function AlertList({ tripId, limit = 10 }) {
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['alerts', tripId],
    queryFn: async () => {
      const allAlerts = await base44.entities.AlertHistory.filter(
        tripId ? { trip_id: tripId } : {}
      );
      return allAlerts.sort((a, b) => 
        new Date(b.created_date) - new Date(a.created_date)
      ).slice(0, limit);
    }
  });

  const acknowledgeMutation = useMutation({
    mutationFn: (alertId) => acknowledgeAlert({ alertId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast.success('Alert acknowledged');
    }
  });

  const reportMutation = useMutation({
    mutationFn: ({ alertId, reason }) => reportFalsePositive({ alertId, reason }),
    onSuccess: () => {
      toast.success('Thank you for your feedback');
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card className="border-none bg-green-50">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <p className="text-gray-600">No recent alerts</p>
        </CardContent>
      </Card>
    );
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'caution': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical': return <Badge className="bg-red-600 text-white">Critical</Badge>;
      case 'caution': return <Badge className="bg-yellow-600 text-white">Caution</Badge>;
      default: return <Badge variant="outline">Info</Badge>;
    }
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Card 
          key={alert.id}
          className={`border-l-4 ${
            alert.severity === 'critical' ? 'border-l-red-600 bg-red-50' :
            alert.severity === 'caution' ? 'border-l-yellow-600 bg-yellow-50' :
            'border-l-blue-600 bg-blue-50'
          } ${alert.acknowledged ? 'opacity-60' : ''}`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {getSeverityIcon(alert.severity)}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    {getSeverityBadge(alert.severity)}
                    <p className="text-sm text-gray-600 mt-1">
                      {format(new Date(alert.created_date), 'MMM d, h:mm a')}
                    </p>
                  </div>
                  {alert.acknowledged && (
                    <Badge variant="outline" className="bg-white">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Acknowledged
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-gray-800 mb-3">{alert.message}</p>
                
                {alert.risk_score && (
                  <p className="text-xs text-gray-600 mb-3">
                    Risk Score: {Math.round(alert.risk_score)}/100
                  </p>
                )}

                {!alert.acknowledged && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => acknowledgeMutation.mutate(alert.id)}
                      disabled={acknowledgeMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Got it
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => reportMutation.mutate({ alertId: alert.id })}
                      disabled={reportMutation.isPending}
                    >
                      <Flag className="w-3 h-3 mr-1" />
                      Not Accurate
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}