// Utility to safely open external links in system browser (not WebView)
// Critical for app store compliance and affiliate link tracking

export const openExternalLink = (url) => {
  // For web apps
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  
  // TODO: When integrating with React Native / mobile wrapper:
  // if (window.ReactNativeWebView) {
  //   window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'OPEN_EXTERNAL_LINK', url }));
  // }
};