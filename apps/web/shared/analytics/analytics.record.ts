import type { AnimeAskRoute } from '@/shared/anime/anime.semantic-intent';
import type { CanonicalAnime } from '@/shared/anime/anime.types';

import { askClassFromNavigatorPlan } from './analytics.ask-class';
import { emitProductEvent } from './analytics.emit';
import {
  consumeArrivalVia,
  getAnalyticsSessionId,
  noteDistinctDestination,
} from './analytics.session';
import type { WorldEntrySource } from './analytics.types';
import { resolveAnimeOrigin } from './analytics.origin';

export function resolveWorldEntrySource(): WorldEntrySource {
  if (typeof window === 'undefined') {
    return 'direct';
  }

  const navigation = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (navigation?.type === 'back_forward') {
    return 'return';
  }

  try {
    const referrer = new URL(document.referrer);
    if (referrer.origin === window.location.origin && referrer.pathname === '/') {
      return 'home';
    }
  } catch {
    /* invalid referrer */
  }

  return 'direct';
}

export function recordWorldEntered(): void {
  emitProductEvent({
    name: 'world_entered',
    source: resolveWorldEntrySource(),
    session_id: getAnalyticsSessionId(),
  });
}

export function recordNavigatorAskSubmitted(plan: AnimeAskRoute): void {
  const discoverLookup =
    plan.kind === 'discover' ? plan.lookup.kind : undefined;

  emitProductEvent({
    name: 'navigator_ask_submitted',
    ask_class: askClassFromNavigatorPlan({
      kind: plan.kind,
      discoverLookup,
    }),
    session_id: getAnalyticsSessionId(),
  });
}

export function recordDestinationArrival(anime: CanonicalAnime): void {
  const sessionId = getAnalyticsSessionId();

  emitProductEvent({
    name: 'destination_arrived',
    anime_id: anime.id,
    slug: anime.slug,
    origin: resolveAnimeOrigin(anime),
    via: consumeArrivalVia(),
    session_id: sessionId,
  });

  const distinctCount = noteDistinctDestination(anime.id);
  if (distinctCount === 2) {
    emitProductEvent({
      name: 'session_multi_destination',
      distinct_count: 2,
      session_id: sessionId,
    });
  }
}
