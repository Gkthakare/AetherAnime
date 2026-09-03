import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { ANIME_CATALOG } from '@/shared/anime/anime.catalog';
import { canonicalizeDiscoveryCandidate } from '@/shared/anime/anime.discovery';
import { buildAnimeSemanticProfile } from '@/shared/anime/anime.semantic-profile';
import {
  verifiedWatchUrl,
  watchPathsForAnime,
} from '@/shared/anime/anime.watch-path';

import {
  destinationAvailablePaths,
  destinationKinshipAvailable,
  destinationSignalTags,
  destinationStoryRecord,
} from './anime-destination.paths';
import { ANIME_DESTINATION_COPY } from './anime-destination.constants';

const widgetDir = dirname(fileURLToPath(import.meta.url));
const destinationSource = readFileSync(
  join(widgetDir, 'anime-destination.tsx'),
  'utf8',
);
const pathsHelperSource = readFileSync(
  join(widgetDir, 'anime-destination.paths.ts'),
  'utf8',
);
const pathsViewSource = readFileSync(
  join(widgetDir, 'anime-destination-paths.tsx'),
  'utf8',
);
const typesSource = readFileSync(
  join(widgetDir, '../../shared/anime/anime.types.ts'),
  'utf8',
);
const constantsSource = readFileSync(
  join(widgetDir, 'anime-destination.constants.ts'),
  'utf8',
);
const atmosphereView = readFileSync(
  join(widgetDir, '../anime-arrival-atmosphere/anime-arrival-atmosphere.view.tsx'),
  'utf8',
);
const worldSceneSource = readFileSync(
  join(widgetDir, '../world-scene/world-scene.tsx'),
  'utf8',
);

function bySlug(slug: string) {
  const anime = ANIME_CATALOG.find((entry) => entry.slug === slug);
  assert.ok(anime, slug);
  return anime;
}

describe('destination world thresholds', () => {
  test('paths render after supporting metadata and at most three concepts', () => {
    const supporting = destinationSource.indexOf(
      'data-slot="anime-destination-supporting"',
    );
    const paths = destinationSource.indexOf('<AnimeDestinationPaths');
    const watchNow = destinationSource.indexOf(
      'data-slot="anime-destination-watch-now"',
    );
    assert.ok(supporting > watchNow);
    assert.ok(paths > supporting);
    assert.match(pathsViewSource, /data-slot="anime-destination-paths"/);
    assert.match(pathsViewSource, /data-path=\{path\.id\}/);
    assert.match(pathsHelperSource, /id: 'story'/);
    assert.match(pathsHelperSource, /id: 'signals'/);
    assert.match(pathsHelperSource, /id: 'kinship'/);
    assert.doesNotMatch(pathsViewSource, /data-path="episodes"|data-path="reviews"/);
    assert.match(constantsSource, /pathsEyebrow/);
    assert.match(destinationSource, /if \(!anime \|\| !presented\) return null/);
    assert.match(
      worldSceneSource,
      /destinationInIdentity && arrivedAnime \? \(/,
    );
    const allPaths = destinationAvailablePaths({
      story: 'A longer record than the orientation.',
      signalCount: 3,
      kinshipAvailable: true,
      copy: ANIME_DESTINATION_COPY,
    });
    assert.equal(allPaths.length, 3);
    assert.deepEqual(
      allPaths.map((path) => path.id),
      ['story', 'signals', 'kinship'],
    );
    assert.equal(
      destinationAvailablePaths({
        story: null,
        signalCount: 0,
        kinshipAvailable: false,
        copy: ANIME_DESTINATION_COPY,
      }).length,
      0,
    );
  });

  test('Story uses existing fuller synopsis only and never an LLM', () => {
    const solo = bySlug('solo-leveling');
    assert.equal(destinationStoryRecord(solo.synopsis, solo.synopsis), null);
    assert.equal(destinationStoryRecord(solo.synopsis, null), null);
    const fuller =
      'A hunter the world ranked weakest is called into a climbing that only answers those who keep going alone. The gates keep opening.';
    assert.equal(destinationStoryRecord(solo.synopsis, fuller), fuller);
    assert.doesNotMatch(pathsHelperSource, /planAnimeAsk|requestSemanticIntent|openai/i);
    assert.doesNotMatch(pathsViewSource, /fetch\(`\/api\/anime-metadata/);
  });

  test('Signals use existing semantic evidence only', () => {
    const solo = bySlug('solo-leveling');
    const tags = destinationSignalTags({
      genres: solo.genres,
      synopsis: solo.synopsis,
    });
    const profile = buildAnimeSemanticProfile({
      malId: 52299,
      title: solo.canonicalTitle,
      alternateTitle: null,
      year: solo.year,
      type: solo.type,
      episodeCount: solo.episodeCount,
      status: solo.status,
      genres: solo.genres,
      studios: solo.studios,
      synopsis: solo.synopsis,
    });
    assert.deepEqual(
      tags,
      profile.evidence.map((entry) => entry.tag.toUpperCase()),
    );
    assert.ok(tags.includes('ACTION-HEAVY'));
    assert.ok(tags.includes('UNDERDOG'));
    assert.doesNotMatch(pathsHelperSource, /INTENSE|OVERPOWERED/);
    assert.equal(
      destinationSignalTags({ genres: [], synopsis: 'Ordinary days.' }).length,
      0,
    );
  });

  test('Kinship reuses discovery similar lookup and does not prefetch', () => {
    const solo = bySlug('solo-leveling');
    assert.equal(destinationKinshipAvailable(solo), true);
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
    assert.equal(destinationKinshipAvailable(discovered), true);
    assert.match(destinationSource, /useNeighboringWorlds|requestAnimeDiscovery\(\{\s*kind: 'similar'/);
    assert.match(pathsViewSource, /networkOpen/);
    assert.match(pathsViewSource, /canonicalizeDiscoveryCandidate|onKinshipSelect/);
    assert.doesNotMatch(pathsViewSource, /planAnimeAsk|requestSemanticIntent/);
  });

  test('Watch Now, Save, poster, atmosphere, geometry, and CanonicalAnime stay frozen', () => {
    assert.match(destinationSource, /openWatchPath\(watchUrl\)/);
    assert.match(destinationSource, /onClick=\{watchlist\.toggle\}/);
    assert.match(destinationSource, /data-slot="anime-universe-figure"/);
    assert.match(destinationSource, /ANIME_DESTINATION_STAGE/);
    assert.match(atmosphereView, /BLUR_RADIUS\.lg/);
    assert.doesNotMatch(typesSource, /activePath|destinationPath|storyRecord/);
    assert.doesNotMatch(pathsViewSource, /searchParams|\?tab=|\?path=/);
    assert.match(pathsViewSource, /aria-expanded/);
    assert.match(pathsViewSource, /aria-controls/);
    assert.match(pathsViewSource, /aria-live="polite"/);
    assert.match(pathsViewSource, /DURATION\.FAST|DURATION\.NORMAL/);
    assert.doesNotMatch(pathsViewSource, /DURATION\.CINEMATIC/);
    assert.match(pathsViewSource, /height: 0/);
    assert.match(pathsViewSource, /height: 'auto'/);
    assert.match(pathsViewSource, /reduceMotion \? \{ opacity: 0 \}/);
    assert.doesNotMatch(pathsViewSource, /openWatchPath|toggleWatchlist|onTogglePreview/);
    assert.match(constantsSource, /min-h-11/);
    assert.equal(
      verifiedWatchUrl(watchPathsForAnime(bySlug('solo-leveling'))),
      'https://sololeveling-anime.net/',
    );
  });
});

describe('destination story chamber', () => {
  test('Story stays unavailable unless metadata is a fuller truthful record', () => {
    const orientation = 'A hunter the world ranked weakest keeps climbing.';
    assert.equal(destinationStoryRecord(orientation, orientation), null);
    assert.equal(destinationStoryRecord(orientation, null), null);
    assert.equal(destinationStoryRecord(orientation, '   '), null);
    assert.equal(destinationStoryRecord(orientation, 'Short.'), null);
    const fuller =
      'Humanity was caught at a precipice a decade ago when the gates opened and hunters answered them.';
    assert.equal(destinationStoryRecord(orientation, fuller), fuller);
  });

  test('Story chamber renders the existing synopsis without rewriting it', () => {
    assert.match(pathsViewSource, /data-slot="anime-destination-story-chamber"/);
    assert.match(pathsViewSource, /\{story\}/);
    assert.doesNotMatch(
      pathsViewSource,
      /story\.(replace|slice|split|substring)|summarize|paraphrase|rewrite/i,
    );
    assert.doesNotMatch(pathsHelperSource, /planAnimeAsk|requestSemanticIntent|openai/i);
    assert.doesNotMatch(pathsViewSource, /fetch\(`\/api\/anime-metadata|\/api\/anime-intent/);
    assert.doesNotMatch(
      pathsViewSource,
      /story-chamber.*(rounded|shadow|backdrop-blur|bg-card)/,
    );
  });

  test('changing destination slug remounts exploration so Kinship cannot leak', () => {
    assert.match(pathsViewSource, /key=\{anime\.slug\}/);
    assert.match(pathsViewSource, /function DestinationPathsInner/);
  });
});

describe('destination kinship constellation', () => {
  test('Kinship still uses existing similar candidates without fabricated scores', () => {
    assert.match(pathsViewSource, /navigatorPathFromDiscovery/);
    assert.match(pathsViewSource, /data-slot="anime-destination-kinship-constellation"/);
    assert.match(pathsViewSource, /data-slot="anime-destination-kinship-path"/);
    assert.doesNotMatch(
      pathsViewSource,
      /% similar|because you|confidence|match percentage|92%/i,
    );
    assert.doesNotMatch(pathsViewSource, /<img|poster|thumbnail/i);
    assert.doesNotMatch(
      constantsSource,
      /KINSHIP.*(rounded-md|shadow-lg|backdrop-blur|bg-card)/,
    );
  });

  test('Kinship selection, lazy fetch, and freeze contracts stay intact', () => {
    assert.match(pathsViewSource, /onKinshipSelect/);
    assert.match(destinationSource, /canonicalizeDiscoveryCandidate/);
    assert.match(destinationSource, /arriveAnime\(/);
    assert.match(destinationSource, /useNeighboringWorlds|requestAnimeDiscovery\(\{\s*kind: 'similar'/);
    assert.match(pathsViewSource, /key=\{anime\.slug\}/);
    assert.doesNotMatch(pathsViewSource, /openWatchPath|toggleWatchlist|onTogglePreview/);
    assert.match(constantsSource, /ANIME_DESTINATION_KINSHIP_PATH/);
    assert.match(constantsSource, /min-h-11/);
    assert.doesNotMatch(pathsViewSource, /DURATION\.CINEMATIC/);
    assert.match(pathsViewSource, /data-slot="anime-destination-story-chamber"/);
  });
});
