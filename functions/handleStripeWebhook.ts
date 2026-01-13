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

    console.log('Webhook received event type:', event.type);
    
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log('Checkout session completed:', {
            session_id: session.id,
            customer_email: session.customer_email,
            customer_details: session.customer_details,
            metadata: session.metadata,
            amount_total: session.amount_total,
            payment_status: session.payment_status,
            mode: session.mode,
            line_items: session.line_items
        });
        
        const userEmail = session.metadata?.user_email || session.customer_details?.email || session.customer_email;
        let paymentType = session.metadata?.payment_type;
        const tripId = session.metadata?.trip_id;

        // Detect payment type from session mode if not in metadata
        if (!paymentType) {
            if (session.mode === 'subscription') {
                paymentType = 'subscription';
            } else if (session.mode === 'payment') {
                // Check amount to determine if it's a trip purchase
                const amount = session.amount_total / 100;
                if (amount === 19.99 || amount === 29.99) {
                    paymentType = 'one_time_trip';
                } else {
                    paymentType = 'one_time_product';
                }
            }
        }

        console.log('Extracted data:', { userEmail, paymentType, tripId, mode: session.mode, amount: session.amount_total / 100 });

        if (!userEmail) {
            console.error('No user email found in session');
            return Response.json({ error: 'No user email' }, { status: 400 });
        }

        try {
            // Handle one-time trip purchase
            if (paymentType === 'one_time_trip' && tripId) {
                console.log('Processing one-time trip purchase for trip:', tripId);
                const trips = await base44.asServiceRole.entities.Trip.filter({ id: tripId });
                if (trips.length === 0) {
                    console.error('Trip not found:', tripId);
                    return Response.json({ error: 'Trip not found' }, { status: 404 });
                }
                
                const trip = trips[0];
                const plan = session.metadata.plan || 'explorer';
                const accessEndDate = new Date(trip.end_date);
                accessEndDate.setDate(accessEndDate.getDate() + 3);

                console.log('Creating TripAccess record:', {
                    trip_id: tripId,
                    user_email: userEmail,
                    access_level: plan === 'globetrotter' ? 'globetrotter' : 'explorer',
                    payment_type: 'one_time',
                    amount_paid: session.amount_total / 100,
                    access_end_date: accessEndDate.toISOString()
                });

                const accessRecord = await base44.asServiceRole.entities.TripAccess.create({
                    trip_id: tripId,
                    user_email: userEmail,
                    access_level: plan === 'globetrotter' ? 'globetrotter' : 'explorer',
                    payment_type: 'one_time',
                    amount_paid: session.amount_total / 100,
                    stripe_payment_intent: session.payment_intent,
                    access_start_date: new Date().toISOString(),
                    access_end_date: accessEndDate.toISOString()
                });

                console.log(`✅ TripAccess record created successfully:`, accessRecord);
                console.log(`One-time ${plan} access activated for trip ${tripId} for ${userEmail}`);
                return Response.json({ received: true, access_granted: true });
            }

            // Handle subscription purchase
            if (paymentType === 'subscription' || session.mode === 'subscription') {
                console.log('Processing subscription purchase...');
                const prefs = await base44.asServiceRole.entities.UserNotificationPreferences.filter({
                    user_email: userEmail
                });

                // Determine plan from metadata or amount
                let plan = session.metadata?.plan;
                if (!plan) {
                    const amount = session.amount_total / 100;
                    // Monthly: $9.99 = explorer, $19.99 = globetrotter
                    // Yearly: $94.99 = explorer, $180 = globetrotter
                    if (amount === 19.99 || amount === 180) {
                        plan = 'globetrotter';
                    } else {
                        plan = 'explorer';
                    }
                }

                console.log('Determined plan:', plan);
                
                const subscriptionTier = plan === 'globetrotter' ? 'elite' : 'premium';
                
                if (prefs.length > 0) {
                    console.log('Updating existing preferences for:', userEmail);
                    await base44.asServiceRole.entities.UserNotificationPreferences.update(prefs[0].id, {
                        subscription_tier: subscriptionTier,
                        sms_enabled: plan === 'globetrotter'
                    });
                } else {
                    console.log('Creating new preferences for:', userEmail);
                    await base44.asServiceRole.entities.UserNotificationPreferences.create({
                        user_email: userEmail,
                        subscription_tier: subscriptionTier,
                        sms_enabled: plan === 'globetrotter',
                        email_enabled: true,
                        in_app_enabled: true,
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

                console.log(`✅ ${plan === 'globetrotter' ? 'Globetrotter (Elite)' : 'Explorer (Premium)'} subscription activated for ${userEmail}`);
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            return Response.json({ error: 'Processing failed' }, { status: 500 });
        }
    }

    return Response.json({ received: true });
});