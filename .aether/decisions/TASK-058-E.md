# Decision — TASK-058-E

Status: accepted
Date: 2026-08-26
Surface: World Idle geographic artwork integration

## Decision

Integrate the TASK-058-D Option B masters into production World Idle as additional static plates behind the existing identity landmark:

1. `aetheranime-world-far-landscape.webp` (2560×1440 RGB) behind the landscape hero
2. `aetheranime-world-far-portrait.webp` (1280×1920 RGB) behind the portrait identity
3. `aetheranime-depth-midground-continuation-landscape.webp` (1536×864 RGBA) between hero and sparse mid on landscape only

Hero/far fusion uses soft blend + edge mask — not a hard rectangular inset. Direction A crop experiments are obsolete and replaced by this geography stylesheet.

Sparse midground: **REDUCE** on Idle (opacity ~0.28) so it accents without muddying the continuation.

## Verified asset contract (inspected files)

| Asset | Dimensions | Format | Alpha | Bytes |
|---|---:|---|---|---:|
| far landscape | 2560×1440 | WebP RGB | no | 134260 |
| far portrait | 1280×1920 | WebP RGB | no | 87630 |
| mid continuation | 1536×864 | WebP RGBA | yes | 538898 |

Production filenames:

- `aetheranime-world-far-landscape.webp`
- `aetheranime-world-far-portrait.webp`
- `aetheranime-depth-midground-continuation-landscape.webp`

## Protect

TASK-046 compositor freeze, TASK-052 Home, TASK-053 Idle composition ownership, TASK-054 Current/Ahead, TASK-055 living presence, TASK-057-A/B Memory (not implemented), Navigator, WorldKind, Destination, WorldScene lifecycle, routing.

## Consequences

- WorldEnvironment stack gains two Idle-gated geographic plates; Home/Destination keep them hidden.
- Portrait does not receive landscape mid-continuation.
- No new animation, parallax on geography, network, or compositor architecture.
