
// Utility to safely open external links in system browser (not WebView)
// Critical for app store compliance and affiliate link tracking

export const openExternalLink = (url) => {
  // Check if running inside React Native WebView
  if (typeof window !== 'undefined' && window.ReactNativeWebView) {
    // Signal the native wrapper to open URL in system browser
    window.ReactNativeWebView.postMessage(JSON.stringify({ 
      type: 'OPEN_EXTERNAL_LINK', 
      url: url 
    }));
  } else if (typeof window !== 'undefined') {
    // Fallback for web - open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
