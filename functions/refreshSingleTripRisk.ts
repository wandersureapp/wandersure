import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { trip_id } = await req.json();

        if (!trip_id) {
            return Response.json({ error: 'trip_id is required' }, { status: 400 });
        }

        const trips = await base44.entities.Trip.filter({ id: trip_id });
        const trip = trips[0];

        if (!trip) {
            return Response.json({ error: 'Trip not found' }, { status: 404 });
        }

        // Check user has access to this trip
        if (trip.created_by !== user.email && user.role !== 'admin') {
            return Response.json({ error: 'Unauthorized to access this trip' }, { status: 403 });
        }

        console.log(`[${new Date().toISOString()}] Refreshing risk for trip: ${trip.trip_name} (${trip.destination})`);

        const prompt = `You are a travel risk intelligence analyst. Analyze the following trip and provide REAL-TIME risk assessments.

Trip Details:
- Destination: ${trip.destination}, ${trip.destination_country}
- Travel Dates: ${trip.start_date} to ${trip.end_date}
- Airline: ${trip.airline || 'Not specified'}
- Flight Number: ${trip.flight_number || 'Not specified'}

IMPORTANT INSTRUCTIONS:
1. Use CURRENT, REAL-TIME data from the internet (government advisories, news, weather forecasts, flight data)
2. For flight risks, check REAL flight status APIs and current airline performance
3. For weather, get CURRENT forecasts for the exact travel dates and destination
4. For safety/crime, check CURRENT government travel advisories and recent news
5. For political stability, check CURRENT events and State Department warnings
6. For health risks, check CDC travel health notices and current outbreaks
7. For airport intelligence, provide CURRENT TSA wait times and airport conditions if available

Provide detailed reasoning for each risk category based on REAL data you find.`;

        const riskData = await base44.integrations.Core.InvokeLLM({
            prompt: prompt,
            add_context_from_internet: true,
            response_json_schema: {
                type: "object",
                properties: {
                    flight_delay_risk: { type: "number", description: "0-100" },
                    weather_risk: { type: "number", description: "0-100" },
                    crime_risk: { type: "number", description: "0-100" },
                    political_risk: { type: "number", description: "0-100" },
                    health_risk: { type: "number", description: "0-100" },
                    disruption_risk: { type: "number", description: "0-100" },
                    airport_conditions: { type: "string", description: "Current airport status" },
                    tsa_wait_times: { type: "string", description: "Current TSA wait estimates" },
                    flight_delay_reasoning: { type: "string" },
                    weather_reasoning: { type: "string" },
                    crime_reasoning: { type: "string" },
                    political_reasoning: { type: "string" },
                    health_reasoning: { type: "string" },
                    disruption_reasoning: { type: "string" },
                    airport_intel: { type: "string" },
                    critical_alerts: {
                        type: "array",
                        items: { type: "string" },
                        description: "List of critical alerts requiring immediate attention"
                    }
                }
            }
        });

        // Calculate overall score as weighted average
        // Safety (crime/political) and health are more critical, so weighted higher
        const overallScore = Math.round(
            (riskData.flight_delay_risk * 1.0 +
             riskData.weather_risk * 1.0 +
             riskData.crime_risk * 1.5 +
             riskData.political_risk * 1.5 +
             riskData.health_risk * 1.3 +
             riskData.disruption_risk * 0.7) / 7.0
        );

        const previousScore = trip.risk_assessment?.overall_score || 0;

        await base44.entities.Trip.update(trip.id, {
            risk_assessment: {
                overall_score: riskData.overall_score,
                flight_delay_risk: riskData.flight_delay_risk,
                weather_risk: riskData.weather_risk,
                crime_risk: riskData.crime_risk,
                political_risk: riskData.political_risk,
                health_risk: riskData.health_risk,
                disruption_risk: riskData.disruption_risk,
                airport_conditions: riskData.airport_conditions,
                tsa_wait_times: riskData.tsa_wait_times,
                last_updated: new Date().toISOString()
            },
            risk_details: {
                flight_delay_reasoning: riskData.flight_delay_reasoning,
                weather_reasoning: riskData.weather_reasoning,
                crime_reasoning: riskData.crime_reasoning,
                political_reasoning: riskData.political_reasoning,
                health_reasoning: riskData.health_reasoning,
                disruption_reasoning: riskData.disruption_reasoning,
                airport_intel: riskData.airport_intel,
                critical_alerts: riskData.critical_alerts || []
            }
        });

        console.log(`[${new Date().toISOString()}] Updated risk score: ${previousScore} → ${riskData.overall_score}`);

        return Response.json({
            success: true,
            trip_id: trip.id,
            trip_name: trip.trip_name,
            previous_score: previousScore,
            new_score: riskData.overall_score,
            risk_change: riskData.overall_score - previousScore,
            updated_at: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error refreshing trip risk:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});