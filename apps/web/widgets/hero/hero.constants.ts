/**
 * Arrival identity copy — world language, not marketing.
 *
 * Reuses the existing Regional space / Present / invitation grammar so Home
 * and World speak as one place. No product-landing headlines.
 */

import { REGION_IDENTITY_COPY } from '@/widgets/region-identity/region-identity.constants';
import { WORLD_IDENTITY_COPY } from '@/widgets/world-identity/world-identity.constants';
import { WORLD_NAVIGATOR_COPY } from '@/widgets/world-navigator/world-navigator.constants';

export const HERO_COPY = {
  regionalSpace: REGION_IDENTITY_COPY.noneEyebrow,
  present: WORLD_IDENTITY_COPY.validEyebrow,
  title: 'AetherAnime',
  invitation: WORLD_NAVIGATOR_COPY.orientation,
} as const;

/**
 * Quieter than WorldIdentity's name scale so the portal remains protagonist.
 */
export const HERO_TITLE_SCALE =
  'text-4xl font-medium leading-[1.02] tracking-[-0.02em] sm:text-5xl lg:text-6xl';
