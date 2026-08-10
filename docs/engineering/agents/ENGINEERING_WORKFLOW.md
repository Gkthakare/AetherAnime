# Engineering Workflow

Permanent engineering workflow for AetherAnime application work.

Agents live in `docs/engineering/agents/`. Invoke the matching agent doc at each stage. Do not skip stages for feature work unless the task is explicitly docs-only, chore-only, or a hot-fix with a written waiver.

```
Architecture Review
        ↓
  Implementation
        ↓
       QA
        ↓
    Visual QA
        ↓
  Documentation
        ↓
   Git Commit
```

## 1. Architecture Review

**Agent:** `ARCHITECT_AGENT.md`

- Lock ownership, allowed files, and non-goals.
- Point to canon sections; do not redesign locked documents.
- Output a handoff contract Implementation can follow without re-litigating structure.

## 2. Implementation

**Agent:** `IMPLEMENTATION_AGENT.md`

- Change only allowed files.
- Reuse foundations and existing exports.
- Produce a task-scoped engineering delta.
- Run required verification (`tsc`, eslint, build, or as specified).

## 3. QA

**Agent:** `QA_AGENT.md`

- Lifecycle, ownership, reduced motion, and regression checks.
- Blocking defects return to Implementation; then re-enter QA.

## 4. Visual QA

**Agent:** `VISUAL_QA_AGENT.md`

- Soft Aether / Identity / Motion forbidden-list review on touched surfaces.
- Optional for pure logic/infra tasks with no visual surface — note the skip in Documentation.

## 5. Documentation

**Agent:** `DOCUMENTATION_AGENT.md`

- Changelog append and any required engineering docs.
- Record verification and known limitations once — not per prior milestone.

## 6. Git Commit

- Commit only when the user explicitly requests it.
- Message focuses on why; include only intentional paths (no secrets, no `.next`).
- Do not push unless asked.

## Supporting agents (on demand)

| Agent | When |
| --- | --- |
| `REFACTOR_AGENT.md` | Behavior-neutral structure work authorized by Architect |
| `PERFORMANCE_AGENT.md` | Motion/budget risk or explicit performance task |

Insert Performance review after Implementation (or after QA) when ambient loops, particles, or ceremony surfaces change. Insert Refactor only as its own task or a clearly scoped slice — never as silent drive-by.

## Token-saving strategy (workflow-level)

1. **One owner per stage** — do not re-run Architecture during Implementation unless a blocker appears.
2. **Diff-scoped reading** — later stages read the delta + contract, not the whole monorepo.
3. **Canon by pointer** — section titles, not full document pastes.
4. **No milestone recaps** — reports describe only the current task.
5. **Skip with intent** — Visual QA may be skipped for non-visual tasks; record the skip.
6. **Append-only history** — changelog grows; it is not rewritten.

## Future usage

- Paste or `@`-reference the active agent file at the start of each stage.
- Task briefs should name the stage and allowed surfaces.
- New agents may be added under `docs/engineering/agents/` only with a workflow update here.
