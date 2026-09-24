import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get user's active trips
    const trips = await base44.entities.Trip.filter({
      created_by: user.email
    });

    const activeTrips = trips.filter(trip => 
      (trip.status === 'active' || trip.status === 'booked') &&
      new Date(trip.end_date) > new Date()
    );

    // Build RSS feed
    const appUrl = Deno.env.get('APP_URL') || 'https://your-app-url.com';
    const items = [];

    for (const trip of activeTrips) {
      const riskScore = trip.risk_assessment?.overall_score || 0;
      
      if (riskScore > 50) {
        const riskLevel = riskScore > 70 ? 'High' : 'Moderate';
        const pubDate = trip.risk_assessment?.last_updated 
          ? new Date(trip.risk_assessment.last_updated).toUTCString()
          : new Date().toUTCString();

        let description = `Risk Level: ${riskScore}/100\n\n`;
        
        if (trip.risk_details?.critical_alerts?.length > 0) {
          description += 'Critical Alerts:\n';
          trip.risk_details.critical_alerts.forEach(alert => {
            description += `• ${alert}\n`;
          });
          description += '\n';
        }

        if (trip.risk_assessment?.flight_delay_risk > 50) {
          description += `Flight Delay Risk: ${trip.risk_assessment.flight_delay_risk}/100\n`;
        }
        if (trip.risk_assessment?.weather_risk > 50) {
          description += `Weather Risk: ${trip.risk_assessment.weather_risk}/100\n`;
        }
        if (trip.risk_assessment?.crime_risk > 50) {
          description += `Safety Risk: ${trip.risk_assessment.crime_risk}/100\n`;
        }

        items.push(`
    <item>
      <title>⚠️ ${riskLevel} Risk Alert: ${trip.trip_name}</title>
      <link>${appUrl}/TripDetail?id=${trip.id}</link>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid>${trip.id}-${trip.risk_assessment?.last_updated || Date.now()}</guid>
    </item>`);
      }
    }

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>WanderSure Travel Alerts</title>
    <link>${appUrl}/Dashboard</link>
    <description>Real-time travel risk alerts for your trips</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${appUrl}/api/rss/alerts" rel="self" type="application/rss+xml" />
    ${items.join('\n')}
  </channel>
</rss>`;

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
});