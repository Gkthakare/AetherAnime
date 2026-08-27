# Memory — Index

Graph hub for project state. Read [[current-state]] at the start of any task; read the others when they bear on it.

| File | Answers | Read when |
|---|---|---|
| [[current-state]] | what is true and what is not started | always, first |
| [[visual-debt]] | which visual shortcomings are confirmed | before proposing visual work |
| [[technical-debt]] | which technical problems are verified | before tooling or cleanup work |
| [[open-questions]] | what is genuinely undecided | before proposing a new capability |

## Cluster

```
        [[current-state]]
          /          \
[[visual-debt]]   [[technical-debt]]
          \
      [[open-questions]]
```

`current-state` is the entry point; debt files describe where it falls short; open questions describe where the product has not decided yet.

## Maintenance

Updated through [[task-completion]], using [[MEMORY.template]].

- Claim only what shipped and was verified.
- Debt needs an observation behind it, not an opinion.
- Delete resolved entries. Stale memory is worse than none.
- Do not answer an open question here — that is a decision record.
