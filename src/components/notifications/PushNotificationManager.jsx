import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, CheckCircle, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function PushNotificationManager() {
  const [pushSupported, setPushSupported] = useState(false);
  const [pushPermission, setPushPermission] = useState("default");
  const queryClient = useQueryClient();

  useEffect(() => {
    // Check if push notifications are supported
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setPushSupported(true);
      setPushPermission(Notification.permission);
    }
  }, []);

  const { data: subscriptions = [] } = useQuery({
    queryKey: ['push-subscriptions'],
    queryFn: () => base44.entities.PushSubscription.list(),
    enabled: pushSupported
  });

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      // Request notification permission
      const permission = await Notification.requestPermission();
      setPushPermission(permission);

      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Get VAPID public key from environment
      const vapidPublicKey = 'BNxVHwXdHfL2R7OI7UF5tPAhBSAcPq7VJ8_TYTxlW1BvQZVvFn0D6qJ-Xm8zqhZ1pKQMCZEe3VgWx4YnPqK8rXQ';

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      // Get user info
      const user = await base44.auth.me();

      // Save subscription to database
      await base44.entities.PushSubscription.create({
        user_email: user.email,
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')))),
          auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth'))))
        },
        device_info: navigator.userAgent
      });

      return subscription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['push-subscriptions'] });
    }
  });

  const unsubscribeMutation = useMutation({
    mutationFn: async () => {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        
        // Remove from database
        const currentSubscription = subscriptions.find(sub => sub.endpoint === subscription.endpoint);
        if (currentSubscription) {
          await base44.entities.PushSubscription.delete(currentSubscription.id);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['push-subscriptions'] });
    }
  });

  const handleTogglePush = async () => {
    if (subscriptions.length > 0) {
      unsubscribeMutation.mutate();
    } else {
      subscribeMutation.mutate();
    }
  };

  if (!pushSupported) {
    return (
      <div className="p-4 bg-gray-100 border-2 border-gray-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-gray-500 mt-1" />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">Browser Notifications</h4>
            <p className="text-sm text-gray-600">
              Push notifications are not supported in your browser
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
      <div className="flex items-start gap-3">
        <Bell className="w-5 h-5 text-purple-600 mt-1" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">Browser Push Notifications</h4>
            {subscriptions.length > 0 && (
              <Badge className="bg-green-600 text-white text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Get instant alerts even when you're not on WanderSure
          </p>
          <Button
            size="sm"
            variant={subscriptions.length > 0 ? "outline" : "default"}
            className={subscriptions.length > 0 ? "border-purple-600 text-purple-600" : "bg-purple-600 hover:bg-purple-700"}
            onClick={handleTogglePush}
            disabled={subscribeMutation.isPending || unsubscribeMutation.isPending}
          >
            {subscribeMutation.isPending || unsubscribeMutation.isPending ? (
              "Processing..."
            ) : subscriptions.length > 0 ? (
              <>
                <BellOff className="w-4 h-4 mr-2" />
                Disable Push
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 mr-2" />
                Enable Push
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
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
}