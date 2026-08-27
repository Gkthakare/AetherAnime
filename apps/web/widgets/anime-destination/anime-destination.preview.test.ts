import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { ANIME_CATALOG } from '@/shared/anime/anime.catalog';
import { canonicalizeDiscoveryCandidate } from '@/shared/anime/anime.discovery';
import {
  verifiedWatchUrl,
  watchPathsForAnime,
} from '@/shared/anime/anime.watch-path';

import {
  ANIME_ARRIVAL_STAGE_GRID_POSTER,
  ANIME_DESTINATION_POSTER_WIDTH,
  ANIME_DESTINATION_STAGE,
  animePosterPreviewCopy,
} from './anime-destination.constants';

const widgetDir = dirname(fileURLToPath(import.meta.url));
const destinationSource = readFileSync(
  join(widgetDir, 'anime-destination.tsx'),
  'utf8',
);
const constantsSource = readFileSync(
  join(widgetDir, 'anime-destination.constants.ts'),
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

function posterSource(): string {
  const start = destinationSource.indexOf('function AnimePoster');
  const end = destinationSource.indexOf(
    'export function AnimeDestination',
    start,
  );
  assert.ok(start > 0 && end > start);
  return destinationSource.slice(start, end);
}

describe('poster remains a destination artifact', () => {
  test('poster is a local preview button, not Watch Now', () => {
    const poster = posterSource();
    assert.match(poster, /type="button"/);
    assert.match(poster, /data-slot="anime-poster"/);
    assert.match(poster, /aria-expanded=\{previewed\}/);
    assert.match(poster, /onClick=\{onTogglePreview\}/);
    assert.doesNotMatch(poster, /openWatchPath/);
    assert.match(
      destinationSource,
      /onClick=\{\(\) => \{\s*if \(watchUrl\) openWatchPath\(watchUrl\);/,
    );
  });

  test('preview state stays local presentation, not domain or URL state', () => {
    assert.match(
      destinationSource,
      /const \[previewed, setPreviewed\] = useState\(false\)/,
    );
    assert.doesNotMatch(destinationSource, /searchParams.*preview|dispatchFocus/);
    assert.doesNotMatch(typesSource, /previewed|posterPreview/);
  });

  test('preview copy is a short identity fragment, not a synopsis overlay', () => {
    assert.match(constantsSource, /export function animePosterPreviewCopy/);
    assert.match(destinationSource, /animePosterPreviewCopy/);
    assert.doesNotMatch(destinationSource, /synopsis\.slice/);
    assert.doesNotMatch(posterSource(), /Watch Now|crunchyroll|myanimelist/i);
  });

  test('presence scale stays restrained and reduced-motion skips travel', () => {
    const poster = posterSource();
    assert.match(poster, /scale-\[1\.02\]/);
    assert.doesNotMatch(poster, /scale-\[1\.03\]|scale-\[1\.1\]/);
    assert.match(poster, /motion-reduce:transition-none/);
    assert.match(poster, /focus-visible:ring-2/);
  });

  test('keyboard focus uses the same presence language as hover', () => {
    assert.match(
      constantsSource,
      /ANIME_POSTER_PRESENCE_SCALE =\s*'hover:scale-\[1\.02\] focus-visible:scale-\[1\.02\]'/,
    );
    const poster = posterSource();
    assert.match(poster, /in-focus-visible:opacity-100/);
    assert.match(poster, /in-focus-visible:w-0\.5/);
    assert.doesNotMatch(poster, /group-focus-visible:/);
  });
});

describe('poster preview copy', () => {
  test('catalog preview uses alternate, year, and genres without synopsis', () => {
    const solo = bySlug('solo-leveling');
    const preview = animePosterPreviewCopy(solo);
    assert.match(preview, /Ore dake Level Up na Ken/);
    assert.match(preview, /2024/);
    assert.match(preview, /ACTION/);
    assert.doesNotMatch(preview, /hunter the world ranked weakest/);
    assert.ok(preview.length <= 120);
  });

  test('discovered preview does not invent artwork or Watch Now', () => {
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
    assert.equal(verifiedWatchUrl(watchPathsForAnime(discovered)), null);
    const preview = animePosterPreviewCopy(discovered);
    assert.match(preview, /2020/);
    assert.match(preview, /ACTION/);
    assert.doesNotMatch(preview, /Watch Now/);
    assert.ok(preview.length <= 120);
    const poster = posterSource();
    assert.match(poster, /previewText && anime\.poster/);
  });
});

describe('TASK-035 and TASK-036 remain frozen', () => {
  test('stage geometry and supporting hierarchy are unchanged', () => {
    assert.match(ANIME_DESTINATION_STAGE, /max-w-5xl/);
    assert.match(ANIME_DESTINATION_POSTER_WIDTH, /lg:w-\[18\.75rem\]/);
    assert.match(
      ANIME_ARRIVAL_STAGE_GRID_POSTER,
      /18\.75rem_minmax\(22\.5rem,35rem\)/,
    );
    const supporting = destinationSource.indexOf(
      'data-slot="anime-destination-supporting"',
    );
    const studios = destinationSource.indexOf('{studios}');
    const watchNow = destinationSource.indexOf(
      'data-slot="anime-destination-watch-now"',
    );
    assert.ok(studios > supporting);
    assert.ok(studios > watchNow);
  });
});
