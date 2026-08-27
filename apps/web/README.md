# AetherAnime (`apps/web`)

V1 release candidate: **Home → World Idle → Destination**.

Product freeze: TASK-069. Release candidate: TASK-070. Deployment readiness: TASK-071.
Host: **Vercel** (TASK-072).

## Install

```bash
cd apps/web
npm ci
```

Requires Node.js compatible with Next.js 16.

## Environment

Copy `.env.example` to `.env.local` (gitignored). Server-only variables:

| Variable | Required | Purpose |
|---|---|---|
| `MAL_CLIENT_ID` | For MAL-backed discovery/metadata | MyAnimeList API client ID |
| `SEMANTIC_INTENT_API_KEY` | Optional | OpenAI-compatible key for Navigator structured intent |
| `SEMANTIC_INTENT_BASE_URL` | Optional | Intent endpoint base URL |
| `SEMANTIC_INTENT_MODEL` | Optional | Model id |

Never prefix these with `NEXT_PUBLIC_`. Leave semantic intent empty to disable the LLM path.

## Development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Production

```bash
npm run build
npm run start
```

Default listen port is 3000 (`PORT` overrides).

## Routes

| URL | Surface |
|---|---|
| `/` | Home (threshold) |
| `/world/aetheranime` | World Idle |
| `/world/aetheranime?anime=<slug>` | Destination |
| `/world/aetheranime?region=<id>` | Region focus (existing contract) |

## What is local-only

- World Memory: `localStorage` key `aetheranime.memory.v1`
- Watchlist: `localStorage` key `aetheranime.watchlist.v1`

No account sync in V1.

## External services

- MyAnimeList API (server) when `MAL_CLIENT_ID` is set
- Optional OpenAI-compatible intent endpoint when semantic intent vars are set

Home and Idle make **no** `/api/*` calls. Destination uses metadata. Navigator uses intent/discovery only when needed.

## What V1 deliberately does not contain

- Horizon interaction / arrive-from-memory
- Account or server Memory sync
- Dedicated portrait mid-continuation or per-title Destination environment artwork
- Chatbot UI or extra AI surfaces beyond Navigator structured intent
- A database, server Memory sync, WebSocket, worker, or cron

## Deployment (Vercel)

Selected host: **Vercel** ([[TASK-072]]). No `vercel.json` is required — Next.js App Router is zero-config on Vercel.

Root Directory in the Vercel project: `apps/web`.

### One-time auth / project link

```bash
# From the machine that will deploy
npx vercel login
cd apps/web
npx vercel link   # set Root Directory to apps/web if linking from repo root
```

### Server environment (Vercel Project → Settings → Environment Variables)

Set as **server-only** (Production / Preview as needed). Never use `NEXT_PUBLIC_`:

- `MAL_CLIENT_ID`
- `SEMANTIC_INTENT_API_KEY` (optional)
- `SEMANTIC_INTENT_BASE_URL` (optional)
- `SEMANTIC_INTENT_MODEL` (optional)

### Deploy

```bash
cd apps/web
npx vercel --prod
```

Or connect the Git remote in the Vercel dashboard and deploy from the linked branch (still with Root Directory `apps/web`).

### Production URL / rollback

- Default HTTPS URL is assigned by Vercel after the first successful deploy.
- Rollback: Vercel Dashboard → Deployments → promote a prior successful deployment (or redeploy a previous commit).
- Env updates: change Project Environment Variables, then redeploy.

## Verification

```bash
npx tsx --test "shared/**/*.test.ts" "widgets/**/*.test.ts"
npx tsc --noEmit
npm run lint
npm run build
```
