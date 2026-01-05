import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import { format, subDays } from "date-fns";

export default function AlertMetricsAdmin() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: metrics = [] } = useQuery({
    queryKey: ['alert-metrics'],
    queryFn: () => base44.entities.AlertMetrics.list('-created_date', 30),
    enabled: !!user && user.role === 'admin'
  });

  const { data: queueItems = [] } = useQuery({
    queryKey: ['alert-queue'],
    queryFn: () => base44.entities.AlertQueue.list('-created_date', 100),
    enabled: !!user && user.role === 'admin'
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Admin access required</p>
      </div>
    );
  }

  const today = metrics[0] || {};
  const last7Days = metrics.slice(0, 7);
  
  const totalAlerts7d = last7Days.reduce((sum, m) => sum + (m.total_alerts_generated || 0), 0);
  const totalSent7d = last7Days.reduce((sum, m) => sum + (m.alerts_sent || 0), 0);
  const deliveryRate = totalSent7d > 0 ? ((totalSent7d / totalAlerts7d) * 100).toFixed(1) : 0;
  
  const totalAcknowledged7d = last7Days.reduce((sum, m) => sum + (m.user_acknowledgments || 0), 0);
  const engagementRate = totalSent7d > 0 ? ((totalAcknowledged7d / totalSent7d) * 100).toFixed(1) : 0;

  const falsePositives7d = last7Days.reduce((sum, m) => sum + (m.false_positive_reports || 0), 0);
  const falsePositiveRate = totalSent7d > 0 ? ((falsePositives7d / totalSent7d) * 100).toFixed(1) : 0;

  const pendingAlerts = queueItems.filter(q => q.status === 'pending').length;
  const failedAlerts = queueItems.filter(q => q.status === 'failed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Alert System Metrics</h1>
          <p className="text-gray-600">Real-time observability and performance tracking</p>
        </div>

        {/* Today's Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-8 h-8 text-blue-600" />
                <Badge>{today.total_alerts_generated || 0}</Badge>
              </div>
              <p className="text-sm text-gray-600">Alerts Generated Today</p>
              <p className="text-xs text-gray-500 mt-1">
                {today.alerts_sent || 0} sent, {today.alerts_suppressed || 0} suppressed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <Badge variant="destructive">{today.critical_alerts || 0}</Badge>
              </div>
              <p className="text-sm text-gray-600">Critical Alerts</p>
              <p className="text-xs text-gray-500 mt-1">
                🟡 {today.caution_alerts || 0} caution
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <Badge className="bg-green-100 text-green-800">{deliveryRate}%</Badge>
              </div>
              <p className="text-sm text-gray-600">Delivery Rate (7d)</p>
              <p className="text-xs text-gray-500 mt-1">
                {totalSent7d} of {totalAlerts7d} delivered
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-purple-600" />
                <Badge className="bg-purple-100 text-purple-800">{engagementRate}%</Badge>
              </div>
              <p className="text-sm text-gray-600">Engagement Rate (7d)</p>
              <p className="text-xs text-gray-500 mt-1">
                {totalAcknowledged7d} acknowledged
              </p>
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Pending Alerts</span>
                  <Badge variant={pendingAlerts > 5 ? "destructive" : "outline"}>
                    {pendingAlerts}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Failed Deliveries</span>
                  <Badge variant={failedAlerts > 0 ? "destructive" : "outline"}>
                    {failedAlerts}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Avg Response Time</span>
                  <Badge variant="outline">
                    {today.avg_response_time_seconds?.toFixed(2) || 0}s
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Deduplicated (Today)</span>
                  <Badge variant="outline">{today.alerts_deduplicated || 0}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Quality Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">False Positive Rate (7d)</span>
                  <Badge variant={parseFloat(falsePositiveRate) > 10 ? "destructive" : "outline"}>
                    {falsePositiveRate}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Email Success (Today)</span>
                  <Badge variant="outline">
                    {today.email_delivery_success || 0} / {(today.email_delivery_success || 0) + (today.email_delivery_failed || 0)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">SMS Success (Today)</span>
                  <Badge variant="outline">
                    {today.sms_delivery_success || 0} / {(today.sms_delivery_success || 0) + (today.sms_delivery_failed || 0)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Suppressed (Today)</span>
                  <Badge variant="outline">{today.alerts_suppressed || 0}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 7-Day History */}
        <Card>
          <CardHeader>
            <CardTitle>7-Day Alert History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {last7Days.map((day, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">
                    {format(new Date(day.date), 'MMM d, yyyy')}
                  </span>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">
                      {day.total_alerts_generated || 0} generated
                    </Badge>
                    <Badge className="bg-green-100 text-green-800">
                      {day.alerts_sent || 0} sent
                    </Badge>
                    <Badge variant="outline">
                      {day.user_acknowledgments || 0} ack
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}