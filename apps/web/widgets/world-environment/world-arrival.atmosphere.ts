/**
 * Arrival atmosphere — presentation derived from arrivedAnime.
 *
 * Reuses existing Soft Aether climate tokens. Not Focus, not a new world,
 * not MAL enrichment. Clearing arrivedAnime returns idle.
 */

import type { CanonicalAnime } from '@/shared/anime';
import type { WorldClimate } from '@/shared/world';

import {
  WORLD_ENVIRONMENT_ARRIVAL_IDENTITY_OPACITY,
  WORLD_ENVIRONMENT_ARRIVAL_LIGHT_OPACITY,
  WORLD_ENVIRONMENT_DESTINATION_LIGHT_OPACITY,
  WORLD_ENVIRONMENT_IDENTITY_ATMOSPHERE_OPACITY,
} from './world-environment.constants';

export type AtmosphereSource = 'idle' | 'region' | 'arrival';

export type WorldArrivalAtmosphere = {
  readonly climate: WorldClimate | null;
  readonly source: AtmosphereSource;
  readonly destinationOpacity: number;
  readonly identityOpacity: number;
  /** Existing CanonicalAnime slug when arrived; presentation key only. */
  readonly arrivalKey: string | null;
};

export type WorldArrivalAtmosphereInput = {
  readonly arrivedAnime: CanonicalAnime | null;
  readonly regionClimate: WorldClimate | null;
};

/**
 * Bounded local-genre accents onto existing WorldClimate vocabulary.
 *
 * Action is the catalog floor and maps to charged intensity. An additional
 * mapped genre becomes the arrival accent so ubiquitous Action does not
 * collapse every destination into one wash. Unmapped genres (Fantasy, etc.)
 * are ignored. Arrival with no mapped genre still uses charged — never idle.
 */
const GENRE_CLIMATE: Record<string, WorldClimate> = {
  action: 'charged',
  horror: 'charged',
  thriller: 'charged',
  supernatural: 'cool',
  mystery: 'cool',
  'sci-fi': 'cool',
  'sci fi': 'cool',
  drama: 'warm',
  romance: 'warm',
  comedy: 'warm',
};

function climateFromLocalGenres(
  genres: ReadonlyArray<string>,
): WorldClimate {
  const mapped = genres.map(
    (genre) => GENRE_CLIMATE[genre.trim().toLowerCase()],
  );
  const accent = mapped.find(
    (climate): climate is Exclude<WorldClimate, 'charged'> =>
      climate === 'cool' || climate === 'warm',
  );
  if (accent) return accent;
  return 'charged';
}

export function worldArrivalAtmosphere(
  input: WorldArrivalAtmosphereInput,
): WorldArrivalAtmosphere {
  if (input.arrivedAnime) {
    return {
      climate: climateFromLocalGenres(input.arrivedAnime.genres),
      source: 'arrival',
      destinationOpacity: WORLD_ENVIRONMENT_ARRIVAL_LIGHT_OPACITY,
      identityOpacity: WORLD_ENVIRONMENT_ARRIVAL_IDENTITY_OPACITY,
      arrivalKey: input.arrivedAnime.slug,
    };
  }

  if (input.regionClimate) {
    return {
      climate: input.regionClimate,
      source: 'region',
      destinationOpacity: WORLD_ENVIRONMENT_DESTINATION_LIGHT_OPACITY,
      identityOpacity: WORLD_ENVIRONMENT_IDENTITY_ATMOSPHERE_OPACITY,
      arrivalKey: null,
    };
  }

  return {
    climate: null,
    source: 'idle',
    destinationOpacity: 0,
    identityOpacity: 0,
    arrivalKey: null,
  };
}
