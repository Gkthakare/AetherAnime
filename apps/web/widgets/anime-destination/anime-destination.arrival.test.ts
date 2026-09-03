/**
 * TASK-080 — Destination arrival ceremony contracts.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  ANIME_DESTINATION_ARRIVAL_DELAY,
  animeDestinationActions,
  animeDestinationBody,
  animeDestinationIdentity,
  animeDestinationPoster,
} from './anime-destination.motion';

const dir = dirname(fileURLToPath(import.meta.url));
const destinationSource = readFileSync(
  join(dir, 'anime-destination.tsx'),
  'utf8',
);
const motionSource = readFileSync(
  join(dir, 'anime-destination.motion.ts'),
  'utf8',
);
const atmosphereView = readFileSync(
  join(dir, '../anime-arrival-atmosphere/anime-arrival-atmosphere.view.tsx'),
  'utf8',
);
const atmosphereCss = readFileSync(
  join(dir, '../anime-arrival-atmosphere/anime-arrival-atmosphere.css'),
  'utf8',
);

function delayOf(variants: { show?: { transition?: { delay?: number } } }) {
  return variants.show?.transition?.delay ?? -1;
}

describe('TASK-080 Destination arrival ceremony', () => {
  test('stagger order: poster → identity → body → actions within cinematic window', () => {
    assert.ok(
      ANIME_DESTINATION_ARRIVAL_DELAY.poster <
        ANIME_DESTINATION_ARRIVAL_DELAY.identity,
    );
    assert.ok(
      ANIME_DESTINATION_ARRIVAL_DELAY.identity <
        ANIME_DESTINATION_ARRIVAL_DELAY.body,
    );
    assert.ok(
      ANIME_DESTINATION_ARRIVAL_DELAY.body <
        ANIME_DESTINATION_ARRIVAL_DELAY.actions,
    );
    assert.ok(ANIME_DESTINATION_ARRIVAL_DELAY.actions <= 2.4);
    assert.equal(delayOf(animeDestinationPoster), ANIME_DESTINATION_ARRIVAL_DELAY.poster);
    assert.equal(
      delayOf(animeDestinationIdentity),
      ANIME_DESTINATION_ARRIVAL_DELAY.identity,
    );
    assert.equal(delayOf(animeDestinationBody), ANIME_DESTINATION_ARRIVAL_DELAY.body);
    assert.equal(
      delayOf(animeDestinationActions),
      ANIME_DESTINATION_ARRIVAL_DELAY.actions,
    );
  });

  test('ceremony is keyed to Destination arrival identity, not anonymous mount', () => {
    assert.match(destinationSource, /key=\{anime\.id\}/);
    assert.match(destinationSource, /data-destination-arrival=\{anime\.id\}/);
    assert.match(
      atmosphereView,
      /presentation\.source[\s\S]*playAnimation|playAnimation[\s\S]*presentation\.source/,
    );
  });

  test('reduced motion collapses extended choreography', () => {
    assert.match(destinationSource, /animeDestinationPosterReduced/);
    assert.match(destinationSource, /animeDestinationCopyReduced/);
    const reducedBlock = motionSource.slice(
      motionSource.indexOf('export const animeDestinationPosterReduced'),
      motionSource.indexOf('export const animeDestinationIdentity'),
    );
    assert.doesNotMatch(reducedBlock, /delay:/);
    assert.match(atmosphereCss, /prefers-reduced-motion:\s*reduce/);
  });

  test('no continuous Destination animation after settle', () => {
    assert.doesNotMatch(motionSource, /infinite|repeat:\s*Infinity|loop:\s*true/);
    assert.doesNotMatch(destinationSource, /aether-living-light|living-light/);
    assert.match(atmosphereView, /forwards/);
    assert.doesNotMatch(atmosphereCss, /animation:\s*[^;]*infinite/);
  });
});
