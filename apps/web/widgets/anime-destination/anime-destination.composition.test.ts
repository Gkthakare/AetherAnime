import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { ANIME_CATALOG } from '@/shared/anime/anime.catalog';
import { canonicalizeDiscoveryCandidate } from '@/shared/anime/anime.discovery';
import { verifiedWatchUrl, watchPathsForAnime } from '@/shared/anime/anime.watch-path';

import {
  ANIME_DESTINATION_COPY,
  ANIME_DESTINATION_POSTER_WIDTH,
  ANIME_DESTINATION_STAGE,
  ANIME_DESTINATION_TITLE,
  ANIME_SEAL_WIDTH,
} from './anime-destination.constants';

const widgetDir = dirname(fileURLToPath(import.meta.url));
const destinationSource = readFileSync(
  join(widgetDir, 'anime-destination.tsx'),
  'utf8',
);
const watchNowSource = readFileSync(
  join(widgetDir, 'anime-destination.watch-now.ts'),
  'utf8',
);
const sceneSource = readFileSync(
  join(widgetDir, '../world-scene/world-scene.tsx'),
  'utf8',
);
const atmosphereView = readFileSync(
  join(widgetDir, '../anime-arrival-atmosphere/anime-arrival-atmosphere.view.tsx'),
  'utf8',
);
const environmentSource = readFileSync(
  join(widgetDir, '../world-environment/world-environment.tsx'),
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

describe('arrival stage composition', () => {
  test('destination occupies a stage wider than the previous centered column', () => {
    assert.match(destinationSource, /data-slot="anime-arrival-stage"/);
    assert.match(ANIME_DESTINATION_STAGE, /max-w-5xl/);
    assert.doesNotMatch(destinationSource, /max-w-3xl/);
  });

  test('desktop composition places poster and information as siblings', () => {
    assert.match(destinationSource, /data-slot="anime-destination-copy"/);
    const stage = destinationSource.indexOf('anime-arrival-stage');
    const copy = destinationSource.indexOf('anime-destination-copy');
    const synopsis = destinationSource.indexOf('presented.synopsis');
    const copyEnd = destinationSource.indexOf(
      'data-slot="anime-destination-providers"',
    );
    assert.ok(stage > 0);
    assert.ok(copy > stage);
    assert.ok(synopsis > copy);
    assert.ok(copyEnd > synopsis);
  });

  test('desktop poster clamp reaches identity-artifact scale, not wallpaper', () => {
    assert.match(ANIME_DESTINATION_POSTER_WIDTH, /18\.75rem/);
    assert.doesNotMatch(ANIME_DESTINATION_POSTER_WIDTH, /100vw/);
    assert.doesNotMatch(ANIME_DESTINATION_POSTER_WIDTH, /lg:w-\[clamp/);
  });

  test('discovered destinations do not reserve a catalog poster hole', () => {
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
    assert.match(destinationSource, /data-destination-artwork=/);
    assert.match(ANIME_SEAL_WIDTH, /w-\[/);
    assert.notEqual(ANIME_SEAL_WIDTH, ANIME_DESTINATION_POSTER_WIDTH);
  });

  test('title remains destination identity and Watch Now remains the threshold copy', () => {
    assert.match(ANIME_DESTINATION_TITLE, /clamp/);
    assert.equal(ANIME_DESTINATION_COPY.watchNow, 'Watch Now');
    assert.match(destinationSource, /data-slot="anime-destination-title"/);
    assert.match(destinationSource, /data-slot="anime-destination-watch-now"/);
  });
});

describe('arrival composition architecture freeze', () => {
  test('idle WorldScene does not force the arrival stage onto the world', () => {
    assert.match(
      sceneSource,
      /destinationInIdentity \? 'anime' : 'idle'/,
    );
    assert.match(sceneSource, /arrival\.identityGap/);
    assert.doesNotMatch(sceneSource, /anime-arrival-stage/);
  });

  test('WorldIdentity recedes below the anime title during arrival', () => {
    assert.match(
      sceneSource,
      /\[&_\[data-slot=world-identity-title\]\]:text-lg/,
    );
    assert.match(
      sceneSource,
      /\[&_\[data-slot=world-identity-title\]\]:lg:text-2xl/,
    );
    assert.doesNotMatch(
      sceneSource,
      /\[&_\[data-slot=world-identity-title\]\]:lg:text-5xl/,
    );
  });

  test('TASK-034 wash and Watch Now authority remain unchanged', () => {
    assert.match(environmentSource, /<AnimeArrivalAtmosphere poster=\{poster\} \/>/);
    assert.match(atmosphereView, /BLUR_RADIUS/);
    assert.doesNotMatch(
      readFileSync(
        join(widgetDir, '../anime-arrival-atmosphere/anime-arrival-atmosphere.css'),
        'utf8',
      ),
      /mix-blend-mode:\s*screen/,
    );
    assert.match(watchNowSource, /noopener,noreferrer/);
    assert.equal(
      verifiedWatchUrl(watchPathsForAnime(bySlug('solo-leveling'))),
      'https://sololeveling-anime.net/',
    );
    assert.doesNotMatch(typesSource, /backdrop|artworkKey|imageKey/);
    assert.doesNotMatch(destinationSource, /resolveAnime|planAnimeAsk|zustand/);
  });

  test('foreground poster still uses CanonicalAnime.poster', () => {
    assert.match(destinationSource, /src=\{anime\.poster\}/);
    assert.ok(bySlug('solo-leveling').poster);
  });
});
