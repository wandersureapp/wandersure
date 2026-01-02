import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { tripId, accessToken } = await req.json();

        if (!tripId) {
            return Response.json({ error: 'Trip ID required' }, { status: 400 });
        }

        if (!accessToken) {
            return Response.json({ 
                error: 'Gmail access token required. Please authorize Gmail access.',
                needsAuth: true 
            }, { status: 401 });
        }

        // Search for travel confirmation emails in the last 90 days
        const searchQuery = 'subject:(confirmation OR booking OR itinerary OR reservation) (flight OR hotel OR rental OR cruise OR train) newer_than:90d';
        
        const searchResponse = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(searchQuery)}&maxResults=50`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            }
        );

        if (!searchResponse.ok) {
            const error = await searchResponse.json();
            return Response.json({ 
                error: 'Failed to access Gmail. Please re-authorize.',
                needsAuth: true,
                details: error 
            }, { status: 401 });
        }

        const searchData = await searchResponse.json();
        
        if (!searchData.messages || searchData.messages.length === 0) {
            return Response.json({ 
                success: true, 
                message: 'No confirmation emails found',
                bookings: []
            });
        }

        // Get full email content for each message
        const emailContents = [];
        for (const message of searchData.messages.slice(0, 10)) {
            const emailResponse = await fetch(
                `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=full`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept': 'application/json'
                    }
                }
            );
            const emailData = await emailResponse.json();
            
            // Extract email body
            let body = '';
            if (emailData.payload.body.data) {
                body = atob(emailData.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
            } else if (emailData.payload.parts) {
                for (const part of emailData.payload.parts) {
                    if (part.mimeType === 'text/plain' && part.body.data) {
                        body += atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
                    }
                }
            }

            emailContents.push({
                subject: emailData.payload.headers.find(h => h.name === 'Subject')?.value || '',
                from: emailData.payload.headers.find(h => h.name === 'From')?.value || '',
                body: body.substring(0, 5000) // Limit body size
            });
        }

        // Use AI to extract booking information
        const extractedData = await base44.integrations.Core.InvokeLLM({
            prompt: `Extract all travel booking information from these confirmation emails. Look for:
- Flight numbers, airlines, departure/arrival times and airports
- Hotel names, addresses, confirmation/booking numbers
- Rental car companies, pickup/dropoff locations, confirmation numbers
- Cruise lines, ship names, booking numbers
- Train/rail bookings

Emails:
${emailContents.map((e, i) => `
Email ${i + 1}:
From: ${e.from}
Subject: ${e.subject}
Body: ${e.body}
`).join('\n---\n')}

Extract all relevant booking details.`,
            response_json_schema: {
                type: "object",
                properties: {
                    flights: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                airline: { type: "string" },
                                flight_number: { type: "string" },
                                departure_airport: { type: "string" },
                                arrival_airport: { type: "string" },
                                departure_time: { type: "string" },
                                confirmation_number: { type: "string" }
                            }
                        }
                    },
                    hotels: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                hotel_name: { type: "string" },
                                address: { type: "string" },
                                check_in: { type: "string" },
                                check_out: { type: "string" },
                                booking_number: { type: "string" }
                            }
                        }
                    },
                    car_rentals: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                company: { type: "string" },
                                pickup_location: { type: "string" },
                                dropoff_location: { type: "string" },
                                pickup_time: { type: "string" },
                                booking_number: { type: "string" }
                            }
                        }
                    },
                    cruises: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                cruise_line: { type: "string" },
                                ship_name: { type: "string" },
                                departure_port: { type: "string" },
                                departure_date: { type: "string" },
                                booking_number: { type: "string" }
                            }
                        }
                    }
                }
            }
        });

        // Update trip with extracted booking data
        const trip = await base44.entities.Trip.filter({ id: tripId });
        if (trip.length > 0) {
            const updates = {};
            
            if (extractedData.flights && extractedData.flights.length > 0) {
                const flight = extractedData.flights[0];
                updates.airline = flight.airline;
                updates.flight_number = flight.flight_number;
            }
            
            if (extractedData.hotels && extractedData.hotels.length > 0) {
                const hotel = extractedData.hotels[0];
                updates.hotel_name = hotel.hotel_name;
                updates.hotel_booking_number = hotel.booking_number;
            }
            
            if (extractedData.car_rentals && extractedData.car_rentals.length > 0) {
                const rental = extractedData.car_rentals[0];
                updates.car_rental_company = rental.company;
                updates.car_rental_booking_number = rental.booking_number;
            }
            
            if (extractedData.cruises && extractedData.cruises.length > 0) {
                const cruise = extractedData.cruises[0];
                updates.cruise_line = cruise.cruise_line;
                updates.cruise_booking_number = cruise.booking_number;
            }

            if (Object.keys(updates).length > 0) {
                await base44.asServiceRole.entities.Trip.update(tripId, updates);
            }
        }

        return Response.json({
            success: true,
            bookings: extractedData,
            message: 'Booking information extracted and trip updated'
        });

    } catch (error) {
        console.error('Email parsing error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});