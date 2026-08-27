# TASK-066 — Traveller state → World reactivity audit

Status: FROZEN
Area: architecture · product state · Memory / Continue / Watchlist

## Decision

**No new persistent state model and no additional state-reactive visual system** are justified for V1. Existing `aetheranime.memory.v1` + Horizon + Navigator Continue already communicate journey continuity. Watchlist remains deliberate save, independent of Memory. Ephemeral Destination / URL / ceremony state must not be promoted to persistence. MemoryEntry `{ animeId, slug, lastArrivedAt, title? }` remains sufficient.

## Why

Production Chromium state-flow QA verified: empty → arrive A → Idle (Horizon + Continue) → refresh → Continue resumes A → already-arrived suppresses Continue → A→B→C newest wins → invalid Memory degrades empty → Watchlist-only does not create Continuity chrome → URL arrival records Memory → clear storage resets. Source shows Memory consumers are only WorldScene recorder, Horizon (read), and Continue (read). WorldEnvironment / Idle geography / living presence do not derive from Memory count or Watchlist. Adding count/recency/journey-depth/progression reactions would invent progression from observational arrivals and risk gamification / HUD / second world-state systems without a concrete continuity gap.

## Protected behaviour

- Persistent keys remain only `aetheranime.memory.v1` and `aetheranime.watchlist.v1`.
- Do not invent `aetheranime.continue.v1`, visit counts, first-arrival, sequence, world position, or sessionStorage journey state for V1 continuity.
- Do not drive WorldEnvironment / Climate / geography / living light from Memory length or Watchlist.
- Do not merge Memory with Watchlist or Kinship semantics.
- Horizon stays non-interactive residual; Continue stays singular Idle Navigator resume from Memory newest.

## Implementation area

None (audit only). Evidence: `%TEMP%/aether-066-qa/report.json`.

## Contracts

- Unit suite 463 pass; `tsc` 0; ESLint 0; `next build` 0.
- Production FPS sample: Idle empty 60 · Destination 62 · Idle+Memory 61 (1440×900, headless + `--disable-gpu`).
- Network: Idle 0 `/api/*`; Destination existing metadata only. No polling.
- A11y: Horizon `pointer-events: none`, `aria-hidden=true`; Continue real `BUTTON` with accessible name.

## Do not undo

- Do not treat “the architecture can store it” as a product requirement.
- Do not reopen TASK-065 visual coherence to express progression.
- Do not add XP / levels / badges / history dashboards / Memory cards.
- Do not expand Memory schema without a concrete new semantic decision.

## Links

[[TASK-057-A]] · [[TASK-057-B]] · [[TASK-061]] · [[TASK-062]] · [[TASK-065]] · [[vision]] · [[visual-language]] · [[engineering-rules]] · [[performance-contract]] · [[open-questions]] · [[current-state]]
