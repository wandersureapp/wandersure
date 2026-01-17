import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { phone_number } = await req.json();

        if (!phone_number) {
            return Response.json({ error: 'phone_number is required' }, { status: 400 });
        }

        // Send actual SMS via Twilio
        const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
        const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
        const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

        const message = `Welcome to WanderSure! 🌍 You'll receive critical travel alerts at this number. Save us as "WanderSure Alerts" for instant recognition. Reply STOP to unsubscribe.`;

        const twilioResponse = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
            {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    To: phone_number,
                    From: fromNumber,
                    Body: message
                })
            }
        );

        if (!twilioResponse.ok) {
            const error = await twilioResponse.text();
            throw new Error(`Twilio error: ${error}`);
        }

        return Response.json({
            success: true,
            message: 'SMS welcome message sent successfully'
        });
    } catch (error) {
        console.error('Error sending SMS welcome:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});