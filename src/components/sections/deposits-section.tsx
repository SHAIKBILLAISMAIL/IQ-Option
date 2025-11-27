"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface DepositsContent {
    headline: string;
    country: string;
    flagIcon: string;
}

const defaultContent: DepositsContent = {
    headline: "Fast & secure deposits & withdrawals in",
    country: "United States",
    flagIcon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/us-36.svg"
};

const DepositsSection = () => {
    const [content, setContent] = useState<DepositsContent>(defaultContent);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch('/api/homepage-content/deposits');
                if (response.ok) {
                    const data = await response.json();
                    setContent(data.contentData);
                }
            } catch (error) {
                console.error('Failed to fetch deposits content:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, []);

    if (isLoading) {
        return (
            <section className="relative min-h-[600px] overflow-hidden bg-background-deep py-32">
                <div className="container relative z-10 mx-auto max-w-4xl text-center">
                    <div className="h-20 bg-background-mid/50 animate-pulse rounded-lg mb-8 mx-auto max-w-3xl" />
                    <div className="h-16 w-64 bg-background-mid/50 animate-pulse rounded-full mx-auto" />
                </div>
            </section>
        );
    }

    return (
        <section className="relative min-h-[600px] overflow-hidden bg-background-deep py-32">
            {/* Dramatic orange glow from bottom center */}
            <div className="absolute bottom-0 left-1/2 h-[800px] w-[1200px] -translate-x-1/2 rounded-full bg-gradient-radial from-primary/30 via-primary/10 to-transparent blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

            <div className="container relative z-10 mx-auto max-w-4xl text-center">
                <h2 className="mb-8 text-display-2 font-bold leading-tight text-white drop-shadow-lg md:text-display-2">
                    {content.headline}
                </h2>

                {/* Country Badge */}
                <div className="inline-flex items-center gap-3 rounded-full bg-primary/20 px-8 py-4 backdrop-blur-sm">
                    <div className="relative h-8 w-8">
                        <Image
                            src={content.flagIcon}
                            alt={`${content.country} flag`}
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-title-2 font-bold text-primary">
                        {content.country}
                    </span>
                </div>
            </div>
        </section>
    );
};

export default DepositsSection;