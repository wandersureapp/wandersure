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

        console.log(`[${new Date().toISOString()}] Refreshing risk for trip: ${trip.trip_name}`);

        const destinationsInfo = trip.destinations && trip.destinations.length > 0
            ? trip.destinations.map(d => `${d.city}, ${d.country} (${d.arrival_date} to ${d.departure_date}) - ${d.purpose}`).join('\n  ')
            : `${trip.destination}, ${trip.destination_country || ''}`;

        const flightsInfo = trip.flights && trip.flights.length > 0
            ? trip.flights.map((f, i) => `Flight ${i+1}: ${f.airline} ${f.flight_number} (${f.departure_airport} → ${f.arrival_airport})`).join('\n  ')
            : 'Not specified';

        const prompt = `You are a travel risk intelligence analyst. Analyze the following trip and provide REAL-TIME risk assessments.

Trip Details:
- Trip Name: ${trip.trip_name}
- Travel Dates: ${trip.start_date} to ${trip.end_date}

DESTINATIONS:
  ${destinationsInfo}

FLIGHTS:
  ${flightsInfo}

Hotel: ${trip.hotel_name || 'Not specified'}
Travelers: ${trip.travelers_count || 1}

IMPORTANT INSTRUCTIONS:
1. Use CURRENT, REAL-TIME data from the internet (government advisories, news, weather forecasts, flight data)
2. For flight risks, use the SPECIFIC flight information provided above (airlines, flight numbers, routes)
3. For weather, get CURRENT forecasts for the exact travel dates and ALL destinations
4. For safety/crime, check CURRENT government travel advisories and recent news for EACH destination
5. For political stability, check CURRENT events and State Department warnings for ALL locations
6. For health risks, check CDC travel health notices and current outbreaks for ALL destinations
7. For airport intelligence, provide CURRENT TSA wait times and airport conditions if available

CRITICAL: You MUST score ALL categories 0-100. Never return 0 or null unless there is genuinely NO risk.
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
        // Ensure all values default to 0 if missing
        const flightRisk = riskData.flight_delay_risk || 0;
        const weatherRisk = riskData.weather_risk || 0;
        const crimeRisk = riskData.crime_risk || 0;
        const politicalRisk = riskData.political_risk || 0;
        const healthRisk = riskData.health_risk || 0;
        const disruptionRisk = riskData.disruption_risk || 0;

        const overallScore = Math.round(
            (flightRisk * 1.0 +
             weatherRisk * 1.0 +
             crimeRisk * 1.5 +
             politicalRisk * 1.5 +
             healthRisk * 1.3 +
             disruptionRisk * 0.7) / 7.0
        );

        const previousScore = trip.risk_assessment?.overall_score || 0;

        await base44.entities.Trip.update(trip.id, {
            risk_assessment: {
                overall_score: overallScore,
                flight_delay_risk: flightRisk,
                weather_risk: weatherRisk,
                crime_risk: crimeRisk,
                political_risk: politicalRisk,
                health_risk: healthRisk,
                disruption_risk: disruptionRisk,
                airport_conditions: riskData.airport_conditions || '',
                tsa_wait_times: riskData.tsa_wait_times || '',
                last_updated: new Date().toISOString()
            },
            risk_details: {
                flight_delay_reasoning: riskData.flight_delay_reasoning || 'No flight delay analysis available',
                weather_reasoning: riskData.weather_reasoning || 'No weather analysis available',
                crime_reasoning: riskData.crime_reasoning || 'No safety analysis available',
                political_reasoning: riskData.political_reasoning || 'No political analysis available',
                health_reasoning: riskData.health_reasoning || 'No health analysis available',
                disruption_reasoning: riskData.disruption_reasoning || 'No disruption analysis available',
                airport_intel: riskData.airport_intel || '',
                critical_alerts: riskData.critical_alerts || []
            }
        });

        console.log(`[${new Date().toISOString()}] Updated risk score: ${previousScore} → ${overallScore}`);

        return Response.json({
            success: true,
            trip_id: trip.id,
            trip_name: trip.trip_name,
            previous_score: previousScore,
            new_score: overallScore,
            risk_change: overallScore - previousScore,
            updated_at: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error refreshing trip risk:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});