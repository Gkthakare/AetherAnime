/**
 * WorldIdentity — copy and presentation scale for status-driven identity.
 *
 * No motion values. Presentation constants describe hierarchy only; the
 * component owns no typography system of its own.
 */

import type { WorldShellStatus } from '@/widgets/world-shell/world-shell.types';

export const WORLD_IDENTITY_COPY = {
  unknownEyebrow: 'Unknown threshold',
  unknownTitle: 'This world is not registered',
  unknownDescription:
    'The destination slug has no World Registry entry. Presence cannot begin.',
  comingSoonEyebrow: 'Coming soon',
  comingSoonDescription:
    'This world is registered but not yet open for presence.',
  validEyebrow: 'Present',
  invitation:
    'Speak or type a title, a likeness, a feeling, or a saved path.',
} as const;

export type WorldIdentityTaglineInput = {
  readonly status: WorldShellStatus;
  readonly registryTagline?: string;
  readonly taglineOverride?: string;
};

export type WorldIdentitySubtitleInput = {
  readonly status: WorldShellStatus;
  readonly description?: string;
};

/**
 * User-facing idle line. Registry tagline stays architectural and is not
 * the first-visit invitation.
 */
export function worldIdentityUserFacingTagline(
  input: WorldIdentityTaglineInput,
): string | undefined {
  if (input.taglineOverride !== undefined) return input.taglineOverride;
  if (input.status === 'valid') return WORLD_IDENTITY_COPY.invitation;
  return undefined;
}

/**
 * Valid worlds keep registry description internal. Unknown / coming-soon
 * still explain why presence cannot begin.
 */
export function worldIdentityUserFacingSubtitle(
  input: WorldIdentitySubtitleInput,
): string {
  if (input.status === 'unknown') return WORLD_IDENTITY_COPY.unknownDescription;
  if (input.status === 'comingSoon') {
    return WORLD_IDENTITY_COPY.comingSoonDescription;
  }
  return '';
}

/**
 * Title scale.
 *
 * The World name is the loudest element in the composition — the environment
 * is the dominant actor, but the identity must read as the name of a world
 * rather than a page heading. Unknown / coming-soon titles are sentences, not
 * names, so they take a smaller step.
 */
export const WORLD_IDENTITY_TITLE_SCALE = {
  name: 'text-2xl sm:text-3xl lg:text-4xl',
  sentence: 'text-3xl sm:text-4xl',
} as const;

/**
 * Registry taglines are tracked uppercase. The invitation must read as a
 * spoken sentence so the grammar of asks is visible.
 */
export const WORLD_IDENTITY_TAGLINE_SCALE = {
  registry:
    'max-w-sm text-[0.6875rem] uppercase tracking-[0.28em] text-ring/70',
  invitation: 'max-w-md text-sm leading-relaxed text-foreground/75',
} as const;
