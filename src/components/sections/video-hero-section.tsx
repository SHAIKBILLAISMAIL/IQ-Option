"use client";

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { VolumeX } from 'lucide-react';

interface VideoHeroContent {
  headline: string;
  ctaText: string;
  videoSrc: string;
  videoPoster: string;
  videoTitle: string;
  videoDuration: string;
}

const defaultContent: VideoHeroContent = {
  headline: "Stay ahead with high-speed trading & advanced tech",
  ctaText: "Start trading",
  videoSrc: "https://static.cdnroute.io/_assets/videos/intro-mcl/end.webm",
  videoPoster: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/images/images_6.png",
  videoTitle: "12 years of history",
  videoDuration: "0:00"
};

const VideoPlayer = ({ content }: { content: VideoHeroContent }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);

    const togglePlay = useCallback(() => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    }, []);

    const toggleMute = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (!videoRef.current) return;
        const newMutedState = !videoRef.current.muted;
        videoRef.current.muted = newMutedState;
        setIsMuted(newMutedState);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(video);

        return () => {
            if (video) {
                observer.unobserve(video);
            }
        };
    }, []);

    return (
        <div 
            onClick={togglePlay} 
            className="relative rounded-xl overflow-hidden aspect-[16/9] bg-black cursor-pointer group"
        >
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster={content.videoPoster}
                src={content.videoSrc}
                playsInline
                autoPlay
                muted
                loop
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
            
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

            <div className="absolute inset-0 p-4 sm:p-6 text-white flex flex-col justify-between">
                <div className="flex justify-end">
                    <button
                        onClick={toggleMute}
                        className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors pointer-events-auto"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                        {isMuted ? (
                            <VolumeX className="w-5 h-5 text-white" />
                        ) : (
                            <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/volume-on-23.svg" width={20} height={20} alt="Volume on" />
                        )}
                    </button>
                </div>

                <div className="flex items-center gap-4 pointer-events-none">
                    <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/play-25.svg" width={24} height={24} alt="Play icon" />
                    <div>
                        <p className="text-sm font-semibold leading-none text-text-primary">{content.videoTitle}</p>
                        <p className="text-xs text-text-secondary leading-none mt-1">{content.videoDuration}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function VideoHeroSection() {
    const [content, setContent] = useState<VideoHeroContent>(defaultContent);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch('/api/homepage-content/video_hero');
                if (response.ok) {
                    const data = await response.json();
                    setContent(data.contentData);
                }
            } catch (error) {
                console.error('Failed to fetch video hero content:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, []);

    if (isLoading) {
        return (
            <section className="relative bg-background-deep flex items-center py-24 lg:min-h-[600px] lg:py-0">
                <div className="container mx-auto grid lg:grid-cols-2 gap-x-[60px] gap-y-12 items-center">
                    <div className="flex flex-col items-start gap-10">
                        <div className="h-32 w-full bg-background-mid/50 animate-pulse rounded-lg" />
                        <div className="h-14 w-48 bg-background-mid/50 animate-pulse rounded-lg" />
                    </div>
                    <div className="aspect-[16/9] bg-background-mid/50 animate-pulse rounded-xl" />
                </div>
            </section>
        );
    }

    return (
        <section className="relative bg-background-deep flex items-center py-24 lg:min-h-[600px] lg:py-0 overflow-x-clip">
            <div className="absolute -bottom-1/4 -right-1/4 w-3/4 max-w-[800px] h-3/4 max-h-[600px] bg-[radial-gradient(circle_at_center,rgba(255,133,22,0.15)_0%,_transparent_70%)] -z-0" aria-hidden="true" />
            
            <div className="container mx-auto grid lg:grid-cols-2 gap-x-[60px] gap-y-12 items-center">
                <div className="flex flex-col items-start gap-10 text-left">
                    <h2 className="text-display-2 text-text-primary">
                        {content.headline}
                    </h2>
                    <Link 
                        href="#" 
                        className="bg-primary text-primary-foreground text-button-md font-semibold px-8 py-4 rounded-lg hover:bg-orange-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background-deep transition-colors duration-300"
                    >
                        {content.ctaText}
                    </Link>
                </div>

                <VideoPlayer content={content} />
            </div>
        </section>
    );
}