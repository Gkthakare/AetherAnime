import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  createSpeechRecognizer,
  getSpeechRecognitionConstructor,
  isSpeechRecognitionSupported,
  settleVoiceAfterRecognitionEnd,
  speechRecognitionErrorCopy,
} from './world-navigator.speech';

type ResultLike = {
  isFinal: boolean;
  0: { transcript: string };
};

class FakeSpeechRecognition {
  lang = '';
  continuous = true;
  interimResults = false;
  maxAlternatives = 0;
  onresult: ((event: { resultIndex: number; results: ArrayLike<ResultLike> }) => void) | null =
    null;
  onerror: ((event: { error: string }) => void) | null = null;
  onend: (() => void) | null = null;
  started = 0;
  stopped = 0;
  aborted = 0;
  static last: FakeSpeechRecognition | null = null;

  constructor() {
    FakeSpeechRecognition.last = this;
  }

  start() {
    this.started += 1;
  }

  stop() {
    this.stopped += 1;
  }

  abort() {
    this.aborted += 1;
  }

  emitResult(results: ResultLike[], resultIndex = 0) {
    this.onresult?.({ resultIndex, results });
  }

  emitError(error: string) {
    this.onerror?.({ error });
  }

  emitEnd() {
    this.onend?.();
  }
}

describe('speech recognition support', () => {
  test('is unsupported when no constructor exists', () => {
    assert.equal(isSpeechRecognitionSupported({}), false);
    assert.equal(getSpeechRecognitionConstructor({}), null);
  });

  test('detects webkitSpeechRecognition without assuming the unprefixed API', () => {
    const host = { webkitSpeechRecognition: FakeSpeechRecognition };
    assert.equal(isSpeechRecognitionSupported(host), true);
    assert.equal(getSpeechRecognitionConstructor(host), FakeSpeechRecognition);
  });

  test('prefers window.SpeechRecognition when both exist', () => {
    class Prefixed {}
    class Standard {}
    const host = {
      SpeechRecognition: Standard,
      webkitSpeechRecognition: Prefixed,
    };
    assert.equal(getSpeechRecognitionConstructor(host), Standard);
  });
});

describe('speechRecognitionErrorCopy', () => {
  test('maps permission, silence, capture, and network to world copy', () => {
    assert.equal(
      speechRecognitionErrorCopy('not-allowed'),
      'Voice access is unavailable.',
    );
    assert.equal(
      speechRecognitionErrorCopy('no-speech'),
      'The world heard nothing.',
    );
    assert.equal(
      speechRecognitionErrorCopy('audio-capture'),
      'No listening channel is available.',
    );
    assert.equal(
      speechRecognitionErrorCopy('network'),
      'The listening channel was interrupted.',
    );
    assert.equal(
      speechRecognitionErrorCopy('language-not-supported'),
      'The listening channel was interrupted.',
    );
  });

  test('treats abort as a silent stop', () => {
    assert.equal(speechRecognitionErrorCopy('aborted'), null);
  });

  test('does not dump unknown browser error strings', () => {
    assert.equal(
      speechRecognitionErrorCopy('service-not-allowed-xyz'),
      'The listening channel was interrupted.',
    );
  });
});

describe('createSpeechRecognizer', () => {
  test('returns null when recognition is unsupported', () => {
    assert.equal(
      createSpeechRecognizer({
        host: {},
        onFinal: () => {},
        onError: () => {},
      }),
      null,
    );
  });

  test('configures a single-shot recognizer and forwards transcripts', () => {
    const finals: string[] = [];
    const interims: string[] = [];
    const recognizer = createSpeechRecognizer({
      host: { SpeechRecognition: FakeSpeechRecognition },
      onInterim: (transcript) => interims.push(transcript),
      onFinal: (transcript) => finals.push(transcript),
      onError: () => {
        throw new Error('unexpected error');
      },
    });

    assert.ok(recognizer);
    recognizer.start();
    const instance = FakeSpeechRecognition.last;
    assert.ok(instance);
    assert.equal(instance.lang, 'en-US');
    assert.equal(instance.continuous, false);
    assert.equal(instance.interimResults, true);
    assert.equal(instance.maxAlternatives, 1);
    assert.equal(instance.started, 1);

    instance.emitResult([{ isFinal: false, 0: { transcript: 'take me to ' } }]);
    instance.emitResult([
      { isFinal: true, 0: { transcript: 'take me to Solo Leveling' } },
    ]);

    assert.deepEqual(interims, ['take me to ']);
    assert.deepEqual(finals, ['take me to Solo Leveling']);
  });

  test('aborting an active session prevents a later final from committing', () => {
    const finals: string[] = [];
    const recognizer = createSpeechRecognizer({
      host: { SpeechRecognition: FakeSpeechRecognition },
      onFinal: (transcript) => finals.push(transcript),
      onError: () => {},
    });
    assert.ok(recognizer);
    recognizer.start();
    recognizer.abort();
    const instance = FakeSpeechRecognition.last;
    assert.ok(instance);
    instance.emitResult([
      { isFinal: true, 0: { transcript: 'should not commit' } },
    ]);
    assert.deepEqual(finals, []);
    assert.equal(instance.aborted, 1);
  });

  test('start terminates a previous session before listening again', () => {
    const recognizer = createSpeechRecognizer({
      host: { SpeechRecognition: FakeSpeechRecognition },
      onFinal: () => {},
      onError: () => {},
    });
    assert.ok(recognizer);
    recognizer.start();
    const first = FakeSpeechRecognition.last;
    assert.ok(first);
    recognizer.start();
    assert.equal(first.aborted, 1);
    const second = FakeSpeechRecognition.last;
    assert.ok(second);
    assert.notEqual(second, first);
    assert.equal(second.started, 1);
  });

  test('dispose removes handlers and aborts', () => {
    const recognizer = createSpeechRecognizer({
      host: { SpeechRecognition: FakeSpeechRecognition },
      onFinal: () => {},
      onError: () => {},
    });
    assert.ok(recognizer);
    recognizer.start();
    const instance = FakeSpeechRecognition.last;
    assert.ok(instance);
    recognizer.dispose();
    assert.equal(instance.aborted, 1);
    assert.equal(instance.onresult, null);
    assert.equal(instance.onerror, null);
    assert.equal(instance.onend, null);
  });

  test('clean onend without a final transcript or error notifies onEnd', () => {
    const finals: string[] = [];
    const errors: string[] = [];
    let ended = 0;
    const recognizer = createSpeechRecognizer({
      host: { SpeechRecognition: FakeSpeechRecognition },
      onFinal: (transcript) => finals.push(transcript),
      onError: (error) => errors.push(error),
      onEnd: () => {
        ended += 1;
      },
    });
    assert.ok(recognizer);
    recognizer.start();
    FakeSpeechRecognition.last?.emitEnd();
    assert.equal(ended, 1);
    assert.deepEqual(finals, []);
    assert.deepEqual(errors, []);
  });
});

describe('settleVoiceAfterRecognitionEnd', () => {
  test('returns listening UI to idle when recognition ends without a transcript', () => {
    assert.deepEqual(
      settleVoiceAfterRecognitionEnd({ mode: 'listening', interim: 'take me' }),
      { mode: 'idle' },
    );
  });

  test('does not overwrite an error state', () => {
    assert.deepEqual(
      settleVoiceAfterRecognitionEnd({
        mode: 'error',
        message: 'Voice access is unavailable.',
      }),
      { mode: 'error', message: 'Voice access is unavailable.' },
    );
  });
});
