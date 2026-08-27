/**
 * WorldNavigator — typed navigator phases and copy.
 *
 * Phases are a discriminated union. Widgets must not scatter string
 * comparisons against raw status text.
 */

import type { CanonicalAnime, WatchlistReturnRow } from '@/shared/anime';
import type { AnimeDiscoveryCandidate } from '@/shared/anime/anime.discovery';

export type NavigatorPhase =
  | 'idle'
  | 'resolving'
  | 'resolved'
  | 'ambiguous'
  | 'discovered'
  | 'watchlist'
  | 'interpreting'
  | 'unintelligible'
  | 'unknown'
  | 'error';

export type NavigatorState =
  | { readonly phase: 'idle' }
  | { readonly phase: 'resolving'; readonly query: string }
  | {
      readonly phase: 'resolved';
      readonly query: string;
      readonly anime: CanonicalAnime;
    }
  | {
      readonly phase: 'ambiguous';
      readonly query: string;
      readonly candidates: ReadonlyArray<CanonicalAnime>;
    }
  | {
      readonly phase: 'discovered';
      readonly query: string;
      readonly candidates: ReadonlyArray<
        AnimeDiscoveryCandidate & { readonly matchReason?: string | null }
      >;
    }
  | {
      readonly phase: 'watchlist';
      readonly query: string;
      readonly rows: ReadonlyArray<WatchlistReturnRow>;
    }
  | { readonly phase: 'unknown'; readonly query: string }
  | { readonly phase: 'interpreting'; readonly query: string }
  | { readonly phase: 'unintelligible'; readonly query: string }
  | { readonly phase: 'error'; readonly query: string };

export interface WorldNavigatorProps {
  className?: string;
}
