import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { canonicalizeDiscoveryCandidate } from '@/shared/anime/anime.discovery';
import { ANIME_CATALOG } from '@/shared/anime/anime.catalog';

import { ANIME_DESTINATION_COPY } from './anime-destination.constants';
import { destinationKinshipAvailable } from './anime-destination.paths';

const widgetDir = dirname(fileURLToPath(import.meta.url));
const destinationSource = readFileSync(
  join(widgetDir, 'anime-destination.tsx'),
  'utf8',
);
const pathsViewSource = readFileSync(
  join(widgetDir, 'anime-destination-paths.tsx'),
  'utf8',
);
const networkSource = readFileSync(
  join(widgetDir, 'anime-destination-network.tsx'),
  'utf8',
);
const universeCss = readFileSync(
  join(widgetDir, 'anime-destination.universe.css'),
  'utf8',
);
const pathsHelperSource = readFileSync(
  join(widgetDir, 'anime-destination.paths.ts'),
  'utf8',
);
const discoveryRoute = readFileSync(
  join(widgetDir, '../../app/api/anime-discovery/route.ts'),
  'utf8',
);
const typesSource = readFileSync(
  join(widgetDir, '../../shared/anime/anime.types.ts'),
  'utf8',
);

function bySlug(slug: string) {
  const anime = ANIME_CATALOG.find((entry) => entry.slug === slug);
  assert.ok(anime, slug);
  return anime;
}

describe('TASK-099 universe network', () => {
  test('kinship is available for any anime with a MAL identity, including discovered worlds', () => {
    const solo = bySlug('solo-leveling');
    assert.equal(destinationKinshipAvailable(solo), true);

    const discovered = canonicalizeDiscoveryCandidate({
      malId: 11757,
      title: 'Sword Art Online',
      alternateTitle: null,
      year: 2012,
      type: 'tv',
      episodeCount: 25,
      status: 'finished',
      genres: ['Action'],
      studios: [],
      poster: 'https://cdn.myanimelist.net/images/anime/11/39717.jpg',
    });
    assert.match(discovered.slug, /^discovered-11757$/);
    assert.equal(destinationKinshipAvailable(discovered), true);
    assert.match(pathsHelperSource, /malIdForSlug/);
    assert.doesNotMatch(
      pathsHelperSource,
      /destinationKinshipAvailable[\s\S]*getAnimeBySlug\(anime\.slug\) != null/,
    );
  });

  test('similar discovery resolves discovered seeds, not only catalog slugs', () => {
    assert.match(discoveryRoute, /discoveredMalIdFromSlug/);
    assert.match(discoveryRoute, /similar/);
    assert.doesNotMatch(
      discoveryRoute,
      /const anime = getAnimeBySlug\(similar\);\s*if \(!anime\) return Response\.json\(\{ candidates: \[\] \}\)/,
    );
  });

  test('neighboring worlds render as a spatial universe network, not a recommendation list', () => {
    assert.match(networkSource, /data-slot="anime-universe-network"/);
    assert.match(networkSource, /data-slot="anime-universe-neighbor"/);
    assert.match(networkSource, /data-neighbor-state/);
    assert.match(networkSource, /data-slot="anime-universe-network-origin"/);
    assert.match(destinationSource, /AnimeUniverseNetwork|anime-destination-network/);
    assert.match(destinationSource, /data-universe-depth="beyond"/);
    assert.doesNotMatch(
      networkSource,
      /Recommended for you|because you|match percentage|You might also like/i,
    );
    assert.doesNotMatch(networkSource, /grid-cols-|carousel|swiper/i);
    assert.equal(ANIME_DESTINATION_COPY.neighbors, 'Neighboring worlds');
    assert.match(ANIME_DESTINATION_COPY.beyondBody, /universe does not/i);
  });

  test('neighbor focus is consequential for pointer, keyboard, and touch', () => {
    assert.match(networkSource, /onFocus|onBlur|onPointerEnter|onPointerLeave/);
    assert.match(networkSource, /data-neighbor-state=\{|data-neighbor-state="/);
    assert.match(universeCss, /data-neighbor-state/);
    assert.match(universeCss, /\[data-neighbor-state='prominent'\]|\[data-neighbor-state="prominent"\]/);
    assert.match(universeCss, /\[data-neighbor-state='receded'\]|\[data-neighbor-state="receded"\]/);
    assert.match(networkSource, /min-h-11|min-h-\[2\.75rem\]/);
    assert.match(networkSource, /focus-visible:ring/);
  });

  test('selecting a neighbor still travels through arriveAnime and existing transport', () => {
    assert.match(networkSource, /arriveAnime|onSelect/);
    assert.match(destinationSource, /arriveAnime\(/);
    assert.match(destinationSource, /canonicalizeDiscoveryCandidate/);
    assert.match(destinationSource, /markArrivalVia\('kinship'\)/);
    assert.match(
      destinationSource,
      /candidates\.slice\(0,\s*ANIME_UNIVERSE_NETWORK_MAX\)|ANIME_UNIVERSE_NETWORK_MAX/,
    );
    assert.doesNotMatch(destinationSource, /router\.push|window\.location|href=\{.*discovered/);
    assert.doesNotMatch(networkSource, /WebGL|R3F|<canvas/i);
    assert.doesNotMatch(typesSource, /universeGraph|worldPosition|journeyGraph/);
  });

  test('Beyond bridges neighboring worlds to Continuum without a second return system', () => {
    assert.match(destinationSource, /id="anime-universe-beyond"/);
    assert.match(destinationSource, /AnimeUniverseNetwork|data-slot="anime-universe-network"/);
    assert.match(destinationSource, /clearAnimeArrival/);
    assert.match(destinationSource, /returnContinuum/);
    assert.equal(
      (destinationSource.match(/clearAnimeArrival/g) ?? []).length >= 1,
      true,
    );
    assert.doesNotMatch(destinationSource, /createContext|zustand|world-position/);
  });

  test('neighbor lookup stays lazy, abortable, and non-recursive', () => {
    assert.match(
      destinationSource,
      /useNeighboringWorlds|requestAnimeDiscovery\(\{\s*kind: 'similar'/,
    );
    assert.match(
      readFileSync(join(widgetDir, 'use-neighboring-worlds.ts'), 'utf8'),
      /AbortController|controller\.abort/,
    );
    assert.doesNotMatch(destinationSource, /prefetch|for \(.*neighbors|recursive/);
    assert.doesNotMatch(networkSource, /requestAnimeDiscovery/);
    assert.match(destinationSource, /here === 'beyond'|here === 'paths'/);
  });
});
