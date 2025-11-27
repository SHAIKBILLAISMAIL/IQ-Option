import type { Metadata, Viewport } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import PWARegister from "@/components/pwa-register";
import InstallPrompt from "@/components/install-prompt";

export const metadata: Metadata = {
  title: "IQ Option - Online Trading Platform",
  description: "Trade with IQ Option - the first-choice broker for 170M+ traders across 160 countries. Start your trading career today.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IQ Option",
  },
  icons: {
    icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/a9d01dcc-d202-4296-8a1e-f1e869ef1166/generated_images/modern-minimalist-favicon-icon-for-iq-op-f468a74a-20251122094849.jpg",
    apple: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/a9d01dcc-d202-4296-8a1e-f1e869ef1166/generated_images/modern-minimalist-favicon-icon-for-iq-op-f468a74a-20251122094849.jpg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ff8516",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="IQ Option" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="IQ Option" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ErrorReporter />
        {children}
        <Toaster />
        <PWARegister />
        <InstallPrompt />
        <VisualEditsMessenger />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="lazyOnload"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="false"
          data-custom-data='{"appName": "IQ Option", "version": "1.0.0"}'
        />
      </body>
    </html>
  );
}