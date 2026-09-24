import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { alertId } = await req.json();

    if (!alertId) {
      return Response.json({ error: 'Alert ID required' }, { status: 400 });
    }

    // Get alert
    const alerts = await base44.entities.AlertHistory.filter({ id: alertId });
    
    if (alerts.length === 0) {
      return Response.json({ error: 'Alert not found' }, { status: 404 });
    }

    const alert = alerts[0];

    // Verify user owns this alert
    if (alert.user_email !== user.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update acknowledgment
    await base44.entities.AlertHistory.update(alertId, {
      acknowledged: true
    });

    // Update queue if exists
    const queue = await base44.entities.AlertQueue.filter({
      trip_id: alert.trip_id,
      alert_type: alert.alert_type,
      user_email: user.email
    });

    if (queue.length > 0) {
      await base44.entities.AlertQueue.update(queue[0].id, {
        acknowledged_at: new Date().toISOString()
      });
    }

    // Update metrics
    const today = new Date().toISOString().split('T')[0];
    const metrics = await base44.asServiceRole.entities.AlertMetrics.filter({ date: today });
    
    if (metrics.length > 0) {
      await base44.asServiceRole.entities.AlertMetrics.update(metrics[0].id, {
        user_acknowledgments: (metrics[0].user_acknowledgments || 0) + 1
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});