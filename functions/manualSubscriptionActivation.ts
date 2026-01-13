import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (user?.role !== 'admin') {
            return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        const { user_email, subscription_tier } = await req.json();

        if (!user_email || !subscription_tier) {
            return Response.json({ error: 'user_email and subscription_tier required' }, { status: 400 });
        }

        const prefs = await base44.asServiceRole.entities.UserNotificationPreferences.filter({
            user_email: user_email
        });

        let result;
        if (prefs.length > 0) {
            result = await base44.asServiceRole.entities.UserNotificationPreferences.update(prefs[0].id, {
                subscription_tier: subscription_tier,
                sms_enabled: subscription_tier === 'elite',
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
        } else {
            result = await base44.asServiceRole.entities.UserNotificationPreferences.create({
                user_email: user_email,
                subscription_tier: subscription_tier,
                email_enabled: true,
                in_app_enabled: true,
                sms_enabled: subscription_tier === 'elite',
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
        }

        return Response.json({ 
            success: true, 
            message: `${subscription_tier} subscription activated for ${user_email}`,
            result 
        });
    } catch (error) {
        console.error('Error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});