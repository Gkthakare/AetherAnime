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
const hereSource = readFileSync(join(widgetDir, 'use-universe-here.ts'), 'utf8');
const typesSource = readFileSync(
  join(widgetDir, '../../shared/anime/anime.types.ts'),
  'utf8',
);

describe('TASK-101 living universe depth answer', () => {
  test('spatial here already exists and must drive environmental answering', () => {
    assert.match(destinationSource, /data-universe-here=\{here\}/);
    assert.match(hereSource, /IntersectionObserver/);
    assert.match(universeCss, /data-universe-here=/);
  });

  test('current depth promotes its environmental field; other fields recede', () => {
    assert.match(
      universeCss,
      /\[data-universe-here='story'\].*\[data-crop='story'\]|\[data-universe-here="story"\].*\[data-crop="story"\]/,
    );
    assert.match(
      universeCss,
      /\[data-universe-here='world'\].*\[data-crop='world'\]|\[data-universe-here="world"\].*\[data-crop="world"\]/,
    );
    assert.match(
      universeCss,
      /\[data-universe-here='record'\].*\[data-crop='record'\]|\[data-universe-here="record"\].*\[data-crop="record"\]/,
    );
    assert.match(
      universeCss,
      /\[data-universe-here='beyond'\].*\[data-crop='beyond'\]|\[data-universe-here="beyond"\].*\[data-crop="beyond"\]/,
    );
    assert.match(universeCss, /:not\(\[data-crop=/);
  });

  test('living depth answer adds no state, persistence, particles, or new data', () => {
    assert.doesNotMatch(destinationSource, /sessionStorage|aetheranime\.living/);
    assert.doesNotMatch(universeCss, /animation:[^;]*infinite|@keyframes living/);
    assert.doesNotMatch(destinationSource, /WebGL|R3F|<canvas/i);
    assert.doesNotMatch(typesSource, /livingUniverse|npc|characterGallery/);
    assert.match(destinationSource, /data-universe-journey/);
    assert.match(destinationSource, /journeyOrigin/);
  });
});
