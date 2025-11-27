"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";

interface McLarenContent {
  logoUnited: string;
  logoMcLaren: string;
  backgroundImage: string;
  quote: string;
  ceoName: string;
  ceoTitle: string;
  ceoImage: string;
}

const defaultContent: McLarenContent = {
  logoUnited: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/images/mclaren-badge_1x-14.jpg",
  logoMcLaren: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/mclaren-logo-20.svg",
  backgroundImage: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/images/mclaren_1x-15.png",
  quote: "Success in endurance racing — and for United Autosports as a company — comes from strategy, reliability, and people. These are the same values we see in IQ Option",
  ceoName: "Richard Dean",
  ceoTitle: "CEO and Team Principal",
  ceoImage: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/images/ceo_1x-16.jpg"
};

const McLarenPartnership = () => {
  const [content, setContent] = useState<McLarenContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/homepage-content/mclaren');
        if (response.ok) {
          const data = await response.json();
          setContent(data.contentData);
        }
      } catch (error) {
        console.error('Failed to fetch McLaren content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (isLoading) {
    return (
      <section className="bg-background-deep py-[100px]">
        <div className="container">
          <div className="relative min-h-[640px] overflow-hidden rounded-xl bg-background-mid/50 animate-pulse md:min-h-[720px]" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background-deep py-[100px]">
      <div className="container">
        <div
          className="relative min-h-[640px] overflow-hidden rounded-xl bg-cover bg-center text-white md:min-h-[720px]"
          style={{
            backgroundImage: `url('${content.backgroundImage}')`,
          }}
        >
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-60% to-transparent" />

          {/* Content Wrapper */}
          <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-8 md:p-12 lg:p-16">
            
            {/* Top Logos */}
            <div className="flex flex-col items-start gap-y-6">
              <Image
                src={content.logoUnited}
                alt="United Autosports Logo"
                width={140}
                height={40}
                className="h-auto w-[120px] mix-blend-lighten md:w-[140px]"
              />
              <Image
                src={content.logoMcLaren}
                alt="McLaren Logo"
                width={120}
                height={30}
                className="h-auto w-[100px] md:w-[120px]"
              />
            </div>

            {/* Bottom Quote & Author */}
            <div className="flex flex-col gap-6 md:max-w-3xl lg:flex-row lg:items-end">
              <Image
                src={content.ceoImage}
                alt={`Portrait of ${content.ceoName}`}
                width={96}
                height={96}
                className="h-20 w-20 shrink-0 rounded-full border-2 border-white/20 object-cover lg:h-24 lg:w-24"
              />
              <div className="flex flex-col">
                <blockquote className="text-[24px] font-medium leading-[1.4] text-text-primary">
                  "{content.quote}"
                </blockquote>
                <figcaption className="mt-4">
                  <p className="text-body-2 font-semibold text-text-primary">
                    {content.ceoName}
                  </p>
                  <p className="text-body-3 text-text-secondary">
                    {content.ceoTitle}
                  </p>
                </figcaption>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default McLarenPartnership;