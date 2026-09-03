import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

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
const typesSource = readFileSync(
  join(widgetDir, '../../shared/anime/anime.types.ts'),
  'utf8',
);

function bySlug(slug: string) {
  const anime = ANIME_CATALOG.find((entry) => entry.slug === slug);
  assert.ok(anime, slug);
  return anime;
}

describe('TASK-098 living anime universe', () => {
  test('exploring a path is destination-local state that the environment can answer', () => {
    assert.match(destinationSource, /data-universe-explore/);
    assert.match(destinationSource, /data-universe-claimed/);
    assert.match(pathsViewSource, /onExplore/);
    assert.match(universeCss, /data-universe-explore/);
    assert.match(universeCss, /data-universe-claimed/);
    assert.doesNotMatch(destinationSource, /createContext|zustand|world-position/);
  });

  test('neighboring worlds reuse kinship similar lookup and arriveAnime, not a second recsys', () => {
    const solo = bySlug('solo-leveling');
    assert.equal(destinationKinshipAvailable(solo), true);
    assert.match(destinationSource, /data-slot="anime-universe-neighbors"/);
    assert.match(destinationSource, /ANIME_UNIVERSE_NETWORK_MAX|candidates\.slice\(0,\s*3\)/);
    assert.match(destinationSource, /requestAnimeDiscovery\(\{\s*kind: 'similar'|useNeighboringWorlds/);
    assert.match(destinationSource, /arriveAnime\(/);
    assert.match(destinationSource, /canonicalizeDiscoveryCandidate/);
    assert.match(destinationSource, /markArrivalVia\('kinship'\)/);
    assert.doesNotMatch(
      destinationSource + networkSource,
      /Recommended for you|because you|match percentage/i,
    );
    assert.equal(ANIME_DESTINATION_COPY.neighbors, 'Neighboring worlds');
  });

  test('world facts open Signals exploration without becoming catalog filters', () => {
    assert.match(destinationSource, /href="#anime-universe-paths"/);
    assert.match(destinationSource, /onExplore\('signals'\)|onExplore\("signals"\)|setExplorePath\('signals'\)/);
    assert.doesNotMatch(destinationSource, /rounded-full|genre-filter|searchParams/);
    assert.match(ANIME_DESTINATION_COPY.claimed, /remembered/i);
  });

  test('spatial identity is a quiet coordinate, not a sticky website header', () => {
    assert.match(destinationSource, /data-slot="anime-universe-anchor"/);
    assert.doesNotMatch(
      destinationSource,
      /sticky top-0|fixed inset-x-0 top-0|site-header/,
    );
    assert.match(universeCss, /anime-universe-anchor/);
    assert.match(universeCss, /data-universe-explore='signals'/);
    assert.match(universeCss, /data-universe-explore='kinship'/);
  });

  test('living interaction does not add transport, analytics, persistence, or WebGL', () => {
    assert.doesNotMatch(destinationSource, /recordDestinationArrival|\/api\/events/);
    assert.doesNotMatch(pathsViewSource, /localStorage|indexedDB/);
    assert.doesNotMatch(destinationSource, /onWheel|preventDefault\(\)|scrollTo\(/);
    assert.doesNotMatch(destinationSource, /WebGL|R3F|<canvas/i);
    assert.doesNotMatch(typesSource, /character|episodeGallery|relatedWorlds/);
    assert.match(destinationSource, /here === 'paths'|here === 'beyond'/);
  });
});
