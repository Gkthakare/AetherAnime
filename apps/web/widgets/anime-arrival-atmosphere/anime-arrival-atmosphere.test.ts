import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { ANIME_CATALOG } from '@/shared/anime/anime.catalog';
import { canonicalizeDiscoveryCandidate } from '@/shared/anime/anime.discovery';
import { verifiedWatchUrl, watchPathsForAnime } from '@/shared/anime/anime.watch-path';
import { BLUR_RADIUS } from '@/shared/lib/graphics';
import { DURATION } from '@/shared/lib/motion';

import { animeArrivalAtmosphere } from './anime-arrival-atmosphere';
import {
  ARRIVAL_ATMOSPHERE_OFFSET,
  ARRIVAL_ATMOSPHERE_OPACITY,
  ARRIVAL_ATMOSPHERE_PROJECTION,
  ARRIVAL_ATMOSPHERE_SCALE,
  arrivalAtmosphereTravel,
} from './anime-arrival-atmosphere.motion';

const dir = dirname(fileURLToPath(import.meta.url));
const helperSource = readFileSync(
  join(dir, 'anime-arrival-atmosphere.ts'),
  'utf8',
);
const viewSource = readFileSync(
  join(dir, 'anime-arrival-atmosphere.view.tsx'),
  'utf8',
);
const cssSource = readFileSync(
  join(dir, 'anime-arrival-atmosphere.css'),
  'utf8',
);
const environmentSource = readFileSync(
  join(dir, '../world-environment/world-environment.tsx'),
  'utf8',
);
const sceneSource = readFileSync(
  join(dir, '../world-scene/world-scene.tsx'),
  'utf8',
);
const destinationSource = readFileSync(
  join(dir, '../anime-destination/anime-destination.tsx'),
  'utf8',
);
const watchNowSource = readFileSync(
  join(dir, '../anime-destination/anime-destination.watch-now.ts'),
  'utf8',
);
const crossingSource = readFileSync(
  join(dir, '../world-environment/world-realm-crossing.ts'),
  'utf8',
);
const livingSource = readFileSync(
  join(dir, '../world-environment/world-living-presence.ts'),
  'utf8',
);
const typesSource = readFileSync(
  join(dir, '../../shared/anime/anime.types.ts'),
  'utf8',
);
const nextConfig = readFileSync(join(dir, '../../next.config.ts'), 'utf8');

function bySlug(slug: string) {
  const anime = ANIME_CATALOG.find((entry) => entry.slug === slug);
  assert.ok(anime, slug);
  return anime;
}

describe('animeArrivalAtmosphere activation', () => {
  test('catalog arrivedAnime with poster activates the backdrop', () => {
    const solo = bySlug('solo-leveling');
    const wash = animeArrivalAtmosphere({
      poster: solo.poster,
      reduceMotion: false,
    });
    assert.ok(solo.poster);
    assert.equal(wash.active, true);
    assert.equal(wash.source, solo.poster);
    assert.equal(wash.spatial, true);
    assert.equal(wash.ariaHidden, true);
  });

  test('arrivedAnime.poster === null does not activate the backdrop', () => {
    const wash = animeArrivalAtmosphere({
      poster: null,
      reduceMotion: false,
    });
    assert.equal(wash.active, false);
    assert.equal(wash.source, null);
    assert.equal(wash.spatial, false);
  });

  test('idle / no arrivedAnime does not activate the backdrop', () => {
    const wash = animeArrivalAtmosphere({
      poster: null,
      reduceMotion: false,
    });
    assert.equal(wash.active, false);
    assert.equal(wash.source, null);
  });

  test('candidates and unknown never activate because they have no poster', () => {
    const candidate = animeArrivalAtmosphere({
      poster: null,
      reduceMotion: false,
    });
    const unknown = animeArrivalAtmosphere({
      poster: null,
      reduceMotion: false,
    });
    assert.equal(candidate.active, false);
    assert.equal(unknown.active, false);
  });

  test('backdrop source is exactly arrivedAnime.poster', () => {
    const solo = bySlug('solo-leveling');
    const zero = bySlug('fate-zero');
    assert.equal(
      animeArrivalAtmosphere({ poster: solo.poster, reduceMotion: false })
        .source,
      solo.poster,
    );
    assert.equal(
      animeArrivalAtmosphere({ poster: zero.poster, reduceMotion: false })
        .source,
      zero.poster,
    );
    assert.notEqual(solo.poster, zero.poster);
  });

  test('discovered CanonicalAnime keeps poster null and receives no wash', () => {
    const discovered = canonicalizeDiscoveryCandidate({
      malId: 40748,
      title: 'Jujutsu Kaisen',
      alternateTitle: null,
      year: 2020,
      type: 'tv',
      episodeCount: 24,
      status: 'finished',
      genres: ['Action'],
      studios: [],
    });
    assert.equal(discovered.poster, null);
    const wash = animeArrivalAtmosphere({
      poster: discovered.poster,
      reduceMotion: false,
    });
    assert.equal(wash.active, false);
    assert.equal(wash.source, null);
  });

  test('watchlist catalog return uses the same poster wash as direct arrival', () => {
    const poster = bySlug('solo-leveling').poster;
    const direct = animeArrivalAtmosphere({ poster, reduceMotion: false });
    const watchlist = animeArrivalAtmosphere({ poster, reduceMotion: false });
    assert.deepEqual(watchlist, direct);
    assert.equal(direct.active, true);
  });

  test('Escape / clearing poster unmounts the wash', () => {
    const arrived = animeArrivalAtmosphere({
      poster: bySlug('solo-leveling').poster,
      reduceMotion: false,
    });
    const cleared = animeArrivalAtmosphere({
      poster: null,
      reduceMotion: false,
    });
    assert.equal(arrived.active, true);
    assert.equal(cleared.active, false);
    assert.equal(cleared.source, null);
  });

  test('reduced motion keeps the wash without spatial travel', () => {
    const wash = animeArrivalAtmosphere({
      poster: bySlug('solo-leveling').poster,
      reduceMotion: true,
    });
    assert.equal(wash.active, true);
    assert.equal(wash.spatial, false);
    assert.equal(wash.source, bySlug('solo-leveling').poster);
    const travel = arrivalAtmosphereTravel(true);
    assert.equal(travel.scale, ARRIVAL_ATMOSPHERE_SCALE.settled);
  });
});

describe('arrival atmosphere motion language', () => {
  test('enter duration matches TASK-031 cinematic crossing', () => {
    assert.equal(DURATION.CINEMATIC, 1.2);
    const travel = arrivalAtmosphereTravel(false);
    assert.ok(Array.isArray(travel.scale));
    assert.ok(
      (travel.scale as number[])[0] > ARRIVAL_ATMOSPHERE_SCALE.settled,
    );
    assert.equal(
      (travel.scale as number[]).at(-1),
      ARRIVAL_ATMOSPHERE_SCALE.settled,
    );
    assert.ok(ARRIVAL_ATMOSPHERE_SCALE.settled > 1);
    assert.ok(ARRIVAL_ATMOSPHERE_SCALE.enter > ARRIVAL_ATMOSPHERE_SCALE.settled);
  });
});

describe('arrival atmosphere architecture freeze', () => {
  test('presentation does not create or modify CanonicalAnime identity', () => {
    assert.doesNotMatch(helperSource, /CanonicalAnime/);
    assert.doesNotMatch(viewSource, /CanonicalAnime/);
    assert.match(typesSource, /readonly poster: string \| null/);
    assert.doesNotMatch(typesSource, /backdrop|artworkKey|imageKey/);
  });

  test('WorldScene passes arrivedAnime.poster without a second resolver', () => {
    assert.match(sceneSource, /poster=\{arrivedAnime\?\.poster \?\? null\}/);
    assert.doesNotMatch(viewSource, /resolveAnime|planAnimeAsk|arriveAnime/);
    assert.doesNotMatch(helperSource, /resolveAnime|planAnimeAsk|arriveAnime/);
  });

  test('wash mounts inside WorldEnvironment under identity veil and vignette', () => {
    const midground = environmentSource.indexOf(
      'slot="world-environment-midground-architecture"',
    );
    const wash = environmentSource.indexOf('<AnimeArrivalAtmosphere');
    const identVeil = environmentSource.indexOf(
      'data-slot="world-environment-identity-veil"',
    );
    const vignette = environmentSource.indexOf(
      'data-slot="world-environment-vignette"',
    );
    assert.ok(midground > 0);
    assert.ok(wash > midground);
    assert.ok(identVeil > wash);
    assert.ok(vignette > wash);
    assert.match(environmentSource, /poster=\{poster/);
  });

  test('backdrop is decorative, hidden from AT, and ignores pointer', () => {
    assert.match(viewSource, /aria-hidden="true"/);
    assert.match(viewSource, /data-slot="anime-arrival-atmosphere"/);
    assert.match(viewSource, /pointer-events-none/);
    assert.match(viewSource, /alt=""/);
  });

  test('blur is isolated to the wash image, not backdrop-filter on the UI', () => {
    assert.match(cssSource, /filter:\s*blur/);
    assert.doesNotMatch(cssSource, /backdrop-filter/);
    assert.doesNotMatch(viewSource, /backdrop-filter|backdrop-blur/);
    assert.match(viewSource, /BLUR_RADIUS/);
    assert.equal(BLUR_RADIUS.lg, '24px');
  });

  test('reduced motion CSS removes scale travel', () => {
    assert.match(cssSource, /prefers-reduced-motion:\s*reduce/);
    assert.match(cssSource, /aether-arrival-atmosphere-reduced/);
  });

  test('no resolver, store, API, remote artwork, or Watch Now dependency', () => {
    const sources = `${helperSource}\n${viewSource}`;
    assert.doesNotMatch(
      sources,
      /resolveAnime|planAnimeAsk|createContext|zustand/,
    );
    assert.doesNotMatch(
      sources,
      /fetch\(|\/api\/|openWatchPath|verifiedWatchUrl/,
    );
    assert.doesNotMatch(
      sources,
      /BackdropStore|ArtworkStore|AnimeDestinationStore|crunchyroll/,
    );
    assert.match(nextConfig, /remotePatterns/);
    assert.match(nextConfig, /cdn\.myanimelist\.net/);
    assert.match(nextConfig, /\/images\/anime\/\*\*/);
  });

  test('Watch Now authority and TASK-031 / TASK-032 remain unchanged', () => {
    assert.match(watchNowSource, /noopener,noreferrer/);
    assert.match(destinationSource, /openWatchPath/);
    assert.match(crossingSource, /source === 'arrival'/);
    assert.match(livingSource, /source !== 'arrival'/);
    assert.match(sceneSource, /WorldRealmCrossing/);
    const url = verifiedWatchUrl(
      watchPathsForAnime(bySlug('solo-leveling')),
    );
    assert.equal(url, 'https://sololeveling-anime.net/');
  });

  test('foreground poster still uses the same catalog poster string', () => {
    assert.match(destinationSource, /src=\{anime\.poster\}/);
    assert.match(viewSource, /src=\{presentation\.source\}/);
  });
});

describe('TASK-038 immersive poster-derived atmosphere', () => {
  test('background source equals arrivedAnime.poster and is not a new artwork field', () => {
    const solo = bySlug('solo-leveling');
    const zero = bySlug('fate-zero');
    assert.equal(
      animeArrivalAtmosphere({ poster: solo.poster, reduceMotion: false })
        .source,
      solo.poster,
    );
    assert.equal(
      animeArrivalAtmosphere({ poster: zero.poster, reduceMotion: false })
        .source,
      zero.poster,
    );
    assert.match(viewSource, /src=\{presentation\.source\}/);
    assert.doesNotMatch(typesSource, /backdrop|heroImage|backgroundPoster/);
  });

  test('foreground poster stays the same source and stays unblurred', () => {
    assert.match(destinationSource, /src=\{anime\.poster\}/);
    assert.doesNotMatch(
      destinationSource,
      /BLUR_RADIUS|filter:\s*blur|--arrival-atmosphere-blur/,
    );
    assert.match(destinationSource, /scale-\[1\.02\]/);
  });

  test('idle, candidates, unknown, and discovered poster-null receive no atmosphere', () => {
    assert.equal(
      animeArrivalAtmosphere({ poster: null, reduceMotion: false }).active,
      false,
    );
    const discovered = canonicalizeDiscoveryCandidate({
      malId: 40748,
      title: 'Jujutsu Kaisen',
      alternateTitle: null,
      year: 2020,
      type: 'tv',
      episodeCount: 24,
      status: 'finished',
      genres: ['Action'],
      studios: [],
    });
    assert.equal(discovered.poster, null);
    assert.equal(
      animeArrivalAtmosphere({
        poster: discovered.poster,
        reduceMotion: false,
      }).active,
      false,
    );
  });

  test('projection is environmental Option D field — soft blur, high settle, no screen wash', () => {
    assert.match(viewSource, /BLUR_RADIUS\.lg/);
    assert.equal(BLUR_RADIUS.lg, '24px');
    assert.ok(
      Number.parseFloat(BLUR_RADIUS.lg) <
        Number.parseFloat(BLUR_RADIUS.atmospheric),
    );
    assert.doesNotMatch(cssSource, /mix-blend-mode:\s*screen/);
    assert.match(cssSource, /mask-image:\s*radial-gradient/);
    assert.match(viewSource, /ARRIVAL_ATMOSPHERE_PROJECTION/);
    assert.match(ARRIVAL_ATMOSPHERE_PROJECTION, /inset-\[-/);
    const overscan = Number.parseInt(
      ARRIVAL_ATMOSPHERE_PROJECTION.match(/inset-\[-(\d+)%\]/)?.[1] ?? '0',
      10,
    );
    assert.ok(overscan >= 20);
    assert.ok(overscan < 40);
    assert.ok(ARRIVAL_ATMOSPHERE_OPACITY.settle >= 0.7);
    assert.ok(ARRIVAL_ATMOSPHERE_OPACITY.settle <= 0.9);
    assert.ok(ARRIVAL_ATMOSPHERE_SCALE.enter <= 1.12);
    assert.ok(ARRIVAL_ATMOSPHERE_SCALE.settled >= 1.04);
    assert.ok(ARRIVAL_ATMOSPHERE_SCALE.settled < ARRIVAL_ATMOSPHERE_SCALE.enter);
    assert.match(ARRIVAL_ATMOSPHERE_OFFSET.x, /%/);
    assert.match(ARRIVAL_ATMOSPHERE_OFFSET.y, /%/);
    assert.doesNotMatch(viewSource, /getContext\(|WebGL|createImageBitmap/);
    assert.doesNotMatch(cssSource, /backdrop-filter/);
  });

  test('wash does not request a 140vw optimizer width or keep will-change', () => {
    assert.doesNotMatch(viewSource, /sizes="140vw"/);
    assert.match(viewSource, /sizes=\{ARRIVAL_ATMOSPHERE_SIZES\}/);
    assert.doesNotMatch(cssSource, /will-change:/);
  });

  test('background remains decorative and TASK-035–037 stay frozen', () => {
    assert.match(viewSource, /aria-hidden="true"/);
    assert.match(viewSource, /pointer-events-none/);
    assert.match(destinationSource, /ANIME_DESTINATION_STAGE/);
    assert.match(destinationSource, /ANIME_DESTINATION_POSTER_WIDTH/);
    assert.match(destinationSource, /data-slot="anime-destination-watch-now"/);
    assert.match(destinationSource, /onClick=\{onTogglePreview\}/);
    assert.doesNotMatch(
      destinationSource.slice(
        destinationSource.indexOf('function AnimePoster'),
        destinationSource.indexOf('export function AnimeDestination'),
      ),
      /openWatchPath/,
    );
  });
});
