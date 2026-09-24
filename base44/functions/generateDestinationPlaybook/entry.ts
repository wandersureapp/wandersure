import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tripId } = await req.json();
    
    // Get trip details
    const trips = await base44.entities.Trip.list();
    const trip = trips.find(t => t.id === tripId);
    
    if (!trip) {
      return Response.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Generate playbook using AI
    const prompt = `Create a comprehensive destination playbook for ${trip.destination}, ${trip.destination_country}.

Travel dates: ${trip.start_date} to ${trip.end_date}
Number of travelers: ${trip.travelers_count}

Generate detailed content including:
1. Local customs and etiquette (detailed cultural norms)
2. Essential language phrases with translations and pronunciation
3. Hidden gems and local favorites (restaurants, cafes, viewpoints, experiences)
4. Safety tips specific to this destination
5. Money-saving strategies (local tricks, best time to visit attractions)
6. Best transportation options
7. Must-try local foods and dishes

Make it practical, actionable, and insider-focused. Include specific places and tips a tourist guide wouldn't tell you.`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          local_customs: { type: "string" },
          language_tips: {
            type: "array",
            items: {
              type: "object",
              properties: {
                phrase: { type: "string" },
                translation: { type: "string" },
                pronunciation: { type: "string" }
              }
            }
          },
          hidden_gems: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                category: { type: "string" }
              }
            }
          },
          safety_tips: {
            type: "array",
            items: { type: "string" }
          },
          money_saving_tips: {
            type: "array",
            items: { type: "string" }
          },
          best_time_to_visit: { type: "string" },
          transportation_guide: { type: "string" },
          food_recommendations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                dish: { type: "string" },
                description: { type: "string" }
              }
            }
          }
        }
      }
    });

    // Save the playbook
    const playbook = await base44.entities.DestinationPlaybook.create({
      trip_id: tripId,
      destination: trip.destination,
      destination_country: trip.destination_country,
      travel_dates: `${trip.start_date} to ${trip.end_date}`,
      generated_content: result
    });

    return Response.json({ success: true, playbook });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});