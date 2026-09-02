# Decisions — Index

Graph hub for architectural and design decisions. Every record here is `Status: FROZEN`.

Read a record when your task touches its area. Do not read all of them.

| Record | Area | In one line |
|---|---|---|
| [[TASK-046]] | rendering / performance | At ≥120rem idle, living light is the only continuous breath |
| [[TASK-049]] | motion primitives | Identity enter motion consolidated into `shared/lib/motion/identity.ts` |
| [[TASK-050]] | accessibility / styling | No shared focus-ring abstraction; local composition over the `--ring` token |
| [[TASK-050.1]] | accessibility | Production Chromium keyboard focus verified across the surface matrix |
| [[TASK-052]] | Home | Home is a world threshold and reuses `WorldEnvironment`, without `WorldClimate` |
| [[TASK-053]] | world idle | Idle is a place: location marker, instrument, path — not a centered overlay |
| [[TASK-054]] | world idle | Crossings are spatial at different distances, not equal UI plates |
| [[TASK-055]] | world idle | Idle presence built from the existing environment stack, inside the 046 budget |
| [[TASK-057-A]] | world / arrival | World Memory records places, observed at `arrivedAnime` rather than `onAnimeArrive` |
| [[TASK-057-B]] | world idle | Memory Horizon = upper-trailing residual afterglow (implemented) |
| [[TASK-058-E]] | world idle | Idle geography uses far + mid-continuation plates behind the identity landmark |
| [[TASK-059]] | world idle | Continuum/Thresholds physicality = CSS grounded footing + distant silhouette (implemented) |
| [[TASK-060]] | Destination | Arrived place = hybrid WorldEnvironment presence (implemented) |
| [[TASK-061]] | Idle ↔ Destination | Continue = explicit Navigator resume of last arrived destination (implemented) |
| [[TASK-062]] | AI / Navigator | AI = Navigator-native structured intent only; no extra AI surface for V1 |
| [[TASK-063]] | system audit | TASK-046→062 architecture audit: READY; optional hygiene only |
| [[TASK-064]] | World Idle mobile | Portrait Idle near→mid→far via existing plate crop bands |
| [[TASK-065]] | visual language audit | Home→Idle→Destination coherent as one world; no production change |
| [[TASK-066]] | traveller state audit | Memory+Continue suffice; no extra state-reactive world system |
| [[TASK-067]] | World Navigator audit | Navigator sufficient for V1 intent→destination; no redesign |
| [[TASK-068]] | Destination performance | Arrival dip is one-shot ceremony; settled Destination ≈61 FPS |
| [[TASK-069]] | V1 freeze audit | World coherent; V1 freezes; remaining debt deferred |
| [[TASK-070]] | release readiness | V1 release candidate ready; no production changes |
| [[TASK-071]] | release / deployment | V1 ready to deploy; target not yet defined in-repo |
| [[TASK-072]] | deployment / host | Vercel selected; first deploy paused on auth |
| [[TASK-073]] | Destination design | Anime-specific poster field (D); all-anime data gate |
| [[TASK-074]] | anime artwork contract | Validated poster may be local or MAL CDN URL (implemented) |
| [[TASK-075]] | Destination Option D | Anime poster environmental field; WE subordinate |
| [[TASK-076]] | V1 visual / product acceptance | Accepted with deferred polish; V1 freeze holds |
| [[TASK-077]] | V1 production deploy | Paused — Vercel CLI logged out; user must login |
| [[TASK-078]] | Vercel auth & project link | Auth still required; link not started; no deploy |
| [[TASK-079]] | Vercel project + env readiness | Linked `aetheranime` / `apps/web`; Production env empty; deploy blocked |
| [[TASK-080]] | Navigator + Destination art/arrival | Plot semantic path; contain field; identity-keyed ceremony |
| [[TASK-082]] | Vercel production + live QA | Deployed Ready; hunter Solo ranking blocked live |
| [[TASK-083]] | Production semantic intent | HTTP boundary fix; hunter Solo #1 verified live |
| [[TASK-085]] | Capital Phase measurement audit | Zero analytics today; hybrid architecture proposed |
| [[TASK-086]] | Capital Phase instrumentation | Hybrid Plausible + `/api/events`; CORE funnel; privacy boundary |
| [[TASK-087]] | Capital Phase PMF + monetization strategy | Discovery beachhead; affiliate-first; no PMF claim |
| [[TASK-088]] | Production analytics enablement | aetheranime.com; server-side Plausible; CORE events live |
| [[TASK-089]] | Plausible visitor attribution fix | Forward UA + X-Forwarded-For; product page URLs |
| [[TASK-090]] | Capital Phase Experiment 1 baseline | 7-day discovery funnel; started 2026-09-03T05:00+05:30 |

## Clusters

**Visual language lineage** — each record inherits the previous surface and tightens it.

```
        [[visual-language]]
        /       |        \
[[TASK-052]] [[TASK-053]] [[TASK-054]]
        \       |        /
           [[TASK-055]]
                |
     [[performance-contract]]
                |
          [[rendering]]
```

**Performance lineage** — [[TASK-046]] sets the budget; [[TASK-055]] is the first presence work that had to fit inside it.

**Audit lineage** — [[TASK-049]] consolidated a real duplicated primitive; [[TASK-050]] applied the same method and correctly rejected an abstraction; [[TASK-050.1]] verified the un-abstracted system in a real browser.

## Adding a record

Use [[DECISION.template]]. Write one only for durable outcomes; a rejected change is a valid record. Give it 3–6 real relationships, add a row to the table above, and update [[current-state]].
