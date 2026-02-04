/**
 * Trigger native haptic feedback
 * @param {string} type - Type of haptic feedback ('light', 'medium', 'heavy', 'success', 'warning', 'error')
 */
export function triggerHaptic(type = 'light') {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'HAPTIC_FEEDBACK',
      feedbackType: type
    }));
  }
}