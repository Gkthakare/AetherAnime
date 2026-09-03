import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  isWorldTransportLocked,
  reduceWorldTransport,
  runWorldAnimeTransport,
  worldTransportSchedule,
  WORLD_TRANSPORT_DEPART_S,
} from './world.transport';

describe('world transport reducer', () => {
  test('depart enters departing from idle only', () => {
    assert.equal(reduceWorldTransport('idle', 'depart'), 'departing');
    assert.equal(reduceWorldTransport('in_transit', 'depart'), 'in_transit');
  });

  test('transit follows departing', () => {
    assert.equal(reduceWorldTransport('departing', 'transit'), 'in_transit');
  });

  test('arrive follows in_transit', () => {
    assert.equal(reduceWorldTransport('in_transit', 'arrive'), 'arriving');
  });

  test('settle returns to idle', () => {
    assert.equal(reduceWorldTransport('arriving', 'settle'), 'idle');
  });

  test('abort resets to idle from any locked phase', () => {
    assert.equal(reduceWorldTransport('departing', 'abort'), 'idle');
    assert.equal(reduceWorldTransport('in_transit', 'abort'), 'idle');
    assert.equal(reduceWorldTransport('arriving', 'abort'), 'idle');
  });

  test('locked phases block duplicate selection', () => {
    assert.equal(isWorldTransportLocked('idle'), false);
    assert.equal(isWorldTransportLocked('departing'), true);
    assert.equal(isWorldTransportLocked('in_transit'), true);
    assert.equal(isWorldTransportLocked('arriving'), true);
  });
});

describe('world transport schedule', () => {
  test('normal motion waits for depart dwell before url midpoint', () => {
    const schedule = worldTransportSchedule(false);
    assert.equal(schedule.departS, WORLD_TRANSPORT_DEPART_S);
    assert.ok(schedule.urlCommitS > schedule.departS);
    assert.equal(schedule.totalS, schedule.departS + 1.2);
  });

  test('reduced motion collapses dwells', () => {
    const schedule = worldTransportSchedule(true);
    assert.equal(schedule.departS, 0);
    assert.equal(schedule.urlCommitS, 0);
    assert.equal(schedule.totalS, 0);
  });
});

describe('runWorldAnimeTransport', () => {
  test('invokes callbacks in depart → transit → url → arrive → settle order', async () => {
    const order: string[] = [];

    await runWorldAnimeTransport(
      {
        onDepart: () => order.push('depart'),
        onTransit: () => order.push('transit'),
        onUrlCommit: () => order.push('url'),
        onArrive: () => order.push('arrive'),
        onSettle: () => order.push('settle'),
      },
      { reducedMotion: true },
    );

    assert.deepEqual(order, [
      'depart',
      'transit',
      'url',
      'arrive',
      'settle',
    ]);
  });

  test('url commit follows transit, not depart', async () => {
    const order: string[] = [];

    await runWorldAnimeTransport(
      {
        onDepart: () => order.push('depart'),
        onTransit: () => order.push('transit'),
        onUrlCommit: () => order.push('url'),
        onArrive: () => order.push('arrive'),
        onSettle: () => order.push('settle'),
      },
      { reducedMotion: true },
    );

    const transitIndex = order.indexOf('transit');
    const urlIndex = order.indexOf('url');
    assert.ok(transitIndex < urlIndex);
    assert.ok(order.indexOf('depart') < transitIndex);
  });
});
