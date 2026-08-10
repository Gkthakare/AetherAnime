'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { reportError } from '@/shared/lib/errors';
import { spacing } from '@/shared/config/theme';
import { ExperienceLayout } from '@/widgets/experience-layout';

type ExperienceErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

/**
 * Route error boundary — the visible end of the reporting channel.
 *
 * Render-time failures previously blanked the experience with no record; here
 * they are reported once and offered a retry so the threshold can be re-entered.
 */
export default function ExperienceError({
  error,
  unstable_retry,
}: ExperienceErrorProps) {
  useEffect(() => {
    reportError('app.error', error, { digest: error.digest });
  }, [error]);

  return (
    <ExperienceLayout>
      <section
        data-slot="experience-error"
        className="relative flex min-h-full w-full flex-col items-center justify-center text-center"
        style={{ gap: spacing.lg, paddingInline: spacing.xl }}
      >
        <p className="text-sm tracking-[0.12em] text-ring uppercase">
          Threshold unstable
        </p>
        <h1 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
          The passage did not hold
        </h1>
        <p className="max-w-md text-sm text-muted-foreground md:text-base">
          Something interrupted this world before it could form. You can try the
          crossing again.
        </p>
        <Button variant="outline" size="lg" onClick={() => unstable_retry()}>
          Try again
        </Button>
      </section>
    </ExperienceLayout>
  );
}
