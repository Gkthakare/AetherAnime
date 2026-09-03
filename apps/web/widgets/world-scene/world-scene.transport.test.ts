import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const sceneSource = readFileSync(join(dir, 'world-scene.tsx'), 'utf8');
const navigationSource = readFileSync(
  join(dir, 'world-scene-navigation.tsx'),
  'utf8',
);

function block(source: string, start: string, end: string): string {
  const from = source.indexOf(start);
  assert.notEqual(from, -1, `${start} not found`);
  const to = source.indexOf(end, from);
  assert.notEqual(to, -1, `${end} not found after ${start}`);
  return source.slice(from, to);
}

describe('world scene anime transport wiring', () => {
  test('Navigator arriveAnime delegates to transport ceremony', () => {
    const arrive = block(
      sceneSource,
      'const arriveAnime = useCallback(',
      'const clearAnimeArrival',
    );
    assert.match(arrive, /beginAnimeTransport\(anime\)/);
    assert.doesNotMatch(arrive, /onAnimeArrive/);
    assert.doesNotMatch(arrive, /setArrivedAnime/);
  });

  test('URL commit is deferred to transport onUrlCommit', () => {
    const transport = block(
      sceneSource,
      'const beginAnimeTransport = useCallback(',
      'const arriveAnime = useCallback(',
    );
    assert.match(transport, /runWorldAnimeTransport/);
    assert.match(transport, /onUrlCommit:/);
    assert.match(transport, /onAnimeArrive\?\.\(anime\)/);
    assert.match(transport, /lastAnimeArrivalRef\.current = anime\.slug/);
  });

  test('visual arrival commits at transit, not at selection', () => {
    const transport = block(
      sceneSource,
      'const beginAnimeTransport = useCallback(',
      'const arriveAnime = useCallback(',
    );
    assert.match(transport, /onTransit:/);
    assert.match(transport, /commitAnimeArrivalVisual\(anime\)/);
    assert.match(transport, /onDepart:/);
    assert.doesNotMatch(
      transport,
      /onDepart:[\s\S]{0,240}commitAnimeArrivalVisual/,
    );
  });

  test('duplicate selection is blocked while transport is locked', () => {
    const transport = block(
      sceneSource,
      'const beginAnimeTransport = useCallback(',
      'const arriveAnime = useCallback(',
    );
    assert.match(transport, /isWorldTransportLocked/);
  });

  test('deep-link handoff does not run transport ceremony', () => {
    const handoff = block(
      sceneSource,
      'const handoffAnimeArrival = useCallback(',
      '// Same-route ?region=',
    );
    assert.doesNotMatch(handoff, /runWorldAnimeTransport/);
  });

  test('clearing anime aborts in-flight transport', () => {
    const clear = block(
      sceneSource,
      'const clearAnimeArrival = useCallback(',
      'const handoffAnimeArrival = useCallback(',
    );
    assert.match(clear, /transportAbortRef\.current\?\.abort\(\)/);
    assert.match(clear, /setTransportPhase\('idle'\)/);
  });

  test('transport phase is exposed on the scene root', () => {
    assert.match(sceneSource, /data-world-transport=\{transportPhase\}/);
  });

  test('navigation adapter still owns URL writes', () => {
    assert.match(navigationSource, /onAnimeArrive=\{handleAnimeArrive\}/);
    assert.match(navigationSource, /router\.push\(href\)/);
    assert.doesNotMatch(sceneSource, /useRouter/);
  });

  test('destination analytics still observe arrivedAnime once', () => {
    const recorder = block(
      sceneSource,
      '// World Memory observes committed arrival',
      'const ambient =',
    );
    assert.match(recorder, /recordDestinationArrival\(arrivedAnime\)/);
    assert.equal(sceneSource.split('recordDestinationArrival(').length - 1, 1);
  });
});
