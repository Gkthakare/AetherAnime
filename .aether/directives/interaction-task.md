# Directive — Interaction Task

## Purpose

Add or change what the traveller can do — navigation, arrival, paths, instruments, persistence — without breaking state ownership, URL discipline, or data authority.

## When to use

Navigator behaviour, region activation, anime arrival, destination paths, Watch Now, Watchlist, voice, discovery, intent. Anything that changes the loop.

## Required context

Always: [[engineering-rules]].
Usually: [[data-flow]], [[routing]], [[system]], and [[network]] if a request is involved.
Read the reducers and the existing tests for the state you are touching.

## Process

1. Name the owner. Which director owns this state, which reducer transitions it, which helper writes the URL. If your change needs a new owner, that is a design decision — say so.
2. Confirm data authority. Where does the fact come from, and is it allowed to come from there? Nothing about a real anime is invented.
3. Confirm the request budget in [[network]]. A new request on a user-visible interaction needs justification.
4. Write the failing test first — reducer/helper behaviour as a real unit test, plus a contract test if you are freezing a shape.
5. Implement. Local UI state stays local; scene state goes through the reducer; URL goes through `shared/lib/navigation`.
6. Verify keyboard path, `aria` wiring, and reduced motion for anything that animates.

## Quality gates

- tests, `npx tsc --noEmit`, `npm run lint`, `npm run build` — all real output
- keyboard reachable, focus visible, focus not stolen, order matches the spatial order
- no URL write outside the navigation helpers; no search-param read inside a scene
- no auto-arrival from search, recommendation, or intent
- abort signals on every request; no leaked state across destination remounts
- request count unchanged unless the task explicitly adds one

## Stop conditions

- the change requires a global store or a new state library
- it requires client-side third-party access or exposing a credential
- it requires fabricating or LLM-authoring facts about a real anime
- it would make search or intent navigate on its own
- it requires reopening a frozen decision

## Expected report

Objective · owner and reducer touched · data authority · network delta · files changed · tests (before/after) · TypeScript · ESLint · build · keyboard/accessibility result · frozen decisions respected · what was not done.
