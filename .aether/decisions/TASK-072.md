# TASK-072 — V1 deployment target & first deployment

Status: FROZEN
Area: deployment / infrastructure · V1 freeze

## Decision

**SELECTED TARGET: Vercel.** Deployment model: Next.js App Router on Vercel (zero repository platform config). **First live deploy is PAUSED** — `npx vercel whoami` reported an invalid token; user must `vercel login`, link the project (`apps/web` root), set server env vars, then deploy.

## Why

The app is a standard Next.js 16.2 App Router surface with Route Handlers, dynamic `/world/[destination]`, static WebP assets, and server-only env — no database, workers, or WebSockets. Official Vercel Next.js docs describe zero-configuration deploy for this stack. Generic Node/`next start` and Docker remain compatible fallbacks, but Docker Desktop was not running here and adds ops surface V1 does not need. No `vercel.json` / Dockerfile invented.

## Protected behaviour

- Do not reopen TASK-046→071 for deployment polish.
- Do not add platform config unless a concrete host requirement appears.
- Server secrets stay off `NEXT_PUBLIC_*` and out of client bundles.
- Do not auto-commit or push.

## Implementation area

- Docs: `apps/web/README.md` (host, env, deploy, rollback)
- No application code changes
- Evidence: local gates + auth failure from Vercel CLI 59.7.0

## Contracts

- Local: 463 tests pass; `tsc` 0; `eslint` 0; `next build` 0; `next start` HTTP 200 on `/`, Idle, Destination, metadata.
- Live smoke / live FPS: **not run** (no authenticated deploy).
- Auth blocker: invalid Vercel token → `vercel login` required.

## Do not undo

- Do not switch hosts without an explicit new decision.
- Do not treat auth pause as a product architecture failure.
- Do not commit secrets or `.env.local`.

## Links

[[TASK-071]] · [[TASK-070]] · [[TASK-069]] · [[engineering-rules]] · [[current-state]] · [[open-questions]]
