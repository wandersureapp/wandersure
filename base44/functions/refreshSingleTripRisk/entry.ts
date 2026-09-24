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

        const prompt = `You are a travel risk analyst with access to live data sources. Provide a COMPREHENSIVE real-time risk assessment for this trip:

Trip Name: ${trip.trip_name}
Overall Travel Dates: ${trip.start_date} to ${trip.end_date}

DESTINATIONS (analyze risk for EACH location):
${destinationsInfo}

FLIGHTS:
${flightsInfo}

Hotel: ${trip.hotel_name || 'Not specified'}
Travelers: ${trip.travelers_count || 1}
Trip Cost: $${trip.trip_cost || 0}

CRITICAL: Check these OFFICIAL real-time sources:

GOVERNMENT & TRAVEL ADVISORIES (check for ALL destinations):
- US State Department travel advisories for each country visited
- CDC health notices and vaccination requirements for each destination
- TSA updates and security alerts
- Local government official websites for each city

CRIME & SAFETY (check for ALL destinations):
- Current crime statistics for each city
- Recent incidents affecting tourists in each location
- Police reports and safety databases for all destinations
- Travel safety forums and recent traveler experiences

FLIGHT & AIRPORT INTELLIGENCE:
${flightsInfo !== 'No specific flight information provided' && flightsInfo !== 'Flight details added but incomplete' ? 
`- Live flight status for the SPECIFIC FLIGHTS listed above
- FlightAware/FlightRadar24 current delay patterns for these EXACT flight numbers
- Check each airline's on-time performance
- MENTION THE ACTUAL FLIGHT NUMBERS in your flight_delay_reasoning` :
`- General airport conditions and delay patterns
- CLEARLY STATE "No specific flight information available" in your flight_delay_reasoning`}
- Real-time TSA wait times at departure airports
- Airport websites for closures, construction, critical updates
- Current traffic conditions to airports
- Parking availability and shuttle status

WEATHER CONDITIONS:
- Current weather at departure and arrival airports
- Hour-by-hour forecast for travel dates
- Severe weather alerts or warnings
- Historical weather patterns for these dates
- Storm tracking and precipitation forecasts

NEWS & CURRENT EVENTS (check for ALL destinations):
- Breaking news in each destination city
- Political protests or civil unrest in any location
- Natural disasters or emergencies at any stop
- Local events causing disruptions in any destination

AIRLINE SPECIFIC:
- Recent cancellations and delays for the airlines listed above
- Baggage handling issues or lost luggage rates
- Customer service problems or labor disputes

DESTINATION SPECIFIC (for ALL destinations):
- Local laws travelers should know in each location
- Scams targeting tourists in each city
- Healthcare quality and hospital access for all destinations
- Communication (wifi/phone service) in each location

Score each risk 0-100 (0=no risk, 100=extreme risk). Be detailed and specific with reasoning based on ACTUAL current data for EACH location. Each reasoning field must be at least 2-3 detailed sentences.`;

        const riskData = await base44.integrations.Core.InvokeLLM({
            prompt: prompt,
            add_context_from_internet: true,
            response_json_schema: {
                type: "object",
                properties: {
                    flight_delay_risk: { type: "number", description: "0-100, overall flight risk" },
                    weather_risk: { type: "number", description: "0-100, overall weather risk" },
                    crime_risk: { type: "number", description: "0-100, overall crime risk" },
                    political_risk: { type: "number", description: "0-100, overall political risk" },
                    health_risk: { type: "number", description: "0-100, overall health risk" },
                    disruption_risk: { type: "number", description: "0-100, overall disruption risk" },
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
                    },
                    destination_risks: {
                        type: "array",
                        description: "REQUIRED - Individual risk scores for EACH destination",
                        items: {
                            type: "object",
                            properties: {
                                city: { type: "string" },
                                country: { type: "string" },
                                crime_risk: { type: "number" },
                                political_risk: { type: "number" },
                                health_risk: { type: "number" },
                                weather_risk: { type: "number" },
                                disruption_risk: { type: "number" },
                                overall_score: { type: "number" },
                                summary: { type: "string" }
                            }
                        }
                    }
                },
                required: ["flight_delay_risk", "weather_risk", "crime_risk", "political_risk", "health_risk", "disruption_risk", "flight_delay_reasoning", "weather_reasoning", "crime_reasoning", "political_reasoning", "health_reasoning", "disruption_reasoning", "destination_risks"]
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

        // Update destinations with per-location risk scores
        const updatedDestinations = trip.destinations?.map(dest => {
            const destRisk = riskData.destination_risks?.find(
                dr => dr.city === dest.city && dr.country === dest.country
            );
            
            if (destRisk) {
                return {
                    ...dest,
                    risk_assessment: {
                        overall_score: destRisk.overall_score,
                        crime_risk: destRisk.crime_risk,
                        political_risk: destRisk.political_risk,
                        health_risk: destRisk.health_risk,
                        weather_risk: destRisk.weather_risk,
                        disruption_risk: destRisk.disruption_risk
                    }
                };
            }
            return dest;
        }) || trip.destinations;

        await base44.entities.Trip.update(trip.id, {
            destinations: updatedDestinations,
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