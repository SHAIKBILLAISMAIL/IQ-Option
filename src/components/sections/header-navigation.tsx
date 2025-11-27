"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import RegistrationModal from './registration-modal';
import { useSession } from '@/lib/auth-client';

// Force recompilation - HMR cache clear
const HeaderNavigation = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: session, isPending } = useSession();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Initial check
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    const navItems = [
        { name: "Download App", href: "/download" },
        { name: "For Traders", href: "/for-traders" },
        { name: "About Us", href: "/about" },
    ];

    return (
        <>
            <header className={`sticky top-0 z-[1000] w-full h-20 transition-all duration-300 ease-in-out ${scrolled ? 'bg-background-mid/90 backdrop-blur-xl border-b border-border-subtle' : 'bg-transparent'}`}>
                <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 md:px-10">
                    {/* Left Side: Logo */}
                    <Link href="/" className="flex shrink-0 items-center gap-2">
                        <Image
                            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/favicon-47.svg"
                            alt="IQ Option Logo Icon"
                            width={32}
                            height={32}
                            priority
                        />
                        <span className="font-sans text-[22px] font-semibold tracking-tight text-white">iq option</span>
                    </Link>

                    {/* Center: Desktop Navigation */}
                    <nav className="hidden lg:flex lg:justify-center">
                        <ul className="flex items-center gap-x-8">
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="group relative flex items-center gap-1.5 py-2 font-sans text-[15px] font-medium text-white transition-colors hover:text-primary">
                                        <span>{item.name}</span>
                                        <span className="absolute bottom-[-1px] left-0 block h-px w-full origin-center scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"></span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Right Side: Controls & Mobile Hamburger */}
                    <div className="flex items-center gap-x-4">
                        <div className="hidden lg:flex items-center gap-x-6">
                            <button className="flex items-center gap-1.5 font-sans text-[15px] font-medium text-white transition-colors hover:text-primary">
                                <Image
                                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/images/globe-27.svg"
                                    alt="Language"
                                    width={20}
                                    height={20}
                                />
                                EN
                            </button>
                            
                            {!isPending && session?.user ? (
                                <Link 
                                    href="/trade" 
                                    className="shrink-0 rounded-sm bg-primary px-6 py-3 font-sans text-[15px] font-semibold text-primary-foreground transition-colors duration-300 hover:bg-orange-hover"
                                >
                                    Trade Now
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="font-sans text-[15px] font-medium text-white transition-colors hover:text-primary">
                                        Log in
                                    </Link>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="shrink-0 rounded-sm bg-primary px-6 py-3 font-sans text-[15px] font-semibold text-primary-foreground transition-colors duration-300 hover:bg-orange-hover"
                                    >
                                        Sign Up
                                    </button>
                                </>
                            )}
                            
                            {/* Admin Panel Link */}
                            <Link 
                                href="/admin/login" 
                                className="flex items-center gap-2 font-sans text-[15px] font-medium text-text-secondary transition-colors hover:text-primary"
                                title="Admin Panel"
                            >
                                <span className="text-lg">🔐</span>
                                <span className="hidden xl:inline">Admin Panel</span>
                            </Link>
                        </div>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu" className="z-50 text-white lg:hidden">
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Panel */}
            <div className={`fixed inset-0 top-20 z-[999] bg-background-deep transition-transform duration-300 ease-in-out lg:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="mx-auto h-full px-6 pt-8 pb-20 md:px-10">
                    <nav>
                        <ul className="flex flex-col gap-y-6">
                             {navItems.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} onClick={() => setIsMenuOpen(false)} className="flex w-full items-center justify-between font-sans text-xl font-medium text-white">
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="mt-12 flex flex-col gap-y-6 border-t border-border-subtle pt-8">
                        <button className="flex items-center gap-2 font-sans text-xl font-medium text-white">
                            <Image
                                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/images/globe-27.svg"
                                alt="Language"
                                width={24}
                                height={24}
                            />
                            EN
                        </button>
                        
                        {!isPending && session?.user ? (
                            <Link 
                                href="/trade" 
                                onClick={() => setIsMenuOpen(false)}
                                className="w-full rounded-sm bg-primary py-4 px-6 text-center font-sans text-lg font-semibold text-primary-foreground transition-colors"
                            >
                                Trade Now
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="font-sans text-xl font-medium text-white">
                                    Log in
                                </Link>
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setIsModalOpen(true);
                                    }}
                                    className="w-full rounded-sm bg-primary py-4 px-6 text-center font-sans text-lg font-semibold text-primary-foreground transition-colors"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                        
                        {/* Admin Panel Link - Mobile */}
                        <Link 
                            href="/admin/login" 
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-2 font-sans text-xl font-medium text-text-secondary border-t border-border-subtle pt-6"
                        >
                            <span className="text-2xl">🔐</span>
                            Admin Panel
                        </Link>
                    </div>
                </div>
            </div>

            {/* Registration Modal */}
            {isModalOpen && <RegistrationModal onClose={() => setIsModalOpen(false)} />}
        </>
    );
};

export default HeaderNavigation;