import { resolveInitialAnimeArrival } from '@/shared/anime';
import { toWorldSlug } from '@/shared/lib/navigation';
import { getWorldBySlug, resolveInitialRegionFocus } from '@/shared/world';
import { ExperienceLayout } from '@/widgets/experience-layout';
import { resolveWorldShellStatus } from '@/widgets/world-shell';
import { WorldSceneNavigation } from '@/widgets/world-scene';

type WorldEntryPageProps = {
  params: Promise<{ destination: string }>;
  searchParams: Promise<{
    region?: string | string[];
    anime?: string | string[];
  }>;
};

/**
 * World entry route — Navigation mounts WorldScene (Director).
 * Registry resolves on the page; Scene orchestrates Shell + slots.
 * `?anime=` and `?region=` are mutually exclusive on write; a valid anime
 * arrival wins over a region query on read.
 */
export default async function WorldEntryPage({
  params,
  searchParams,
}: WorldEntryPageProps) {
  const { destination } = await params;
  const { region: regionQuery, anime: animeQuery } = await searchParams;
  const slug = toWorldSlug(destination);
  const world = getWorldBySlug(slug);
  const status = resolveWorldShellStatus(world);
  const initialAnimeSlug = resolveInitialAnimeArrival(animeQuery);
  const initialRegionId = initialAnimeSlug
    ? undefined
    : resolveInitialRegionFocus(world, regionQuery);

  return (
    <ExperienceLayout>
      <WorldSceneNavigation
        slug={slug || 'unknown'}
        world={world}
        status={status}
        initialRegionId={initialRegionId}
        initialAnimeSlug={initialAnimeSlug}
      />
    </ExperienceLayout>
  );
}
