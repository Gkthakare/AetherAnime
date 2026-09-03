import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { ANIME_CATALOG } from '@/shared/anime/anime.catalog';
import { canonicalizeDiscoveryCandidate } from '@/shared/anime/anime.discovery';

import { ANIME_DESTINATION_COPY } from './anime-destination.constants';
import {
  destinationUniverseNav,
} from './anime-destination.universe';
import { destinationAvailablePaths } from './anime-destination.paths';

const widgetDir = dirname(fileURLToPath(import.meta.url));
const destinationSource = readFileSync(
  join(widgetDir, 'anime-destination.tsx'),
  'utf8',
);
const universeSource = readFileSync(
  join(widgetDir, 'anime-destination.universe.ts'),
  'utf8',
);
const universeCss = readFileSync(
  join(widgetDir, 'anime-destination.universe.css'),
  'utf8',
);
const pathsViewSource = readFileSync(
  join(widgetDir, 'anime-destination-paths.tsx'),
  'utf8',
);
const hereSource = readFileSync(
  join(widgetDir, 'use-universe-here.ts'),
  'utf8',
);
const crossingCss = readFileSync(
  join(widgetDir, '../world-environment/world-realm-crossing.css'),
  'utf8',
);

function bySlug(slug: string) {
  const anime = ANIME_CATALOG.find((entry) => entry.slug === slug);
  assert.ok(anime, slug);
  return anime;
}

describe('TASK-097 universe visual depth', () => {
  test('spatial index includes paths and marks the current coordinate', () => {
    const solo = bySlug('solo-leveling');
    const nav = destinationUniverseNav({
      synopsis: solo.synopsis,
      year: solo.year,
      genres: solo.genres,
      studios: solo.studios,
      episodeCount: solo.episodeCount,
      score: null,
      hasPaths: true,
    });
    assert.deepEqual(
      nav.map((entry) => entry.id),
      ['overview', 'story', 'world', 'record', 'paths', 'beyond'],
    );
    assert.match(destinationSource, /data-universe-here/);
    assert.match(destinationSource, /aria-current/);
    assert.match(hereSource, /IntersectionObserver/);
    assert.doesNotMatch(hereSource, /appendChild|infinite scroll/i);
    assert.match(universeCss, /aria-current/);
  });

  test('story, world, and record are spatial sections with environmental crops, not text cards', () => {
    assert.match(destinationSource, /data-universe-depth="story"/);
    assert.match(destinationSource, /data-universe-depth="world"/);
    assert.match(destinationSource, /data-universe-depth="record"/);
    assert.match(destinationSource, /data-universe-depth="beyond"/);
    assert.match(destinationSource, /<h2/);
    assert.match(destinationSource, /ANIME_DESTINATION_COPY\.storyHeading/);
    assert.match(destinationSource, /ANIME_DESTINATION_COPY\.worldHeading/);
    assert.match(destinationSource, /ANIME_DESTINATION_COPY\.recordHeading/);
    assert.match(destinationSource, /data-crop=\{crop\}/);
    assert.match(destinationSource, /crop="story"/);
    assert.match(destinationSource, /crop="world"/);
    assert.match(destinationSource, /crop="record"/);
    assert.match(destinationSource, /crop="beyond"/);
    assert.match(destinationSource, /data-slot="anime-universe-genre"/);
    assert.match(destinationSource, /data-slot="anime-universe-record-measure"/);
    assert.doesNotMatch(destinationSource, /{genres}/);
    assert.equal(ANIME_DESTINATION_COPY.storyHeading, 'The Story');
    assert.equal(ANIME_DESTINATION_COPY.worldHeading, 'The World');
    assert.equal(ANIME_DESTINATION_COPY.recordHeading, 'The Record');
  });

  test('paths fork through the universe instead of a card grid', () => {
    const paths = destinationAvailablePaths({
      story: 'A longer record than the orientation.',
      signalCount: 3,
      kinshipAvailable: true,
      copy: ANIME_DESTINATION_COPY,
    });
    assert.equal(paths.length, 3);
    assert.match(pathsViewSource, /data-slot="anime-universe-paths-here"/);
    assert.match(pathsViewSource, /data-slot="anime-universe-path-fork"/);
    assert.equal(ANIME_DESTINATION_COPY.pathsHere, 'You are here');
    assert.doesNotMatch(
      pathsViewSource,
      /grid-cols-3|rounded-md|shadow-lg|bg-card/,
    );
    assert.match(pathsViewSource, /aria-expanded/);
  });

  test('one poster is recomposed; characters and episodes are never invented', () => {
    assert.match(destinationSource, /data-slot="anime-universe-field"/);
    assert.match(destinationSource, /src=\{anime\.poster\}/);
    assert.doesNotMatch(destinationSource, /id="anime-universe-characters"/);
    assert.doesNotMatch(destinationSource, /episode thumbnail|character grid/i);
    const discovered = canonicalizeDiscoveryCandidate({
      malId: 40748,
      title: 'Jujutsu Kaisen',
      alternateTitle: null,
      year: 2020,
      type: 'tv',
      episodeCount: null,
      status: 'finished',
      genres: ['Action'],
      studios: [],
    });
    assert.equal(discovered.poster, null);
    const nav = destinationUniverseNav({
      synopsis: discovered.synopsis,
      year: discovered.year,
      genres: discovered.genres,
      studios: discovered.studios,
      episodeCount: discovered.episodeCount,
      score: null,
      hasPaths: false,
    });
    assert.ok(!nav.some((entry) => entry.id === 'record'));
    assert.ok(!nav.some((entry) => entry.id === 'paths'));
  });

  test('scroll stays native and warp remains a one-shot black hole without cyan rings', () => {
    assert.doesNotMatch(destinationSource, /onWheel|preventDefault\(\)|scrollTo\(/);
    assert.doesNotMatch(destinationSource, /WebGL|R3F|<canvas/i);
    assert.doesNotMatch(universeCss, /animation:[^;]*infinite/);
    assert.match(crossingCss, /aether-warp-horizon/);
    assert.doesNotMatch(crossingCss, /border-ring|#22d3ee|#00ffff/);
    assert.match(universeSource, /hasPaths/);
  });
});
