"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface BonusCard {
    title: string;
    description: string;
    features: string[];
    ctaText?: string;
    ctaLink?: string;
    mediaType: 'video' | 'image';
    mediaSrc: string;
}

interface BonusesContent {
    headline: string;
    subheadline: string;
    cards: BonusCard[];
}

const CheckmarkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 h-6 w-6">
    <path d="M16.4709 8.49508L10.5979 14.3681L7.5293 11.2995C7.22765 10.9979 6.73809 10.9979 6.43644 11.2995C6.13479 11.6012 6.13479 12.0907 6.43644 12.3924L9.94154 15.8975C10.2432 16.2007 10.7312 16.1991 11.0313 15.8975L17.5636 9.36526C17.8652 9.06361 17.8652 8.57405 17.5636 8.2724C17.2619 7.97075 16.7725 7.97075 16.4709 8.49508Z" fill="currentColor"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5C6.20101 1.5 1.5 6.20101 1.5 12C1.5 17.799 6.20101 22.5 12 22.5Z" fill="currentColor"/>
  </svg>
);

const defaultContent: BonusesContent = {
    headline: "Advantages & special bonuses",
    subheadline: "Unlock special rewards to keep your trading going strong — from welcome boosters to trade insurance.",
    cards: [
        {
            title: "Extra benefits & rewards",
            description: "Enjoy exclusive perks that enhance your strategy and profits.",
            features: ["Deposit bonuses", "Risk-free trades", "No deposit bonuses"],
            mediaType: "video",
            mediaSrc: "https://static.cdnroute.io/_assets/videos/advantages/hand_mobile.webm"
        },
        {
            title: "Trade on VIP terms",
            description: "Elevate your trading with special VIP advantages.",
            features: ["1.5x Profitability", "Expert strategies"],
            ctaText: "Become a VIP",
            ctaLink: "#",
            mediaType: "image",
            mediaSrc: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/images/images_9.png"
        },
        {
            title: "Compete for grand cash prizes in tournaments",
            description: "Put your skills to the test in our trading competitions. Trade, climb the leaderboard, and win!",
            features: ["No entry fees", "Prize pool up to $250,000"],
            ctaText: "Participate",
            ctaLink: "#",
            mediaType: "video",
            mediaSrc: "https://static.cdnroute.io/_assets/videos/advantages/tournaments.webm"
        }
    ]
};

const BonusesSection = () => {
    const [content, setContent] = useState<BonusesContent>(defaultContent);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch('/api/homepage-content/bonuses');
                if (response.ok) {
                    const data = await response.json();
                    setContent(data.contentData);
                }
            } catch (error) {
                console.error('Failed to fetch bonuses content:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, []);

    if (isLoading) {
        return (
            <section className="bg-background-deep py-24 px-6 xl:px-0">
                <div className="container mx-auto">
                    <div className="mb-12 max-w-2xl">
                        <div className="h-20 bg-background-mid/50 animate-pulse rounded-lg mb-4" />
                        <div className="h-12 bg-background-mid/50 animate-pulse rounded-lg" />
                    </div>
                    <div className="flex flex-col gap-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-[460px] bg-card/50 animate-pulse rounded-[24px]" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-background-deep py-24 px-6 xl:px-0">
            <div className="container mx-auto">
                <div className="mb-12 max-w-2xl text-center mx-auto lg:text-left lg:mx-0">
                    <h2 className="text-display-2 text-text-primary mb-4">
                        {content.headline}
                    </h2>
                    <p className="text-body-1 text-text-secondary">
                        {content.subheadline}
                    </p>
                </div>

                <div className="flex flex-col gap-8">
                    {content.cards.map((card, index) => (
                        <div key={index} className="relative bg-card rounded-[24px] overflow-hidden border border-border-subtle flex flex-col lg:flex-row min-h-[460px]">
                            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 100% 0, rgba(255, 133, 22, 0.15) 0, rgba(0, 0, 0, 0) 35%)" }}></div>
                            <div className="p-12 lg:w-[580px] shrink-0 z-10 flex flex-col justify-center">
                                <h3 className="text-display-4 text-text-primary mb-4">{card.title}</h3>
                                <p className="text-body-2 text-text-secondary mb-8">{card.description}</p>
                                <ul className="space-y-4 mb-8">
                                    {card.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center gap-3 text-success-green">
                                            <CheckmarkIcon />
                                            <span className="text-title-4 text-text-primary">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                {card.ctaText && (
                                    <a href={card.ctaLink} className="inline-flex items-center gap-2 text-button-md font-semibold text-primary hover:text-orange-hover transition-colors">
                                        {card.ctaText}
                                        <ChevronRight className="h-4 w-4" />
                                    </a>
                                )}
                            </div>
                            <div className="relative flex-1 flex items-end justify-center lg:justify-start">
                                {card.mediaType === 'video' ? (
                                    <video
                                        className={`w-full max-w-[450px] lg:max-w-none ${index === 0 ? 'lg:w-[600px] lg:absolute lg:bottom-0 lg:-right-[130px]' : index === 2 ? 'lg:w-[610px] lg:absolute lg:bottom-[-50px] lg:-right-[25px]' : ''}`}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        src={card.mediaSrc}
                                    />
                                ) : (
                                    <div className="relative flex-1 flex items-center justify-center w-full p-8 lg:p-0">
                                        <Image 
                                            src={card.mediaSrc}
                                            alt={card.title}
                                            width={320} 
                                            height={290} 
                                            className="object-contain"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BonusesSection;