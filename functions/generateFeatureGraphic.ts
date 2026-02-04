import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const result = await base44.integrations.Core.GenerateImage({
      prompt: "Professional app store feature graphic for WanderSure travel intelligence app, 1024x500px landscape format. Modern gradient background flowing from blue (#3b82f6) to teal (#14b8a6). Center composition featuring: WanderSure logo with shield and airplane icon, smartphone mockup displaying risk assessment dashboard with colorful gauges (green/yellow/red), floating notification cards showing 'Flight Alert' and 'Weather Warning', miniature world map with glowing location pins, small weather icons (sun, clouds, storm), security badge icons. Professional sans-serif typography showing 'WanderSure' and tagline 'AI-Powered Travel Intelligence'. Clean, modern UI aesthetic with subtle shadows and depth. High quality digital illustration, app store marketing banner style, wide cinematic composition"
    });

    return Response.json({ 
      success: true,
      image_url: result.url 
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});