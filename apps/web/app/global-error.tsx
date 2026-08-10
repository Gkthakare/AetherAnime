'use client';

import { useEffect } from 'react';

import { reportError } from '@/shared/lib/errors';

import './globals.css';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

/**
 * Root error boundary — last catch when the root layout itself fails.
 *
 * Replaces the root layout when active, so it owns `<html>` / `<body>` and
 * cannot rely on providers or theme context being mounted.
 */
export default function GlobalError({
  error,
  unstable_retry,
}: GlobalErrorProps) {
  useEffect(() => {
    reportError('app.globalError', error, { digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black px-6 text-center text-zinc-100">
          <h1 className="text-3xl font-medium tracking-tight">
            The Aether went dark
          </h1>
          <p className="max-w-md text-sm text-zinc-400">
            AetherAnime could not start. The failure has been recorded.
          </p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
