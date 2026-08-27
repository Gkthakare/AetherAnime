# Skill — Next.js / React

Patterns this codebase uses. Follow them; do not import habits from other stacks.

## Server / client split

Pages are async server components. They `await params` and `searchParams`, resolve and **validate** everything, then hand plain props to a client director. Client components never read search params and never parse the URL.

Provider access and credentials stay in `app/api/*` route handlers. A route handler returns data, never navigation, and degrades to an empty result instead of throwing.

## Director / performer

One component owns the state for a stage and publishes it on a context. Performers subscribe. This keeps state ownership findable and prevents two components from disagreeing about the same phase.

State transitions go through pure reducers in `shared/`, which makes them unit-testable without React.

## Props over prop-drilled state, refs for identity

Navigation arrival enters as a **prop**. To apply it without remounting and without fighting transient in-scene state, keep a `lastAppliedRef` and only act when the validated identity actually changes. This is what makes Back/Forward work while local focus changes stay local.

Mirror director state onto `data-*` attributes. CSS gates on them, tests assert them, and no extra React state is needed to style a phase.

## Async discipline

Every request takes an `AbortSignal`. Abort on re-entry and in the unmount cleanup. Check `signal.aborted` before setting state in both `then` and `catch`. Swallow `AbortError`, rethrow everything else.

## Remount to reset

When a subtree holds local state that must not survive a context change (expanded path, fetched candidates), give it a `key` derived from identity (`key={anime.slug}`). This is cheaper and safer than reset effects.

## External stores

`localStorage`-backed state uses `useSyncExternalStore` with a subscribe function that listens to both the native `storage` event (cross-tab) and a custom event (same-tab). Guard every access with `typeof window === 'undefined'`.

## File layout

A widget is a folder: `x.tsx`, `x.constants.ts`, `x.motion.ts`, `x.types.ts`, `x.css`, `x.test.ts`, `index.ts`. Constants and motion values live outside the component so tests can assert them without rendering.

## Related

[[system]] · [[data-flow]] · [[engineering-rules]] · [[routing]]
