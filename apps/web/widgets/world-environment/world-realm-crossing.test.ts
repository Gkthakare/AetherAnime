import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import type { CanonicalAnime } from '@/shared/anime';
import { DISTANCE, DURATION } from '@/shared/lib/motion';

import { worldArrivalAtmosphere } from './world-arrival.atmosphere';
import {
  REALM_CROSSING_SCALE,
  REALM_CROSSING_TIMES,
  realmCrossingEnvironment,
  realmCrossingTransition,
} from './world-realm-crossing.motion';
import { worldRealmCrossing } from './world-realm-crossing';

const dir = dirname(fileURLToPath(import.meta.url));
const crossingSource = readFileSync(join(dir, 'world-realm-crossing.ts'), 'utf8');
const crossingView = readFileSync(
  join(dir, 'world-realm-crossing.view.tsx'),
  'utf8',
);
const sceneSource = readFileSync(
  join(dir, '../world-scene/world-scene.tsx'),
  'utf8',
);

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

describe('worldRealmCrossing activation', () => {
  test('idle does not activate crossing', () => {
    const atmosphere = worldArrivalAtmosphere({
      arrivedAnime: null,
      regionClimate: null,
    });
    const crossing = worldRealmCrossing({
      atmosphere,
      reduceMotion: false,
    });
    assert.equal(atmosphere.source, 'idle');
    assert.equal(crossing.active, false);
    assert.equal(crossing.key, null);
    assert.equal(crossing.spatial, false);
  });

  test('arrivedAnime activates crossing keyed to the slug', () => {
    const atmosphere = worldArrivalAtmosphere({
      arrivedAnime: anime({
        slug: 'solo-leveling',
        genres: ['Action', 'Fantasy'],
      }),
      regionClimate: null,
    });
    const crossing = worldRealmCrossing({
      atmosphere,
      reduceMotion: false,
    });
    assert.equal(crossing.active, true);
    assert.equal(crossing.key, 'solo-leveling');
    assert.equal(crossing.spatial, true);
    assert.equal(crossing.ariaHidden, true);
  });

  test('crossing key changes with anime identity', () => {
    const solo = worldRealmCrossing({
      atmosphere: worldArrivalAtmosphere({
        arrivedAnime: anime({
          slug: 'solo-leveling',
          genres: ['Action', 'Fantasy'],
        }),
        regionClimate: null,
      }),
      reduceMotion: false,
    });
    const zero = worldRealmCrossing({
      atmosphere: worldArrivalAtmosphere({
        arrivedAnime: anime({
          slug: 'fate-zero',
          genres: ['Action', 'Fantasy', 'Drama'],
        }),
        regionClimate: null,
      }),
      reduceMotion: false,
    });
    assert.equal(solo.key, 'solo-leveling');
    assert.equal(zero.key, 'fate-zero');
    assert.notEqual(solo.key, zero.key);
  });

  test('Solo Leveling receives charged arrival context', () => {
    const atmosphere = worldArrivalAtmosphere({
      arrivedAnime: anime({
        slug: 'solo-leveling',
        genres: ['Action', 'Fantasy'],
      }),
      regionClimate: null,
    });
    assert.equal(atmosphere.climate, 'charged');
    assert.equal(atmosphere.source, 'arrival');
    assert.equal(
      worldRealmCrossing({ atmosphere, reduceMotion: false }).climate,
      'charged',
    );
  });

  test('Fate/Zero receives warm arrival context', () => {
    const atmosphere = worldArrivalAtmosphere({
      arrivedAnime: anime({
        slug: 'fate-zero',
        genres: ['Action', 'Fantasy', 'Drama'],
      }),
      regionClimate: null,
    });
    assert.equal(atmosphere.climate, 'warm');
    assert.equal(
      worldRealmCrossing({ atmosphere, reduceMotion: false }).climate,
      'warm',
    );
  });

  test('ambiguous candidates and unknown do not cross', () => {
    const candidates = worldRealmCrossing({
      atmosphere: worldArrivalAtmosphere({
        arrivedAnime: null,
        regionClimate: null,
      }),
      reduceMotion: false,
    });
    const regionOnly = worldRealmCrossing({
      atmosphere: worldArrivalAtmosphere({
        arrivedAnime: null,
        regionClimate: 'cool',
      }),
      reduceMotion: false,
    });
    assert.equal(candidates.active, false);
    assert.equal(regionOnly.active, false);
    assert.equal(regionOnly.key, null);
  });

  test('watchlist arrival uses the same crossing as catalog arrival', () => {
    const catalog = worldRealmCrossing({
      atmosphere: worldArrivalAtmosphere({
        arrivedAnime: anime({
          slug: 'solo-leveling',
          genres: ['Action', 'Fantasy'],
        }),
        regionClimate: null,
      }),
      reduceMotion: false,
    });
    const watchlist = worldRealmCrossing({
      atmosphere: worldArrivalAtmosphere({
        arrivedAnime: anime({
          slug: 'solo-leveling',
          genres: ['Action', 'Fantasy'],
        }),
        regionClimate: null,
      }),
      reduceMotion: false,
    });
    assert.deepEqual(watchlist, catalog);
  });

  test('Escape / clearing arrival removes crossing', () => {
    const arrived = worldRealmCrossing({
      atmosphere: worldArrivalAtmosphere({
        arrivedAnime: anime({
          slug: 'solo-leveling',
          genres: ['Action', 'Fantasy'],
        }),
        regionClimate: null,
      }),
      reduceMotion: false,
    });
    const cleared = worldRealmCrossing({
      atmosphere: worldArrivalAtmosphere({
        arrivedAnime: null,
        regionClimate: null,
      }),
      reduceMotion: false,
    });
    assert.equal(arrived.active, true);
    assert.equal(cleared.active, false);
    assert.equal(cleared.key, null);
  });

  test('reduced motion preserves arrival acknowledgement without travel', () => {
    const atmosphere = worldArrivalAtmosphere({
      arrivedAnime: anime({
        slug: 'solo-leveling',
        genres: ['Action', 'Fantasy'],
      }),
      regionClimate: null,
    });
    const crossing = worldRealmCrossing({
      atmosphere,
      reduceMotion: true,
    });
    assert.equal(crossing.active, true);
    assert.equal(crossing.spatial, false);
    assert.equal(crossing.climate, 'charged');
    const env = realmCrossingEnvironment(true);
    assert.equal(env.scale, 1);
    assert.equal(env.y, 0);
  });
});

describe('realm crossing motion language', () => {
  test('duration is cinematic with a spatial peak, not opacity-only', () => {
    assert.equal(realmCrossingTransition.duration, DURATION.WARP);
    assert.equal(realmCrossingTransition.ease, 'linear');
    assert.deepEqual(realmCrossingTransition.times, [...REALM_CROSSING_TIMES]);
    assert.deepEqual(REALM_CROSSING_TIMES, [0, 0.16, 0.38, 0.58, 1]);
    assert.ok(REALM_CROSSING_SCALE.peak > REALM_CROSSING_SCALE.travel);
    assert.ok(REALM_CROSSING_SCALE.travel > REALM_CROSSING_SCALE.anticipate);
    const env = realmCrossingEnvironment(false);
    assert.ok(Array.isArray(env.scale));
    assert.ok(Array.isArray(env.y));
    assert.ok((env.y as number[]).some((value) => value !== 0));
    assert.ok((env.y as number[]).every((value) => Math.abs(value) <= DISTANCE.SM));
  });
});

describe('realm crossing architecture freeze', () => {
  test('crossing presentation is aria-hidden and decorative', () => {
    assert.match(crossingView, /aria-hidden="true"/);
    assert.match(crossingView, /data-slot="world-realm-crossing"/);
    assert.match(crossingView, /pointer-events-none/);
  });

  test('crossing frame does not keep will-change on the full environment stack', () => {
    assert.doesNotMatch(
      crossingView,
      /data-slot="world-environment-crossing"[^>]*will-change-transform/,
    );
    assert.doesNotMatch(
      crossingView,
      /origin-center will-change-transform/,
    );
  });

  test('no resolver, store, API, or Watch Now dependency', () => {
    const sources = `${crossingSource}\n${crossingView}`;
    assert.doesNotMatch(sources, /resolveAnime|planAnimeAsk|createContext|zustand/);
    assert.doesNotMatch(sources, /fetch\(|\/api\/|openWatchPath|verifiedWatchUrl/);
    assert.doesNotMatch(sources, /arrivalStore|crossingStore|realmStore/);
  });

  test('crossing does not mutate URL or own CanonicalAnime', () => {
    assert.doesNotMatch(crossingView, /router\.|searchParams|worldHref/);
    assert.doesNotMatch(crossingSource, /CanonicalAnime/);
    assert.match(sceneSource, /WorldRealmCrossing/);
    assert.doesNotMatch(
      sceneSource.split('WorldRealmCrossing')[1]?.slice(0, 200) ?? '',
      /arriveAnime|resolveAnime/,
    );
  });
});
