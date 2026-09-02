import type { ArrivalVia } from './analytics.types';

let sessionId: string | null = null;
const destinationsThisSession = new Set<string>();

/** Module-scoped arrival channel — set before navigation, read at committed arrival. */
let pendingArrivalVia: ArrivalVia = 'url';

export function getAnalyticsSessionId(): string {
  if (typeof window === 'undefined') {
    return 'ssr';
  }
  if (!sessionId) {
    sessionId = crypto.randomUUID();
  }
  return sessionId;
}

export function resetAnalyticsSessionForTests(): void {
  sessionId = null;
  destinationsThisSession.clear();
  pendingArrivalVia = 'url';
}

export function markArrivalVia(via: ArrivalVia): void {
  pendingArrivalVia = via;
}

export function consumeArrivalVia(): ArrivalVia {
  const via = pendingArrivalVia;
  pendingArrivalVia = 'url';
  return via;
}

export function noteDistinctDestination(animeId: string): number {
  destinationsThisSession.add(animeId);
  return destinationsThisSession.size;
}

export function getDistinctDestinationCount(): number {
  return destinationsThisSession.size;
}

export function hasVisitedDestination(animeId: string): boolean {
  return destinationsThisSession.has(animeId);
}
