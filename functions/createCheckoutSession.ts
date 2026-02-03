// Stripe checkout disabled for app store compliance
// This function will be replaced with Apple In-App Purchases / Google Play Billing

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Stripe functionality temporarily disabled for app store submission
        return Response.json({ 
            error: 'Purchases temporarily unavailable. In-app purchases coming soon!' 
        }, { status: 503 });
    } catch (error) {
        console.error('Checkout error:', error);
        return Response.json({ 
            error: 'Service unavailable'
        }, { status: 503 });
    }
});