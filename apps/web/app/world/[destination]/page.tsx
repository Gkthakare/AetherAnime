import { notFound } from 'next/navigation';
import { ExperienceLayout } from '@/widgets/experience-layout';
import { isWorldSlug, toWorldSlug } from '@/shared/lib/navigation';
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

  if (!isWorldSlug(destination)) {
    notFound();
  }

  const title = titleFromSlug(toWorldSlug(destination));

  return (
    <ExperienceLayout>
      <section
        data-slot="world-entry"
        className="relative flex min-h-full w-full flex-col items-center justify-center text-center"
        style={{ gap: spacing.lg, paddingInline: spacing.xl }}
      >
        <p className="text-ring text-sm tracking-[0.12em] uppercase">Entered</p>
        <h1 className="text-foreground text-4xl font-medium tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className="text-muted-foreground max-w-md text-sm md:text-base">
          The threshold has answered. This world shell awaits its Engine.
        </p>
      </section>
    </ExperienceLayout>
  );
}
