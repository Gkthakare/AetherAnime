# TASK-083 — Production semantic intent fix

Status: FROZEN
Area: Navigator · `/api/anime-intent` · semantic retrieval

## Decision

**TASK-083 FIXED — PRODUCTION VERIFIED.** Production `{intent:null}` was caused by OpenAI-compatible API incompatibilities (`max_tokens`, `temperature:0`) and strict validation of model JSON (empty `seedTitle`, string `tone`, long traits). Fixed at the existing HTTP semantic boundary with token/temperature retries, payload normalization, and navigate-intent retrieval pinning resolved catalog titles first. No Vercel env value changes. Hunter/system descriptive ask returns structured intent and ranks Solo Leveling #1 live.

## Why

TASK-082 blocked: env names present but provider HTTP 400 + validation null. Model responses were valid semantically but rejected; navigate+seedTitle path fetched similars and excluded Solo.

## Protected behaviour

- No query→slug hardcode; no `NEXT_PUBLIC_*` secrets.
- Semantic intent remains primary; lexical safety-net unchanged for null intent.
- Exact `Solo Leveling` stays deterministic (0 LLM).
- Navigator-only AI surface; no artwork/Home/Idle/Memory/Continue changes.

## Implementation area

`anime.semantic-intent.ts` — `postChatCompletion`, `normalizeStructuredIntentPayload`, `retrieveForStructuredIntent` navigate pin

## Contracts

- 499 tests; tsc/lint/build 0
- Live alias: `https://aetheranime-tawny.vercel.app`
- Deploy: `dpl_Ey9rUzXmnMqLpSAKQMxZh5nUx3C8`
- Hunter ask: intent non-null; Solo #1

## Do not undo

- Do not revert to single `max_tokens` + `temperature:0` without retry
- Do not remove navigate resolved-title pin (reopens similar-only Solo exclusion)

## Links

[[TASK-082]] · [[TASK-080]] · [[TASK-062]] · [[current-state]]
