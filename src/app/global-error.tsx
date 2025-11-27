"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Global error:', error);
    }
    
    // Send error to parent window if in iframe
    if (typeof window !== 'undefined' && window.parent !== window) {
      window.parent.postMessage(
        {
          type: "ERROR_CAPTURED",
          error: {
            message: error.message,
            stack: error.stack,
            digest: error.digest,
            name: error.name,
            source: "global-error"
          },
          timestamp: Date.now(),
        },
        "*"
      );
    }
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Error - IQ Option</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-[#ff8516]">
              Oops!
            </h1>
            <h2 className="text-2xl font-semibold text-white">
              Something went wrong
            </h2>
            <p className="text-lg text-gray-400">
              We encountered an unexpected error. Please try again or return to the homepage.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                reset();
                if (typeof window !== 'undefined') {
                  window.location.href = '/';
                }
              }}
              className="w-full rounded-lg bg-[#ff8516] px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-[#ff9933] hover:shadow-lg"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="w-full rounded-lg border border-gray-700 bg-transparent px-8 py-4 text-center text-lg font-semibold text-white transition-all duration-300 hover:border-[#ff8516] hover:bg-[#ff8516]/10"
            >
              Go to Homepage
            </Link>
          </div>

          {process.env.NODE_ENV === "development" && error.message && (
            <details className="mt-8 text-left">
              <summary className="cursor-pointer text-sm text-gray-400 hover:text-white">
                Error details (development only)
              </summary>
              <div className="mt-4 p-4 bg-[#1a1a1a] rounded-lg border border-gray-800">
                <p className="text-sm text-red-400 font-mono break-all mb-2">
                  {error.message}
                </p>
                {error.stack && (
                  <pre className="text-xs text-gray-500 overflow-auto max-h-40">
                    {error.stack}
                  </pre>
                )}
                {error.digest && (
                  <p className="text-xs text-gray-500 mt-2">
                    Digest: {error.digest}
                  </p>
                )}
              </div>
            </details>
          )}
        </div>
      </body>
    </html>
  );
}