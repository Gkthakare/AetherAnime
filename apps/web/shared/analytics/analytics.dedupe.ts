import { buildProductEventDedupeKey } from './analytics.validate';
import type { ProductEventPayload } from './analytics.types';

const MAX_DEDUPE_ENTRIES = 256;

/** Module-scoped dedupe — not React state. */
const emittedKeys = new Set<string>();

export function shouldEmitProductEvent(event: ProductEventPayload): boolean {
  const key = buildProductEventDedupeKey(event);
  if (emittedKeys.has(key)) {
    return false;
  }
  emittedKeys.add(key);
  if (emittedKeys.size > MAX_DEDUPE_ENTRIES) {
    emittedKeys.clear();
    emittedKeys.add(key);
  }
  return true;
}

/** Test-only reset. */
export function resetProductEventDedupe(): void {
  emittedKeys.clear();
}

export function noteProductEventEmitted(event: ProductEventPayload): void {
  emittedKeys.add(buildProductEventDedupeKey(event));
}
