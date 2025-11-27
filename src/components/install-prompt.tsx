"use client";

import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user already dismissed the prompt
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after 3 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[9999] animate-in slide-in-from-bottom-5 duration-500">
      <div className="bg-card border border-border-subtle rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-title-4 text-text-primary font-semibold">Install IQ Option</h3>
              <p className="text-body-3 text-text-secondary">Trade faster with our app</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-body-2 text-text-secondary mb-4">
          Get instant access to live trading charts, real-time notifications, and offline support.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={handleInstall}
            className="flex-1 bg-primary hover:bg-orange-hover text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Install Now
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-3 text-text-secondary hover:text-text-primary transition-colors font-semibold"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}
