import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Admin only - this is called by scheduled task
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Get all active/booked trips
    const trips = await base44.asServiceRole.entities.Trip.list();
    const activeTrips = trips.filter(trip => 
      (trip.status === 'active' || trip.status === 'booked') &&
      new Date(trip.end_date) > new Date()
    );

    const alertsSent = [];

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
      
      // Check for previous alerts to determine escalation
      const recentAlerts = await base44.asServiceRole.entities.AlertHistory.filter({
        trip_id: trip.id,
        user_email: trip.created_by
      });
      
      const last24Hours = recentAlerts.filter(alert => 
        new Date(alert.created_date) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      );

      // 🔴 CRITICAL ALERTS (All tiers get these)
      if (riskScore > 70 && userPrefs.alert_types?.major_risk_alerts) {
        const severity = 'critical';
        const escalationCount = last24Hours.filter(a => a.alert_type === 'high_risk').length;
        
        const message = `🔴 CRITICAL: ${trip.trip_name} has high risk (${Math.round(riskScore)}/100). Immediate review recommended.`;
        
        // Send email
        if (userPrefs.email_enabled) {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: trip.created_by,
            subject: `🔴 CRITICAL ALERT: ${trip.trip_name}`,
            body: `
              <h2 style="color: #dc2626;">🔴 Critical Travel Risk Alert</h2>
              <p>Your trip <strong>${trip.trip_name}</strong> to ${trip.destination} has reached critical risk level.</p>
              
              <div style="background: #fee2e2; padding: 15px; border-left: 4px solid #dc2626; margin: 20px 0;">
                <strong>Risk Level: ${Math.round(riskScore)}/100</strong>
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
        }

        // Elite tier: SMS for critical alerts
        if (userPrefs.subscription_tier === 'elite' && userPrefs.sms_enabled && userPrefs.sms_number) {
          // Note: SMS integration would go here (Twilio, etc.)
          // Placeholder for future implementation
        }

        // Log alert
        await base44.asServiceRole.entities.AlertHistory.create({
          trip_id: trip.id,
          user_email: trip.created_by,
          severity,
          alert_type: 'high_risk',
          message,
          risk_score: riskScore,
          escalation_count: escalationCount,
          channels_sent: userPrefs.email_enabled ? ['email'] : []
        });

        alertsSent.push({ 
          tripId: trip.id, 
          severity, 
          type: 'high_risk',
          escalation: escalationCount 
        });
      }

      // 🟡 CAUTION ALERTS (Premium & Elite only)
      if (riskScore > 50 && riskScore <= 70 && 
          (userPrefs.subscription_tier === 'premium' || userPrefs.subscription_tier === 'elite')) {
        
        const severity = 'caution';
        const message = `🟡 Caution: ${trip.trip_name} shows elevated risk (${Math.round(riskScore)}/100). Review recommended.`;

        if (userPrefs.email_enabled) {
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
        }

        await base44.asServiceRole.entities.AlertHistory.create({
          trip_id: trip.id,
          user_email: trip.created_by,
          severity,
          alert_type: 'moderate_risk',
          message,
          risk_score: riskScore,
          channels_sent: userPrefs.email_enabled ? ['email'] : []
        });

        alertsSent.push({ tripId: trip.id, severity, type: 'moderate_risk' });
      }

      // Premium/Elite: Flight delay alerts
      if (trip.risk_assessment?.flight_delay_risk > 60 && 
          (userPrefs.subscription_tier === 'premium' || userPrefs.subscription_tier === 'elite') &&
          userPrefs.alert_types?.flight_updates) {
        
        const message = `✈️ Flight delay risk for ${trip.trip_name}: ${Math.round(trip.risk_assessment.flight_delay_risk)}/100`;
        
        if (userPrefs.email_enabled) {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: trip.created_by,
            subject: `✈️ Flight Delay Alert: ${trip.trip_name}`,
            body: `
              <h2>✈️ Flight Disruption Alert</h2>
              <p>Your flight for <strong>${trip.trip_name}</strong> has elevated delay risk.</p>
              <p><strong>Risk Level:</strong> ${Math.round(trip.risk_assessment.flight_delay_risk)}/100</p>
              <p>${trip.risk_details?.flight_delay_reasoning || ''}</p>
              
              <p><strong>Recommended Actions:</strong></p>
              <ul>
                <li>Arrive at airport earlier than usual</li>
                <li>Check flight status regularly</li>
                <li>Review rebooking options</li>
                <li>Verify travel insurance covers delays</li>
              </ul>
              
              <p><a href="${Deno.env.get('APP_URL')}/TripDetail?id=${trip.id}">View Details</a></p>
            `
          });
        }

        await base44.asServiceRole.entities.AlertHistory.create({
          trip_id: trip.id,
          user_email: trip.created_by,
          severity: 'caution',
          alert_type: 'flight_delay',
          message,
          risk_score: trip.risk_assessment.flight_delay_risk,
          channels_sent: userPrefs.email_enabled ? ['email'] : []
        });

        alertsSent.push({ tripId: trip.id, type: 'flight_delay' });
      }
    }

    return Response.json({ 
      success: true, 
      tripsChecked: activeTrips.length,
      alertsSent: alertsSent.length,
      details: alertsSent
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});