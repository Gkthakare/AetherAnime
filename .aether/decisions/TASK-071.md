# TASK-071 — V1 release / deployment readiness

Status: FROZEN
Area: release / deployment preparation · V1 freeze

## Decision

**V1 READY TO DEPLOY.** The TASK-070 release candidate remains build-reproducible, secret-safe, production-runtime verified, and journey-intact. **Deployment target not yet defined** in the repository — deploy as a standard Next.js App Router app once a host is chosen and server env is set. No product or architecture changes.

## Why

TASK-069 froze the product; TASK-070 established RC readiness. This task verified that exact candidate can leave the development environment: `npm ci`/`build`/`start`, secrets stay server-only, production Chromium smoke + settled FPS ≈59–62 across four viewports, Home/Idle zero `/api/*`, frozen decisions intact. Documentation was insufficient for a clean handoff (create-next-app boilerplate); `apps/web/README.md` now covers install, env, prod, routes, local-only persistence, and V1 non-goals.

## Protected behaviour

- Do not reopen TASK-046→070 under a deployment pretext.
- Do not invent a platform config (`vercel.json`, Dockerfile, etc.) without an explicit target decision.
- Do not commit `.env.local`, `.next`, `node_modules`, or temp QA artifacts.
- Prefer zero production code changes; docs/env hygiene only when release-blocking.

## Implementation area

- Docs: `apps/web/README.md`, `.env.example` (unchanged contract)
- Evidence: `%TEMP%/aether-071-qa/` (outside repo)

## Contracts

- Unit 463 pass; `tsc --noEmit` 0; `eslint` 0; `next build` 0; `next start` HTTP 200 on `/`, Idle, Destination, metadata.
- Settled FPS Home / Idle empty / Idle Memory+Continue / Destination ≈59–62 at 390 / 820 / 1440 / 1920.
- Client static bundles contain no `MAL_CLIENT_ID` / `SEMANTIC_INTENT_*` names or `sk-…` keys.

## Do not undo

- Do not treat “deployment target not yet defined” as a product reopen.
- Do not convert deferred visual/engineering debt into deploy blockers.
- Do not auto-commit the large untracked V1 surface without an explicit commit request.

## Links

[[TASK-070]] · [[TASK-069]] · [[TASK-068]] · [[performance-contract]] · [[engineering-rules]] · [[current-state]] · [[open-questions]]
