import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { ANIME_CATALOG } from './anime.catalog';

const publicRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../public',
);

describe('catalog destination assets', () => {
  test('every catalog poster is a local public WebP that exists on disk', () => {
    for (const anime of ANIME_CATALOG) {
      assert.equal(typeof anime.poster, 'string');
      assert.match(
        anime.poster ?? '',
        /^\/assets\/aetheranime\/anime\/[a-z0-9-]+\/[a-z0-9-]+-poster\.webp$/,
      );
      const filePath = path.join(publicRoot, anime.poster!.slice(1));
      assert.equal(existsSync(filePath), true, `missing ${filePath}`);
    }
  });

  test('officialUrl is https or null — never a guessed aggregator', () => {
    for (const anime of ANIME_CATALOG) {
      if (anime.officialUrl == null) continue;
      assert.match(anime.officialUrl, /^https:\/\//);
      assert.doesNotMatch(
        anime.officialUrl,
        /myanimelist|anilist|nyaa|1337x|gogoanime/i,
      );
    }
  });

  test('Fate/stay night keeps officialUrl null until a 2006-series official page is verified', () => {
    const fate = ANIME_CATALOG.find((anime) => anime.slug === 'fate-stay-night');
    assert.ok(fate?.poster);
    assert.equal(fate?.officialUrl, null);
  });

  test('verified official destinations stay on live official sites', () => {
    const bySlug = Object.fromEntries(
      ANIME_CATALOG.map((anime) => [anime.slug, anime]),
    );

    assert.equal(
      bySlug['solo-leveling']?.officialUrl,
      'https://sololeveling-anime.net/',
    );
    assert.equal(bySlug['fate-zero']?.officialUrl, 'https://www.fate-zero.jp/');
    assert.equal(
      bySlug['fate-grand-order']?.officialUrl,
      'https://anime.fate-go.jp/FirstOrder/',
    );
  });

  test('provider ratings remain unavailable', () => {
    for (const anime of ANIME_CATALOG) {
      assert.equal(anime.ratings.mal, null);
      assert.equal(anime.ratings.crunchyroll, null);
    }
  });
});
