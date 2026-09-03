/**
 * Destination exploration — presentation derivation only.
 *
 * Story / Signals / Kinship are path concepts, not CanonicalAnime fields.
 * They read existing synopsis, semantic evidence, and catalog identity.
 */

import { malIdForSlug } from '@/shared/anime/anime.mal.identity';
import { buildAnimeSemanticProfile } from '@/shared/anime/anime.semantic-profile';
import type { CanonicalAnime } from '@/shared/anime/anime.types';

export type DestinationPathId = 'story' | 'signals' | 'kinship';

export function destinationStoryRecord(
  orientation: string,
  metadataSynopsis: string | null | undefined,
): string | null {
  const shown = orientation.trim();
  const extra = metadataSynopsis?.trim() ?? '';
  if (extra.length === 0 || extra === shown) return null;
  if (extra.length <= shown.length) return null;
  return extra;
}

export function destinationSignalTags(input: {
  readonly genres: ReadonlyArray<string>;
  readonly synopsis: string;
}): ReadonlyArray<string> {
  const profile = buildAnimeSemanticProfile({
    malId: 0,
    title: '',
    alternateTitle: null,
    year: null,
    type: 'tv',
    episodeCount: null,
    status: 'finished',
    genres: [...input.genres],
    studios: [],
    synopsis: input.synopsis,
  });
  return profile.evidence.map((entry) => entry.tag.toUpperCase());
}

/** Kinship when the destination has a MAL identity — catalog or discovered. */
export function destinationKinshipAvailable(anime: CanonicalAnime): boolean {
  return malIdForSlug(anime.slug) != null;
}

export function destinationAvailablePaths(input: {
  readonly story: string | null;
  readonly signalCount: number;
  readonly kinshipAvailable: boolean;
  readonly copy: {
    readonly story: string;
    readonly storyHint: string;
    readonly signals: string;
    readonly signalsHint: string;
    readonly kinship: string;
    readonly kinshipHint: string;
  };
}): ReadonlyArray<{
  readonly id: DestinationPathId;
  readonly label: string;
  readonly hint: string;
}> {
  const paths: Array<{
    readonly id: DestinationPathId;
    readonly label: string;
    readonly hint: string;
  }> = [];
  if (input.story) {
    paths.push({
      id: 'story',
      label: input.copy.story,
      hint: input.copy.storyHint,
    });
  }
  if (input.signalCount > 0) {
    paths.push({
      id: 'signals',
      label: input.copy.signals,
      hint: input.copy.signalsHint,
    });
  }
  if (input.kinshipAvailable) {
    paths.push({
      id: 'kinship',
      label: input.copy.kinship,
      hint: input.copy.kinshipHint,
    });
  }
  return paths;
}
