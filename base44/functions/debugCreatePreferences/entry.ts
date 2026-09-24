import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Create directly with service role
        const result = await base44.asServiceRole.entities.UserNotificationPreferences.create({
            user_email: 'sgtbradleygh@gmail.com',
            subscription_tier: 'premium',
            email_enabled: true,
            in_app_enabled: true,
            sms_enabled: false,
            alert_types: {
                trip_reminders: true,
                major_risk_alerts: true,
                flight_updates: true,
                airport_intelligence: true,
                weather_updates: true,
                destination_safety: true,
                hotel_updates: true,
                car_rental_updates: true,
                cruise_updates: true,
                rail_updates: true,
                insurance_recommendations: true,
                price_drop_alerts: true
            }
        });

        return Response.json({ 
            success: true, 
            message: 'Explorer subscription activated',
            result 
        });
    } catch (error) {
        console.error('Error:', error);
        return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
});