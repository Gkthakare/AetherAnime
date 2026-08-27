# TASK-074 — Destination artwork data contract

Status: FROZEN
Area: anime data / security · Destination artwork

## Decision

**DATA CONTRACT LOCKED — Option A.** Expand `CanonicalAnime.poster` semantics from “local project-safe path | null” to **validated presentation artwork | null**: either an existing local catalog path (`/assets/...`) or a **server-validated HTTPS MAL CDN URL** (`cdn.myanimelist.net` only). Discovered destinations obtain artwork by requesting MAL `main_picture` on the **existing** discovery endpoints, normalizing a validated URL into the candidate, then setting `poster` in `canonicalizeDiscoveryCandidate`. No new API, no second artwork field, no image proxy, no persistence of binaries.

Prefer `main_picture.large`, fall back to `main_picture.medium`. Reject malformed/untrusted URLs → `poster: null` (soft fail). Catalog entries keep local posters and win on catalog MAL-ID canonicalize. Next.js `images.remotePatterns` must allow only that MAL CDN host/path for `next/image` (already used by Destination FG + atmosphere).

## Why

TASK-073 Option D needs every resolved Destination to carry that anime’s own artwork. Today discovery **does not request** `main_picture`, normalization omits it, and `canonicalizeDiscoveryCandidate` hardcodes `poster: null` — an intentional remote-image seal, not an accidental bug. Existing UI already treats `poster` as the single artwork channel (`WorldScene` → atmosphere + `AnimeDestination`); contract tests forbid a second `artworkKey` field. Expanding validated `poster` is therefore smaller and clearer than introducing a parallel field.

## Protected behaviour

- Artwork URLs originate only from MAL adapter JSON after hostname/path validation — never from LLM/Navigator free text.
- Trusted host: `cdn.myanimelist.net` (HTTPS). No arbitrary domains.
- No `/api/anime-artwork` or image proxy.
- Home/Idle never fetch artwork.
- Memory/Watchlist keys unchanged; Continue re-hydrates discovered via existing `/api/anime-discovery?id=`.
- Null/untrusted/load-fail → seal + TASK-060 environment fallback; never fabricate art.
- Do not implement Option D visuals in this record — that is TASK-075+.

## Implementation area

Shipped:

- `shared/anime/anime.poster.ts` — `validateAnimePosterSource`, `malMainPicturePoster`
- `shared/anime/anime.discovery.ts` — candidate `poster?`, normalize from `main_picture`, canonicalize validates
- `shared/anime/anime.mal.discovery.ts` — `main_picture` in field list
- `shared/anime/anime.types.ts` — poster semantics docs
- `next.config.ts` — narrow `remotePatterns` for `cdn.myanimelist.net/images/anime/**`
- `shared/anime/anime.poster.test.ts` — security + discovery contracts

Not in this task: TASK-073 Option D visual composition.

## Contracts

- Discovery search + `getByMalId` return validated poster when MAL provides trusted `main_picture`.
- Catalog `poster` remains local WebP paths.
- Client never talks to MAL CDN except via browser image load of already-validated URLs rendered through `next/image`.
- Untrusted URL → null poster.

## Do not undo

- Do not reintroduce raw `main_picture` objects into client candidates.
- Do not allow `myanimelist.net` HTML pages or non-CDN hosts as poster sources.
- Do not let semantic-intent / LLM output set artwork URLs.
- Do not download/commit remote posters as local assets for every anime.

## Links

[[TASK-073]] · [[TASK-060]] · [[TASK-062]] · [[engineering-rules]] · [[current-state]] · [[open-questions]] · [[visual-debt]]
