import { createHttpSemanticIntentProvider } from '@/shared/anime/anime.semantic-intent';

function provider() {
  return createHttpSemanticIntentProvider({
    apiKey: process.env.SEMANTIC_INTENT_API_KEY ?? '',
    baseUrl: process.env.SEMANTIC_INTENT_BASE_URL ?? '',
    model: process.env.SEMANTIC_INTENT_MODEL ?? '',
  });
}

/**
 * Server-only structured intent. Returns data, never navigation.
 */
export async function POST(request: Request) {
  let text = '';
  try {
    const body: unknown = await request.json();
    if (body && typeof body === 'object' && 'text' in body) {
      const value = (body as { text: unknown }).text;
      if (typeof value === 'string') text = value;
    }
  } catch {
    return Response.json({ intent: null });
  }

  const intent = await provider().parseIntent(text);
  return Response.json({ intent });
}
