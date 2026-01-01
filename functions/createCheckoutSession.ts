import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { priceId, plan, productId } = await req.json();

        if (!priceId) {
            return Response.json({ error: 'Price ID required' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            customer_email: user.email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: productId ? 'payment' : 'subscription',
            success_url: productId 
                ? `${req.headers.get('origin')}/TravelAides?success=true`
                : `${req.headers.get('origin')}/NotificationSettings?success=true`,
            cancel_url: productId
                ? `${req.headers.get('origin')}/TravelAides?canceled=true`
                : `${req.headers.get('origin')}/NotificationSettings?canceled=true`,
            metadata: {
                user_email: user.email,
                plan: plan || 'premium',
                product_id: productId || ''
            }
        });

        return Response.json({ url: session.url });
    } catch (error) {
        console.error('Stripe checkout error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});