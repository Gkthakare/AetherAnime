# Engineering Rules

## Test-driven

Behaviour is specified as a failing test first, then implemented, then verified. The suite is `node:test` via `tsx`; there is no test script, so pass files explicitly (see [[project]]).

Two kinds of test coexist and both matter:

- **behaviour tests** — reducers, resolvers, parsers, helpers. Real unit tests.
- **contract tests** — read a source or CSS file and assert the frozen shape of it (`assert.match(source, /…/)`). These exist to make frozen decisions break loudly. When you touch a surface, read its contract tests first: they are the machine-readable form of the decision records.

Never weaken a contract test to make a change pass. If the contract genuinely should change, that is a new decision and needs to be recorded.

## Ownership and duplication

- Domain logic in `shared/`, composition in `widgets/`, data resolution in `app/`.
- One owner per concern. Before adding a token, helper, or layer, find the existing owner.
- Duplication is only worth consolidating when the occurrences are *genuinely the same primitive*. Repeated utility strings applied to different interaction roles are not duplication — see [[TASK-050]]. Consolidating them creates a false abstraction.
- Shared motion primitives live in `shared/lib/motion` (e.g. the identity enter motion from [[TASK-049]]). Do not re-derive them widget-locally.

## State

- Scene directors own state and expose it through context: `WorldScene` (world lifecycle, presence, focus, arrived anime, ambient), `RegionScene` (region runtime), `ArrivalScene` (arrival phase).
- Transitions go through reducers in `shared/world` — `reduceWorldLifecycle`, `reduceWorldPresence`, `reduceWorldFocus`. Do not set phase state ad hoc.
- Local UI state (expanded path, preview, kinship candidates) stays local `useState`. No store.
- Anime arrival is **parallel to** Focus. It never enters the Focus reducer or the region registry.

## URL and navigation

- The URL is written only by navigation commit helpers in `shared/lib/navigation`. Scene components read validated props; they never read search params and never write the URL.
- `?region=` and `?anime=` are mutually exclusive on write. On read, a valid anime arrival wins.
- Arrival identity is validated on the server page (`resolveInitialAnimeArrival`, `resolveInitialRegionFocus`) before it reaches the scene.

## Data authority

- `CanonicalAnime` is the single anime shape. Providers normalise into it; nothing downstream invents fields.
- Provider access is server-only, through `app/api/*` routes. Client code calls the app's own endpoints, never a third party directly.
- No LLM-generated facts about real anime. No fabricated lore, synopses, or relationships.
- `Watch Now` requires a verified https official destination; rejected hosts and unknown availability are handled explicitly in `shared/anime/anime.watch-path.ts`.

See [[data-flow]] and [[network]].

## Accessibility

- Keyboard focus uses the existing `focus-visible:ring-2 ring-ring ring-offset-2 ring-offset-background` recipe composed locally per role. There is deliberately **no shared `FOCUS_RING` helper** ([[TASK-050]]).
- Expandable regions use `aria-expanded` / `aria-controls` and labelled regions; async loading is `aria-live="polite"`.
- Decorative layers are `aria-hidden="true"` and `pointer-events-none`.
- Focus is never stolen on expand. Keyboard order follows the visual/spatial order.
- Every motion has a `prefers-reduced-motion` branch.

## Quality gates

Every task, in order, with real output:

1. tests
2. `npx tsc --noEmit`
3. `npm run lint`
4. `npm run build`
5. measured performance and live visual QA when the task touched either

Never report a gate you did not run. Never report a number you did not measure. See [[task-completion]].

## Related

[[project]] · [[performance-contract]] · [[nextjs-react]] · [[accessibility]] · [[TASK-049]] · [[TASK-050]]
