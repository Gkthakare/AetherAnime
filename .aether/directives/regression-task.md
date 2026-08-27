# Directive — Regression / Cleanup Task

## Purpose

Remove genuine duplication or repair a regression without inventing abstractions or changing behaviour.

## When to use

Suspected duplication, a behaviour that used to work, dead code, or an audit follow-up.

## Required context

Always: [[engineering-rules]].
Usually: [[TASK-049]] (a real consolidation), [[TASK-050]] (a rejected one), plus the decision records for whatever you are about to touch.

## Process

1. **Audit before deciding.** Enumerate every occurrence in a table: symbol, location, identical or not, intended role.
2. Answer honestly: are these the *same primitive*, or the same characters serving different roles? Only the first is duplication. Repeated utility strings applied to different interaction semantics are not.
3. If consolidating: extract to `shared/`, keep timing/values byte-identical, and prove equivalence with tests before and after.
4. If repairing a regression: reproduce it first, find which change introduced it, and add the contract test that would have caught it.
5. Behaviour must be unchanged. If behaviour changes, this is not a cleanup task.

## Quality gates

- test count does not drop; existing assertions are not weakened
- no contract test relaxed to accommodate the change
- `npx tsc --noEmit`, `npm run lint`, `npm run build`
- diff limited to the audited scope — no drive-by edits

## Stop conditions

- the audit concludes no abstraction is justified — **that is a valid, complete outcome**; record it and stop
- the cleanup would change behaviour or visual output
- the scope grows beyond what was audited

## Expected report

Duplication audit table · decision (consolidate / no abstraction justified) with reasoning · files changed · tests before/after · types / lint / build · behaviour confirmed unchanged.
