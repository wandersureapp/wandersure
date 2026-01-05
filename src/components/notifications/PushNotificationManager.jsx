import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, CheckCircle, AlertCircle } from "lucide-react";
import { subscribePush } from "@/functions/subscribePush";

export default function PushNotificationManager({ onSubscriptionChange }) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkPushSupport();
    checkSubscriptionStatus();
  }, []);

  const checkPushSupport = () => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);
  };

  const checkSubscriptionStatus = async () => {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (err) {
      console.error('Error checking subscription:', err);
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribeToPush = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setError('Notification permission denied');
        setIsLoading(false);
        return;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // Get VAPID public key from environment
      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      
      if (!vapidPublicKey) {
        setError('Push notifications not configured');
        setIsLoading(false);
        return;
      }

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      // Send subscription to backend
      const response = await subscribePush({
        subscription: subscription.toJSON()
      });

      if (response.data.success) {
        setIsSubscribed(true);
        if (onSubscriptionChange) onSubscriptionChange(true);
      }
    } catch (err) {
      console.error('Error subscribing to push:', err);
      setError(err.message || 'Failed to enable push notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribeFromPush = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        setIsSubscribed(false);
        if (onSubscriptionChange) onSubscriptionChange(false);
      }
    } catch (err) {
      console.error('Error unsubscribing:', err);
      setError('Failed to disable push notifications');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-900">Browser Not Supported</p>
            <p className="text-xs text-yellow-700 mt-1">
              Push notifications are not supported in your browser. Try Chrome, Firefox, or Edge.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          {isSubscribed ? (
            <Bell className="w-5 h-5 text-green-600" />
          ) : (
            <BellOff className="w-5 h-5 text-gray-400" />
          )}
          <div>
            <p className="font-medium text-gray-900">Browser Push Notifications</p>
            <p className="text-sm text-gray-600">
              {isSubscribed ? 'You will receive instant alerts' : 'Get real-time alerts on your device'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isSubscribed && (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </Badge>
          )}
          <Button
            size="sm"
            variant={isSubscribed ? "outline" : "default"}
            onClick={isSubscribed ? unsubscribeFromPush : subscribeToPush}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : isSubscribed ? 'Disable' : 'Enable'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {isSubscribed && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✓ You'll receive instant notifications for trip alerts, flight updates, and more
          </p>
        </div>
      )}
    </div>
  );
}