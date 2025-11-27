'use client';

import { Suspense, lazy } from 'react';

// Lazy load sections with fallback
const HeaderNavigation = lazy(() => import('@/components/sections/header-navigation').catch(() => import('@/components/ErrorFallback')));
const TickerBanner = lazy(() => import('@/components/sections/ticker-banner').catch(() => import('@/components/ErrorFallback')));
const HeroSection = lazy(() => import('@/components/sections/hero-section').catch(() => import('@/components/ErrorFallback')));
const AwardsSection = lazy(() => import('@/components/sections/awards-section').catch(() => import('@/components/ErrorFallback')));
const McLarenPartnership = lazy(() => import('@/components/sections/mclaren-partnership').catch(() => import('@/components/ErrorFallback')));
const VideoHeroSection = lazy(() => import('@/components/sections/video-hero-section').catch(() => import('@/components/ErrorFallback')));
const TimelineSection = lazy(() => import('@/components/sections/timeline-section').catch(() => import('@/components/ErrorFallback')));
const TechFeaturesSection = lazy(() => import('@/components/sections/tech-features-section').catch(() => import('@/components/ErrorFallback')));
const DemoAccountSection = lazy(() => import('@/components/sections/demo-account-section').catch(() => import('@/components/ErrorFallback')));
const BonusesSection = lazy(() => import('@/components/sections/bonuses-section').catch(() => import('@/components/ErrorFallback')));
const DepositsSection = lazy(() => import('@/components/sections/deposits-section').catch(() => import('@/components/ErrorFallback')));
const TestimonialsSection = lazy(() => import('@/components/sections/testimonials-section').catch(() => import('@/components/ErrorFallback')));
const Footer = lazy(() => import('@/components/sections/footer').catch(() => import('@/components/ErrorFallback')));
const CookieBanner = lazy(() => import('@/components/sections/cookie-banner').catch(() => import('@/components/ErrorFallback')));

// Simple loading fallback
function LoadingSection() {
  return <div className="h-24 w-full bg-background-mid/20" />;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background-deep">
      <Suspense fallback={<LoadingSection />}>
        <HeaderNavigation />
      </Suspense>
      
      <Suspense fallback={<LoadingSection />}>
        <TickerBanner />
      </Suspense>
      
      <main>
        <Suspense fallback={<LoadingSection />}>
          <HeroSection />
        </Suspense>
        
        <Suspense fallback={<LoadingSection />}>
          <AwardsSection />
        </Suspense>
        
        <Suspense fallback={<LoadingSection />}>
          <McLarenPartnership />
        </Suspense>
        
        <Suspense fallback={<LoadingSection />}>
          <VideoHeroSection />
        </Suspense>
        
        <Suspense fallback={<LoadingSection />}>
          <TimelineSection />
        </Suspense>
        
        <Suspense fallback={<LoadingSection />}>
          <TechFeaturesSection />
        </Suspense>
        
        <Suspense fallback={<LoadingSection />}>
          <DemoAccountSection />
        </Suspense>
        
        <Suspense fallback={<LoadingSection />}>
          <BonusesSection />
        </Suspense>
        
        <Suspense fallback={<LoadingSection />}>
          <DepositsSection />
        </Suspense>
        
        <Suspense fallback={<LoadingSection />}>
          <TestimonialsSection />
        </Suspense>
      </main>

      <Suspense fallback={<LoadingSection />}>
        <Footer />
      </Suspense>
      
      <Suspense fallback={<LoadingSection />}>
        <CookieBanner />
      </Suspense>
    </div>
  );
}