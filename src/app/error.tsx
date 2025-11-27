'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background-deep flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-display-2 font-bold text-white mb-4">
            Oops!
          </h1>
          <p className="text-body-1 text-text-secondary mb-2">
            Something went wrong
          </p>
          <p className="text-body-3 text-text-tertiary">
            We're working on fixing the issue. Please try again.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={reset}
            className="w-full rounded-lg bg-primary px-8 py-4 font-sans text-button-lg font-semibold text-primary-foreground transition-all duration-300 hover:bg-orange-hover hover:shadow-lg"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="w-full rounded-lg border border-border-medium bg-transparent px-8 py-4 text-center font-sans text-button-lg font-semibold text-white transition-all duration-300 hover:border-primary hover:bg-primary/10"
          >
            Go to Homepage
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mt-8 p-4 bg-background-mid rounded-lg border border-border-subtle text-left">
            <p className="text-body-3 text-error-red font-mono break-all">
              {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
