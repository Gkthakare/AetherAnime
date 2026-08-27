import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { ANIME_CATALOG } from './anime.catalog';
import { resolveAnime } from './anime.resolver';
import { normalizeVoiceQuery } from './anime.voice';
import { metadataLookupTarget } from './anime.mal.identity';
import {
  catalogWatchPathProvider,
  verifiedWatchUrl,
  watchPathLookupTarget,
  watchPathsForAnime,
} from './anime.watch-path';
import type { CanonicalAnime } from './anime.types';

function bySlug(slug: string): CanonicalAnime {
  const anime = ANIME_CATALOG.find((entry) => entry.slug === slug);
  assert.ok(anime, slug);
  return anime;
}

function withOfficialUrl(
  anime: CanonicalAnime,
  officialUrl: string | null,
): CanonicalAnime {
  return { ...anime, officialUrl };
}

describe('watchPathsForAnime', () => {
  test('verified official URL enables Watch Now', () => {
    const paths = watchPathsForAnime(bySlug('solo-leveling'));
    const official = paths.find((path) => path.provider === 'official');
    assert.equal(official?.status, 'verified');
    assert.equal(official?.url, 'https://sololeveling-anime.net/');
    assert.equal(
      verifiedWatchUrl(paths),
      'https://sololeveling-anime.net/',
    );
  });

  test('null official URL disables Watch Now as unavailable, not unknown', () => {
    const paths = watchPathsForAnime(bySlug('fate-stay-night'));
    const official = paths.find((path) => path.provider === 'official');
    assert.equal(official?.status, 'unavailable');
    assert.equal(official?.url, null);
    assert.equal(verifiedWatchUrl(paths), null);
  });

  test('Crunchyroll remains unknown because no official integration exists', () => {
    const paths = watchPathsForAnime(bySlug('solo-leveling'));
    const crunchyroll = paths.find((path) => path.provider === 'crunchyroll');
    assert.equal(crunchyroll?.provider, 'crunchyroll');
    assert.equal(crunchyroll?.status, 'unknown');
    assert.equal(crunchyroll?.url, null);
  });

  test('invalid official URL is safely rejected', () => {
    const paths = watchPathsForAnime(
      withOfficialUrl(bySlug('solo-leveling'), 'javascript:alert(1)'),
    );
    const official = paths.find((path) => path.provider === 'official');
    assert.equal(official?.status, 'unavailable');
    assert.equal(official?.url, null);
    assert.equal(verifiedWatchUrl(paths), null);

    const insecure = watchPathsForAnime(
      withOfficialUrl(bySlug('solo-leveling'), 'http://sololeveling-anime.net/'),
    );
    assert.equal(verifiedWatchUrl(insecure), null);
  });

  test('malformed provider result fails safely', () => {
    assert.equal(verifiedWatchUrl([]), null);
    assert.equal(
      verifiedWatchUrl([
        { provider: 'official', status: 'verified', url: 'http://insecure.example' },
      ]),
      null,
    );
  });

  test('provider identity is preserved across catalog titles', () => {
    for (const anime of ANIME_CATALOG) {
      const providers = watchPathsForAnime(anime).map((path) => path.provider);
      assert.deepEqual(providers, ['official', 'crunchyroll']);
    }
  });
});

describe('verified catalog watch paths', () => {
  test('Solo Leveling official path remains the verified anime site', () => {
    assert.equal(
      verifiedWatchUrl(watchPathsForAnime(bySlug('solo-leveling'))),
      'https://sololeveling-anime.net/',
    );
  });

  test('Fate/Zero official path remains the verified anime site', () => {
    assert.equal(
      verifiedWatchUrl(watchPathsForAnime(bySlug('fate-zero'))),
      'https://www.fate-zero.jp/',
    );
  });

  test('Fate/Grand Order official path remains First Order', () => {
    assert.equal(
      verifiedWatchUrl(watchPathsForAnime(bySlug('fate-grand-order'))),
      'https://anime.fate-go.jp/FirstOrder/',
    );
  });
});

describe('Fate identity is not collapsed by watch paths', () => {
  test('Fate/stay night is not mapped to Zero, Heaven’s Feel, or UBW', () => {
    const stayNight = watchPathsForAnime(bySlug('fate-stay-night'));
    const official = stayNight.find((path) => path.provider === 'official');
    assert.equal(official?.url, null);
    assert.equal(official?.status, 'unavailable');
    assert.doesNotMatch(String(official?.url), /fate-zero|fate-sn|ubw|heavens-feel/i);
  });

  test('Fate catalog titles keep distinct official destinations', () => {
    const stayNight = verifiedWatchUrl(watchPathsForAnime(bySlug('fate-stay-night')));
    const fateZero = verifiedWatchUrl(watchPathsForAnime(bySlug('fate-zero')));
    const grandOrder = verifiedWatchUrl(
      watchPathsForAnime(bySlug('fate-grand-order')),
    );
    assert.equal(stayNight, null);
    assert.equal(fateZero, 'https://www.fate-zero.jp/');
    assert.equal(grandOrder, 'https://anime.fate-go.jp/FirstOrder/');
    assert.notEqual(fateZero, grandOrder);
  });
});

describe('watch-path lookup is not resolution', () => {
  test('voice Solo Leveling still resolves locally then yields a verified path', () => {
    const result = resolveAnime(
      normalizeVoiceQuery('Take me to Solo Leveling'),
    );
    assert.equal(watchPathLookupTarget(result), 'solo-leveling');
    if (result.status !== 'resolved') return;
    assert.equal(
      verifiedWatchUrl(catalogWatchPathProvider.getByCanonicalAnime(result.anime)),
      'https://sololeveling-anime.net/',
    );
  });

  test('ambiguous Fate does not look up a watch path until a candidate is selected', () => {
    const result = resolveAnime(normalizeVoiceQuery('Take me to Fate'));
    assert.equal(result.status, 'ambiguous');
    assert.equal(watchPathLookupTarget(result), null);
    assert.equal(metadataLookupTarget(result), null);
  });

  test('unknown anime does not look up a watch path', () => {
    const result = resolveAnime('something completely nonexistent');
    assert.equal(watchPathLookupTarget(result), null);
  });
});
