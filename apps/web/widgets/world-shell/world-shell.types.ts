import type { ReactNode } from 'react';

/** Registry-driven shell resolution outcomes. */
export type WorldShellStatus = 'valid' | 'unknown' | 'comingSoon';

/** Named composition regions — Scene fills defaults. */
export type WorldShellSlots = {
  /** Destination signal override; defaults to WorldIdentity. */
  identity?: ReactNode;
  /** Soft presence / climate host. */
  presence?: ReactNode;
  /** Kind-specific primary activity. */
  primary?: ReactNode;
  /** Secondary / supporting region. */
  secondary?: ReactNode;
};

/**
 * WorldShell — composition host only.
 * Identity metadata comes from Scene context (no Registry / runtime props).
 */
export interface WorldShellProps extends WorldShellSlots {
  /** Layout composition only. */
  className?: string;
}
