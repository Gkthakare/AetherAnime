# Template — Memory File

Generic. Portable to any project running an Aether brain.

Memory answers three questions: **what is true now**, **what is known to be wrong**, **what is genuinely undecided**. Nothing else belongs here.

```markdown
# <Current State | Visual Debt | Technical Debt | Open Questions>

Last verified: TASK-XXX

## <Grouping>

- <entry> — <evidence or where it was observed> — <wikilink>
```

## Rules by file

**current-state.md** — completed work, the present state of each surface, and known-not-started work. Only claim what shipped. If something is unverified, say so.

**visual-debt.md** — confirmed visual shortcomings, each one observed. No speculation, no wish list. "Could be better" is not debt unless someone looked and said so.

**technical-debt.md** — verified technical problems. Complexity is not debt. An architecture you would design differently is not debt. Debt is something that is *wrong*, *fragile*, or *misleading* and has been confirmed.

**open-questions.md** — real unresolved product or design questions. Do not answer them here; answering is a decision and belongs in `decisions/`. Record what would need to be true for the question to close.

## Maintenance

- Update at the end of a task, through `directives/task-completion.md`.
- Remove entries that are resolved. Stale memory is worse than no memory.
- Every entry should be actionable or informative to the *next* agent. If it is neither, delete it.
