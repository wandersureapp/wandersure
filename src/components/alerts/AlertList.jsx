import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, AlertTriangle, Info, Flag, Clock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { acknowledgeAlert } from "@/functions/acknowledgeAlert";
import { reportFalsePositive } from "@/functions/reportFalsePositive";

export default function AlertList({ tripId, limit = 10 }) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("current");

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['alerts', tripId],
    queryFn: async () => {
      const allAlerts = await base44.entities.AlertHistory.filter(
        tripId ? { trip_id: tripId } : {}
      );
      return allAlerts.sort((a, b) => 
        new Date(b.created_date) - new Date(a.created_date)
      );
    }
  });

  const acknowledgeMutation = useMutation({
    mutationFn: (alertId) => acknowledgeAlert({ alertId }),
    onMutate: async (alertId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['alerts', tripId] });
      
      // Snapshot previous value
      const previousAlerts = queryClient.getQueryData(['alerts', tripId]);
      
      // Optimistically update
      queryClient.setQueryData(['alerts', tripId], (old) => 
        old.map(alert => 
          alert.id === alertId 
            ? { ...alert, acknowledged: true, acknowledged_at: new Date().toISOString() }
            : alert
        )
      );
      
      return { previousAlerts };
    },
    onError: (err, alertId, context) => {
      // Rollback on error
      queryClient.setQueryData(['alerts', tripId], context.previousAlerts);
      toast.error('Failed to acknowledge alert');
    },
    onSuccess: () => {
      toast.success('Alert acknowledged');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts', tripId] });
    }
  });

  const reportMutation = useMutation({
    mutationFn: ({ alertId, reason }) => reportFalsePositive({ alertId, reason }),
    onSuccess: () => {
      toast.success('Thank you for your feedback');
    }
  });

  const currentAlerts = alerts.filter(alert => !alert.acknowledged).slice(0, limit);
  const historicalAlerts = alerts.filter(alert => alert.acknowledged);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
        ))}
      </div>
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

  const renderAlert = (alert) => (
    <Card 
      key={alert.id}
      className={`border-l-4 ${
        alert.severity === 'critical' ? 'border-l-red-600 bg-red-50' :
        alert.severity === 'caution' ? 'border-l-yellow-600 bg-yellow-50' :
        'border-l-blue-600 bg-blue-50'
      } ${alert.acknowledged ? 'opacity-80' : ''}`}
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
  );

  if (alerts.length === 0) {
    return (
      <Card className="border-none bg-green-50">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <p className="text-gray-600">No alerts for this trip</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="current" className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Current Alerts
          {currentAlerts.length > 0 && (
            <Badge className="ml-2 bg-red-600 text-white text-xs">{currentAlerts.length}</Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Alert History
          {historicalAlerts.length > 0 && (
            <Badge variant="outline" className="ml-2 text-xs">{historicalAlerts.length}</Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="current">
        {currentAlerts.length === 0 ? (
          <Card className="border-none bg-green-50">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <p className="text-gray-600">No current alerts - all clear! ✈️</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {currentAlerts.map(renderAlert)}
          </div>
        )}
      </TabsContent>

      <TabsContent value="history">
        {historicalAlerts.length === 0 ? (
          <Card className="border-none bg-gray-50">
            <CardContent className="p-6 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No alert history yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {historicalAlerts.map(renderAlert)}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}