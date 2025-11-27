"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Milestone {
  year: number;
  title: string;
  description: string;
  icon?: string | null;
  keyEvent?: boolean;
}

interface TimelineContent {
  headline: string;
  subheadline: string;
  milestones: Milestone[];
}

const defaultMilestones: Milestone[] = [
  { year: 2013, title: 'Company Foundation', description: 'IQ Option was founded, starting its journey to redefine online trading.', icon: null },
  { year: 2014, title: 'First mobile apps', description: 'Launched our first mobile trading applications for iOS and Android.', icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/icon2014-26.svg' },
  { year: 2015, title: '1M Users', description: 'Reached the milestone of 1 million registered users on the platform.', icon: null, keyEvent: true },
  { year: 2016, title: 'Global Expansion', description: 'Expanded services to numerous countries, enhancing our global presence.', icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/icon2016-27.svg' },
  { year: 2017, title: 'Crypto Trading', description: 'Introduced cryptocurrency trading, diversifying asset offerings.', icon: null },
  { year: 2018, title: '10M Users', description: 'The user base grew tenfold, reaching an impressive 10 million traders.', icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/icon2018-28.svg', keyEvent: true },
  { year: 2019, title: 'Platform Upgrade', description: 'Major platform overhaul for faster performance and a better UX.', icon: null },
  { year: 2020, title: '50M Users', description: 'Surpassed 50 million users as global adoption continued to accelerate.', icon: null, keyEvent: true },
  { year: 2021, title: 'Margin Trading', description: 'Launched margin trading feature, providing traders with more leverage.', icon: null },
  { year: 2022, title: 'Big Growth', description: '80M users reached, and Afftore, a multi-brand affiliate program, is introduced.', icon: null, keyEvent: true },
  { year: 2023, title: 'Rewards for Traders', description: 'Loyalty Program and script indicators unveiled.', icon: null },
  { year: 2024, title: '100M Strong', description: '100 million users, 550 assets, and new incentives like risk-free trades and deposit bonuses.', icon: null, keyEvent: true },
  { year: 2025, title: 'IQ Option-Autosports', description: 'Partnership with a growing motorsport team merging the worlds of racing and finance.', icon: null },
];

const timelineEvents = [
    { year: 2022, label: "50M Users" },
    { year: 2022.6, label: "80M Users" },
    { year: 2023.8, label: "100M Users" },
];

export default function TimelineSection() {
    const [content, setContent] = useState<TimelineContent>({
        headline: "Milestones that built our legacy",
        subheadline: "Registered with official regulators",
        milestones: defaultMilestones
    });
    const [isLoading, setIsLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(10);
    const [translateX, setTranslateX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const carouselRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const timelineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch('/api/homepage-content/timeline');
                if (response.ok) {
                    const data = await response.json();
                    if (data.contentData?.milestones && Array.isArray(data.contentData.milestones)) {
                        setContent(data.contentData);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch timeline content:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, []);

    // Defensive check
    const milestones = Array.isArray(content?.milestones) ? content.milestones : defaultMilestones;
    const totalItems = milestones.length;

    const updateCarouselPosition = useCallback(() => {
        if (carouselRef.current && itemRefs.current[activeIndex]) {
            const carouselWidth = carouselRef.current.offsetWidth;
            const activeItem = itemRefs.current[activeIndex] as HTMLDivElement;
            const itemOffsetLeft = activeItem.offsetLeft;
            const itemWidth = activeItem.offsetWidth;

            const newTranslateX = carouselWidth / 2 - itemOffsetLeft - itemWidth / 2;
            setTranslateX(newTranslateX);
        }
    }, [activeIndex]);

    useEffect(() => {
        updateCarouselPosition();
        window.addEventListener('resize', updateCarouselPosition);
        return () => window.removeEventListener('resize', updateCarouselPosition);
    }, [updateCarouselPosition]);

    const handlePrev = () => setActiveIndex(prev => Math.max(0, prev - 1));
    const handleNext = () => setActiveIndex(prev => Math.min(totalItems - 1, prev + 1));

    const handleInteraction = useCallback((clientX: number) => {
        if (!timelineRef.current) return;
        const timelineRect = timelineRef.current.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (clientX - timelineRect.left) / timelineRect.width));
        const newIndex = Math.round(progress * (totalItems - 1));
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    }, [activeIndex, totalItems]);
    
    const handleDrag = useCallback((event: MouseEvent | TouchEvent) => {
        if (!isDragging) return;
        event.preventDefault();
        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        handleInteraction(clientX);
    }, [isDragging, handleInteraction]);

    const handleDragEnd = useCallback(() => setIsDragging(false), []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleDrag);
            window.addEventListener('touchmove', handleDrag, { passive: false });
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchend', handleDragEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleDrag);
            window.removeEventListener('touchmove', handleDrag);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchend', handleDragEnd);
        };
    }, [isDragging, handleDrag, handleDragEnd]);

    const handleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
        handleInteraction(event.clientX);
    };

    const progressPercent = totalItems > 1 ? (activeIndex / (totalItems - 1)) * 100 : 0;

    if (isLoading) {
        return (
            <section className="bg-background-deep py-[120px] overflow-x-clip">
                <div className="container">
                    <div className="h-24 bg-background-mid/50 animate-pulse rounded-lg mb-24" />
                    <div className="h-12 bg-background-mid/50 animate-pulse rounded-lg mb-12" />
                    <div className="h-64 bg-background-mid/50 animate-pulse rounded-lg" />
                </div>
            </section>
        );
    }

    return (
        <section className="bg-background-deep py-[120px] overflow-x-clip">
            <div className="container">
                <div className="flex justify-between items-start mb-24">
                    <h2 className="text-[64px] leading-[1.1] font-bold text-white">
                        {content.headline.split('\n').map((line, i) => (
                            <span key={i}>{line}<br/></span>
                        ))}
                    </h2>
                    <div className="hidden md:flex flex-col items-center text-center flex-shrink-0 ml-8 pt-4">
                        <div className="relative w-24 h-24 mb-4">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#493116] to-[#1C1206]">
                                <div className="absolute inset-px rounded-full bg-gradient-to-b from-[#242424] to-[#1A1A1A] flex items-center justify-center">
                                    <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/images/shield-17.png" alt="Shield Icon" width={48} height={48} />
                                </div>
                            </div>
                            <div className="absolute top-[85%] left-1/2 -translate-x-1/2 w-10 h-10 bg-[#2F1F0E]" style={{clipPath: 'polygon(0 0, 100% 0, 50% 70%)'}}></div>
                        </div>
                        <p className="text-sm text-text-secondary w-40">{content.subheadline}</p>
                    </div>
                </div>

                <div className="relative mb-12" ref={timelineRef}>
                    <div className="relative h-12">
                        <div className="absolute top-[21px] left-0 w-full h-0.5 bg-border-medium rounded-full cursor-pointer" onClick={handleTrackClick}></div>
                        <div className="absolute top-[21px] left-0 h-0.5 bg-primary rounded-full pointer-events-none" style={{ width: `${progressPercent}%` }}></div>
                        
                        {milestones.map((milestone, index) => {
                            const percent = totalItems > 1 ? (index / (totalItems - 1)) * 100 : 0;
                            return (
                                <button key={milestone.year} onClick={() => setActiveIndex(index)} className="absolute -translate-x-1/2 top-8" style={{ left: `${percent}%` }}>
                                    <span className={`text-sm font-semibold transition-colors ${activeIndex === index ? "text-white" : "text-text-tertiary"}`}>
                                        {milestone.year}
                                    </span>
                                </button>
                            );
                        })}
                        
                        <div
                            onMouseDown={() => setIsDragging(true)} onTouchStart={() => setIsDragging(true)}
                            className="absolute top-[12.5px] w-5 h-5 bg-primary rounded-full border-4 border-background-deep transition-all duration-300 -translate-x-1/2 cursor-grab active:cursor-grabbing"
                            style={{ left: `${progressPercent}%` }}
                        ></div>
                        
                        <div className="absolute top-0 w-full">
                            {timelineEvents.map((event) => {
                                const percent = ((event.year - 2013) / (2025 - 2013)) * 100;
                                return (
                                    <div key={event.label} className="absolute -translate-x-1/2 text-primary text-xs font-semibold select-none" style={{ left: `${percent}%` }}>
                                        {event.label}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <button onClick={handlePrev} disabled={activeIndex === 0} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-background-mid/50 backdrop-blur-sm rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed hidden md:block -translate-x-[calc(100%+24px)]">
                        <ChevronLeft className="w-6 h-6 text-white"/>
                    </button>
                    <button onClick={handleNext} disabled={activeIndex === totalItems - 1} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-background-mid/50 backdrop-blur-sm rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed hidden md:block translate-x-[calc(100%+24px)]">
                        <ChevronRight className="w-6 h-6 text-white"/>
                    </button>
                    <div ref={carouselRef} className="overflow-hidden">
                        <div className="flex gap-5 transition-transform duration-500 ease-in-out" style={{ transform: `translateX(${translateX}px)`}}>
                            {milestones.map((milestone, index) => (
                                <div
                                    key={milestone.year}
                                    ref={el => itemRefs.current[index] = el}
                                    className={`bg-background-mid p-8 rounded-2xl border-2 transition-all duration-300 w-[316px] flex-shrink-0 h-[212px] flex flex-col ${activeIndex === index ? "border-primary shadow-[0px_0px_24px_0px_rgba(255,133,22,0.3)]" : "border-transparent"}`}
                                >
                                    {milestone.icon && <Image src={milestone.icon} alt={`${milestone.title} icon`} width={40} height={40} className="mb-4" />}
                                    <h3 className="text-2xl font-semibold text-white leading-tight mt-auto">{milestone.title}</h3>
                                    <p className="text-base text-text-secondary mt-2 leading-relaxed">{milestone.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}