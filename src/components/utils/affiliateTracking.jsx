// Affiliate tracking utility for partner referrals

const AFFILIATE_PARAMS = {
  worldnomads: "ref=wandersure",
  allianz: "utm_source=wandersure&utm_medium=referral",
  travelguard: "partner=wandersure",
  sevencorners: "ref=wandersure"
};

/**
 * Adds affiliate tracking parameters to provider URLs
 * @param {string} baseUrl - The provider's base URL
 * @param {string} providerKey - Key to identify the provider (lowercase, no spaces)
 * @param {object} additionalParams - Additional tracking parameters (tripId, userId, etc)
 */
export function buildAffiliateUrl(baseUrl, providerKey, additionalParams = {}) {
  try {
    const url = new URL(baseUrl);
    
    // Add provider-specific affiliate parameters
    const affiliateParam = AFFILIATE_PARAMS[providerKey.toLowerCase().replace(/\s+/g, '')];
    if (affiliateParam) {
      const params = new URLSearchParams(affiliateParam);
      params.forEach((value, key) => {
        url.searchParams.set(key, value);
      });
    }
    
    // Add additional tracking parameters
    Object.entries(additionalParams).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });
    
    return url.toString();
  } catch (error) {
    console.error('Error building affiliate URL:', error);
    return baseUrl;
  }
}

/**
 * Tracks affiliate link clicks (can be extended with analytics)
 * @param {string} providerName - Name of the provider
 * @param {string} tripId - Associated trip ID
 * @param {number} estimatedPremium - Estimated quote amount
 */
export function trackAffiliateClick(providerName, tripId, estimatedPremium) {
  // Log click event (can be extended to send to analytics service)
  console.log('Affiliate click:', {
    provider: providerName,
    tripId,
    estimatedPremium,
    timestamp: new Date().toISOString()
  });
  
  // This is where you'd integrate with analytics services like:
  // - Google Analytics
  // - Mixpanel
  // - Segment
  // - Your own backend analytics endpoint
  
  // Example: window.gtag && window.gtag('event', 'affiliate_click', { ... })
}

export default {
  buildAffiliateUrl,
  trackAffiliateClick
};