import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { alertId, reason } = await req.json();

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

    // Mark as false positive (could add a field to AlertHistory schema)
    // For now, we'll track it in metrics
    
    // Update metrics
    const today = new Date().toISOString().split('T')[0];
    const metrics = await base44.asServiceRole.entities.AlertMetrics.filter({ date: today });
    
    if (metrics.length > 0) {
      await base44.asServiceRole.entities.AlertMetrics.update(metrics[0].id, {
        false_positive_reports: (metrics[0].false_positive_reports || 0) + 1
      });
    }

    return Response.json({ success: true, message: 'Thank you for your feedback. We\'ll use this to improve our alerts.' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});