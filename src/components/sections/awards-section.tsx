"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";

interface Award {
    icon: string;
    alt: string;
    title: string;
    organization: string;
    year: string;
}

interface AwardsContent {
    awards: Award[];
}

const defaultAwards: Award[] = [
  {
    icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/award1-16.svg",
    alt: "Best Trading Experience award by FX DAILY INFO",
    title: "Best Trading Experience",
    organization: "FX DAILY INFO",
    year: "2023",
  },
  {
    icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/award2-17.svg",
    alt: "Most Innovative Trading Platform award by WORLD BUSINESS OUTLOOK",
    title: "Most Innovative Trading Platform",
    organization: "WORLD BUSINESS OUTLOOK",
    year: "2022",
  },
  {
    icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/award3-18.svg",
    alt: "Best Trading Platform award by WORLD FOREX AWARD",
    title: "Best Trading Platform",
    organization: "WORLD FOREX AWARD",
    year: "2024",
  },
  {
    icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/award4-19.svg",
    alt: "Best Mobile Trading App award by WORLD FOREX AWARD",
    title: "Best Mobile Trading App",
    organization: "WORLD FOREX AWARD",
    year: "2024",
  },
];

const AwardsSection = () => {
  const [content, setContent] = useState<AwardsContent>({ awards: defaultAwards });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/homepage-content/awards');
        if (response.ok) {
          const data = await response.json();
          if (data.contentData?.awards && Array.isArray(data.contentData.awards)) {
            setContent(data.contentData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch awards content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Defensive check
  const awards = Array.isArray(content?.awards) ? content.awards : defaultAwards;

  if (isLoading) {
    return (
      <section className="bg-background-deep py-20">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="h-24 w-full max-w-[180px] bg-background-mid/50 animate-pulse rounded-lg mb-4" />
                <div className="h-12 w-full bg-background-mid/50 animate-pulse rounded-lg mb-2" />
                <div className="h-8 w-3/4 bg-background-mid/50 animate-pulse rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background-deep py-20">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {awards.map((award, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="relative h-24 w-full max-w-[180px] mb-4">
                <Image
                  src={award.icon}
                  alt={award.alt}
                  fill
                  sizes="(max-width: 768px) 45vw, 22vw"
                  className="object-contain"
                />
              </div>
              <p className="flex items-center justify-center text-xl font-semibold text-text-primary uppercase tracking-wider mb-2 min-h-[56px] leading-tight">
                {award.title}
              </p>
              <div className="text-sm font-normal text-text-secondary uppercase tracking-wider leading-snug">
                <div>{award.organization}</div>
                <div>{award.year}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;