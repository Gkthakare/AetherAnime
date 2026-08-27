/**
 * Client semantic-intent request. Talks only to the app API.
 */

import type { StructuredAnimeIntent } from './anime.semantic-intent';
import { validateStructuredAnimeIntent } from './anime.semantic-intent';

export async function requestSemanticIntent(
  text: string,
  signal: AbortSignal,
): Promise<StructuredAnimeIntent | null> {
  const response = await fetch('/api/anime-intent', {
    method: 'POST',
    signal,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) return null;
  const body: unknown = await response.json();
  if (!body || typeof body !== 'object' || !('intent' in body)) return null;
  return validateStructuredAnimeIntent(
    (body as { intent: unknown }).intent,
  );
}
