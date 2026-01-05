import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const startTime = Date.now();
  
  try {
    const base44 = createClientFromRequest(req);
    
    // Admin only - this is called by scheduled task
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Initialize metrics for today
    const today = new Date().toISOString().split('T')[0];
    let metrics = await base44.asServiceRole.entities.AlertMetrics.filter({ date: today });
    if (metrics.length === 0) {
      metrics = [await base44.asServiceRole.entities.AlertMetrics.create({ date: today })];
    }
    const dailyMetrics = metrics[0];

    // Get all active/booked trips
    const trips = await base44.asServiceRole.entities.Trip.list();
    const activeTrips = trips.filter(trip => 
      (trip.status === 'active' || trip.status === 'booked') &&
      new Date(trip.end_date) > new Date()
    );

    const alertsGenerated = [];
    const alertsSent = [];
    let suppressedCount = 0;
    let deduplicatedCount = 0;
    let expiredCount = 0;

    for (const trip of activeTrips) {
      // Get user's notification preferences
      const prefs = await base44.asServiceRole.entities.UserNotificationPreferences.filter({
        user_email: trip.created_by
      });
      
      const userPrefs = prefs[0] || { 
        subscription_tier: 'free',
        email_enabled: true, 
        alert_types: { major_risk_alerts: true } 
      };

      // Skip if user has disabled alerts
      if (!userPrefs.email_enabled && !userPrefs.in_app_enabled) continue;

      const riskScore = trip.risk_assessment?.overall_score || 0;
      const now = new Date();
      
      // ===== RATE LIMITING CHECK =====
      // Check alerts sent in last hour to prevent spam
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentAlerts = await base44.asServiceRole.entities.AlertHistory.filter({
        trip_id: trip.id,
        user_email: trip.created_by
      });
      
      const recentHourAlerts = recentAlerts.filter(a => 
        new Date(a.created_date) > oneHourAgo
      );

      // Max 3 alerts per hour per trip (critical always goes through)
      if (recentHourAlerts.length >= 3 && riskScore <= 70) {
        suppressedCount++;
        continue;
      }

      // ===== FEEDBACK LOOP - Historical Effectiveness =====
      const last7Days = recentAlerts.filter(a => 
        new Date(a.created_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
      
      // If user hasn't acknowledged any alerts in 7 days, lower priority
      const acknowledgedRecently = last7Days.some(a => a.acknowledged);
      const userEngaged = acknowledgedRecently || last7Days.length === 0;

      // ===== EXPIRATION CHECK =====
      // Don't send flight alerts after flight departure
      if (trip.start_date && new Date(trip.start_date) < now) {
        // Trip already started - different alert logic
        const tripEnded = new Date(trip.end_date) < now;
        if (tripEnded) {
          expiredCount++;
          continue;
        }
      }

      // 🔴 CRITICAL ALERTS (All tiers)
      if (riskScore > 70 && userPrefs.alert_types?.major_risk_alerts) {
        const alertHash = `${trip.id}_high_risk_${today}`;
        
        // Check deduplication
        const existingQueue = await base44.asServiceRole.entities.AlertQueue.filter({
          alert_hash: alertHash
        });
        
        if (existingQueue.length > 0 && existingQueue[0].status === 'sent') {
          deduplicatedCount++;
          continue;
        }

        const severity = 'critical';
        const escalationCount = recentHourAlerts.filter(a => a.alert_type === 'high_risk').length;
        
        // Calculate confidence based on multiple factors
        const criticalAlertsCount = trip.risk_details?.critical_alerts?.length || 0;
        const confidenceScore = Math.min(100, 70 + (criticalAlertsCount * 10));
        
        // Confidence threshold - only send if > 60% confident
        if (confidenceScore < 60) {
          suppressedCount++;
          continue;
        }

        const message = `🔴 CRITICAL: ${trip.trip_name} has high risk (${Math.round(riskScore)}/100). Immediate review recommended.`;
        
        // Calculate expiration (don't alert after trip ends)
        const expiresAt = new Date(trip.end_date);
        
        // Create alert queue entry
        const queueEntry = await base44.asServiceRole.entities.AlertQueue.create({
          trip_id: trip.id,
          user_email: trip.created_by,
          alert_hash: alertHash,
          severity,
          alert_type: 'high_risk',
          message,
          risk_score: riskScore,
          priority: 1,
          status: 'pending',
          expires_at: expiresAt.toISOString(),
          confidence_score: confidenceScore
        });

        alertsGenerated.push(queueEntry);

        // Send email
        let emailSuccess = false;
        if (userPrefs.email_enabled) {
          try {
            await base44.asServiceRole.integrations.Core.SendEmail({
              to: trip.created_by,
              subject: `🔴 CRITICAL ALERT: ${trip.trip_name}`,
              body: `
                <h2 style="color: #dc2626;">🔴 Critical Travel Risk Alert</h2>
                <p>Your trip <strong>${trip.trip_name}</strong> to ${trip.destination} has reached critical risk level.</p>
                
                <div style="background: #fee2e2; padding: 15px; border-left: 4px solid #dc2626; margin: 20px 0;">
                  <strong>Risk Level: ${Math.round(riskScore)}/100</strong><br>
                  <small>Confidence: ${Math.round(confidenceScore)}%</small>
                </div>
                
                ${trip.risk_details?.critical_alerts?.length > 0 ? `
                  <h3 style="color: #dc2626;">Immediate Concerns:</h3>
                  <ul>
                    ${trip.risk_details.critical_alerts.map(alert => `<li>${alert}</li>`).join('')}
                  </ul>
                ` : ''}
                
                <p><strong>Recommended Actions:</strong></p>
                <ul>
                  <li>Review trip details immediately</li>
                  <li>Consider alternative plans</li>
                  <li>Verify travel insurance coverage</li>
                  <li>Register with local embassy if traveling internationally</li>
                </ul>
                
                <p><a href="${Deno.env.get('APP_URL')}/TripDetail?id=${trip.id}" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0;">View Full Details</a></p>
                
                <p style="color: #666; font-size: 12px; margin-top: 20px;">
                  This is a ${escalationCount > 0 ? `follow-up alert (${escalationCount + 1}x)` : 'new alert'}. 
                  ${escalationCount > 2 ? 'Multiple escalations detected - situation may be worsening.' : ''}
                </p>
              `
            });
            emailSuccess = true;
          } catch (error) {
            console.error('Email send failed:', error);
          }
        }

        // Elite tier: SMS for critical alerts
        let smsSuccess = false;
        if (userPrefs.subscription_tier === 'elite' && userPrefs.sms_enabled && userPrefs.sms_number) {
          // SMS integration placeholder - implement with Twilio/SNS
          // smsSuccess = await sendSMS(userPrefs.sms_number, message);
        }

        // Update queue status
        await base44.asServiceRole.entities.AlertQueue.update(queueEntry.id, {
          status: emailSuccess || smsSuccess ? 'sent' : 'failed',
          sent_at: new Date().toISOString(),
          delivery_attempts: 1,
          channels_attempted: [
            ...(userPrefs.email_enabled ? ['email'] : []),
            ...(userPrefs.subscription_tier === 'elite' && userPrefs.sms_enabled ? ['sms'] : [])
          ]
        });

        // Log to history
        await base44.asServiceRole.entities.AlertHistory.create({
          trip_id: trip.id,
          user_email: trip.created_by,
          severity,
          alert_type: 'high_risk',
          message,
          risk_score: riskScore,
          escalation_count: escalationCount,
          channels_sent: emailSuccess ? ['email'] : []
        });

        // Update metrics
        await base44.asServiceRole.entities.AlertMetrics.update(dailyMetrics.id, {
          critical_alerts: (dailyMetrics.critical_alerts || 0) + 1,
          alerts_sent: (dailyMetrics.alerts_sent || 0) + (emailSuccess ? 1 : 0),
          email_delivery_success: (dailyMetrics.email_delivery_success || 0) + (emailSuccess ? 1 : 0),
          email_delivery_failed: (dailyMetrics.email_delivery_failed || 0) + (emailSuccess ? 0 : 1),
          sms_delivery_success: (dailyMetrics.sms_delivery_success || 0) + (smsSuccess ? 1 : 0),
          sms_delivery_failed: (dailyMetrics.sms_delivery_failed || 0) + (smsSuccess ? 0 : 1)
        });

        alertsSent.push({ 
          tripId: trip.id, 
          severity, 
          type: 'high_risk',
          escalation: escalationCount,
          confidence: confidenceScore
        });
      }

      // 🟡 CAUTION ALERTS (Premium & Elite only)
      if (riskScore > 50 && riskScore <= 70 && 
          (userPrefs.subscription_tier === 'premium' || userPrefs.subscription_tier === 'elite') &&
          userEngaged) {
        
        const alertHash = `${trip.id}_moderate_risk_${today}`;
        
        // Deduplication
        const existingQueue = await base44.asServiceRole.entities.AlertQueue.filter({
          alert_hash: alertHash
        });
        
        if (existingQueue.length > 0 && existingQueue[0].status === 'sent') {
          deduplicatedCount++;
          continue;
        }

        const severity = 'caution';
        const message = `🟡 Caution: ${trip.trip_name} shows elevated risk (${Math.round(riskScore)}/100). Review recommended.`;
        
        const confidenceScore = 75; // Medium confidence for caution alerts
        
        const expiresAt = new Date(trip.end_date);

        const queueEntry = await base44.asServiceRole.entities.AlertQueue.create({
          trip_id: trip.id,
          user_email: trip.created_by,
          alert_hash: alertHash,
          severity,
          alert_type: 'moderate_risk',
          message,
          risk_score: riskScore,
          priority: 2,
          status: 'pending',
          expires_at: expiresAt.toISOString(),
          confidence_score: confidenceScore
        });

        alertsGenerated.push(queueEntry);

        let emailSuccess = false;
        if (userPrefs.email_enabled) {
          try {
            await base44.asServiceRole.integrations.Core.SendEmail({
              to: trip.created_by,
              subject: `🟡 Travel Advisory: ${trip.trip_name}`,
              body: `
                <h2 style="color: #f59e0b;">🟡 Elevated Risk Advisory</h2>
                <p>Your trip <strong>${trip.trip_name}</strong> to ${trip.destination} shows elevated risk conditions.</p>
                
                <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                  <strong>Risk Level: ${Math.round(riskScore)}/100 - Moderate</strong>
                </div>
                
                <p><strong>Factors to Monitor:</strong></p>
                <ul>
                  ${trip.risk_assessment?.flight_delay_risk > 50 ? `<li>Flight delays possible (${Math.round(trip.risk_assessment.flight_delay_risk)}/100)</li>` : ''}
                  ${trip.risk_assessment?.weather_risk > 50 ? `<li>Weather concerns (${Math.round(trip.risk_assessment.weather_risk)}/100)</li>` : ''}
                  ${trip.risk_assessment?.crime_risk > 50 ? `<li>Safety awareness needed (${Math.round(trip.risk_assessment.crime_risk)}/100)</li>` : ''}
                </ul>
                
                <p><a href="${Deno.env.get('APP_URL')}/TripDetail?id=${trip.id}">View Detailed Analysis</a></p>
              `
            });
            emailSuccess = true;
          } catch (error) {
            console.error('Email send failed:', error);
          }
        }

        await base44.asServiceRole.entities.AlertQueue.update(queueEntry.id, {
          status: emailSuccess ? 'sent' : 'failed',
          sent_at: new Date().toISOString(),
          delivery_attempts: 1,
          channels_attempted: userPrefs.email_enabled ? ['email'] : []
        });

        await base44.asServiceRole.entities.AlertHistory.create({
          trip_id: trip.id,
          user_email: trip.created_by,
          severity,
          alert_type: 'moderate_risk',
          message,
          risk_score: riskScore,
          channels_sent: emailSuccess ? ['email'] : []
        });

        await base44.asServiceRole.entities.AlertMetrics.update(dailyMetrics.id, {
          caution_alerts: (dailyMetrics.caution_alerts || 0) + 1,
          alerts_sent: (dailyMetrics.alerts_sent || 0) + (emailSuccess ? 1 : 0),
          email_delivery_success: (dailyMetrics.email_delivery_success || 0) + (emailSuccess ? 1 : 0),
          email_delivery_failed: (dailyMetrics.email_delivery_failed || 0) + (emailSuccess ? 0 : 1)
        });

        alertsSent.push({ tripId: trip.id, severity, type: 'moderate_risk' });
      }
    }

    // Update final metrics
    const processingTime = (Date.now() - startTime) / 1000;
    await base44.asServiceRole.entities.AlertMetrics.update(dailyMetrics.id, {
      total_alerts_generated: (dailyMetrics.total_alerts_generated || 0) + alertsGenerated.length,
      alerts_suppressed: (dailyMetrics.alerts_suppressed || 0) + suppressedCount,
      alerts_deduplicated: (dailyMetrics.alerts_deduplicated || 0) + deduplicatedCount,
      alerts_expired: (dailyMetrics.alerts_expired || 0) + expiredCount,
      avg_response_time_seconds: processingTime
    });

    return Response.json({ 
      success: true, 
      tripsChecked: activeTrips.length,
      alertsGenerated: alertsGenerated.length,
      alertsSent: alertsSent.length,
      suppressed: suppressedCount,
      deduplicated: deduplicatedCount,
      expired: expiredCount,
      processingTimeSeconds: processingTime,
      details: alertsSent
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});