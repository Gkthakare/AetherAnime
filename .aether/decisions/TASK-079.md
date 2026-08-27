# TASK-079 — Vercel project link + Production env readiness

Status: FROZEN
Area: deployment / Vercel · V1 freeze

## Decision

**PROJECT LINKED; PRODUCTION ENV NOT READY; DEPLOY BLOCKED.** Authenticated as `gkthakare`. Created and linked Vercel project `gauravth-projects1/aetheranime` (id `prj_qqHxvksnb5YJVyHa6lkDHdwv5MRE`) from `apps/web`. Framework **Next.js**; Root Directory **`apps/web`** confirmed. Did **not** link unrelated `aetheria-command-center`. Production env list is **empty** — required names missing on Vercel. `npx vercel --prod` not run. Deployment **not authorized** until Production env names are configured by the user.

## Why

TASK-078 blocked on auth. Auth now succeeds. Linking and root-directory contract are satisfied; Production secrets are not yet present on the host.

## Protected behaviour

- Root Directory must remain `apps/web`.
- Do not link AetherAnime V1 to unrelated projects.
- Never print or store env **values** in `.aether`.
- Do not commit `.vercel/` or `.env.local`.
- Do not deploy until Production env names are present.
- Keep `assets/aether-058d-candidates/` out of production.

## Implementation area

- Local link: `apps/web/.vercel/project.json` (gitignored)
- Project: `aetheranime` under team `gauravth-projects1`
- User: set Production env names via Vercel UI/CLI from `.env.example`

## Contracts

- Auth: `gkthakare`
- Root Directory: `apps/web`
- Production env configured: **no** (0 vars)
- Deploy: **not run**

## Do not undo

- Do not reset root directory to `.`
- Do not deploy with empty Production secrets expecting discovery/intent to work
- Do not invent `vercel.json` / Dockerfile

## Links

[[TASK-078]] · [[TASK-077]] · [[TASK-072]] · [[current-state]] · [[open-questions]]
