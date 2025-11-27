"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface TickerItem {
    name: string;
    change: string;
}

interface TickerContent {
    items: TickerItem[];
}

const defaultItems: TickerItem[] = [
    { name: "Gold", change: "-0.89%" },
    { name: "EUR/USD", change: "+0.23%" },
    { name: "Bitcoin", change: "+2.45%" },
    { name: "Apple", change: "-1.12%" },
];

const TickerBanner = () => {
    const [content, setContent] = useState<TickerContent>({ items: defaultItems });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch('/api/homepage-content/ticker', {
                    cache: 'no-store'
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.contentData?.items && Array.isArray(data.contentData.items)) {
                        setContent(data.contentData);
                    }
                } else {
                    // API failed, continue using default content
                    console.warn('Using default ticker content');
                }
            } catch (error) {
                // Network error or API unavailable - silently use default content
                console.warn('Ticker banner using default content due to API error');
            }
        };

        fetchContent();
    }, []);

    // Defensive check
    const tickerItems = Array.isArray(content?.items) ? content.items : defaultItems;
    const duplicatedItems = [...tickerItems, ...tickerItems, ...tickerItems];

    return (
        <div className="relative h-16 overflow-hidden bg-background-mid border-y border-border-subtle">
            <div className="absolute inset-0 flex items-center">
                <div className="flex animate-scroll whitespace-nowrap">
                    {duplicatedItems.map((item, index) => {
                        const isPositive = item.change.startsWith('+');
                        return (
                            <div
                                key={index}
                                className="mx-8 flex items-center gap-3 text-white"
                            >
                                <div className="relative h-8 w-8 flex-shrink-0">
                                    <Image
                                        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/images/images_2.png"
                                        alt={item.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <span className="text-base font-medium">{item.name}</span>
                                <span className={`text-base font-medium ${isPositive ? 'text-success-green' : 'text-error-red'}`}>
                                    {item.change} {isPositive ? '↑' : '↓'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TickerBanner;