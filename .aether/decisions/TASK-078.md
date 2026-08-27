# TASK-078 — Vercel authentication & project link

Status: FROZEN
Area: deployment / Vercel · V1 freeze

## Decision

**AUTH STILL REQUIRED — LINK NOT STARTED.** After V1 commit `f592bcb` on `origin/feature/experience-engine`, `npx vercel whoami` still reports **Logged out** (CLI 59.7.0). No `.vercel` link exists under `apps/web`. No Production env configured. No deploy attempted. Deployment is **not authorized** until login, link (`apps/web`), and env names are confirmed.

## Why

TASK-077 paused on auth; this resume task re-checked the boundary with the synchronized remote. Authentication has not changed. Linking without a session would invent a project state.

## Protected behaviour

- Root Directory must remain `apps/web`.
- Do not run `npx vercel --prod` in this task class until auth + link + env-name readiness are true.
- Never write secret **values** into the brain; only env **names**.
- Do not commit/push brain or `.vercel` unless a later task explicitly asks.
- Keep `assets/aether-058d-candidates/` out of production.

## Implementation area

Ops only: `npx vercel login` → `npx vercel whoami` → link from `apps/web` → confirm Root Directory → user sets Production env names from `.env.example` → later task may `--prod`.

## Contracts

- Authenticated account: **none** (logged out).
- Project link: **none**.
- Live deploy: **not run**.

## Do not undo

- Do not claim linked/ready while `whoami` fails.
- Do not invent `vercel.json` / Dockerfile to bypass login.
- Do not configure env **values** from agent context.

## Links

[[TASK-077]] · [[TASK-072]] · [[TASK-071]] · [[current-state]] · [[open-questions]]
