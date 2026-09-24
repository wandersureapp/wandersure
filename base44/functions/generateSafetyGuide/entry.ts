import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tripId } = await req.json();
    
    const trips = await base44.entities.Trip.list();
    const trip = trips.find(t => t.id === tripId);
    
    if (!trip) {
      return Response.json({ error: 'Trip not found' }, { status: 404 });
    }

    const prompt = `Create a comprehensive safety and security guide for ${trip.destination}, ${trip.destination_country}.

Travel dates: ${trip.start_date} to ${trip.end_date}

Generate detailed safety information including:
1. Emergency contacts (police, ambulance, fire, tourist police, embassy)
2. Common scams and how to avoid them
3. Transportation safety tips (taxis, public transit, rideshares)
4. Health precautions and recommended vaccinations
5. Areas to avoid (specific neighborhoods or zones)
6. Document backup strategies
7. Important local laws tourists should know

Be specific and practical. Include phone numbers where available.`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          emergency_contacts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                service: { type: "string" },
                number: { type: "string" },
                notes: { type: "string" }
              }
            }
          },
          common_scams: {
            type: "array",
            items: {
              type: "object",
              properties: {
                scam_type: { type: "string" },
                description: { type: "string" },
                how_to_avoid: { type: "string" }
              }
            }
          },
          transportation_safety: {
            type: "array",
            items: { type: "string" }
          },
          health_precautions: {
            type: "array",
            items: { type: "string" }
          },
          areas_to_avoid: {
            type: "array",
            items: {
              type: "object",
              properties: {
                area: { type: "string" },
                reason: { type: "string" }
              }
            }
          },
          document_backup_tips: {
            type: "array",
            items: { type: "string" }
          },
          local_laws: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    });

    const guide = await base44.entities.SafetyGuide.create({
      trip_id: tripId,
      destination: trip.destination,
      destination_country: trip.destination_country,
      generated_content: result
    });

    return Response.json({ success: true, guide });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});