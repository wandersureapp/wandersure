import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const clientId = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID');
        const appUrl = Deno.env.get('APP_URL') || 'https://wandersure.base44.app';
        const redirectUri = `${appUrl}/GmailCallback`;
        const scope = 'https://www.googleapis.com/auth/gmail.readonly';

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${encodeURIComponent(clientId)}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&response_type=code` +
            `&scope=${encodeURIComponent(scope)}` +
            `&access_type=offline` +
            `&state=${user.email}`;

        return Response.json({ authUrl });

    } catch (error) {
        console.error('Gmail auth URL error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});