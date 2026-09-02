import { shouldEmitProductEvent } from './analytics.dedupe';
import type { ProductEventPayload } from './analytics.types';

export type EmitProductEventOptions = {
  /** Skip client-side dedupe (server applies its own rules). */
  skipDedupe?: boolean;
};

/**
 * Fire-and-forget product event POST. Never throws. Never blocks navigation.
 */
export function emitProductEvent(
  payload: ProductEventPayload,
  options: EmitProductEventOptions = {},
): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (!options.skipDedupe && !shouldEmitProductEvent(payload)) {
      return;
    }

    void fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      /* analytics failure must not affect product */
    });
  } catch {
    /* swallow */
  }
}

/** Test helper — synchronous validation path without network. */
export function serializeProductEvent(payload: ProductEventPayload): string {
  return JSON.stringify(payload);
}
