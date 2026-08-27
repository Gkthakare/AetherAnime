# Template — Decision Record

Generic. Portable to any project running an Aether brain.

File: `decisions/TASK-XXX.md`. One page maximum. A decision record is not a status report — strip the narrative, keep what constrains the future.

```markdown
# TASK-XXX — <short title>

Status: FROZEN            <!-- FROZEN | ACTIVE | SUPERSEDED by `TASK-YYY` -->
Area: <surface / system>

## Decision

What is now true. One or two sentences, stated as fact.

## Why

The problem or evidence that forced it. Include the measurement if there was one.

## Protected behaviour

The specific mechanism that must keep working — file, selector, constant, gate, value.
Name the contract test that guards it, if one exists.

## Implementation area

Files and directories a future agent should look at.

## Contracts

Performance and accessibility obligations this decision creates or depends on.
Omit a line rather than inventing one.

## Do not undo

Concrete things a future task could plausibly do that would silently break this.

## Links

<3–6 wikilinks to real relationships>
```

## Rules

- Write it only for **durable** outcomes. A task that changed nothing lasting gets no record.
- `FROZEN` means intentionally protected; reopening requires an explicit instruction.
- A rejected change is a valid decision and worth recording — it stops the question being re-litigated.
- Links must be real relationships (supersedes, depends on, constrains, was measured against). Never keyword links.
- Add the record to `decisions/INDEX.md` in the same change.
