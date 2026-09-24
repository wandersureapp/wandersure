// Stripe webhook disabled for app store compliance
// This function will be replaced with Apple/Google receipt validation

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    const base44 = createClientFromRequest(req);
    
    // Stripe webhook functionality temporarily disabled for app store submission
    console.log('Stripe webhook called but disabled for app store compliance');
    
    return Response.json({ 
        received: true,
        message: 'Webhook disabled - app store compliance' 
    });
});