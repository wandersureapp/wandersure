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
        email_enabled: true, 
        alert_types: { major_risk_alerts: true } 
      };

      // Skip if user has disabled alerts
      if (!userPrefs.email_enabled && !userPrefs.in_app_enabled) continue;

      const riskScore = trip.risk_assessment?.overall_score || 0;
      
      // Send alerts for high-risk trips
      if (riskScore > 60 && userPrefs.alert_types?.major_risk_alerts) {
        const message = `High risk alert for ${trip.trip_name}: Risk score ${Math.round(riskScore)}/100. Review your trip details.`;
        
        // Send email
        if (userPrefs.email_enabled) {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: trip.created_by,
            subject: `⚠️ High Risk Alert: ${trip.trip_name}`,
            body: `
              <h2>High Risk Alert</h2>
              <p>Your trip <strong>${trip.trip_name}</strong> to ${trip.destination} has an elevated risk score of <strong>${Math.round(riskScore)}/100</strong>.</p>
              
              ${trip.risk_details?.critical_alerts?.length > 0 ? `
                <h3>Critical Alerts:</h3>
                <ul>
                  ${trip.risk_details.critical_alerts.map(alert => `<li>${alert}</li>`).join('')}
                </ul>
              ` : ''}
              
              <p><a href="${Deno.env.get('APP_URL') || 'https://your-app-url.com'}/TripDetail?id=${trip.id}">View Trip Details</a></p>
              
              <p>Stay safe and informed with WanderSure.</p>
            `
          });
        }

        alertsSent.push({ tripId: trip.id, tripName: trip.trip_name, userEmail: trip.created_by });
      }

      // Send flight delay alerts for premium users
      if (trip.risk_assessment?.flight_delay_risk > 50 && 
          userPrefs.premium_subscription && 
          userPrefs.alert_types?.flight_updates) {
        
        const message = `Flight delay risk for ${trip.trip_name}: ${Math.round(trip.risk_assessment.flight_delay_risk)}/100`;
        
        if (userPrefs.email_enabled) {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: trip.created_by,
            subject: `✈️ Flight Delay Risk: ${trip.trip_name}`,
            body: `
              <h2>Flight Delay Alert</h2>
              <p>Your flight for <strong>${trip.trip_name}</strong> has elevated delay risk.</p>
              <p><strong>Risk Level:</strong> ${Math.round(trip.risk_assessment.flight_delay_risk)}/100</p>
              <p>${trip.risk_details?.flight_delay_reasoning || ''}</p>
              <p><a href="${Deno.env.get('APP_URL') || 'https://your-app-url.com'}/TripDetail?id=${trip.id}">View Details</a></p>
            `
          });
        }

        alertsSent.push({ tripId: trip.id, type: 'flight_delay', userEmail: trip.created_by });
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