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

        // TODO: Integrate with Twilio/SNS for actual SMS sending
        // For now, send email confirmation that SMS is set up
        await base44.integrations.Core.SendEmail({
            to: user.email,
            subject: '📱 SMS Alerts Activated - WanderSure',
            body: `
                <h2 style="color: #2563eb;">📱 SMS Travel Alerts Activated!</h2>
                <p>Hi ${user.full_name || 'Traveler'},</p>
                
                <p>You've successfully activated SMS alerts for your WanderSure account.</p>
                
                <div style="background: #dbeafe; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
                    <strong>Phone Number:</strong> ${phone_number}
                </div>
                
                <p><strong>What to expect:</strong></p>
                <ul>
                    <li>🚨 Critical safety alerts sent instantly via SMS</li>
                    <li>✈️ Major flight delays and cancellations</li>
                    <li>🌪️ Severe weather warnings</li>
                    <li>⚠️ Emergency travel advisories</li>
                </ul>
                
                <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <strong>💡 Pro Tip:</strong> Save this contact in your phone as "WanderSure Alerts" so you'll recognize our messages instantly!
                </div>
                
                <p>SMS alerts are sent only for critical situations to avoid overwhelming you. You'll continue to receive detailed updates via email and in-app notifications.</p>
                
                <p style="color: #666; font-size: 12px; margin-top: 20px;">
                    You can disable SMS alerts anytime from your notification settings.
                </p>
                
                <div style="margin: 20px 0;">
                    <a href="${Deno.env.get('APP_URL')}/NotificationSettings" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Manage Alert Settings</a>
                </div>
            `
        });

        return Response.json({
            success: true,
            message: 'SMS welcome confirmation sent via email'
        });
    } catch (error) {
        console.error('Error sending SMS welcome:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});