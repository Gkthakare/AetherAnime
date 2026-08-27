/**
 * WorldShell — destination architecture after Portal ceremony.
 *
 *   import { WorldShell, resolveWorldShellStatus } from '@/widgets/world-shell';
 */

export { WorldShell } from './world-shell';
export type {
  WorldShellProps,
  WorldShellSlots,
  WorldShellStatus,
} from './world-shell.types';

import type { WorldDefinition } from '@/shared/world';

import type { WorldShellStatus } from './world-shell.types';

/** Map registry metadata to shell status. */
export function resolveWorldShellStatus(
  world: WorldDefinition | undefined,
): WorldShellStatus {
  if (!world) return 'unknown';
  if (world.comingSoon) return 'comingSoon';
  return 'valid';
}
