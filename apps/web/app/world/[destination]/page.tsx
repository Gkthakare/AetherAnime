import { notFound } from 'next/navigation';

import { ExperienceLayout } from '@/widgets/experience-layout';
import { toWorldSlug } from '@/shared/lib/navigation';
import { spacing } from '@/shared/config/theme';

type WorldEntryPageProps = {
  params: Promise<{ destination: string }>;
};

function titleFromSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * World entry shell — consequence of Portal Settling completion.
 * Presentation only; World Engine content lands later.
 */
export default async function WorldEntryPage({ params }: WorldEntryPageProps) {
  const { destination } = await params;
  const slug = toWorldSlug(destination);

  // An unaddressable destination is a missing world, not a default one.
  if (slug.length === 0) notFound();

  const title = titleFromSlug(slug);

  return (
    <ExperienceLayout>
      <section
        data-slot="world-entry"
        className="relative flex min-h-full w-full flex-col items-center justify-center text-center"
        style={{ gap: spacing.lg, paddingInline: spacing.xl }}
      >
        <p className="text-sm tracking-[0.12em] text-ring uppercase">
          Entered
        </p>
        <h1 className="text-4xl font-medium tracking-tight text-foreground md:text-5xl">
          {title}
        </h1>
        <p className="max-w-md text-sm text-muted-foreground md:text-base">
          The threshold has answered. This world shell awaits its Engine.
        </p>
      </section>
    </ExperienceLayout>
  );
}
