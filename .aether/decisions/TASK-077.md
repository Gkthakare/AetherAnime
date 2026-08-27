# TASK-077 — V1 production deployment attempt

Status: FROZEN
Area: deployment / Vercel · V1 freeze

## Decision

**DEPLOYMENT PAUSED — USER ACTION REQUIRED.** Target remains Vercel with Root Directory `apps/web`. `npx vercel whoami` reported **Logged out** (CLI 59.7.0). No production deploy, live URL, or deployment ID was created. V1 is not LIVE until the user authenticates, links the project, sets server env names from `.env.example`, and runs `npx vercel --prod`.

## Why

TASK-072 already selected Vercel; TASK-076 accepted the product. This task reached the authentication boundary before linking, env configuration, or `--prod`. Fabricating a URL would violate evidence rules.

## Protected behaviour

- Do not claim a live URL without `vercel whoami` success + a real `--prod` result.
- Root Directory must stay `apps/web`.
- Server secrets (`MAL_CLIENT_ID`, `SEMANTIC_INTENT_*`) stay off `NEXT_PUBLIC_*` and out of the brain.
- Do not auto-commit or push for deployment.

## Implementation area

- Ops: `npx vercel login` → `whoami` → link (`apps/web`) → Production env names → `npx vercel --prod`
- Docs: `apps/web/README.md` Deployment section
- No application code changes in this attempt

## Contracts

- Live smoke / live FPS / live artwork: **not run** (no authenticated deploy).
- Local product freeze through [[TASK-076]] unchanged.

## Do not undo

- Do not switch hosts without a new decision.
- Do not invent `vercel.json`, Docker, or databases to bypass auth.
- Do not reopen deferred polish to “unblock” deploy.

## Links

[[TASK-072]] · [[TASK-071]] · [[TASK-076]] · [[current-state]] · [[open-questions]]
