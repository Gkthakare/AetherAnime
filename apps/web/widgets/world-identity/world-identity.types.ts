/**
 * WorldIdentity — types only.
 *
 * Presentation of registry metadata. Not Registry. Not Shell.
 */

import type { WorldDefinition } from '@/shared/world';
import type { WorldShellStatus } from '@/widgets/world-shell';

export type WorldIdentityProps = {
  /** Explicit slug — overrides Scene when provided. */
  slug?: string;
  /** Explicit world metadata — overrides Scene when provided. */
  world?: WorldDefinition;
  /** Explicit status — overrides Scene when provided. */
  status?: WorldShellStatus;
  /** Optional tagline override (else world.tagline). */
  tagline?: string;
  /** Layout composition only. */
  className?: string;
};
