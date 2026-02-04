import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

// Check if request is from native app
function isNativeApp(req) {
  const userAgent = req.headers.get('user-agent') || '';
  return userAgent.includes('WanderSure') || userAgent.includes('ReactNativeWebView');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Block checkout from native apps - they should use IAP
    if (isNativeApp(req)) {
      return Response.json({ 
        error: 'Please use in-app purchase from the mobile app',
        requiresNativeIAP: true
      }, { status: 400 });
    }

    const { productType, productId, tripId, priceAmount } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: productType,
          },
          unit_amount: Math.round(priceAmount * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${Deno.env.get('APP_URL')}/TripDetail?id=${tripId}&payment=success`,
      cancel_url: `${Deno.env.get('APP_URL')}/TravelAides?payment=cancelled`,
      metadata: {
        user_email: user.email,
        product_type: productType,
        product_id: productId,
        trip_id: tripId || ''
      }
    });

    return Response.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return Response.json({ 
      error: error.message || 'Failed to create checkout session'
    }, { status: 500 });
  }
});