import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
    const base44 = createClientFromRequest(req);
    
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    let event;
    try {
        event = await stripe.webhooks.constructEventAsync(
            body,
            signature,
            Deno.env.get('STRIPE_WEBHOOK_SECRET')
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userEmail = session.metadata.user_email;

        try {
            const prefs = await base44.asServiceRole.entities.UserNotificationPreferences.filter({
                user_email: userEmail
            });

            if (prefs.length > 0) {
                await base44.asServiceRole.entities.UserNotificationPreferences.update(prefs[0].id, {
                    premium_subscription: true,
                    sms_enabled: true
                });
            } else {
                await base44.asServiceRole.entities.UserNotificationPreferences.create({
                    user_email: userEmail,
                    premium_subscription: true,
                    sms_enabled: true,
                    email_enabled: true,
                    in_app_enabled: true
                });
            }

            console.log(`Premium activated for ${userEmail}`);
        } catch (error) {
            console.error('Error updating user preferences:', error);
            return Response.json({ error: 'Database update failed' }, { status: 500 });
        }
    }

    return Response.json({ received: true });
});