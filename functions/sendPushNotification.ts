import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import webpush from 'npm:web-push@3.6.7';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Admin only function for sending push notifications
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { userEmail, title, body, data } = await req.json();

    // Configure VAPID
    webpush.setVapidDetails(
      `mailto:${Deno.env.get('VAPID_EMAIL')}`,
      Deno.env.get('VAPID_PUBLIC_KEY'),
      Deno.env.get('VAPID_PRIVATE_KEY')
    );

    // Get user's push subscriptions
    const subscriptions = await base44.asServiceRole.entities.PushSubscription.filter({
      user_email: userEmail
    });

    const results = [];
    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: sub.keys
          },
          JSON.stringify({
            title,
            body,
            data: data || {},
            icon: '/icon-192.png',
            badge: '/badge-72.png'
          })
        );
        results.push({ endpoint: sub.endpoint, success: true });
      } catch (error) {
        // If subscription is invalid, delete it
        if (error.statusCode === 410 || error.statusCode === 404) {
          await base44.asServiceRole.entities.PushSubscription.delete(sub.id);
        }
        results.push({ endpoint: sub.endpoint, success: false, error: error.message });
      }
    }

    return Response.json({ success: true, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});