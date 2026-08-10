# Portal Motion — Living Threshold

> Canonical motion specification for the AetherAnime Portal Engine.
>
> **Status:** Approved Creative Direction (pending stakeholder review of this document)  
> **Classification:** Experience Design · Motion Direction · Portal Engine  
> **Date locked:** 2026-08-05  
> **Related:** `docs/design/PORTAL_IDENTITY.md` · `docs/design/PORTAL_ENGINE.md` · `docs/design/PORTAL_INVITATION.md` · `docs/design/EXPERIENCE_BUDGET.md`

This document defines **how the Impossible Threshold moves and why**.

It does not prescribe implementation code, frameworks, durations-as-code, or file structure.

If implementation and this document disagree, resolve the disagreement before shipping.

---

# 1. Motion Philosophy (60 / 30 / 10)

The idle life of the Portal is a permanent hybrid:

| Share | Philosophy | Role |
| --- | --- | --- |
| **60%** | **Gravitational Drift** | Soul of the portal. The world feels subtly attracted toward the singularity. |
| **30%** | **Living Stone** | Body of the threshold. Ancient tectonic stability; almost imperceptible plate movement. |
| **10%** | **Dimensional Luminance** | Seam and field luminance only. Never whole-portal breathing or scaling. |

### Creative law

**Reality moves. The Portal does not.**

The portal itself should feel eternal.

The surrounding reality — plates of “here,” hairline stress, seam light, atmospheric field — is what subtly bends, gathers, yields, and responds.

Avoid making the portal look like an animated UI element.

The user should feel they discovered something that already existed — older than the application — not that a widget woke up to entertain them.

### Emotional intent

| Intent | Expression |
| --- | --- |
| Presence | Near-stillness with rare, quiet wrongness |
| Invitation | Want gathers toward the singularity without a pulse that reads as “click me” |
| Dignity | Motion never begs; it waits |
| Continuity | Same DNA from idle whisper to future Crossing |

---

# 2. Motion Hierarchy

Motion **increases** as we approach the singularity.

Nothing ever competes with the singularity.

```
Level 0 — Sacred Chamber
Never moves.

Level 1 — Fracture Plates
Almost imperceptible micro-shifts (Living Stone).

Level 2 — Hairline
Tiny asynchronous drift (Gravitational Drift).

Level 3 — Primary Seam
Luminance gathers inward (Dimensional Luminance + Drift).

Level 4 — Singularity
Density and invitation only (Gravitational Drift).
No positional bounce. No scale pulse as hero motion.
```

### Layer rules

| Layer | May change | Must not |
| --- | --- | --- |
| Chamber | — | Translate, scale, rotate, opacity loops |
| Fracture plates | Micro-translate / micro-shear ≤ conscious threshold | Orbit, sync mirror, large travel |
| Hairline | Async micro-drift toward singularity | Spin, flash |
| Primary seam | Opacity / luminance gather along the fissure | Continuous rotation, whole-portal scale |
| Singularity | Opacity / density (invitation) | Loader pulse, positional dance |
| Atmospheric field | Soft opacity crawl (luminance share) | Bloom stacks, aggressive breathe |
| Particle field host | Empty until Particle Engine | — |

### Asynchronous rhythm

Synchronized looping is forbidden.

Plates, hairline, and luminance must not share one BPM. Offsets create geology and gravity; sync creates UI kit animation.

---

# 3. Attention Budget

Every moving layer spends attention.

Prefer, in order:

1. **Stillness**
2. **Micro transforms**
3. **Luminance**
4. **Opacity**

Avoid adding movement simply because animation is available.

### Idle cast limit

At most **two** continuous ambient transform/opacity loops may run on the Living Threshold under the Experience Budget exception (see §6).

Additional layers may be static or event-driven (Aware / Inviting / ceremony) without counting as continuous ambient loops.

If a third continuous loop is proposed, it must replace one of the two — not stack.

### Hierarchy of attention spend

| Spend | Allowed when |
| --- | --- |
| Stillness | Default |
| Micro plate shift | Idle presence (Stone 30%) |
| Seam luminance | Idle + Inviting gather |
| Singularity density | Idle whisper + ceremony invitation |
| Larger travel / unlock | Accepting / Crossing only (future tasks) |

---

# 4. Forbidden Motions

Permanently forbidden on the Portal Engine:

- Continuous rotation
- Spinner behavior
- Whole-portal scale pulses
- Synchronized looping across layers
- Orbit animations
- “Alive button” behavior (hover-as-marketing bounce, elastic CTA squash)
- Magical Seal ring orbits as identity language
- Outward particle fireworks as default idle

**Rejection test:** If motion can be mistaken for loading, a CTA animation, or a dashboard widget, reject it.

---

# 5. Reduced-Motion Philosophy

Reduced motion preserves the **emotional lifecycle** (Idle → Aware → Inviting → Accepting → Crossing → Settling → Idle). It simplifies spectacle; it does not delete the journey.

| Mode | Behavior |
| --- | --- |
| Full motion | Hybrid 60/30/10 idle within amplitude limits |
| Reduced motion | No continuous translate loops; optional static mid-pose; ceremony may use opacity-led seam/singularity changes only |
| No motion / forced still | Geometry alone must still read as Impossible Threshold (Identity law: stillness reads as gateway) |

Reduced motion must never introduce a different portal personality (e.g. falling back to circular seal language).

---

# 6. Experience Budget Exception

`EXPERIENCE_BUDGET.md` reserves continuous ambient loops primarily for Atmosphere.

**Living Threshold exception (Portal Engine only):**

> The Portal Engine may own a maximum of two continuous ambient transform/opacity loops provided they remain below conscious perception and never resemble loading, breathing, rotation, or button animation.

This exception:

- Applies **only** to the Living Threshold / Impossible Threshold idle presence.
- Does **not** authorize infinite loops on arbitrary interactive chrome.
- Does **not** authorize whole-portal scale breathing.
- Remains bound by transform + opacity only, no layout animation, and the Forbidden Motions list above.

Ceremony motion (Accepting → Crossing → Settling) is not an “ambient loop”; it is event-driven and separately governed by Invitation + this document’s future Crossing compatibility.

---

# 7. Future Compatibility

## Gravity Engine

Gravitational Drift (60%) is the native idle dialect of future gravity.

When Gravity Engine lands, it **amplifies** inward want along existing hierarchy — it does not invent outward force or orbital spectacle as default.

Idle micro-drift toward the singularity becomes the seed of stronger field response during Aware / Inviting / Crossing.

## Particle Engine

Particles mount in the geometry’s particle field host without rewriting hierarchy.

Rules:

- Attracted **inward** toward seam / singularity.
- Inherit async timing (no single BPM swarm).
- Respect Attention Budget — particles spend attention; density stays Soft Aether.
- Reduced motion may omit particles while preserving phases via luminance.

## World Crossing

Crossing remains Portal-led ceremony (Invitation canon).

Idle Living Threshold must hand off cleanly:

| Beat | Motion intent |
| --- | --- |
| Idle | Eternal presence (this document) |
| Aware / Inviting | Seam luminance gather; gravity densifies |
| Accepting | Lock; portal leads |
| Crossing | Reality yields; singularity opens into passage (inward, not explosion) |
| Settling | Shared exhale; return to eternal idle or hand off consequence |

Ceremony and consequence stay separable. World variants tint interior climate; they do not fork a second idle motion culture.

---

# 8. Immutable Motion Principles

1. **Reality moves. The Portal does not.**
2. **60 Drift / 30 Stone / 10 Luminance** — permanent hybrid shares.
3. **Motion increases toward the singularity.**
4. **The chamber never moves.**
5. **Stillness is a design material.**
6. **No rotation. No orbits. No spinners.**
7. **No whole-portal scale pulse.**
8. **No synchronized looping.**
9. **If it looks like loading or a CTA, kill it.**
10. **Async is how geology and gravity feel real.**
11. **Luminance before travel; travel only when earned.**
12. **At most two continuous ambient loops — whisper amplitude only.**
13. **Reduced motion keeps phases; geometry keeps identity.**
14. **Gravity and particles amplify inward want — never outward fireworks as default.**
15. **One motion soul from icon stillness to Arrival presence to Crossing.**

---

# Relationship to Other Canon

| Document | Relationship |
| --- | --- |
| `PORTAL_IDENTITY.md` | Visual DNA (Impossible Threshold). This document is how that DNA lives in time. |
| `PORTAL_INVITATION.md` | Emotional lifecycle and `Enter {destination}`. Motion maps to phases; verb stays sacred. |
| `PORTAL_ENGINE.md` | Engine architecture. Motion language here replaces Magical Seal orbit culture. |
| `EXPERIENCE_BUDGET.md` | Hard ceilings + Living Threshold ambient-loop exception. |

---

# Document Control

| Field | Value |
| --- | --- |
| Document | `docs/design/PORTAL_MOTION.md` |
| Role | Canonical Portal Engine motion specification |
| Approved hybrid | 60% Gravitational Drift · 30% Living Stone · 10% Dimensional Luminance |
| Implementation | Must not begin until this document is accepted as governing for Portal idle/ceremony motion language |

When this document evolves, record why. Do not silently restore spinner, seal-orbit, or whole-portal breathe language.

---

*End of Portal Motion — Living Threshold.*
