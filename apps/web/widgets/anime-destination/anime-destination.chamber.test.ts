/**
 * TASK-103 — Vertical Chamber Universe contracts.
 * Source-level guards for chamber grammar under poster-only.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const widgetDir = dirname(fileURLToPath(import.meta.url));
const destinationSource = readFileSync(
  join(widgetDir, 'anime-destination.tsx'),
  'utf8',
);
const universeCss = readFileSync(
  join(widgetDir, 'anime-destination.universe.css'),
  'utf8',
);
const presenceCss = readFileSync(
  join(widgetDir, '../world-environment/world-destination-presence.css'),
  'utf8',
);
const typesSource = readFileSync(
  join(widgetDir, '../../shared/anime/anime.types.ts'),
  'utf8',
);

describe('TASK-103 vertical chamber universe', () => {
  test('chambers are full-viewport volumes, not webpage section stacks', () => {
    assert.match(universeCss, /TASK-103/);
    assert.match(
      universeCss,
      /\[data-slot='anime-universe-hero'\][\s\S]*?min-height:\s*100dvh/,
    );
    assert.match(
      universeCss,
      /\[data-slot='anime-universe-section'\][\s\S]*?min-height:\s*100dvh/,
    );
    assert.match(destinationSource, /data-universe-depth="arrival"/);
    assert.match(destinationSource, /data-universe-depth="story"/);
    assert.match(destinationSource, /data-universe-depth="beyond"/);
  });

  test('arrival figure is full-bleed environmental material, not a side plate', () => {
    assert.match(
      universeCss,
      /\[data-slot='anime-universe-figure'\]\s*\{[^}]*inset:\s*0\s*;/,
    );
    assert.match(
      universeCss,
      /\[data-slot='anime-universe-figure'\]\s*\{[^}]*width:\s*100%/,
    );
    assert.match(destinationSource, /src=\{anime\.poster\}/);
    assert.doesNotMatch(destinationSource, /backdrop|artworkKey|imageKey|gallery/);
  });

  test('living depth answer is consequential: active field owns air, others recede hard', () => {
    assert.match(
      universeCss,
      /\[data-universe-here='story'\][^{]*\[data-crop='story'\][^{]*\{[^}]*opacity:\s*0\.(8[2-9]|9)/,
    );
    assert.match(
      universeCss,
      /\[data-universe-here='world'\][^{]*\[data-crop='world'\][^{]*\{[^}]*opacity:\s*0\.(7[5-9]|8|9)/,
    );
    assert.match(
      universeCss,
      /\[data-universe-here='story'\][^{]*:not\(\[data-crop='story'\]\)[^{]*\{[^}]*opacity:\s*0\.0[89]/,
    );
    assert.match(
      universeCss,
      /\[data-universe-explore='story'\][^{]*\[data-crop='story'\][^{]*\{[^}]*opacity:\s*0\.(8|9)/,
    );
  });

  test('arrival demotes metadata and keeps instruments subordinate to identity', () => {
    assert.match(
      universeCss,
      /anime-destination-metadata[\s\S]*?opacity:\s*0\.[12]/,
    );
    assert.match(
      universeCss,
      /anime-universe-hero[\s\S]*?anime-destination-actions|anime-destination-actions[\s\S]*?opacity/,
    );
    assert.match(destinationSource, /data-slot="anime-destination-watch-now"/);
    assert.match(destinationSource, /data-slot="anime-universe-exit"/);
  });

  test('spatial index stays peripheral and quiet', () => {
    assert.match(
      universeCss,
      /\[data-slot='anime-universe-index'\][\s\S]*?opacity:\s*0\.[34]/,
    );
    assert.match(universeCss, /aria-current/);
    assert.match(destinationSource, /aria-current=\{here === entry\.id/);
  });

  test('poster artwork subordinates WorldEnvironment into one atmosphere', () => {
    assert.match(presenceCss, /TASK-103|chamber/);
    assert.match(
      presenceCss,
      /data-anime-artwork='present'[\s\S]*?world-environment-image[\s\S]*?opacity:\s*0\.1[0-6]/,
    );
    assert.match(
      presenceCss,
      /data-anime-artwork='present'[\s\S]*?midground-architecture[\s\S]*?opacity:\s*0\.0[89]/,
    );
  });

  test('chamber grammar adds no transport, artwork system, scroll hijack, or continuous compositor', () => {
    assert.doesNotMatch(destinationSource, /addEventListener\(\s*['"]wheel/);
    assert.doesNotMatch(destinationSource, /WebGL|R3F|<canvas/i);
    assert.doesNotMatch(universeCss, /@keyframes[^;]*infinite/);
    assert.doesNotMatch(typesSource, /chamberEngine|artworkKey|backdropGallery/);
    assert.match(destinationSource, /arriveAnime/);
    assert.match(destinationSource, /journeyOrigin/);
    assert.match(destinationSource, /clearAnimeArrival/);
  });

  test('explore story reasserts field ownership after depth recession including mobile', () => {
    const exploreBlocks = universeCss.match(
      /\[data-universe-explore='story'\][^{]*\[data-crop='story'\][^{]*\{[^}]*opacity:\s*0\.(8|9)[^}]*\}/g,
    );
    assert.ok(exploreBlocks && exploreBlocks.length >= 2);
    assert.match(
      universeCss,
      /mobile depth recession[\s\S]*explore='story'[\s\S]*opacity:\s*0\.82|explore must still win over mobile[\s\S]*opacity:\s*0\.82/,
    );
  });
});
