# TASK-083 — Global companion and licensed-playback foundation

Status: proposed

## Product decision

AetherAnime remains a free, global anime companion. It provides discovery,
personal progress, watchlists, multilingual preferences, and verified
official-provider handoffs without hosting, proxying, embedding, or gating
third-party episodes.

The product is deliberately staged:

1. **A — global companion:** repair production descriptive discovery, then
   add trustworthy regional availability and intentional official handoffs.
2. **C — partner playback:** add in-site playback only through a future,
   provider-approved adapter after a commercial agreement exists.
3. **Licensed playback:** subscription or per-title playback is enabled only
   where AetherAnime holds the relevant territory, language, and playback
   rights.

This is a product-boundary decision. It does not authorize copying, scraping,
proxying, embedding, downloading, or modifying a third-party anime player.

## Goals

- A free guest can find an anime, enter its Destination, learn where it is
  legitimately available in their location, and cross to a verified official
  destination.
- Personal progress, watchlists, and discovery remain free. A user may elect
  to create an account to retain those preferences across devices.
- Country, audio, and subtitle preferences are explicit user settings; the
  product must never infer availability from an LLM.
- The existing descriptive hunter/system ask returns a relevant result set
  with Solo Leveling in the accepted top results on Production.
- Future playback supports provider-supplied intro, recap, and preview cue
  points, rather than guessing timestamps from user text or media analysis.

## Non-goals

- No anime streaming, content acquisition, DRM, entitlement billing, or
  regional licensing implementation in TASK-083.
- No subscription charge, payment provider, price, phone OTP, account system,
  or user-data migration in TASK-083.
- No affiliate assertion, provider logo, availability claim, or Watch Now
  link without a verified data source and applicable agreement.
- No change to the Home/Idle/Destination visual architecture, RealmCrossing,
  Option D artwork field, Watchlist separation, or existing URL ownership.

## Product flow

```text
guest query
  → Navigator proposes paths (never auto-arrives)
  → traveller confirms a path
  → Destination
  → regional official availability, when verified
  → intentional external Watch Now crossing
  → user returns to AetherAnime
  → local progress / Continue until an account feature is explicitly approved
```

An unavailable or unknown source remains honestly unavailable or unknown.
It never becomes a guessed provider, a generic search link, or a fabricated
episode option.

## Ownership and trust boundaries

### Discovery

`planAnimeAsk` remains deterministic-first. `StructuredAnimeIntent` is only a
server-side, validated input to retrieval and ranking. It cannot create a
title, link, availability record, navigation command, or persistence write.

The Production failure is diagnosed before changing retrieval behavior:

- inspect the configuration contract and server response without printing
  secret values;
- distinguish missing/invalid semantic-provider configuration from a valid
  but malformed model response;
- preserve the deterministic lexical/synopsis safety net;
- add only a tested fallback that can establish relevant candidates without a
  query-to-title/slug mapping.

### Provider availability

A future `AvailabilityProvider` is server-only and normalizes a contracted,
official availability source into an application-owned shape. It must accept
explicit location and language inputs, return provenance and status, and keep
secrets out of the browser. It may not be implemented until the source,
contract, fields, regions, attribution, and permitted outbound links are
known.

Existing `AnimeWatchPath` stays the sole authority for an external crossing
until then. Its HTTPS validation and rejected-host rules remain intact.

### Identity and progress

Guests retain the current local-first, minimal Watchlist and Memory behavior.
Account creation, phone sign-in, OTP delivery, cross-device sync, and payment
records are separate future product decisions; none may silently expand the
current `localStorage` data model.

### Licensed playback

A future `LicensedPlaybackProvider` owns entitlement, geography, permitted
audio/subtitle tracks, player session, and cue data. Its contract must require
verified provider-approved cue ranges for `intro`, `recap`, and `preview`.
Skip controls are shown only when such a cue is supplied by the provider and
the player session grants control. This interface is designed before playback
implementation, but remains dormant without a signed provider agreement.

## Revenue boundary

The free companion can eventually earn through disclosed, contracted official
referrals. A paid viewing plan must not be priced or advertised until content
rights, payment fees, taxes, provider terms, and regional obligations are
known. A proposed INR amount is not a license to offer episodes globally.

## Accessibility, privacy, and performance

- All new preference and provider controls must be keyboard reachable, labelled,
  visible on focus, and truthful when availability is unknown.
- Location and language preferences require clear consent and edit controls;
  no precise location is collected by default.
- Provider or semantic credentials are server-only. No third-party client
  calls, polling, or unbounded discovery requests are allowed.
- Home and Idle make zero availability/artwork requests. Arrival retains its
  metadata-only budget and Destination remains static after its ceremony.
- Any future player is evaluated independently for captions, keyboard control,
  reduced motion, privacy, DRM, and platform certification.

## TASK-083 acceptance for the first implementation plan

The plan must first isolate and fix the live descriptive-discovery regression.
It must then define, without implementing, the provider-availability and
licensed-playback contracts plus the external prerequisites required to build
them. It must identify exact source/test files, preserve frozen TASK-080 and
TASK-082 constraints, and include local and Production verification.

## External prerequisites

These are user/company-owned actions, not code tasks:

1. Legal entity, terms, privacy policy, and age/consent stance for account data.
2. A contracted availability/referral data source and its permitted regions,
   attribution, link, and caching rules.
3. A licensed playback/provider agreement before any episode is shown in-site.
4. A payment merchant account and tax/compliance plan before charging users.
5. Store/platform developer accounts and certification acceptance before mobile,
   console, TV, desktop, or VR distribution.

## Verification outline

- Unit tests prove a semantic-provider failure cannot weaken deterministic
  ranking and cannot produce a hardcoded Solo Leveling mapping.
- Existing tests, TypeScript, ESLint, and production build remain clean.
- Production QA repeats all TASK-082 probes; the hunter/system query includes
  Solo Leveling among relevant paths.
- Network evidence confirms no secret, client third-party call, polling loop,
  proxy, unverified Watch Now URL, or artwork API was introduced.
