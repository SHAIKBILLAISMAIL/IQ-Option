"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RegistrationModal from './registration-modal';
import { useSession } from '@/lib/auth-client';

interface HeroContent {
    headline: string;
    subheadline: string;
    traders: string;
    countries: string;
    trustpilotRating: string;
    ctaPrimary: string;
    ctaSecondary: string;
}

const defaultContent: HeroContent = {
    headline: "12 years of launching trading careers",
    subheadline: "Join IQ Option — the first-choice broker for",
    traders: "170 172 081 traders",
    countries: "160 countries",
    trustpilotRating: "4.5",
    ctaPrimary: "Create an account",
    ctaSecondary: "Try free demo"
};

const HeroSection = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: session, isPending } = useSession();
    const [content, setContent] = useState<HeroContent>(defaultContent);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const timestamp = new Date().getTime();
                const response = await fetch(`/api/homepage-content/hero?t=${timestamp}`, {
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.contentData) {
                        setContent(data.contentData);
                    }
                }
            } catch (error) {
                // Silently fail and use default content
                console.error('Failed to fetch hero content:', error);
            }
        };

        fetchContent();

        // Auto-refresh every 5 seconds to show admin changes
        const interval = setInterval(fetchContent, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <section className="relative overflow-hidden px-6 pb-20 pt-32 md:pb-32 md:pt-40">
                {/* Background gradient effects */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-deep/50 to-background-deep" />
                <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

                <div className="container relative z-10 mx-auto max-w-7xl">
                    {/* Text Content */}
                    <div className="mx-auto max-w-4xl text-center">
                        <h1 className="mb-6 text-display-1 font-bold leading-tight text-white md:text-display-1">
                            {content.headline}
                        </h1>
                        <p className="mb-8 text-body-1 text-text-secondary md:text-title-4">
                            {content.subheadline}{' '}
                            <span className="font-semibold text-white">{content.traders}</span> across{' '}
                            <span className="font-semibold text-white">{content.countries}</span>
                        </p>

                        {/* CTA Buttons */}
                        <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            {!isPending && session?.user ? (
                                <Link
                                    href="/trade"
                                    className="w-full rounded-lg bg-primary px-8 py-4 text-center font-sans text-button-lg font-semibold text-primary-foreground transition-all duration-300 hover:bg-orange-hover hover:shadow-lg sm:w-auto"
                                >
                                    Go to Trading Platform
                                </Link>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="w-full rounded-lg bg-primary px-8 py-4 font-sans text-button-lg font-semibold text-primary-foreground transition-all duration-300 hover:bg-orange-hover hover:shadow-lg sm:w-auto"
                                    >
                                        {content.ctaPrimary}
                                    </button>
                                    <Link
                                        href="/trade"
                                        className="w-full rounded-lg border border-border-medium bg-transparent px-8 py-4 text-center font-sans text-button-lg font-semibold text-white transition-all duration-300 hover:border-primary hover:bg-primary/10 sm:w-auto"
                                    >
                                        {content.ctaSecondary}
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Trustpilot Badge */}
                        <div className="flex items-center justify-center gap-2">
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Image
                                        key={i}
                                        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/trustpilot-star-15.svg"
                                        alt="star"
                                        width={20}
                                        height={20}
                                    />
                                ))}
                            </div>
                            <span className="text-body-2 text-text-secondary">
                                <span className="font-semibold text-white">{content.trustpilotRating}</span> on Trustpilot
                            </span>
                        </div>
                    </div>

                    {/* Trading Interface Mockup */}
                    <div className="relative mx-auto mt-16 max-w-5xl">
                        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border-subtle bg-background-mid shadow-2xl">
                            <Image
                                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/images/images_1.png"
                                alt="Trading Platform Interface"
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* Profit indicator overlay */}
                            <div className="absolute right-8 top-8 rounded-lg bg-success-green/90 px-6 py-3 backdrop-blur-sm">
                                <span className="text-title-3 font-bold text-white">+$342</span>
                            </div>
                        </div>

                        {/* Floating elements for depth */}
                        <div className="absolute -left-4 top-1/4 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
                        <div className="absolute -right-4 bottom-1/4 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
                    </div>
                </div>
            </section>

            {/* Registration Modal */}
            {isModalOpen && <RegistrationModal onClose={() => setIsModalOpen(false)} />}
        </>
    );
};

export default HeroSection;