# Directive — Task Completion

## Purpose

Close a task honestly and leave the brain better than you found it.

## When to use

Every task, at the end, before writing the final report. This directive is always in force.

## Required context

The directive you ran, and [[engineering-rules]].

## Process

1. **Run the gates, in this order, and read the real output.**
   - tests — `npx tsx --test <files>` (see [[project]] for the full-suite invocation)
   - types — `npx tsc --noEmit`
   - lint — `npm run lint`
   - build — `npm run build`
   - measured performance and live QA if the task touched motion, layout, or rendering
2. **Diff review.** `git status --porcelain` and `git diff`. Confirm the change set matches the task scope and nothing was touched by accident.
3. **Decide whether the brain changed.** Update it only for durable knowledge:

   | Discovery | Goes to |
   |---|---|
   | a design rule that will apply again | `context/visual-language.md` |
   | a measured performance boundary or a protected mechanism | `context/performance-contract.md` |
   | an engineering convention or a rejected abstraction | `context/engineering-rules.md` |
   | how a real system actually works, or a doc that contradicted the code | `architecture/*` |
   | a reusable technique for a craft area | `skills/*`, new files via [[SKILL.template]] |
   | a repeated failure mode in how tasks are run | `directives/*` |
   | a protected outcome of this task | new `decisions/TASK-XXX.md` + link it in `decisions/INDEX.md` |
   | what is now true / still broken / still unknown | `memory/*` |

   Do **not** write transient detail, one-off mistakes, or narrative into the brain. A record that will not be read again should not exist.
4. If you added a decision record, give it 3–6 meaningful wikilinks and add it to [[decisions/INDEX|decisions index]]. Update [[current-state]].

## Quality gates

- every gate actually run; nothing reported that was not observed
- no fabricated FPS, test count, or build result
- brain updates are durable knowledge only

## Stop conditions

- a gate fails and you cannot fix it inside the task scope — report the failure, do not hide or work around it
- you are about to claim something you did not verify — stop and verify, or say it is unverified

## Expected report

Objective · what changed · gate results with real output · what was protected · brain updates made · what was explicitly not started.
