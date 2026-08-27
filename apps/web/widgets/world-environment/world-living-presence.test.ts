import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import type { CanonicalAnime } from '@/shared/anime';
import { DISTANCE, DURATION } from '@/shared/lib/motion';

import { worldArrivalAtmosphere } from './world-arrival.atmosphere';
import {
  LIVING_PRESENCE_PERIOD,
  LIVING_PRESENCE_SCALE,
  livingPresenceTravel,
} from './world-living-presence.motion';
import { worldLivingPresence } from './world-living-presence';

const dir = dirname(fileURLToPath(import.meta.url));
const livingSource = readFileSync(
  join(dir, 'world-living-presence.ts'),
  'utf8',
);
const environmentSource = readFileSync(
  join(dir, 'world-environment.tsx'),
  'utf8',
);
const livingCss = readFileSync(join(dir, 'world-living-presence.css'), 'utf8');
const sceneSource = readFileSync(
  join(dir, '../world-scene/world-scene.tsx'),
  'utf8',
);
const crossingSource = readFileSync(
  join(dir, 'world-realm-crossing.ts'),
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

describe('worldLivingPresence activation', () => {
  test('idle world is living', () => {
    const atmosphere = worldArrivalAtmosphere({
      arrivedAnime: null,
      regionClimate: null,
    });
    const living = worldLivingPresence({
      atmosphere,
      reduceMotion: false,
    });
    assert.equal(atmosphere.source, 'idle');
    assert.equal(living.active, true);
    assert.equal(living.spatial, true);
    assert.equal(living.ariaHidden, true);
  });

  test('arrival pauses living presence so the crossing owns the beat', () => {
    const atmosphere = worldArrivalAtmosphere({
      arrivedAnime: anime({
        slug: 'solo-leveling',
        genres: ['Action', 'Fantasy'],
      }),
      regionClimate: null,
    });
    const living = worldLivingPresence({
      atmosphere,
      reduceMotion: false,
    });
    assert.equal(atmosphere.source, 'arrival');
    assert.equal(living.active, false);
    assert.equal(living.spatial, false);
  });

  test('region Focus stays living — it is not a crossing', () => {
    const atmosphere = worldArrivalAtmosphere({
      arrivedAnime: null,
      regionClimate: 'cool',
    });
    const living = worldLivingPresence({
      atmosphere,
      reduceMotion: false,
    });
    assert.equal(atmosphere.source, 'region');
    assert.equal(living.active, true);
    assert.equal(living.spatial, true);
  });

  test('ambiguous candidates remain living because they never arrive', () => {
    const atmosphere = worldArrivalAtmosphere({
      arrivedAnime: null,
      regionClimate: null,
    });
    const living = worldLivingPresence({
      atmosphere,
      reduceMotion: false,
    });
    assert.equal(living.active, true);
    assert.equal(atmosphere.arrivalKey, null);
  });

  test('Escape / clearing arrival restores living presence', () => {
    const arrived = worldLivingPresence({
      atmosphere: worldArrivalAtmosphere({
        arrivedAnime: anime({
          slug: 'solo-leveling',
          genres: ['Action', 'Fantasy'],
        }),
        regionClimate: null,
      }),
      reduceMotion: false,
    });
    const idle = worldLivingPresence({
      atmosphere: worldArrivalAtmosphere({
        arrivedAnime: null,
        regionClimate: null,
      }),
      reduceMotion: false,
    });
    assert.equal(arrived.active, false);
    assert.equal(idle.active, true);
  });

  test('reduced motion keeps the world present without travel', () => {
    const atmosphere = worldArrivalAtmosphere({
      arrivedAnime: null,
      regionClimate: null,
    });
    const living = worldLivingPresence({
      atmosphere,
      reduceMotion: true,
    });
    assert.equal(living.active, true);
    assert.equal(living.spatial, false);
    const travel = livingPresenceTravel(true);
    assert.equal(travel.scale, 1);
    assert.equal(travel.y, 0);
  });
});

describe('living presence motion language', () => {
  test('idle travel is slower than a crossing and not opacity-only', () => {
    assert.ok(LIVING_PRESENCE_PERIOD.depth > DURATION.CINEMATIC * 8);
    assert.ok(LIVING_PRESENCE_SCALE.peak > 1);
    assert.ok(LIVING_PRESENCE_SCALE.peak < 1.05);
    const travel = livingPresenceTravel(false);
    assert.ok(Array.isArray(travel.scale));
    assert.ok(Array.isArray(travel.y));
    assert.ok((travel.y as number[]).some((value) => value !== 0));
    assert.ok(
      (travel.y as number[]).every((value) => Math.abs(value) <= DISTANCE.SM),
    );
  });
});

describe('living presence architecture freeze', () => {
  test('environment marks living presence without owning CanonicalAnime', () => {
    assert.match(environmentSource, /worldLivingPresence/);
    assert.match(environmentSource, /data-living=/);
    assert.match(environmentSource, /aria-hidden="true"/);
    assert.doesNotMatch(livingSource, /CanonicalAnime/);
  });

  test('no resolver, store, API, Watch Now, or URL mutation', () => {
    const sources = `${livingSource}\n${environmentSource}`;
    assert.doesNotMatch(
      sources,
      /resolveAnime|planAnimeAsk|createContext|zustand/,
    );
    assert.doesNotMatch(
      sources,
      /fetch\(|\/api\/|openWatchPath|verifiedWatchUrl/,
    );
    assert.doesNotMatch(sources, /livingStore|idleStore|presenceStore/);
    assert.doesNotMatch(environmentSource, /router\.|searchParams|worldHref/);
  });

  test('TASK-031 crossing activation is unchanged', () => {
    assert.match(crossingSource, /source === 'arrival'/);
    assert.match(sceneSource, /WorldRealmCrossing/);
    assert.doesNotMatch(livingSource, /worldRealmCrossing/);
  });
});

describe('TASK-043 living paint budget', () => {
  test('depth plates are not CSS-animated; light remains the idle breath', () => {
    assert.doesNotMatch(
      livingCss,
      /\[data-living='true'\] \.aether-living-depth \{[\s\S]*?animation:/,
    );
    assert.match(
      livingCss,
      /\[data-slot='world-environment'\]\[data-living='true'\] \.aether-living-light/,
    );
    assert.match(livingCss, /animation:\s*aether-living-light/);
  });

  test('haze is not a blurred full-width mover', () => {
    assert.doesNotMatch(environmentSource, /aether-living-haze[^\n]*blur-3xl/);
    assert.doesNotMatch(
      livingCss,
      /\[data-living='true'\] \.aether-living-haze \{[\s\S]*?animation:/,
    );
  });

  test('will-change is not left on huge bitmap layers', () => {
    assert.doesNotMatch(
      environmentSource,
      /aether-living-depth[^\n]*will-change-transform/,
    );
    assert.doesNotMatch(
      environmentSource,
      /aether-living-haze[^\n]*will-change-transform/,
    );
  });
});

describe('TASK-046 living light compositor budget', () => {
  test('1920 idle shrinks the living-light box and keeps opacity breath', () => {
    assert.match(livingCss, /@media \(min-width:\s*120rem\)/);
    assert.match(
      livingCss,
      /\[data-slot='world-environment'\] \.aether-living-light \{[\s\S]*?inset:\s*18%\s*16%/,
    );
    assert.match(
      livingCss,
      /\[data-slot='world-environment'\]\[data-living='true'\] \.aether-living-light/,
    );
    assert.match(livingCss, /animation:\s*aether-living-light/);
  });
});
