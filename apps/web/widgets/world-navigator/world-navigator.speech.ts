/**
 * Browser SpeechRecognition adapter — transcript acquisition only.
 *
 * Voice produces text. The existing resolver remains the authority.
 * Never constructed at module evaluation. SSR-safe.
 */

import { WORLD_NAVIGATOR_VOICE } from './world-navigator.constants';

export const SPEECH_RECOGNITION_LANG = 'en-US';

export type SpeechRecognitionConstructor = new () => SpeechRecognitionHandle;

export type SpeechRecognitionHost = {
  SpeechRecognition?: unknown;
  webkitSpeechRecognition?: unknown;
};

export type SpeechRecognitionHandle = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult:
    | ((event: {
        resultIndex: number;
        results: ArrayLike<{ isFinal: boolean; 0?: { transcript?: string } }>;
      }) => void)
    | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

export type SpeechRecognizer = {
  start(): void;
  stop(): void;
  abort(): void;
  dispose(): void;
};

export type CreateSpeechRecognizerOptions = {
  host?: SpeechRecognitionHost;
  lang?: string;
  onInterim?: (transcript: string) => void;
  onFinal: (transcript: string) => void;
  onError: (error: string) => void;
  onEnd?: () => void;
};

export type VoiceSession =
  | { readonly mode: 'idle' }
  | { readonly mode: 'listening'; readonly interim: string }
  | { readonly mode: 'error'; readonly message: string };

/** Clean SpeechRecognition end without a final/error must not stick in listening. */
export function settleVoiceAfterRecognitionEnd(
  current: VoiceSession,
): VoiceSession {
  return current.mode === 'listening' ? { mode: 'idle' } : current;
}

function resolveHost(
  host?: SpeechRecognitionHost,
): SpeechRecognitionHost | undefined {
  if (host) return host;
  if (typeof window === 'undefined') return undefined;
  return window as unknown as SpeechRecognitionHost;
}

export function getSpeechRecognitionConstructor(
  host?: SpeechRecognitionHost,
): SpeechRecognitionConstructor | null {
  const resolved = resolveHost(host);
  if (!resolved) return null;
  const Ctor = resolved.SpeechRecognition ?? resolved.webkitSpeechRecognition;
  return typeof Ctor === 'function'
    ? (Ctor as SpeechRecognitionConstructor)
    : null;
}

export function isSpeechRecognitionSupported(
  host?: SpeechRecognitionHost,
): boolean {
  return getSpeechRecognitionConstructor(host) !== null;
}

export function speechRecognitionErrorCopy(error: string): string | null {
  if (error === 'aborted') return null;
  if (error === 'not-allowed') return WORLD_NAVIGATOR_VOICE.notAllowed;
  if (error === 'no-speech') return WORLD_NAVIGATOR_VOICE.noSpeech;
  if (error === 'audio-capture') return WORLD_NAVIGATOR_VOICE.audioCapture;
  return WORLD_NAVIGATOR_VOICE.interrupted;
}

export function createSpeechRecognizer(
  options: CreateSpeechRecognizerOptions,
): SpeechRecognizer | null {
  const Ctor = getSpeechRecognitionConstructor(options.host);
  if (!Ctor) return null;

  const lang = options.lang ?? SPEECH_RECOGNITION_LANG;
  let recognition: SpeechRecognitionHandle | null = null;
  let active = false;

  const detach = (instance: SpeechRecognitionHandle) => {
    instance.onresult = null;
    instance.onerror = null;
    instance.onend = null;
  };

  const release = (method: 'abort' | 'stop') => {
    const instance = recognition;
    if (!instance) return;
    active = false;
    detach(instance);
    try {
      instance[method]();
    } catch {
      /* already stopped */
    }
    recognition = null;
  };

  const attach = (instance: SpeechRecognitionHandle) => {
    instance.lang = lang;
    instance.continuous = false;
    instance.interimResults = true;
    instance.maxAlternatives = 1;

    instance.onresult = (event) => {
      if (!active) return;
      let interim = '';
      let finalText = '';
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const text = result[0]?.transcript ?? '';
        if (result.isFinal) {
          finalText += text;
        } else {
          interim += text;
        }
      }
      if (interim) options.onInterim?.(interim);
      if (finalText) {
        active = false;
        options.onFinal(finalText);
      }
    };

    instance.onerror = (event) => {
      if (!active && event.error === 'aborted') return;
      active = false;
      options.onError(event.error);
    };

    instance.onend = () => {
      active = false;
      options.onEnd?.();
    };
  };

  return {
    start() {
      release('abort');
      const instance = new Ctor();
      recognition = instance;
      active = true;
      attach(instance);
      try {
        instance.start();
      } catch {
        active = false;
        options.onError('audio-capture');
      }
    },
    stop() {
      release('stop');
    },
    abort() {
      release('abort');
    },
    dispose() {
      release('abort');
    },
  };
}
