import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Service role function for scheduled tasks (no user auth needed)
        // Get all active and booked trips
        const allTrips = await base44.asServiceRole.entities.Trip.list();
        const activeTrips = allTrips.filter(trip => 
            trip.status === 'active' || trip.status === 'booked'
        );

        console.log(`Refreshing risk assessments for ${activeTrips.length} active trips`);

        const results = [];
        
        for (const trip of activeTrips) {
            try {
                console.log(`Analyzing trip: ${trip.trip_name}`);

                const destinationsInfo = trip.destinations && trip.destinations.length > 0
                    ? trip.destinations.map(d => `${d.city}, ${d.country} (${d.arrival_date} to ${d.departure_date}) - ${d.purpose}`).join('\n')
                    : `${trip.destination}, ${trip.destination_country || ''}`;

                // Get real-time data from the web
                const riskAnalysis = await base44.asServiceRole.integrations.Core.InvokeLLM({
                    prompt: `You are a travel risk analyst with access to live data sources. Analyze current conditions for this MULTI-DESTINATION trip:
                    
Trip: ${trip.trip_name}
Overall Travel Dates: ${trip.start_date} to ${trip.end_date}

DESTINATIONS (assess risk for EACH location):
${destinationsInfo}

Airline: ${trip.airline || 'Not specified'}
Flight: ${trip.flight_number || 'Not specified'}

CRITICAL: Check these OFFICIAL sources for real-time data:

GOVERNMENT & TRAVEL ADVISORIES (check for ALL destinations):
- US State Department travel advisories (travel.state.gov) for each country
- CDC health notices (wwwnc.cdc.gov/travel) for each destination
- TSA updates (tsa.gov)
- Local government websites for each destination

CRIME & SAFETY DATABASES (check for ALL destinations):
- Recent crime reports and statistics for each city
- Historical crime data trends for all locations
- Local police reports and incident databases for each destination
- Travel safety forums and recent traveler reports for all stops

FLIGHT & AIRPORT INTELLIGENCE:
- Live flight status for ${trip.flight_number || 'this route'}
- FlightAware/FlightRadar24 delay patterns
- Current TSA wait times at departure airport
- Airport website critical updates and closures
- Traffic conditions and parking availability

NEWS & CURRENT EVENTS (check for ALL destinations):
- Breaking news for each destination
- Recent incidents affecting travelers in any location
- Political protests or civil unrest in any destination
- Natural disasters or weather emergencies at any stop

WEATHER DATA:
- Current conditions and hour-by-hour forecasts
- Severe weather alerts
- Historical weather patterns for travel dates

Analyze ALL available data points including historical trends and real-time conditions for EACH destination.

Score each risk category 0-100 (0=no risk, 100=extreme risk). The overall_score should reflect the MAXIMUM risk across ALL destinations.`,
                    add_context_from_internet: true,
                    response_json_schema: {
                        type: "object",
                        properties: {
                            flight_delay_risk: { type: "number" },
                            weather_risk: { type: "number" },
                            crime_risk: { type: "number" },
                            political_risk: { type: "number" },
                            health_risk: { type: "number" },
                            disruption_risk: { type: "number" },
                            airport_status: { 
                                type: "object",
                                properties: {
                                    tsa_wait_time: { type: "string" },
                                    critical_updates: { type: "array", items: { type: "string" } },
                                    traffic_status: { type: "string" },
                                    parking_availability: { type: "string" }
                                }
                            },
                            summary: { type: "string" },
                            critical_alerts: {
                                type: "array",
                                items: { type: "string" }
                            },
                            changes_from_previous: { type: "string" }
                        }
                    }
                });

                // Calculate overall score as weighted average
                const overallScore = Math.round(
                    (riskAnalysis.flight_delay_risk * 1.0 +
                     riskAnalysis.weather_risk * 1.0 +
                     riskAnalysis.crime_risk * 1.5 +
                     riskAnalysis.political_risk * 1.5 +
                     riskAnalysis.health_risk * 1.3 +
                     riskAnalysis.disruption_risk * 0.7) / 7.0
                );

                // Compare with previous assessment
                const previousScore = trip.risk_assessment?.overall_score || 0;
                const newScore = overallScore;
                const scoreDifference = newScore - previousScore;
                
                // Update trip with new risk assessment
                await base44.asServiceRole.entities.Trip.update(trip.id, {
                    risk_assessment: {
                        overall_score: overallScore,
                        flight_delay_risk: riskAnalysis.flight_delay_risk,
                        weather_risk: riskAnalysis.weather_risk,
                        crime_risk: riskAnalysis.crime_risk,
                        political_risk: riskAnalysis.political_risk,
                        health_risk: riskAnalysis.health_risk,
                        disruption_risk: riskAnalysis.disruption_risk,
                        airport_status: riskAnalysis.airport_status,
                        last_updated: new Date().toISOString()
                    }
                });

                // Send alert only for SIGNIFICANT risk changes (10+ points)
                if (Math.abs(scoreDifference) >= 10) {
                    const preferences = await base44.asServiceRole.entities.UserNotificationPreferences.filter({
                        user_email: trip.created_by
                    });

                    const userPrefs = preferences[0] || { subscription_tier: 'free', email_enabled: true };
                    const isPremiumUser = userPrefs.subscription_tier === 'premium' || userPrefs.subscription_tier === 'elite';

                    if (isPremiumUser && userPrefs.email_enabled) {
                        const alertType = scoreDifference > 0 ? '⚠️ Risk Increased' : '✅ Risk Decreased';
                        const changeIndicator = scoreDifference > 0 ? `+${scoreDifference}` : `${scoreDifference}`;
                        
                        await base44.asServiceRole.integrations.Core.SendEmail({
                            from_name: "WanderSure Alerts",
                            to: trip.created_by,
                            subject: `${alertType}: ${trip.trip_name}`,
                            body: `
<h2>Travel Risk Alert</h2>
<p>We've detected significant changes in travel conditions for your upcoming trip:</p>

<h3>${trip.trip_name}</h3>
<p><strong>Destination:</strong> ${trip.destination}</p>
<p><strong>Dates:</strong> ${trip.start_date} to ${trip.end_date}</p>

<p><strong>Risk Level:</strong> ${previousScore} → ${newScore} (${changeIndicator} points)</p>

<h4>Summary:</h4>
<p>${riskAnalysis.summary}</p>

${riskAnalysis.airport_status ? `
<h4>Airport Intelligence:</h4>
<ul>
${riskAnalysis.airport_status.tsa_wait_time ? `<li><strong>TSA Wait:</strong> ${riskAnalysis.airport_status.tsa_wait_time}</li>` : ''}
${riskAnalysis.airport_status.traffic_status ? `<li><strong>Traffic:</strong> ${riskAnalysis.airport_status.traffic_status}</li>` : ''}
${riskAnalysis.airport_status.parking_availability ? `<li><strong>Parking:</strong> ${riskAnalysis.airport_status.parking_availability}</li>` : ''}
${riskAnalysis.airport_status.critical_updates?.length > 0 ? riskAnalysis.airport_status.critical_updates.map(update => `<li>${update}</li>`).join('\n') : ''}
</ul>
` : ''}

${riskAnalysis.critical_alerts?.length > 0 ? `
<h4>Critical Alerts:</h4>
<ul>
${riskAnalysis.critical_alerts.map(alert => `<li>${alert}</li>`).join('\n')}
</ul>
` : ''}

<p><a href="${req.headers.get('origin')}/TripDetail?id=${trip.id}">View Trip Details</a></p>

<p style="color: #666; font-size: 12px;">This is a premium alert. Manage your alert settings in the WanderSure app.</p>
                            `
                        });

                        console.log(`Sent risk alert to ${trip.created_by} for trip ${trip.id} (change: ${changeIndicator})`);
                    }
                }

                // Also send in-app notification for free users on major increases
                if (scoreDifference > 20) {
                    const preferences = await base44.asServiceRole.entities.UserNotificationPreferences.filter({
                        user_email: trip.created_by
                    });

                    if (preferences.length > 0 && preferences[0].in_app_enabled) {
                        // Store in-app notification for user to see
                        console.log(`Would create in-app notification for ${trip.created_by} about trip ${trip.id}`);
                    }
                }

                results.push({
                    trip_id: trip.id,
                    trip_name: trip.trip_name,
                    previous_score: previousScore,
                    new_score: newScore,
                    change: scoreDifference,
                    alert_sent: scoreDifference > 15
                });

            } catch (error) {
                console.error(`Error analyzing trip ${trip.id}:`, error);
                results.push({
                    trip_id: trip.id,
                    error: error.message
                });
            }
        }

        return Response.json({
            success: true,
            trips_analyzed: activeTrips.length,
            results: results
        });

    } catch (error) {
        console.error('Risk refresh error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});