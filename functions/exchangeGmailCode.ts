import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { code } = await req.json();

        if (!code) {
            return Response.json({ error: 'Authorization code required' }, { status: 400 });
        }

        const clientId = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID');
        const clientSecret = Deno.env.get('google_oauth_client_secret');
        const appUrl = Deno.env.get('APP_URL');
        const redirectUri = `${appUrl}/GmailCallback`;

        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            })
        });

        const tokens = await tokenResponse.json();

        if (!tokenResponse.ok) {
            return Response.json({ error: 'Failed to exchange code', details: tokens }, { status: 400 });
        }

        // Store tokens in user data
        await base44.auth.updateMe({
            gmail_access_token: tokens.access_token,
            gmail_refresh_token: tokens.refresh_token,
            gmail_token_expiry: Date.now() + (tokens.expires_in * 1000)
        });

        return Response.json({
            success: true,
            message: 'Gmail access granted'
        });

    } catch (error) {
        console.error('Gmail token exchange error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});