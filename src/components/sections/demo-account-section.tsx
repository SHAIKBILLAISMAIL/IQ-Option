"use client";

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';

interface DemoAccountContent {
    headline: string;
    demoAmount: string;
    feature1: string;
    feature2: string;
    ctaText: string;
}

const defaultContent: DemoAccountContent = {
    headline: "Trade live charts with virtual funds",
    demoAmount: "$10,000",
    feature1: "$10,000 preloaded in your demo account",
    feature2: "Unlimited balance refills at any time",
    ctaText: "Try demo account"
};

const DemoAccountSection = () => {
    const [content, setContent] = useState<DemoAccountContent>(defaultContent);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch('/api/homepage-content/demo_account');
                if (response.ok) {
                    const data = await response.json();
                    setContent(data.contentData);
                }
            } catch (error) {
                console.error('Failed to fetch demo account content:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, []);

    if (isLoading) {
        return (
            <section className="relative overflow-hidden bg-background-deep py-32">
                <div className="container relative z-10 mx-auto max-w-4xl text-center">
                    <div className="h-16 bg-background-mid/50 animate-pulse rounded-lg mb-12 mx-auto max-w-2xl" />
                    <div className="h-32 bg-background-mid/50 animate-pulse rounded-lg mb-12" />
                    <div className="space-y-4 mb-12">
                        <div className="h-8 bg-background-mid/50 animate-pulse rounded-lg" />
                        <div className="h-8 bg-background-mid/50 animate-pulse rounded-lg" />
                    </div>
                    <div className="h-14 w-64 bg-background-mid/50 animate-pulse rounded-lg mx-auto" />
                </div>
            </section>
        );
    }

    return (
        <section className="relative overflow-hidden bg-background-deep py-32">
            {/* Background glow effects */}
            <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute left-1/4 top-1/4 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

            <div className="container relative z-10 mx-auto max-w-4xl text-center">
                {/* Headline */}
                <h2 className="mb-12 text-display-2 font-bold text-white">
                    {content.headline}
                </h2>

                {/* Animated Counter */}
                <div className="mb-12">
                    <div className="inline-block rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 px-16 py-12 backdrop-blur-sm">
                        <div className="font-mono text-[80px] font-extrabold leading-none tracking-tight text-primary md:text-[120px]">
                            {content.demoAmount}
                        </div>
                    </div>
                </div>

                {/* Feature bullets */}
                <div className="mb-12 space-y-6">
                    <div className="flex items-center justify-center gap-4 text-left">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-success-green/20">
                            <Check className="h-5 w-5 text-success-green" />
                        </div>
                        <span className="text-body-1 text-white">
                            {content.feature1}
                        </span>
                    </div>
                    <div className="flex items-center justify-center gap-4 text-left">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-success-green/20">
                            <Check className="h-5 w-5 text-success-green" />
                        </div>
                        <span className="text-body-1 text-white">
                            {content.feature2}
                        </span>
                    </div>
                </div>

                {/* CTA Button */}
                <Link
                    href="/trade"
                    className="inline-block rounded-lg bg-primary px-8 py-4 font-sans text-button-lg font-semibold text-primary-foreground transition-all duration-300 hover:bg-orange-hover hover:shadow-lg"
                >
                    {content.ctaText}
                </Link>
            </div>
        </section>
    );
};

export default DemoAccountSection;