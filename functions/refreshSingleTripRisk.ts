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

        // Build comprehensive flight details - support both new array format and legacy format
        let flightsInfo = 'No specific flight information provided';
        
        if (trip.flights && trip.flights.length > 0) {
            flightsInfo = trip.flights.map((f, i) => {
                const parts = [];
                if (f.airline) parts.push(f.airline);
                if (f.flight_number) parts.push(`Flight #${f.flight_number}`);
                if (f.departure_airport && f.arrival_airport) {
                    parts.push(`Route: ${f.departure_airport} → ${f.arrival_airport}`);
                }
                if (f.departure_date) parts.push(`Date: ${f.departure_date}`);
                if (f.departure_time) parts.push(`Time: ${f.departure_time}`);
                return parts.length > 0 ? `Flight ${i+1}: ${parts.join(', ')}` : null;
            }).filter(Boolean).join('\n  ');
            
            if (!flightsInfo || flightsInfo.trim() === '') {
                flightsInfo = 'Flight details added but incomplete';
            }
        } else if (trip.airline || trip.flight_number) {
            // Legacy format fallback
            const parts = [];
            if (trip.airline) parts.push(trip.airline);
            if (trip.flight_number) parts.push(`Flight #${trip.flight_number}`);
            if (trip.departure_airport && trip.arrival_airport) {
                parts.push(`Route: ${trip.departure_airport} → ${trip.arrival_airport}`);
            }
            flightsInfo = parts.join(', ');
        }

        console.log('=== TRIP DATA DEBUG ===');
        console.log('Trip flights array:', JSON.stringify(trip.flights, null, 2));
        console.log('Legacy airline:', trip.airline);
        console.log('Legacy flight_number:', trip.flight_number);
        console.log('Flight information being sent to AI:', flightsInfo);
        console.log('=======================');

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

IMPORTANT - REAL-TIME DATA SOURCES TO CHECK:
1. FLIGHTS: ${flightsInfo !== 'No specific flight information provided' && flightsInfo !== 'Flight details added but incomplete' ? 'CHECK REAL-TIME STATUS for the SPECIFIC FLIGHT NUMBERS listed above. Use FlightAware, FlightRadar24, or airline websites. MENTION THE ACTUAL FLIGHT NUMBERS in your reasoning.' : 'No flight details available - provide general airport/route risk assessment and STATE this clearly in your flight_delay_reasoning.'}
2. WEATHER: Get CURRENT forecasts from weather.gov, weather.com for exact travel dates and ALL destinations
3. SAFETY/CRIME: Check US State Department travel advisories, CDC warnings, recent news for EACH destination
4. POLITICAL: Check current events, protests, government warnings for ALL locations
5. HEALTH: Check CDC travel health notices, vaccination requirements for ALL destinations
6. AIRPORT: Get CURRENT TSA wait times, airport status, traffic conditions

CRITICAL REQUIREMENTS FOR YOUR RESPONSE:
✓ ALL 6 risk scores are REQUIRED (flight_delay_risk, weather_risk, crime_risk, political_risk, health_risk, disruption_risk)
✓ Each score MUST be 0-100 (never null/undefined)
✓ ALL 6 reasoning fields are REQUIRED and must be detailed (minimum 2-3 sentences each)
✓ For flights: If specific flights provided, MENTION THE FLIGHT NUMBERS in your flight_delay_reasoning
✓ For flights: If NO flight info, clearly state "No specific flight information available" in reasoning
✓ Provide SPECIFIC, DETAILED analysis based on REAL current data you find`;

        const riskData = await base44.integrations.Core.InvokeLLM({
            prompt: prompt,
            add_context_from_internet: true,
            response_json_schema: {
                type: "object",
                properties: {
                    flight_delay_risk: { type: "number", description: "0-100, REQUIRED" },
                    weather_risk: { type: "number", description: "0-100, REQUIRED" },
                    crime_risk: { type: "number", description: "0-100, REQUIRED" },
                    political_risk: { type: "number", description: "0-100, REQUIRED" },
                    health_risk: { type: "number", description: "0-100, REQUIRED" },
                    disruption_risk: { type: "number", description: "0-100, REQUIRED" },
                    airport_conditions: { type: "string", description: "Current airport status" },
                    tsa_wait_times: { type: "string", description: "Current TSA wait estimates" },
                    flight_delay_reasoning: { type: "string", description: "REQUIRED - mention specific flights if provided" },
                    weather_reasoning: { type: "string", description: "REQUIRED" },
                    crime_reasoning: { type: "string", description: "REQUIRED" },
                    political_reasoning: { type: "string", description: "REQUIRED" },
                    health_reasoning: { type: "string", description: "REQUIRED" },
                    disruption_reasoning: { type: "string", description: "REQUIRED" },
                    airport_intel: { type: "string", description: "Current airport intelligence" },
                    critical_alerts: {
                        type: "array",
                        items: { type: "string" },
                        description: "List of critical alerts requiring immediate attention"
                    }
                },
                required: ["flight_delay_risk", "weather_risk", "crime_risk", "political_risk", "health_risk", "disruption_risk", "flight_delay_reasoning", "weather_reasoning", "crime_reasoning", "political_reasoning", "health_reasoning", "disruption_reasoning"]
            }
        });

        console.log('=== RISK DATA RECEIVED ===');
        console.log('Flight risk:', riskData.flight_delay_risk);
        console.log('Weather risk:', riskData.weather_risk);
        console.log('Crime risk:', riskData.crime_risk);
        console.log('Political risk:', riskData.political_risk);
        console.log('Health risk:', riskData.health_risk);
        console.log('Disruption risk:', riskData.disruption_risk);
        console.log('Flight reasoning:', riskData.flight_delay_reasoning);
        console.log('=======================');

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