"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

type User = {
  name: string;
  location: string;
  avatar?: string;
};

type Testimonial = {
  type: 'video' | 'text';
  videoSrc?: string;
  isCircle?: boolean;
  quote_headline?: string;
  quote_body: string;
  user: User | null;
  isLargeQuote?: boolean;
};

interface TestimonialsContent {
  headline: string;
  stats: Array<{ value: string; label: string; isRating?: boolean }>;
  testimonials: Testimonial[];
}

const defaultStats = [
  { value: "313 639", label: "AppStore & Google Play reviews" },
  { value: "4.4", label: "A highly rated & trusted app", isRating: true },
  { value: "148M", label: "Registered accounts" },
];

const defaultTestimonials: Testimonial[] = [
  {
    type: 'video',
    videoSrc: 'https://static.cdnroute.io/_assets/videos/reviews/en/review1.mp4',
    quote_body: '',
    user: { name: 'Genison', location: '0:00' },
  },
  {
    type: 'text',
    quote_headline: 'It was easier than I initially expected',
    quote_body: 'IQ offers the best trading platform for everyone. It is easy to use and navigate, even for beginners, and the platform has plenty of tools that make trading easy and painless.',
    user: { name: 'Javier Torres', location: 'Mexico City, Mexico' },
  },
    {
    type: 'text',
    isLargeQuote: true,
    quote_body: 'Fantastic trading platform – fast, secure, and full of useful features. Highly recommended for all traders!',
    user: null,
  },
  {
    type: 'text',
    quote_headline: 'Absolutely love this traderoom!',
    quote_body: 'It\'s hands down the most intuitive and visually appealing trading setup I\'ve ever used. Tons of customization options, pro-level features, and a clean, uncluttered interface. Keep up the great work!',
    user: {
      name: 'Saud Al-Marri',
      location: 'Doha, Qatar',
      avatar: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/images/Avatars-24.webp"
    },
  },
  {
    type: 'video',
    videoSrc: 'https://static.cdnroute.io/_assets/videos/reviews/en/review4.mp4',
    quote_body: '',
    user: { name: 'Murphy/Trader', location: 'Abu Dhabi, UAE' },
  },
  {
    type: 'video',
    videoSrc: 'https://static.cdnroute.io/_assets/videos/reviews/en/review5.mp4',
    isCircle: true,
    quote_body: '',
    user: null,
  },
];

const PlayIcon = () => (
    <Image
        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/play-25.svg"
        alt="Play video"
        width={48}
        height={48}
        className="backdrop-blur-sm bg-white/20 rounded-full"
    />
);

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
 const stopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  if (testimonial.type === 'video') {
    return (
      <div className={`flex flex-col h-full ${testimonial.isCircle ? 'justify-center items-center' : 'p-6 bg-card border border-border-subtle rounded-xl'}`}>
        <div className={`relative overflow-hidden w-full ${testimonial.isCircle ? 'rounded-full aspect-square h-48 w-48' : 'rounded-lg aspect-video'}`}>
          <video
            ref={videoRef}
            src={testimonial.videoSrc}
            playsInline
            loop
            muted
            onPause={stopVideo}
            onEnded={stopVideo}
            className="w-full h-full object-cover"
          />
          {!isPlaying && (
            <div className="absolute inset-0 bg-video-overlay flex items-center justify-center cursor-pointer" onClick={handlePlay}>
              <PlayIcon />
            </div>
          )}
        </div>
        {testimonial.user && !testimonial.isCircle && (
          <div className="mt-auto pt-4 flex items-center gap-3">
             <div className="text-sm">
                <p className="font-semibold text-text-primary text-body-2">{testimonial.user.name}</p>
                <p className="text-text-secondary text-caption">{testimonial.user.location}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`p-6 bg-card border border-border-subtle rounded-xl flex flex-col justify-between h-full`}>
      <div>
        {testimonial.isLargeQuote && <p className="text-7xl font-semibold text-primary/50 leading-none">"</p>}
        {testimonial.quote_headline && (
          <h4 className={`${testimonial.quote_headline.length < 30 ? 'text-title-2' : 'text-title-4'} font-semibold text-text-primary mb-4`}>
            {testimonial.quote_headline}
          </h4>
        )}
        <p className="text-text-secondary text-body-2">{testimonial.quote_body}</p>
      </div>
      {testimonial.user && (
        <div className="mt-6 flex items-center gap-3">
          {testimonial.user.avatar && <Image src={testimonial.user.avatar} alt={testimonial.user.name} width={40} height={40} className="rounded-full" />}
          <div className="text-sm">
            <p className="font-semibold text-text-primary text-body-2">{testimonial.user.name}</p>
            <p className="text-text-secondary text-caption">{testimonial.user.location}</p>
          </div>
        </div>
      )}
    </div>
  );
};


const TestimonialsSection = () => {
  const [content, setContent] = useState<TestimonialsContent>({
    headline: "We've received warm greetings from our traders. Hear what they have to say about us",
    stats: defaultStats,
    testimonials: defaultTestimonials
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/homepage-content/testimonials');
        if (response.ok) {
          const data = await response.json();
          if (data.contentData?.stats && data.contentData?.testimonials &&
              Array.isArray(data.contentData.stats) && Array.isArray(data.contentData.testimonials)) {
            setContent(data.contentData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch testimonials content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Defensive checks
  const stats = Array.isArray(content?.stats) ? content.stats : defaultStats;
  const testimonials = Array.isArray(content?.testimonials) ? content.testimonials : defaultTestimonials;

  if (isLoading) {
    return (
      <section className="bg-background-deep relative py-24 sm:py-32">
        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="h-20 bg-background-mid/50 animate-pulse rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-background-mid/50 animate-pulse rounded-lg" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-background-mid/50 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background-deep relative py-24 sm:py-32">
       <div
          className="absolute inset-x-0 top-[-100px] h-[500px] bg-gradient-to-b from-[rgba(255,133,22,0.1)] to-transparent pointer-events-none"
          style={{
            maskImage: 'radial-gradient(ellipse at top, black 40%, transparent 100%)'
          }}
        />
        <div className="container mx-auto px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-title-1 font-semibold text-text-primary">
            {content.headline}
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-8 text-center max-w-5xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <p className="text-display-3 font-bold text-text-primary">{stat.value}</p>
              {stat.isRating ? (
                <div className="flex items-center gap-0.5 my-2">
                  {[...Array(5)].map((_, i) => (
                    <Image key={i} src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/trustpilot-star-15.svg" alt="Star" width={24} height={24} className="h-4 w-4 lg:h-6 lg:w-6" />
                  ))}
                </div>
              ) : <div className="h-[32px] lg:h-[40px]"></div>}
              <p className="text-body-2 text-text-secondary mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="text-button-md font-semibold text-text-primary border border-border-medium rounded-md px-6 py-3 hover:border-primary transition-colors duration-300">
            More reviews
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;