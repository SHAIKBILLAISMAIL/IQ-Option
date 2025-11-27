'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Tab {
    id: string;
    label: string;
    title: string;
    description: string;
}

interface TechFeaturesContent {
    headline: string;
    subheadline: string;
    chartImage: string;
    tabs: Tab[];
    ctaText: string;
}

const defaultContent: TechFeaturesContent = {
    headline: "Our best tech — for your comfort",
    subheadline: "Make sense of those charts with live strategies, pro-level tools, and expert-backed insights.",
    chartImage: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/images/images_7.png",
    tabs: [
        {
            id: 'live-strategies',
            label: 'Live Strategies',
            title: 'Live Strategies',
            description: 'Popular strategies like Three Black Crows and DPO+MA come alive on your charts, sending automatic signals as the market moves',
        },
        {
            id: 'script-indicators',
            label: 'Script Indicators',
            title: 'Script Indicators',
            description: 'Utilize community-built scripts and indicators to get a different perspective on market movements and trends.',
        },
        {
            id: 'on-platform-webinars',
            label: 'On-Platform Webinars',
            title: 'On-Platform Webinars',
            description: 'Join live webinars with trading experts directly on the platform to learn new techniques and ask questions.',
        },
        {
            id: 'themed-chats',
            label: 'Themed Chats',
            title: 'Themed Chats',
            description: 'Discuss strategies and market news with fellow traders in dedicated chat rooms for various assets and topics.',
        },
    ],
    ctaText: "Get started"
};

const TechFeaturesSection = () => {
    const [content, setContent] = useState<TechFeaturesContent>(defaultContent);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('live-strategies');

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch('/api/homepage-content/tech_features');
                if (response.ok) {
                    const data = await response.json();
                    setContent(data.contentData);
                }
            } catch (error) {
                console.error('Failed to fetch tech features content:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, []);

    const activeTabData = content.tabs.find(tab => tab.id === activeTab);

    if (isLoading) {
        return (
            <section className="bg-background-mid py-[100px]">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="h-24 bg-background-deep/50 animate-pulse rounded-lg mb-6" />
                        <div className="h-16 bg-background-deep/50 animate-pulse rounded-lg" />
                    </div>
                    <div className="mt-16 h-[600px] bg-card/50 animate-pulse rounded-[32px]" />
                </div>
            </section>
        );
    }

    return (
        <section className="bg-background-mid py-[100px]">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-4xl mx-auto">
                    <h2 className="text-display-2 font-bold text-text-primary leading-tight">
                        {content.headline.split('—').map((part, i) => (
                            <span key={i}>{part}{i === 0 ? '—' : ''}<br /></span>
                        ))}
                    </h2>
                    <p className="text-body-1 text-text-secondary mt-6 max-w-2xl mx-auto">
                        {content.subheadline}
                    </p>
                </div>

                <div className="mt-16 bg-card rounded-[32px] overflow-hidden">
                    <div className="grid lg:grid-cols-2 items-center gap-8 lg:gap-16 p-8 lg:p-12">
                        <div className="flex flex-col justify-center order-2 lg:order-1">
                            {activeTabData && (
                                <>
                                    <h3 className="text-title-1 font-semibold text-text-primary">
                                        {activeTabData.title}
                                    </h3>
                                    <p className="text-body-2 text-text-secondary mt-4 max-w-md">
                                        {activeTabData.description}
                                    </p>
                                    <a
                                        href="#"
                                        className="inline-block text-center w-fit bg-primary text-primary-foreground text-button-md font-semibold py-4 px-6 rounded-lg mt-8 hover:bg-orange-hover transition-colors duration-300"
                                    >
                                        {content.ctaText}
                                    </a>
                                </>
                            )}
                        </div>
                        <div className="order-1 lg:order-2">
                            <Image
                                src={content.chartImage}
                                alt="Candlestick chart visualization"
                                width={550}
                                height={350}
                                className="w-full h-auto object-contain"
                            />
                        </div>
                    </div>

                    <div className="border-t border-border-subtle px-8 lg:px-12">
                        <nav className="flex items-center gap-10 overflow-x-auto">
                            {content.tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className="relative py-6 text-body-2 font-semibold transition-colors duration-300 focus:outline-none whitespace-nowrap"
                                    aria-label={`Switch to ${tab.label}`}
                                >
                                    <span className={activeTab === tab.id ? 'text-text-primary' : 'text-text-tertiary hover:text-text-secondary'}>
                                        {tab.label}
                                    </span>
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" aria-hidden="true"></div>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TechFeaturesSection;