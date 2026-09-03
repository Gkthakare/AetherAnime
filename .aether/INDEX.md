# Aether Brain — INDEX

Primary context router for AetherAnime. **Read this file first. Then read only what the task needs.**

Do not read the whole `.aether/` directory. Do not read every decision record. Source code is always more authoritative than any note here; if they disagree, the code wins and the note gets corrected.

---

## What AetherAnime is

An **anime operating system**, not an anime catalog. The product is the feeling of entering a living world; anime is the content inside it. Home is a threshold, `/world/aetheranime` is a place, and an anime is a destination arrived at inside that place.

Stack: Next.js 16 App Router, React 19, TypeScript 5, Tailwind v4, framer-motion 12. Single app at `apps/web`. Tests are `node:test` files executed through `tsx`.

Details: [[project]] · [[vision]]

---

## Where knowledge lives

| Directory | Holds | Read when |
|---|---|---|
| `context/` | durable project rules — identity, visual language, engineering rules, performance contract | almost every task reads exactly one or two of these |
| `architecture/` | what the real systems own and must not duplicate | before touching rendering, routing, data, or network |
| `directives/` | how to run a class of task, start to finish | at task start, pick one |
| `skills/` | reusable technique for a craft area | when the task needs that craft |
| `decisions/` | frozen decision records per completed task | when your surface overlaps a prior decision |
| `memory/` | current state, debt, open questions | at task start to know what is already true |
| `templates/` | generic, project-neutral formats | when writing a new task, decision, memory, or skill file |

Authoritative outside the brain:

- **Application code** — `apps/web/`. Always authoritative over documentation.
- **Tests** — `apps/web/**/*.test.ts`. Encode the frozen contracts as executable assertions.
- `docs/` — earlier long-form product and design documents. Useful background, **not** maintained as agent context. `docs/engineering/CHANGELOG.md` stops at TASK-041 and does not describe TASK-042+.

---

## Loading strategy

```
TASK REQUEST
  → classify task (visual / interaction / performance / accessibility / regression)
  → read the one matching directive           .aether/directives/<type>-task.md
  → read the context it names                 .aether/context/*
  → read decision records for the surfaces you touch
  → read a skill only if the craft is unfamiliar
  → inspect the actual source files
  → implement (tests first)
  → verify (tests, types, lint, build, measured performance)
  → update the brain only if durable knowledge changed
```

Budget: 3–6 brain files for a typical task. If you are reading more than eight, you have not classified the task.

Tasks arrive in the compact format defined by [[TASK.template]]; resolve its `READ` / `PROTECT` / `VERIFY` fields through this index.

### Task type → what to read

| Task type | Directive | Context | Usually also |
|---|---|---|---|
| Visual / composition | [[visual-task]] | [[visual-language]], [[performance-contract]] | [[rendering]], the decision for that surface |
| Interaction / navigation | [[interaction-task]] | [[engineering-rules]] | [[data-flow]], [[routing]] |
| Performance | [[performance-task]] | [[performance-contract]] | [[rendering]], [[TASK-046]] |
| Accessibility | [[accessibility-task]] | [[engineering-rules]] | [[TASK-050]], [[TASK-050.1]] |
| Regression / cleanup | [[regression-task]] | [[engineering-rules]] | [[TASK-049]], [[TASK-050]] |
| Data / anime domain | [[interaction-task]] | [[engineering-rules]] | [[data-flow]], [[network]] |

### Surface → decisions that constrain it

| Surface | Frozen decisions |
|---|---|
| Home / arrival | [[TASK-052]] |
| World idle | [[TASK-053]], [[TASK-054]], [[TASK-055]], [[TASK-057-B]], [[TASK-058-E]], [[TASK-059]], [[TASK-061]], [[TASK-067]], [[TASK-069]], [[TASK-095]] |
| Destination / arrival atmosphere | [[TASK-046]], [[TASK-055]], [[TASK-060]], [[TASK-068]], [[TASK-075]], [[TASK-076]], [[TASK-080]], [[TASK-092]], [[TASK-096]], [[TASK-097]], [[TASK-098]], [[TASK-099]], [[TASK-100]], [[TASK-101]] |
| Motion primitives | [[TASK-049]] |
| Focus / keyboard | [[TASK-050]], [[TASK-050.1]] |
| Any animated full-viewport layer | [[TASK-046]], [[performance-contract]] |

---

## Frozen decisions

All listed records are `Status: FROZEN`. Do not reopen them without an explicit instruction to do so.

[[TASK-046]] · [[TASK-049]] · [[TASK-050]] · [[TASK-050.1]] · [[TASK-052]] · [[TASK-053]] · [[TASK-054]] · [[TASK-055]] · [[TASK-057-A]] · [[TASK-057-B]] · [[TASK-058-E]] · [[TASK-059]] · [[TASK-060]] · [[TASK-061]] · [[TASK-062]] · [[TASK-063]] · [[TASK-064]]

Hub: [[decisions/INDEX|decisions index]]

---

## Current state

Completed through [[TASK-102]] (Capital Experience Audit II; no product code). Experiment 1 baseline remains active ([[TASK-090]]).

Read [[current-state]] before proposing work. Then [[visual-debt]], [[technical-debt]], [[open-questions]] as needed.

Hub: [[memory/INDEX|memory index]]

---

## Portability

The brain separates operating-system knowledge from project knowledge, so the former can be copied to another repository unchanged.

| Portable — copy as-is | Project-specific — rewrite per project |
|---|---|
| `templates/` — task, decision, memory, and skill formats | `context/` — this project's identity, visual language, rules, performance contract |
| `directives/` — how to run a class of task | `architecture/` — this project's real systems |
| the loading strategy and the operating principles in this file | `decisions/` — this project's frozen decisions |
| `CLAUDE.md` / `AGENTS.md` structure | `memory/` — this project's state, debt, and open questions |

`skills/` sits in between: the craft technique transfers, the project-specific illustrations in each file need editing.

To adopt the brain elsewhere: copy `templates/` and `directives/`, copy this INDEX as a skeleton, then write `context/`, `architecture/`, and `memory/` from that project's real code. Start `decisions/` empty.

## Non-negotiables

- Frozen decisions stay frozen.
- Performance claims require measurement in a production build. Never assert FPS you did not measure.
- Never fabricate test, type, lint, or build results.
- Reuse the existing environment / motion / climate stacks. Parallel visual systems are a defect, not a feature.
- New durable knowledge goes in the brain; transient detail does not.
