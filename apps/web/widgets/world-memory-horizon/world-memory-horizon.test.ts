import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import type { MemoryEntry } from '@/shared/anime/anime.memory';

import {
  MEMORY_HORIZON_DESKTOP_LIMIT,
  MEMORY_HORIZON_HARD_MAX,
  MEMORY_HORIZON_PORTRAIT_LIMIT,
} from './world-memory-horizon.constants';
import { memoryHorizonMarks } from './world-memory-horizon';

const dir = dirname(fileURLToPath(import.meta.url));
const root = join(dir, '../..');
const viewPath = join(dir, 'world-memory-horizon.view.tsx');
const cssPath = join(dir, 'world-memory-horizon.css');
const indexPath = join(dir, 'index.ts');
const logicPath = join(dir, 'world-memory-horizon.ts');
const constantsPath = join(dir, 'world-memory-horizon.constants.ts');
const scenePath = join(dir, '../world-scene/world-scene.tsx');
const geographyCss = join(
  dir,
  '../world-environment/world-idle-geography.css',
);
const memoryDomain = join(root, 'shared/anime/anime.memory.ts');
const kinshipPaths = join(
  dir,
  '../anime-destination/anime-destination-paths.tsx',
);
const atmospherePath = join(dir, '../atmosphere-layer/atmosphere-layer.tsx');

function entry(
  id: string,
  at: number,
  title?: string,
): MemoryEntry {
  return {
    animeId: id,
    slug: id,
    lastArrivedAt: at,
    ...(title ? { title } : {}),
  };
}

describe('TASK-057-B Memory Horizon', () => {
  test('widget module surface exists', () => {
    assert.equal(existsSync(viewPath), true);
    assert.equal(existsSync(cssPath), true);
    assert.equal(existsSync(indexPath), true);
    assert.equal(existsSync(logicPath), true);
    assert.equal(existsSync(constantsPath), true);
  });

  test('density caps stay within the frozen hard maximum', () => {
    assert.ok(MEMORY_HORIZON_HARD_MAX <= 8);
    assert.ok(MEMORY_HORIZON_DESKTOP_LIMIT <= MEMORY_HORIZON_HARD_MAX);
    assert.ok(MEMORY_HORIZON_PORTRAIT_LIMIT <= 4);
    assert.ok(MEMORY_HORIZON_PORTRAIT_LIMIT <= MEMORY_HORIZON_DESKTOP_LIMIT);
  });

  test('empty memory yields no marks', () => {
    assert.deepEqual(memoryHorizonMarks([]), []);
  });

  test('bounded recent memories map to deterministic marks', () => {
    const rows = [
      entry('a', 300),
      entry('b', 200),
      entry('c', 100),
    ];
    const marks = memoryHorizonMarks(rows);
    assert.equal(marks.length, 3);
    assert.equal(marks[0]?.animeId, 'a');
    assert.equal(marks[1]?.animeId, 'b');
    assert.equal(marks[2]?.animeId, 'c');
    // Newest is more present and more trailing than older.
    assert.ok((marks[0]?.opacity ?? 0) >= (marks[1]?.opacity ?? 0));
    assert.ok((marks[1]?.opacity ?? 0) >= (marks[2]?.opacity ?? 0));
    assert.ok((marks[0]?.trailingPct ?? 0) <= (marks[2]?.trailingPct ?? 0));
    // Same input → same slots (no Math.random).
    assert.deepEqual(memoryHorizonMarks(rows), marks);
  });

  test('desktop mark count never exceeds the hard maximum', () => {
    const many = Array.from({ length: 20 }, (_, i) =>
      entry(`id-${i}`, 1000 - i),
    );
    const marks = memoryHorizonMarks(many.slice(0, MEMORY_HORIZON_DESKTOP_LIMIT));
    assert.ok(marks.length <= MEMORY_HORIZON_HARD_MAX);
    assert.ok(marks.length <= MEMORY_HORIZON_DESKTOP_LIMIT);
  });

  test('view is non-interactive decorative environment', () => {
    const view = readFileSync(viewPath, 'utf8');
    assert.match(view, /aria-hidden=["']true["']/);
    assert.doesNotMatch(view, /\bonClick\b|\bonPointerDown\b|\btabIndex\b/);
    assert.doesNotMatch(view, /<button|<a\s|role=["']button["']/);
    assert.doesNotMatch(view, /href=/);
  });

  test('Idle CSS gate hides Horizon on Destination; Home never mounts it', () => {
    const css = readFileSync(cssPath, 'utf8');
    const scene = readFileSync(scenePath, 'utf8');
    const atmosphere = readFileSync(atmospherePath, 'utf8');
    assert.match(scene, /WorldMemoryHorizon|world-memory-horizon/);
    assert.doesNotMatch(atmosphere, /WorldMemoryHorizon|world-memory-horizon/);
    assert.match(
      css,
      /\[data-slot='world-scene'\]:not\(\[data-world-anime\]\)/,
    );
    assert.match(
      css,
      /\[data-slot='world-scene'\]\[data-world-anime\][\s\S]*world-memory-horizon|world-memory-horizon[\s\S]*data-world-anime/,
    );
  });

  test('portrait density is capped in CSS or constants', () => {
    const css = readFileSync(cssPath, 'utf8');
    assert.match(css, /orientation:\s*portrait/);
    assert.ok(MEMORY_HORIZON_PORTRAIT_LIMIT <= 4);
    // Hide marks beyond portrait limit.
    assert.match(
      css,
      new RegExp(`data-memory-index=['\"]?${MEMORY_HORIZON_PORTRAIT_LIMIT}`),
    );
  });

  test('no Kinship constellation primitives', () => {
    const css = readFileSync(cssPath, 'utf8');
    const view = readFileSync(viewPath, 'utf8');
    const kinship = readFileSync(kinshipPaths, 'utf8');
    assert.match(kinship, /anime-destination-kinship-constellation/);
    assert.doesNotMatch(css, /constellation|branch|spine/i);
    assert.doesNotMatch(view, /constellation|kinship/i);
  });

  test('reduced motion keeps marks; optional drift is removed', () => {
    const css = readFileSync(cssPath, 'utf8');
    assert.match(css, /prefers-reduced-motion:\s*reduce/);
    // If any animation exists, reduced motion must zero it.
    if (/animation:/.test(css)) {
      assert.match(
        css,
        /prefers-reduced-motion:\s*reduce[\s\S]*?animation:\s*none/,
      );
    }
  });

  test('Memory domain is read-only — no rememberArrival writes from Horizon', () => {
    const view = readFileSync(viewPath, 'utf8');
    const logic = readFileSync(logicPath, 'utf8');
    assert.match(view, /recentMemories|readMemory|subscribeMemory/);
    assert.doesNotMatch(view, /rememberArrival/);
    assert.doesNotMatch(logic, /rememberArrival|localStorage|setItem/);
    assert.match(readFileSync(memoryDomain, 'utf8'), /export function recentMemories/);
  });

  test('TASK-058-E geography stylesheet remains the geography owner', () => {
    assert.equal(existsSync(geographyCss), true);
    const geo = readFileSync(geographyCss, 'utf8');
    assert.match(geo, /TASK-058-E/);
    assert.match(geo, /world-environment-far/);
    assert.doesNotMatch(geo, /world-memory-horizon/);
    const view = readFileSync(viewPath, 'utf8');
    assert.doesNotMatch(view, /world-idle-geography|aetheranime-world-far/);
  });

  test('no canvas, WebGL, particles, or new network', () => {
    const view = readFileSync(viewPath, 'utf8');
    const css = readFileSync(cssPath, 'utf8');
    assert.doesNotMatch(view, /canvas|WebGL|particle/i);
    assert.doesNotMatch(view, /\bfetch\s*\(/);
    assert.doesNotMatch(view, /\/api\//);
    assert.doesNotMatch(css, /@keyframes[\s\S]{0,200}will-change/);
  });
});
