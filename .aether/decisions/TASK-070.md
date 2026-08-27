# TASK-070 — V1 release readiness audit

Status: FROZEN
Area: release readiness · production hardening · V1 freeze

## Decision

**V1 RELEASE CANDIDATE READY.** Production build, tests, TypeScript, ESLint, production Chromium smoke matrix (390 / 820 / 1440 / 1920), settled FPS, persistence, network, accessibility, reduced motion, assets, and frozen-decision regression all pass. **No release blockers. No production code changes.**

## Why

TASK-069 froze the product. This audit verified the frozen product still ships cleanly: core journeys work; Home/Idle make 0 `/api/*` requests; Destination uses metadata only; Console showed 0 application errors/exceptions during the matrix; settled FPS Home/Idle/Destination ≈60–62; continuous Idle living light only; Destination living off; Horizon non-interactive; Memory + Watchlist keys only; secrets remain server-side (`MAL_CLIENT_ID`, `SEMANTIC_INTENT_*` never `NEXT_PUBLIC_`). Unused `@base-ui/react` / `shadcn` remain non-blocking hygiene ([[TASK-063]]), not ship stoppers.

## Protected behaviour

- Do not reopen TASK-046→069 for polish under a “release” pretext.
- Do not treat deferred visual debt or unused deps as release blockers.
- Report Destination FPS as **settled** only; arrival-window dips remain TASK-068 ceremony cost.
- `.env.local` must stay gitignored; only `.env.example` ships.

## Implementation area

None (release audit / brain only). Evidence: `%TEMP%/aether-070-qa/report.json` · `summary.json`.

## Contracts

- Unit suite 463 pass; `tsc --noEmit` 0; `eslint` 0; `next build` 0; production server 200 on `/`.
- Settled FPS matrix ≈60–62 across Home / Idle empty / Idle Memory+Continue / Destination at four viewports.
- Smoke: Home→Idle→Continue→Destination→Navigator exact/ambiguous/relational/nonsense/descriptive→Escape→refresh→clear→invalid Memory soft-fail — all viewports.

## Do not undo

- Do not invent features during “release hardening.”
- Do not remove unused deps in this record without a dedicated engineering cleanup task.
- Do not commit `.env.local` or secrets.

## Links

[[TASK-069]] · [[TASK-068]] · [[TASK-067]] · [[TASK-063]] · [[performance-contract]] · [[engineering-rules]] · [[current-state]] · [[open-questions]] · [[visual-debt]]
