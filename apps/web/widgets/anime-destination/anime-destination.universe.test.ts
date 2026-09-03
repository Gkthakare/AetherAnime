import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { ANIME_CATALOG } from '@/shared/anime/anime.catalog';
import { canonicalizeDiscoveryCandidate } from '@/shared/anime/anime.discovery';

import { ANIME_DESTINATION_COPY } from './anime-destination.constants';
import {
  destinationIdentityStatement,
  destinationUniverseNav,
} from './anime-destination.universe';

const widgetDir = dirname(fileURLToPath(import.meta.url));
const destinationSource = readFileSync(
  join(widgetDir, 'anime-destination.tsx'),
  'utf8',
);
const sceneSource = readFileSync(
  join(widgetDir, '../world-scene/world-scene.tsx'),
  'utf8',
);
const crossingView = readFileSync(
  join(widgetDir, '../world-environment/world-realm-crossing.view.tsx'),
  'utf8',
);
const crossingCss = readFileSync(
  join(widgetDir, '../world-environment/world-realm-crossing.css'),
  'utf8',
);
const layoutConstants = readFileSync(
  join(widgetDir, '../world-layout/world-layout.constants.ts'),
  'utf8',
);

function bySlug(slug: string) {
  const anime = ANIME_CATALOG.find((entry) => entry.slug === slug);
  assert.ok(anime, slug);
  return anime;
}

function identityColumn(): string {
  const from = sceneSource.indexOf('data-slot="world-identity-column"');
  const to = sceneSource.indexOf('presence=', from);
  assert.ok(from > 0 && to > from);
  return sceneSource.slice(from, to);
}

describe('TASK-096 anime universe destination', () => {
  test('destination leaves the identity column and occupies the universe stage', () => {
    assert.doesNotMatch(identityColumn(), /AnimeDestination/);
    assert.match(sceneSource, /<AnimeDestination/);
    assert.match(destinationSource, /data-slot="anime-universe"/);
    assert.match(destinationSource, /data-slot="anime-universe-hero"/);
    assert.match(layoutConstants, /WORLD_LAYOUT_ARRIVAL/);
    assert.doesNotMatch(
      layoutConstants.slice(
        layoutConstants.indexOf('WORLD_LAYOUT_ARRIVAL'),
        layoutConstants.indexOf('WORLD_LAYOUT_PRIMARY_ORDER'),
      ),
      /max-w-5xl/,
    );
  });

  test('hero is a viewport-scale environment with destination identity, not a details card', () => {
    assert.match(destinationSource, /data-slot="anime-universe-figure"/);
    assert.match(destinationSource, /data-slot="anime-destination-title"/);
    assert.match(destinationSource, /data-slot="anime-universe-enter"/);
    assert.doesNotMatch(destinationSource, /function AnimePoster/);
    assert.doesNotMatch(destinationSource, /aria-expanded=\{previewed\}/);
    assert.equal(ANIME_DESTINATION_COPY.enterStory, 'Enter the story');
  });

  test('identity statement is the first real synopsis sentence, never fabricated lore', () => {
    const solo = bySlug('solo-leveling');
    assert.equal(
      destinationIdentityStatement(solo.synopsis),
      'A hunter the world ranked weakest is called into a climbing that only answers those who keep going alone.',
    );
    assert.match(destinationSource, /destinationIdentityStatement/);
    assert.doesNotMatch(destinationSource, /Sung Jin-Woo|shadow monarch/i);
  });

  test('long-form universe reveals story, world, record, and beyond from available data', () => {
    const solo = bySlug('solo-leveling');
    const nav = destinationUniverseNav({
      synopsis: solo.synopsis,
      year: solo.year,
      genres: solo.genres,
      studios: solo.studios,
      episodeCount: solo.episodeCount,
      score: null,
    });
    assert.deepEqual(
      nav.map((entry) => entry.id),
      ['overview', 'story', 'world', 'record', 'beyond'],
    );
    assert.match(destinationSource, /id="anime-universe-story"/);
    assert.match(destinationSource, /id="anime-universe-world"/);
    assert.match(destinationSource, /id="anime-universe-record"/);
    assert.match(destinationSource, /id="anime-universe-beyond"/);
    assert.doesNotMatch(destinationSource, /id="anime-universe-characters"/);
  });

  test('sections degrade when a destination has no episodes, score, or extra lore', () => {
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
    const nav = destinationUniverseNav({
      synopsis: discovered.synopsis,
      year: discovered.year,
      genres: discovered.genres,
      studios: discovered.studios,
      episodeCount: discovered.episodeCount,
      score: null,
    });
    assert.ok(nav.some((entry) => entry.id === 'beyond'));
    assert.ok(!nav.some((entry) => entry.id === 'record'));
    assert.equal(discovered.poster, null);
    assert.doesNotMatch(destinationSource, /episode thumbnail|character grid/i);
  });

  test('beyond is a continuation, not a footer, and return uses existing clearAnimeArrival', () => {
    assert.equal(ANIME_DESTINATION_COPY.beyondTitle, 'More worlds exist.');
    assert.equal(ANIME_DESTINATION_COPY.returnContinuum, 'Return to Continuum');
    assert.match(destinationSource, /data-slot="anime-universe-beyond"/);
    assert.match(destinationSource, /data-slot="anime-universe-infinity"/);
    assert.match(destinationSource, /data-slot="anime-universe-exit"/);
    assert.match(destinationSource, /clearAnimeArrival/);
    assert.doesNotMatch(destinationSource, /infinite scroll|IntersectionObserver[\s\S]{0,80}append/);
  });

  test('watch, watchlist, and kinship remain real controls with no new analytics or persistence', () => {
    assert.match(destinationSource, /data-slot="anime-destination-watch-now"/);
    assert.match(destinationSource, /openWatchPath/);
    assert.match(destinationSource, /toggleWatchlist/);
    assert.doesNotMatch(destinationSource, /recordDestinationArrival|plausible|\/api\/events/);
    assert.doesNotMatch(destinationSource, /localStorage|indexedDB/);
    assert.match(destinationSource, /<AnimeDestinationPaths/);
  });

  test('scroll stays native — no wheel hijack, no WebGL, no canvas warp', () => {
    assert.doesNotMatch(destinationSource, /onWheel|preventDefault\(\)|scrollTo\(/);
    assert.doesNotMatch(destinationSource, /WebGL|R3F|Canvas|THREE/);
    assert.doesNotMatch(crossingView, /WebGL|R3F|<canvas/i);
  });
});

describe('TASK-096 spacetime warp', () => {
  test('green-line ring language is gone from the primary crossing', () => {
    assert.doesNotMatch(crossingView, /border-ring\/70/);
    assert.doesNotMatch(crossingView, /aether-realm-ring/);
    assert.doesNotMatch(crossingCss, /aether-realm-ring/);
  });

  test('crossing is a one-shot black-hole warp inside existing transport', () => {
    assert.match(crossingView, /world-warp-horizon/);
    assert.match(crossingView, /world-warp-accretion/);
    assert.match(crossingView, /world-warp-veil/);
    assert.match(crossingCss, /aether-warp-horizon/);
    assert.match(crossingCss, /aether-warp-accretion/);
    assert.match(crossingCss, /opacity:\s*0/);
    assert.doesNotMatch(crossingCss, /animation:[^;]*infinite/);
    assert.match(sceneSource, /WorldRealmCrossing/);
    assert.doesNotMatch(sceneSource, /DestinationTransitionSystem/);
  });
});
