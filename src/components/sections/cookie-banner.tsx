'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CookieBanner = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = document.cookie.split('; ').find(row => row.startsWith('cookie_consent='));
    if (!consent) {
      setIsMounted(true);
      const timer = setTimeout(() => {
        setIsVisible(true); // Trigger fade-in
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false); // Trigger fade-out
    document.cookie = "cookie_consent=true; path=/; max-age=31536000; SameSite=Lax";
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`
        fixed bottom-0 left-0 w-full z-[999] bg-background-mid border-t border-white/10
        transition-opacity duration-500 ease-in-out
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      role="dialog"
      aria-labelledby="cookie-heading"
      aria-describedby="cookie-description"
      aria-hidden={!isVisible}
    >
      <div className="container container-text mx-auto flex items-center justify-between py-5">
        <p id="cookie-description" className="text-sm text-text-primary">
          <span id="cookie-heading" className="sr-only">Cookie Consent</span>
          By continuing to use this site, you agree to our{' '}
          <a
            href="https://iqoption.com/privacy-policy"
            className="font-semibold text-primary hover:text-orange-hover hover:underline"
          >
            Cookie Policy
          </a>
          .
        </p>
        <button
          onClick={handleClose}
          className="ml-4 flex shrink-0 items-center gap-2 text-sm font-semibold text-text-primary transition-colors hover:text-primary"
          aria-label="Close cookie consent banner"
        >
          Close
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;