import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { 
  Card, 
  CardContent, 
  //CardDescription, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import { Badge } from '../ui/badge';
import { useNotificationStore } from '../../stores/notification.store';
import { useAuthStore } from '../../stores/auth.store';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAManager: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [swStatus, setSwStatus] = useState<'registering' | 'registered' | 'failed' | 'not-supported'>('registering');
  const { addNotification } = useNotificationStore();
  const { user } = useAuthStore();

  // Service Worker Registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registered:', registration);
          setSwStatus('registered');

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  addNotification({
                    id: `sw-update-${Date.now()}`,
                    userId: user?.id || 'system',
                    title: 'Update Available',
                    message: 'A new version of SNAP is available. Refresh to update.',
                    type: 'system_notification',
                    isRead: false,
                    createdAt: new Date().toISOString(),
                  });
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[PWA] Service Worker registration failed:', error);
          setSwStatus('failed');
        });
    } else {
      setSwStatus('not-supported');
    }
  }, [addNotification]);

  // Install Prompt Handling
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('[PWA] Install prompt available');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log('[PWA] App installed');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);

      addNotification({
        id: `install-success-${Date.now()}`,
        userId: user?.id || 'system',
        title: 'App Installed!',
        message: 'SNAP has been installed successfully. You can now use it offline!',
        type: 'system_notification',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [addNotification]);

  // Online/Offline Detection
  useEffect(() => {
    const handleOnline = () => {
      console.log('[PWA] Back online');
      setIsOnline(true);
      addNotification({
        id: `online-${Date.now()}`,
        userId: user?.id || 'system',
        title: 'Back Online',
        message: 'Your internet connection has been restored.',
        type: 'system_notification',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    };

    const handleOffline = () => {
      console.log('[PWA] Gone offline');
      setIsOnline(false);
      addNotification({
        id: `offline-${Date.now()}`,
        userId: user?.id || 'system',
        title: 'Offline Mode',
        message: 'You are currently offline. Some features may be limited.',
        type: 'system_notification',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addNotification]);

  // Push Notification Permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        addNotification({
          id: `notifications-enabled-${Date.now()}`,
          userId: user?.id || 'system',
          title: 'Notifications Enabled',
          message: 'You will now receive delivery updates and important notifications.',
          type: 'system_notification',
          isRead: false,
          createdAt: new Date().toISOString(),
        });
      }
    }
  };

  // Install App
  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('[PWA] User accepted install prompt');
    } else {
      console.log('[PWA] User dismissed install prompt');
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // Update Service Worker
  const updateServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.update();
      });
    }
  };

  // Get PWA Status
  const getPWAStatus = () => {
    if (isInstalled) return { status: 'installed', color: 'success' as const };
    if (isInstallable) return { status: 'installable', color: 'warning' as const };
    if (!isOnline) return { status: 'offline', color: 'destructive' as const };
    if (swStatus === 'registered') return { status: 'ready', color: 'success' as const };
    if (swStatus === 'failed') return { status: 'error', color: 'destructive' as const };
    return { status: 'loading', color: 'secondary' as const };
  };

  const pwaStatus = getPWAStatus();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {/* PWA Status Indicator */}
      <Card className="w-64 shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">SNAP PWA</CardTitle>
            <Badge variant={pwaStatus.color} className="text-xs">
              {pwaStatus.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Online/Offline Status */}
          <div className="flex items-center justify-between text-xs">
            <span>Connection:</span>
            <Badge variant={isOnline ? 'success' : 'destructive'}>
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>

          {/* Service Worker Status */}
          <div className="flex items-center justify-between text-xs">
            <span>Service Worker:</span>
            <Badge variant={
              swStatus === 'registered' ? 'success' :
              swStatus === 'failed' ? 'destructive' :
              swStatus === 'not-supported' ? 'secondary' : 'warning'
            }>
              {swStatus === 'registered' ? 'Active' :
               swStatus === 'failed' ? 'Failed' :
               swStatus === 'not-supported' ? 'Not Supported' : 'Registering'}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="space-y-1">
            {isInstallable && (
              <Button
                size="sm"
                className="w-full"
                onClick={installApp}
              >
                📱 Install App
              </Button>
            )}

            {isInstalled && (
              <div className="text-xs text-center text-muted-foreground">
                ✓ App Installed
              </div>
            )}

            {'Notification' in window && Notification.permission === 'default' && (
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={requestNotificationPermission}
              >
                🔔 Enable Notifications
              </Button>
            )}

            {'Notification' in window && Notification.permission === 'granted' && (
              <div className="text-xs text-center text-green-600">
                ✓ Notifications Enabled
              </div>
            )}

            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={updateServiceWorker}
            >
              🔄 Check for Updates
            </Button>
          </div>

          {/* Offline Message */}
          {!isOnline && (
            <div className="text-xs text-center text-orange-600 bg-orange-50 p-2 rounded">
              ⚠️ You're offline. Some features may be limited.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};