import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        const { trip_id } = await req.json();

        if (!trip_id) {
            return Response.json({ error: 'trip_id is required' }, { status: 400 });
        }

        // Get trip details
        const trips = await base44.asServiceRole.entities.Trip.filter({ id: trip_id });
        const trip = trips[0];

        if (!trip) {
            return Response.json({ error: 'Trip not found' }, { status: 404 });
        }

        const riskScore = trip.risk_assessment?.overall_score || 0;
        const riskLevel = riskScore > 70 ? 'Critical' : riskScore > 50 ? 'Elevated' : riskScore > 25 ? 'Moderate' : 'Low';
        const riskColor = riskScore > 70 ? '#dc2626' : riskScore > 50 ? '#f59e0b' : riskScore > 25 ? '#eab308' : '#16a34a';

        await base44.asServiceRole.integrations.Core.SendEmail({
            from_name: 'WanderSure',
            to: trip.created_by,
            subject: `🎯 Your ${trip.trip_name} Risk Assessment is Ready!`,
            body: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #2563eb 0%, #0d9488 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">🌍 Your Trip Intelligence is Ready!</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">AI-Powered Risk Assessment for ${trip.trip_name}</p>
                    </div>

                    <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
                        <h2 style="color: #1f2937; margin-top: 0;">📊 Your Free Risk Assessment</h2>
                        
                        <div style="background: #f9fafb; padding: 20px; border-left: 4px solid ${riskColor}; margin: 20px 0; border-radius: 6px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Overall Risk Level</p>
                                    <h3 style="margin: 5px 0; color: ${riskColor}; font-size: 24px;">${riskLevel} Risk</h3>
                                </div>
                                <div style="font-size: 48px; color: ${riskColor}; font-weight: bold;">${Math.round(riskScore)}</div>
                            </div>
                        </div>

                        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #1e40af;">🔍 Risk Breakdown</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                ${trip.risk_assessment?.flight_delay_risk ? `
                                <tr>
                                    <td style="padding: 8px 0; color: #374151;">✈️ Flight Delays</td>
                                    <td style="text-align: right; font-weight: bold; color: #1f2937;">${Math.round(trip.risk_assessment.flight_delay_risk)}/100</td>
                                </tr>` : ''}
                                ${trip.risk_assessment?.weather_risk ? `
                                <tr>
                                    <td style="padding: 8px 0; color: #374151;">🌤️ Weather</td>
                                    <td style="text-align: right; font-weight: bold; color: #1f2937;">${Math.round(trip.risk_assessment.weather_risk)}/100</td>
                                </tr>` : ''}
                                ${trip.risk_assessment?.crime_risk ? `
                                <tr>
                                    <td style="padding: 8px 0; color: #374151;">🛡️ Safety</td>
                                    <td style="text-align: right; font-weight: bold; color: #1f2937;">${Math.round(trip.risk_assessment.crime_risk)}/100</td>
                                </tr>` : ''}
                            </table>
                        </div>

                        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #1f2937;">📋 Initial Risk Analysis Details</h3>
                            <p style="color: #6b7280; font-size: 13px; margin-top: 5px;">Analysis from: ${trip.risk_assessment?.last_updated ? new Date(trip.risk_assessment.last_updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' + new Date(trip.risk_assessment.last_updated).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : 'trip creation'}</p>
                            <p style="color: #2563eb; font-size: 12px; margin: 5px 0 20px 0;">💡 Subscribe to Smart Alerts for live hourly updates and detailed analysis</p>

                            ${trip.risk_details?.critical_alerts?.length > 0 ? `
                            <div style="background: #fef2f2; padding: 15px; border-left: 4px solid #dc2626; margin-bottom: 15px; border-radius: 4px;">
                                <h4 style="margin: 0 0 10px 0; color: #991b1b; font-size: 15px;">🚨 Critical Alerts</h4>
                                ${trip.risk_details.critical_alerts.map(alert => `<p style="margin: 5px 0; color: #7f1d1d; font-size: 13px;">• ${alert}</p>`).join('')}
                            </div>` : ''}

                            ${trip.risk_details?.flight_delay_reasoning ? `
                            <div style="margin-bottom: 15px;">
                                <h4 style="margin: 0 0 8px 0; color: #374151; font-size: 14px;">✈️ Flight Delays & Cancellations</h4>
                                <p style="margin: 0; color: #4b5563; font-size: 13px; line-height: 1.5;">${trip.risk_details.flight_delay_reasoning}</p>
                            </div>` : ''}

                            ${trip.risk_details?.weather_reasoning ? `
                            <div style="margin-bottom: 15px;">
                                <h4 style="margin: 0 0 8px 0; color: #374151; font-size: 14px;">🌤️ Weather Conditions</h4>
                                <p style="margin: 0; color: #4b5563; font-size: 13px; line-height: 1.5;">${trip.risk_details.weather_reasoning}</p>
                            </div>` : ''}

                            ${trip.risk_details?.airport_intel ? `
                            <div style="margin-bottom: 15px;">
                                <h4 style="margin: 0 0 8px 0; color: #374151; font-size: 14px;">🏢 Airport Intelligence</h4>
                                <p style="margin: 0; color: #4b5563; font-size: 13px; line-height: 1.5;">${trip.risk_details.airport_intel}</p>
                                ${trip.risk_assessment?.tsa_wait_times ? `<p style="margin: 5px 0 0 0; color: #6b7280; font-size: 13px;"><strong>TSA Wait Times:</strong> ${trip.risk_assessment.tsa_wait_times}</p>` : ''}
                            </div>` : ''}

                            ${trip.risk_details?.crime_reasoning ? `
                            <div style="margin-bottom: 15px;">
                                <h4 style="margin: 0 0 8px 0; color: #374151; font-size: 14px;">🛡️ Safety & Crime</h4>
                                <p style="margin: 0; color: #4b5563; font-size: 13px; line-height: 1.5;">${trip.risk_details.crime_reasoning}</p>
                            </div>` : ''}

                            ${trip.risk_details?.political_reasoning ? `
                            <div style="margin-bottom: 15px;">
                                <h4 style="margin: 0 0 8px 0; color: #374151; font-size: 14px;">🏛️ Political Stability</h4>
                                <p style="margin: 0; color: #4b5563; font-size: 13px; line-height: 1.5;">${trip.risk_details.political_reasoning}</p>
                            </div>` : ''}

                            ${trip.risk_details?.health_reasoning ? `
                            <div style="margin-bottom: 15px;">
                                <h4 style="margin: 0 0 8px 0; color: #374151; font-size: 14px;">🏥 Health & Medical</h4>
                                <p style="margin: 0; color: #4b5563; font-size: 13px; line-height: 1.5;">${trip.risk_details.health_reasoning}</p>
                            </div>` : ''}

                            ${trip.risk_details?.disruption_reasoning ? `
                            <div style="margin-bottom: 0;">
                                <h4 style="margin: 0 0 8px 0; color: #374151; font-size: 14px;">⚠️ Travel Disruptions</h4>
                                <p style="margin: 0; color: #4b5563; font-size: 13px; line-height: 1.5;">${trip.risk_details.disruption_reasoning}</p>
                            </div>` : ''}
                        </div>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${Deno.env.get('APP_URL')}/TripDetail?id=${trip.id}" style="background: linear-gradient(135deg, #2563eb 0%, #0d9488 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">📱 View Full Details</a>
                        </div>

                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

                        <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 25px; border-radius: 12px; border: 2px solid #3b82f6;">
                            <h3 style="margin-top: 0; color: #1e40af; font-size: 20px;">🚀 Want More? Upgrade to Live Monitoring!</h3>
                            
                            <p style="color: #1f2937; margin-bottom: 15px;">
                                This free assessment is a <strong>one-time snapshot</strong>. Things change fast when you travel!
                            </p>

                            <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
                                <h4 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px;">✨ Explorer Plan - $9.99/mo</h4>
                                <ul style="margin: 0; padding-left: 20px; color: #374151;">
                                    <li>⏰ <strong>Hourly risk updates</strong> - conditions change, we keep you informed</li>
                                    <li>✈️ Real-time flight delays & gate changes</li>
                                    <li>🌤️ Hour-by-hour weather tracking</li>
                                    <li>🏢 Live TSA wait times & airport intel</li>
                                    <li>🏨 Hotel status updates</li>
                                </ul>
                            </div>

                            <div style="background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%); padding: 15px; border-radius: 8px; margin: 15px 0; border: 2px solid #a855f7;">
                                <h4 style="margin: 0 0 10px 0; color: #7e22ce; font-size: 16px;">👑 Globetrotter Plan - $19.99/mo</h4>
                                <ul style="margin: 0; padding-left: 20px; color: #374151;">
                                    <li>✅ Everything in Explorer</li>
                                    <li>📱 <strong>SMS critical alerts</strong> - get texts for urgent situations</li>
                                    <li>🎯 Priority alert delivery</li>
                                    <li>🛟 24/7 support</li>
                                </ul>
                            </div>

                            <div style="text-align: center; margin-top: 20px;">
                                <a href="${Deno.env.get('APP_URL')}/NotificationSettings" style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">🔔 View Alert Plans</a>
                            </div>
                        </div>

                        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
                            <h4 style="margin: 0 0 10px 0; color: #92400e;">💡 Already Planning More Trips?</h4>
                            <p style="margin: 0; color: #78350f; font-size: 14px;">
                                Get <strong>one-trip monitoring</strong> for $19.99 (Explorer) or $29.99 (Globetrotter). Perfect for occasional travelers!
                            </p>
                        </div>

                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                            <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
                                Questions? Reply to this email or visit our <a href="${Deno.env.get('APP_URL')}/Dashboard" style="color: #2563eb;">dashboard</a>
                            </p>
                            <p style="color: #9ca3af; font-size: 12px; margin: 15px 0 0 0;">
                                WanderSure - Your Journey, Protected 🌍
                            </p>
                        </div>
                    </div>
                </div>
            `
        });

        return Response.json({
            success: true,
            message: 'Initial risk email sent successfully'
        });
    } catch (error) {
        console.error('Error sending initial risk email:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});