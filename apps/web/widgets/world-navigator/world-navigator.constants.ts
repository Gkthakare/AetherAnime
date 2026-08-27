/**
 * WorldNavigator copy — orientation and phase announcements.
 */

import type { NavigatorPhase } from './world-navigator.types';

export const WORLD_NAVIGATOR_COPY = {
  orientation: 'Where shall we go?',
  placeholder: 'Ask the world...',
  inputLabel: 'Ask the world',
  savedDestination: 'Saved destination',
  watchlistEmpty: 'No destinations are saved yet.',
  watchlistWhisper: 'Saved destinations will answer.',
} as const;

export const WORLD_NAVIGATOR_VOICE = {
  listening: 'The world is listening.',
  useVoice: 'Ask the world by voice',
  stopVoice: 'Stop voice navigation',
  notAllowed: 'Voice access is unavailable.',
  noSpeech: 'The world heard nothing.',
  audioCapture: 'No listening channel is available.',
  interrupted: 'The listening channel was interrupted.',
} as const;

/**
 * Idle threshold presentation. Underline field, not a search card.
 * Voice control is a 44px target with no looping motion.
 */
export const WORLD_NAVIGATOR_THRESHOLD = {
  form: 'flex w-full max-w-md flex-col items-stretch',
  input:
    'w-full bg-transparent pr-12 text-left text-base text-foreground border-0 border-b pb-2',
  voiceButton:
    'absolute right-0 bottom-0 flex size-11 items-center justify-center text-muted-foreground',
  voiceGlyph: 'size-5',
} as const;

/** Quiet memory. Never a count, badge, or dashboard. */
export function worldNavigatorIdleStatus(savedCount: number): string | null {
  if (savedCount > 0) return WORLD_NAVIGATOR_COPY.watchlistWhisper;
  return null;
}

export const WORLD_NAVIGATOR_STATUS: Record<NavigatorPhase, string> = {
  idle: 'Where shall we go?',
  resolving: 'The world is listening.',
  resolved: 'The destination answers.',
  ambiguous: 'Several destinations answer to that name.',
  discovered: 'The world found a few paths.',
  watchlist: 'Saved destinations answer.',
  interpreting: 'The world is searching beyond its map.',
  unintelligible: 'The world could not understand that path.',
  unknown: 'The world could not find that destination.',
  error: 'The world lost the trail.',
};

/** Underline accent by phase — color only, no pulse. */
export const WORLD_NAVIGATOR_INPUT_ACCENT: Record<NavigatorPhase, string> = {
  idle: 'border-border/40 focus-visible:border-ring/70',
  resolving: 'border-ring/50',
  resolved: 'border-ring/45',
  ambiguous: 'border-border/50',
  discovered: 'border-border/50',
  watchlist: 'border-border/50',
  interpreting: 'border-ring/50',
  unintelligible: 'border-border/40',
  unknown: 'border-border/40',
  error: 'border-border/40',
};
