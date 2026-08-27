import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import type { CanonicalAnime } from '@/shared/anime';

import {
  WORLD_ENVIRONMENT_ARRIVAL_IDENTITY_OPACITY,
  WORLD_ENVIRONMENT_ARRIVAL_LIGHT_OPACITY,
  WORLD_ENVIRONMENT_DESTINATION_LIGHT_OPACITY,
  WORLD_ENVIRONMENT_IDENTITY_ATMOSPHERE_OPACITY,
} from './world-environment.constants';
import { worldArrivalAtmosphere } from './world-arrival.atmosphere';

function anime(partial: {
  readonly slug: string;
  readonly genres: ReadonlyArray<string>;
}): CanonicalAnime {
  return {
    id: `anime.${partial.slug}`,
    canonicalTitle: partial.slug,
    alternateTitles: [],
    slug: partial.slug,
    synopsis: 'Local orientation copy.',
    year: 2024,
    type: 'tv',
    episodeCount: 12,
    status: 'finished',
    genres: partial.genres,
    studios: [],
    poster: null,
    officialUrl: null,
    ratings: { mal: null, crunchyroll: null },
  };
}

describe('worldArrivalAtmosphere idle', () => {
  test('idle with no region keeps the existing empty atmosphere', () => {
    const presentation = worldArrivalAtmosphere({
      arrivedAnime: null,
      regionClimate: null,
    });
    assert.equal(presentation.source, 'idle');
    assert.equal(presentation.climate, null);
    assert.equal(presentation.destinationOpacity, 0);
    assert.equal(presentation.identityOpacity, 0);
  });

  test('region Focus uses region climate at the existing region mix', () => {
    const presentation = worldArrivalAtmosphere({
      arrivedAnime: null,
      regionClimate: 'cool',
    });
    assert.equal(presentation.source, 'region');
    assert.equal(presentation.climate, 'cool');
    assert.equal(
      presentation.destinationOpacity,
      WORLD_ENVIRONMENT_DESTINATION_LIGHT_OPACITY,
    );
    assert.equal(
      presentation.identityOpacity,
      WORLD_ENVIRONMENT_IDENTITY_ATMOSPHERE_OPACITY,
    );
  });
});

describe('worldArrivalAtmosphere arrival', () => {
  test('arrived anime is a distinct presentation from idle', () => {
    const idle = worldArrivalAtmosphere({
      arrivedAnime: null,
      regionClimate: null,
    });
    const arrived = worldArrivalAtmosphere({
      arrivedAnime: anime({
        slug: 'solo-leveling',
        genres: ['Action', 'Fantasy'],
      }),
      regionClimate: null,
    });
    assert.equal(arrived.source, 'arrival');
    assert.notEqual(arrived.climate, idle.climate);
    assert.ok(arrived.destinationOpacity > idle.destinationOpacity);
    assert.ok(
      arrived.destinationOpacity > WORLD_ENVIRONMENT_DESTINATION_LIGHT_OPACITY,
    );
    assert.equal(
      arrived.destinationOpacity,
      WORLD_ENVIRONMENT_ARRIVAL_LIGHT_OPACITY,
    );
    assert.equal(
      arrived.identityOpacity,
      WORLD_ENVIRONMENT_ARRIVAL_IDENTITY_OPACITY,
    );
  });

  test('mapping is deterministic for the same local genres', () => {
    const first = worldArrivalAtmosphere({
      arrivedAnime: anime({
        slug: 'solo-leveling',
        genres: ['Action', 'Fantasy'],
      }),
      regionClimate: 'neutral',
    });
    const second = worldArrivalAtmosphere({
      arrivedAnime: anime({
        slug: 'solo-leveling',
        genres: ['Action', 'Fantasy'],
      }),
      regionClimate: 'cool',
    });
    assert.equal(first.climate, 'charged');
    assert.equal(second.climate, first.climate);
    assert.equal(second.source, 'arrival');
  });

  test('MAL-shaped enrichment fields do not alter climate selection', () => {
    const arrived = anime({
      slug: 'discovered-40748',
      genres: ['Action'],
    });
    const enriched = {
      ...arrived,
      ratings: { mal: 8.64, crunchyroll: null },
      synopsis: 'Provider synopsis must not retint arrival.',
    };
    const before = worldArrivalAtmosphere({
      arrivedAnime: arrived,
      regionClimate: null,
    });
    const after = worldArrivalAtmosphere({
      arrivedAnime: enriched,
      regionClimate: null,
    });
    assert.equal(before.climate, 'charged');
    assert.equal(after.climate, before.climate);
    assert.equal(after.source, 'arrival');
  });

  test('Fate/stay night and Fate/Zero stay on existing climate vocabulary', () => {
    const stayNight = worldArrivalAtmosphere({
      arrivedAnime: anime({
        slug: 'fate-stay-night',
        genres: ['Action', 'Fantasy', 'Supernatural'],
      }),
      regionClimate: null,
    });
    const zero = worldArrivalAtmosphere({
      arrivedAnime: anime({
        slug: 'fate-zero',
        genres: ['Action', 'Fantasy', 'Drama'],
      }),
      regionClimate: null,
    });
    assert.equal(stayNight.climate, 'cool');
    assert.equal(zero.climate, 'warm');
    assert.equal(stayNight.source, 'arrival');
    assert.equal(zero.source, 'arrival');
  });

  test('empty local genres still acknowledge arrival without inventing Focus', () => {
    const presentation = worldArrivalAtmosphere({
      arrivedAnime: anime({ slug: 'discovered-1', genres: [] }),
      regionClimate: 'cool',
    });
    assert.equal(presentation.source, 'arrival');
    assert.equal(presentation.climate, 'charged');
    assert.equal('focusedRegion' in presentation, false);
  });

  test('clearing arrival returns idle even if a region climate is absent', () => {
    const arrived = worldArrivalAtmosphere({
      arrivedAnime: anime({
        slug: 'solo-leveling',
        genres: ['Action', 'Fantasy'],
      }),
      regionClimate: null,
    });
    const cleared = worldArrivalAtmosphere({
      arrivedAnime: null,
      regionClimate: null,
    });
    assert.equal(arrived.source, 'arrival');
    assert.equal(cleared.source, 'idle');
    assert.equal(cleared.climate, null);
  });

  test('reduced-motion final values equal the arrived still state', () => {
    const motion = worldArrivalAtmosphere({
      arrivedAnime: anime({
        slug: 'solo-leveling',
        genres: ['Action', 'Fantasy'],
      }),
      regionClimate: null,
    });
    const reduced = worldArrivalAtmosphere({
      arrivedAnime: anime({
        slug: 'solo-leveling',
        genres: ['Action', 'Fantasy'],
      }),
      regionClimate: null,
    });
    assert.deepEqual(reduced, motion);
  });
});
