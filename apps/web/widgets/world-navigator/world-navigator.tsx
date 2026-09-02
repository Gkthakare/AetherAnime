'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import {
  canonicalizeDiscoveryCandidate,
  hydratedAnimeMatchesWatchlistRow,
  normalizeVoiceQuery,
  planAnimeAsk,
  readWatchlist,
  rankDiscoveryByAskRelevance,
  subscribeWatchlist,
  requestAnimeDiscovery,
  requestDiscoveredAnime,
  requestSemanticIntent,
  retrieveForStructuredIntent,
  watchlistReturnRows,
} from '@/shared/anime';
import type { CanonicalAnime, StructuredAnimeIntent, WatchlistReturnRow } from '@/shared/anime';
import { subscribeMemory } from '@/shared/anime/anime.memory';
import { markArrivalVia, recordNavigatorAskSubmitted } from '@/shared/analytics';
import { spacing } from '@/shared/config/theme';
import { legibility } from '@/shared/lib/graphics';
import { cn } from '@/lib/utils';
import { useWorldScene } from '@/widgets/world-scene/world-scene-context';

import {
  WORLD_NAVIGATOR_COPY,
  WORLD_NAVIGATOR_INPUT_ACCENT,
  WORLD_NAVIGATOR_STATUS,
  WORLD_NAVIGATOR_THRESHOLD,
  WORLD_NAVIGATOR_VOICE,
  worldNavigatorIdleStatus,
} from './world-navigator.constants';
import {
  WORLD_NAVIGATOR_CONTINUE,
  continueControlLabel,
  hydratedAnimeMatchesContinueEntry,
  readNewestMemoryServerSnapshot,
  readNewestMemorySnapshot,
  resolveContinueCandidate,
  type ContinueCandidate,
} from './world-navigator.continue';
import { WorldNavigatorPathList } from './world-navigator-path';
import {
  WORLD_NAVIGATOR_PATH,
  navigatorPathFromDiscovery,
  navigatorPathFromWatchlist,
  navigatorPathsFromCatalog,
} from './world-navigator.paths';
import {
  WORLD_NAVIGATOR_RESOLVE_MS,
  worldNavigatorEnterFrom,
  worldNavigatorEnterTo,
  worldNavigatorEnterTransition,
  worldNavigatorEnterTransitionReduced,
  worldNavigatorStatusExit,
  worldNavigatorStatusFrom,
  worldNavigatorStatusTo,
  worldNavigatorStatusTransition,
} from './world-navigator.motion';
import {
  createSpeechRecognizer,
  isSpeechRecognitionSupported,
  settleVoiceAfterRecognitionEnd,
  speechRecognitionErrorCopy,
  type SpeechRecognizer,
  type VoiceSession,
} from './world-navigator.speech';
import type {
  NavigatorState,
  WorldNavigatorProps,
} from './world-navigator.types';

function discoveryDeps(signal: AbortSignal) {
  return {
    searchByTitle: (query: string) =>
      requestAnimeDiscovery({ kind: 'search', query }, signal),
    getSimilarByCanonicalAnime: (anime: CanonicalAnime) =>
      requestAnimeDiscovery({ kind: 'similar', slug: anime.slug }, signal),
    watchlistedSlugs: readWatchlist().map((entry) => entry.slug),
  };
}

const EMPTY_CONSTRAINTS = {
  genres: [],
  themes: [],
  protagonistTraits: [],
  tone: [],
} as const;

const WATCHLIST_FILTER_INTENT: StructuredAnimeIntent = {
  type: 'filter',
  title: null,
  seedTitle: null,
  constraints: EMPTY_CONSTRAINTS,
  exclusions: { watchlisted: true },
};

function VoiceGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={WORLD_NAVIGATOR_THRESHOLD.voiceGlyph}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
    >
      <rect x="5.5" y="1.75" width="5" height="7.5" rx="2.5" />
      <path d="M3.25 7.75a4.75 4.75 0 0 0 9.5 0" />
      <path d="M8 12.5v1.75" />
    </svg>
  );
}

/**
 * WorldNavigator — typed destination ask, native to the world identity.
 *
 * Voice is a second input modality. It produces text that enters the same
 * intent → resolveAnime → optional discovery/semantic → arriveAnime path as typing.
 * Not a chatbot or search panel. The LLM never auto-arrives.
 */
export function WorldNavigator({ className }: WorldNavigatorProps) {
  const { arriveAnime, clearAnimeArrival, arrivedAnime } = useWorldScene();
  const reduceMotion = useReducedMotion();
  const inputId = useId();
  const statusId = useId();

  const [query, setQuery] = useState('');
  const [state, setState] = useState<NavigatorState>({ phase: 'idle' });
  const [voice, setVoice] = useState<VoiceSession>({ mode: 'idle' });
  const voiceSupported = useSyncExternalStore(
    () => () => {},
    () => isSpeechRecognitionSupported(),
    () => false,
  );
  const savedCount = useSyncExternalStore(
    subscribeWatchlist,
    () => readWatchlist().length,
    () => 0,
  );
  const newestMemory = useSyncExternalStore(
    subscribeMemory,
    readNewestMemorySnapshot,
    readNewestMemoryServerSnapshot,
  );
  const resolveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const discoveryAbortRef = useRef<AbortController | null>(null);
  const recognizerRef = useRef<SpeechRecognizer | null>(null);
  const commitQueryRef = useRef<(value: string) => void>(() => {});

  const announce = WORLD_NAVIGATOR_STATUS[state.phase];
  const listening = voice.mode === 'listening';

  const commitQuery = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (resolveTimerRef.current !== undefined) {
        clearTimeout(resolveTimerRef.current);
      }
      discoveryAbortRef.current?.abort();
      discoveryAbortRef.current = null;

      if (trimmed.length === 0) {
        setState({ phase: 'idle' });
        return;
      }

      setState({ phase: 'resolving', query: trimmed });

      const settle = () => {
        try {
          const plan = planAnimeAsk(trimmed);
          recordNavigatorAskSubmitted(plan);
          if (plan.kind === 'arrive') {
            setState({
              phase: 'resolved',
              query: trimmed,
              anime: plan.anime,
            });
            markArrivalVia('navigator');
            arriveAnime(plan.anime);
            return;
          }
          if (plan.kind === 'ambiguous') {
            setState({
              phase: 'ambiguous',
              query: trimmed,
              candidates: plan.candidates,
            });
            return;
          }

          if (plan.kind === 'watchlist') {
            setState({
              phase: 'watchlist',
              query: trimmed,
              rows: watchlistReturnRows(readWatchlist()),
            });
            return;
          }

          const controller = new AbortController();
          discoveryAbortRef.current = controller;

          const showCandidates = (
            candidates: Awaited<ReturnType<typeof retrieveForStructuredIntent>>,
            emptyPhase: 'unknown' | 'unintelligible',
          ) => {
            if (controller.signal.aborted) return;
            if (candidates.length === 0) {
              setState({ phase: emptyPhase, query: trimmed });
              return;
            }
            setState({
              phase: 'discovered',
              query: trimmed,
              candidates,
            });
          };

          if (plan.kind === 'discover') {
            requestAnimeDiscovery(plan.lookup, controller.signal)
              .then((candidates) => {
                showCandidates(candidates, 'unknown');
              })
              .catch(() => {
                if (controller.signal.aborted) return;
                setState({ phase: 'unknown', query: trimmed });
              });
            return;
          }

          if (plan.kind === 'filter') {
            retrieveForStructuredIntent(
              WATCHLIST_FILTER_INTENT,
              discoveryDeps(controller.signal),
            )
              .then((candidates) => showCandidates(candidates, 'unknown'))
              .catch(() => {
                if (controller.signal.aborted) return;
                setState({ phase: 'unknown', query: trimmed });
              });
            return;
          }

          if (plan.kind === 'semantic') {
            setState({ phase: 'interpreting', query: trimmed });
            requestSemanticIntent(plan.input, controller.signal)
              .then(async (intent) => {
                if (controller.signal.aborted) return;
                if (!intent) {
                  const deps = discoveryDeps(controller.signal);
                  const searched = await deps.searchByTitle(trimmed.slice(0, 80));
                  const ranked = rankDiscoveryByAskRelevance(searched, trimmed);
                  showCandidates(ranked, 'unintelligible');
                  return;
                }
                const candidates = await retrieveForStructuredIntent(
                  intent,
                  discoveryDeps(controller.signal),
                  plan.input,
                );
                showCandidates(candidates, 'unintelligible');
              })
              .catch(() => {
                if (controller.signal.aborted) return;
                setState({ phase: 'unintelligible', query: trimmed });
              });
            return;
          }

          setState({ phase: 'unknown', query: trimmed });
        } catch {
          setState({ phase: 'error', query: trimmed });
        }
      };

      if (reduceMotion) {
        settle();
        return;
      }

      resolveTimerRef.current = setTimeout(
        settle,
        WORLD_NAVIGATOR_RESOLVE_MS,
      );
    },
    [arriveAnime, reduceMotion],
  );

  const arriveReturnedAnime = useCallback(
    (anime: CanonicalAnime) => {
      setQuery(anime.canonicalTitle);
      setState({
        phase: 'resolved',
        query: anime.canonicalTitle,
        anime,
      });
      arriveAnime(anime);
    },
    [arriveAnime],
  );

  const selectWatchlistRow = useCallback(
    (row: WatchlistReturnRow) => {
      markArrivalVia('navigator');
      if (row.kind === 'catalog') {
        arriveReturnedAnime(row.anime);
        return;
      }

      discoveryAbortRef.current?.abort();
      const controller = new AbortController();
      discoveryAbortRef.current = controller;
      setState({ phase: 'resolving', query: row.slug });

      requestDiscoveredAnime(row.malId, controller.signal)
        .then((anime) => {
          if (controller.signal.aborted) return;
          if (!anime || !hydratedAnimeMatchesWatchlistRow(row.entry, anime)) {
            setState({ phase: 'unknown', query: row.slug });
            return;
          }
          arriveReturnedAnime(anime);
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          setState({ phase: 'unknown', query: row.slug });
        });
    },
    [arriveReturnedAnime],
  );

  const activateContinue = useCallback(
    (candidate: ContinueCandidate) => {
      markArrivalVia('continue');
      if (candidate.arrival.kind === 'catalog') {
        arriveReturnedAnime(candidate.arrival.anime);
        return;
      }

      discoveryAbortRef.current?.abort();
      const controller = new AbortController();
      discoveryAbortRef.current = controller;
      setState({ phase: 'resolving', query: candidate.entry.slug });

      requestDiscoveredAnime(candidate.arrival.malId, controller.signal)
        .then((anime) => {
          if (controller.signal.aborted) return;
          if (
            !anime ||
            !hydratedAnimeMatchesContinueEntry(candidate.entry, anime)
          ) {
            setState({ phase: 'unknown', query: candidate.entry.slug });
            return;
          }
          arriveReturnedAnime(anime);
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          setState({ phase: 'unknown', query: candidate.entry.slug });
        });
    },
    [arriveReturnedAnime],
  );

  useEffect(() => {
    commitQueryRef.current = commitQuery;
  }, [commitQuery]);

  useEffect(() => {
    return () => {
      if (resolveTimerRef.current !== undefined) {
        clearTimeout(resolveTimerRef.current);
      }
      discoveryAbortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!voiceSupported) return undefined;

    const recognizer = createSpeechRecognizer({
      onInterim: (transcript) => {
        setVoice({ mode: 'listening', interim: transcript });
      },
      onFinal: (transcript) => {
        const spoken = transcript.trim();
        setVoice({ mode: 'idle' });
        setQuery(spoken);
        commitQueryRef.current(normalizeVoiceQuery(spoken));
      },
      onError: (code) => {
        const copy = speechRecognitionErrorCopy(code);
        setVoice(copy ? { mode: 'error', message: copy } : { mode: 'idle' });
      },
      onEnd: () => {
        setVoice((current) => settleVoiceAfterRecognitionEnd(current));
      },
    });
    recognizerRef.current = recognizer;

    return () => {
      recognizer?.dispose();
      recognizerRef.current = null;
    };
  }, [voiceSupported]);

  const stopVoice = useCallback(() => {
    recognizerRef.current?.abort();
    setVoice({ mode: 'idle' });
  }, []);

  const toggleVoice = () => {
    if (listening) {
      stopVoice();
      return;
    }

    setVoice({ mode: 'listening', interim: '' });
    recognizerRef.current?.start();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (listening) stopVoice();
    commitQuery(query);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();

    if (listening) {
      stopVoice();
      return;
    }

    if (voice.mode === 'error') {
      setVoice({ mode: 'idle' });
      return;
    }

    if (resolveTimerRef.current !== undefined) {
      clearTimeout(resolveTimerRef.current);
    }
    discoveryAbortRef.current?.abort();
    discoveryAbortRef.current = null;

    if (query.length > 0 || state.phase !== 'idle') {
      setQuery('');
      setState({ phase: 'idle' });
      setVoice({ mode: 'idle' });
      return;
    }

    if (arrivedAnime) {
      clearAnimeArrival();
    }
  };

  let statusMessage: string | null = announce;
  if (listening) {
    statusMessage = WORLD_NAVIGATOR_VOICE.listening;
  } else if (voice.mode === 'error') {
    statusMessage = voice.message;
  } else if (state.phase === 'watchlist' && state.rows.length === 0) {
    statusMessage = WORLD_NAVIGATOR_COPY.watchlistEmpty;
  } else if (state.phase === 'idle') {
    statusMessage = worldNavigatorIdleStatus(savedCount);
  }
  const continueCandidate =
    state.phase === 'idle' && !listening && voice.mode !== 'error'
      ? resolveContinueCandidate(newestMemory ?? undefined, arrivedAnime?.id)
      : null;
  const statusKey = listening
    ? 'listening'
    : voice.mode === 'error'
      ? 'voice-error'
      : state.phase;
  const inputAccent = listening
    ? WORLD_NAVIGATOR_INPUT_ACCENT.resolving
    : WORLD_NAVIGATOR_INPUT_ACCENT[state.phase];

  return (
    <motion.div
      data-slot="world-navigator"
      data-navigator-phase={state.phase}
      data-voice-state={voice.mode}
      className={cn(
        'flex w-full flex-col items-stretch text-left',
        className,
      )}
      style={{ gap: spacing.sm }}
      initial={reduceMotion ? false : worldNavigatorEnterFrom}
      animate={worldNavigatorEnterTo}
      transition={
        reduceMotion
          ? worldNavigatorEnterTransitionReduced
          : worldNavigatorEnterTransition
      }
      onKeyDown={handleKeyDown}
    >
      <p
        data-slot="world-navigator-orientation"
        className={cn(
          'text-xs tracking-[0.04em] text-foreground/70',
          legibility.copy,
        )}
      >
        {WORLD_NAVIGATOR_COPY.orientation}
      </p>

      <form
        data-slot="world-navigator-form"
        className={WORLD_NAVIGATOR_THRESHOLD.form}
        style={{ gap: spacing.sm }}
        onSubmit={handleSubmit}
      >
        <label htmlFor={inputId} className="sr-only">
          {WORLD_NAVIGATOR_COPY.inputLabel}
        </label>
        <div className="relative w-full">
          <input
            id={inputId}
            type="text"
            name="world-navigator-query"
            autoComplete="off"
            spellCheck={false}
            value={query}
            placeholder={WORLD_NAVIGATOR_COPY.placeholder}
            aria-describedby={statusId}
            onChange={(event) => {
              setQuery(event.target.value);
              if (voice.mode === 'error') setVoice({ mode: 'idle' });
            }}
            className={cn(
              WORLD_NAVIGATOR_THRESHOLD.input,
              'placeholder:text-muted-foreground/70',
              'outline-none transition-colors motion-reduce:transition-none',
              inputAccent,
              legibility.copy,
            )}
          />
          {voiceSupported ? (
            <button
              type="button"
              data-slot="world-navigator-voice"
              data-voice-listening={listening ? 'true' : 'false'}
              aria-label={
                listening
                  ? WORLD_NAVIGATOR_VOICE.stopVoice
                  : WORLD_NAVIGATOR_VOICE.useVoice
              }
              aria-pressed={listening}
              onClick={toggleVoice}
              className={cn(
                WORLD_NAVIGATOR_THRESHOLD.voiceButton,
                'outline-none transition-colors motion-reduce:transition-none',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                listening && 'text-ring',
              )}
            >
              <VoiceGlyph />
            </button>
          ) : null}
        </div>
      </form>

      <div
        id={statusId}
        data-slot="world-navigator-status"
        role="status"
        aria-live="polite"
        className="relative min-h-[1.25rem] w-full max-w-md"
      >
        <AnimatePresence mode="wait" initial={false}>
          {statusMessage ? (
            <motion.p
              key={statusKey}
              className={cn(
                'text-xs leading-relaxed text-muted-foreground',
                legibility.copy,
              )}
              initial={reduceMotion ? false : worldNavigatorStatusFrom}
              animate={worldNavigatorStatusTo}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : worldNavigatorStatusExit
              }
              transition={worldNavigatorStatusTransition}
            >
              {statusMessage}
              {listening && voice.interim ? (
                <span
                  data-slot="world-navigator-transcript"
                  className="mt-1 block text-[0.625rem] text-muted-foreground/70"
                >
                  {voice.interim}
                </span>
              ) : null}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>

      {continueCandidate ? (
        <button
          type="button"
          data-slot="world-navigator-continue"
          aria-label={continueControlLabel(continueCandidate.entry)}
          onClick={() => activateContinue(continueCandidate)}
          className={cn(WORLD_NAVIGATOR_PATH.item, legibility.copy, 'max-w-md')}
        >
          <span className={WORLD_NAVIGATOR_PATH.title}>
            {continueControlLabel(continueCandidate.entry)}
          </span>
          <span className={WORLD_NAVIGATOR_PATH.context}>
            {WORLD_NAVIGATOR_CONTINUE.context}
          </span>
        </button>
      ) : null}

      {state.phase === 'ambiguous' ? (
        <WorldNavigatorPathList
          slot="world-navigator-candidates"
          paths={navigatorPathsFromCatalog(state.candidates)}
          onSelect={(key) => {
            const candidate = state.candidates.find((item) => item.id === key);
            if (!candidate) return;
            setQuery(candidate.canonicalTitle);
            setState({
              phase: 'resolved',
              query: candidate.canonicalTitle,
              anime: candidate,
            });
            markArrivalVia('navigator');
            arriveAnime(candidate);
          }}
        />
      ) : null}

      {state.phase === 'discovered' ? (
        <WorldNavigatorPathList
          slot="world-navigator-candidates"
          paths={state.candidates.map(navigatorPathFromDiscovery)}
          onSelect={(key) => {
            const candidate = state.candidates.find(
              (item) => `discovered:${item.malId}` === key,
            );
            if (!candidate) return;
            const anime = canonicalizeDiscoveryCandidate(candidate);
            setQuery(anime.canonicalTitle);
            setState({
              phase: 'resolved',
              query: anime.canonicalTitle,
              anime,
            });
            markArrivalVia('navigator');
            arriveAnime(anime);
          }}
        />
      ) : null}

      {state.phase === 'watchlist' && state.rows.length > 0 ? (
        <WorldNavigatorPathList
          slot="world-navigator-watchlist"
          paths={state.rows.map(navigatorPathFromWatchlist)}
          onSelect={(key) => {
            const row = state.rows.find((item) => item.entry.animeId === key);
            if (row) selectWatchlistRow(row);
          }}
        />
      ) : null}
    </motion.div>
  );
}
