# TASK-067 — Navigator capability audit

Status: FROZEN
Area: World Navigator · intent → destination

## Decision

The existing World Navigator is **sufficient for V1** as the primary world-native instrument for discovering and reaching destinations. No production change. TASK-062 structured-intent architecture remains consistent. Do not redesign into a chatbot, search page, recommendation dashboard, or second navigation system.

## Why

Production Chromium QA + source inspection show one coherent instrument loop: ask → `planAnimeAsk` (deterministic-first) → candidates or named arrive → explicit path activation (except exact catalog resolve) → WorldScene arrival → Memory. Results render as plate-edge path buttons (`max-w-md`), not a catalog grid. Continue stays singular and Idle-only ([[TASK-061]]). AI only returns validated `StructuredAnimeIntent`; retrieval/ranking/arrival stay application-owned. Live `/api/anime-intent` currently returns `intent: null` for descriptive asks in this environment — Navigator fails soft to `unintelligible` (“The world could not understand that path.”), which is correct failure, not a justification for a new AI surface.

## Protected behaviour

- Deterministic-first routing: exact / ambiguous / discover / watchlist / filter before semantic.
- Semantic path: POST `/api/anime-intent` → `validateStructuredAnimeIntent` → `retrieveForStructuredIntent` → path list → user select. LLM never navigates or mutates Memory/Watchlist.
- Exact catalog resolve may arrive immediately (named place). AI / discovery / ambiguous never auto-arrive.
- Continue derives only from Memory newest; never mixed into ranked search results.
- No Navigator persistence beyond existing Memory/Watchlist keys.
- Contract tests in `anime.semantic-intent.test.ts`, Navigator path/continue tests remain authoritative.

## Implementation area

None (audit only). Evidence: `%TEMP%/aether-067-qa/` (`audit-out.txt`, `fps.json`).

## Contracts

- Unit suite 463 pass; `tsc` 0; ESLint 0; `next build` 0.
- FPS (production Chromium, `--disable-gpu`): Idle empty / Continue / Navigator results ≈60–61 at 390 / 820 / 1440 / 1920. Destination samples 52–61 (arrival window can dip; not introduced by this task).
- Network: existing `/api/anime-intent`, `/api/anime-discovery`, `/api/anime-metadata/*` only. No new endpoint.
- Persistence: no new `aetheranime.*` keys; `sessionStorage` unused by Navigator.

## Do not undo

- Do not add chatbot / AI avatar / ambient AI / search history / recommendation feed.
- Do not treat live provider `intent: null` as a product redesign trigger — soft fail is required.
- Do not expand Memory schema or invent Navigator state stores for query history.
- Do not reopen TASK-062 or TASK-065 for “smarter” Navigator visuals.

## Links

[[TASK-053]] · [[TASK-061]] · [[TASK-062]] · [[TASK-066]] · [[vision]] · [[visual-language]] · [[data-flow]] · [[engineering-rules]] · [[performance-contract]] · [[current-state]] · [[open-questions]]
