export {
  WORLD_AMBIENT_DEFAULT,
  WORLD_AMBIENT_LEVELS,
  WORLD_AMBIENT_VARIANTS,
  resolveWorldAmbient,
  worldAmbientIntensity,
} from './world.ambient';
export type {
  ResolveWorldAmbientInput,
  WorldAmbient,
  WorldAmbientLevel,
  WorldAmbientVariant,
} from './world.ambient';
export {
  getAllWorlds,
  getWorld,
  getWorldBySlug,
  isWorldRegistered,
} from './world.helpers';
export {
  WORLD_LIFECYCLE_DEFAULT,
  WORLD_LIFECYCLES,
  canTransitionWorldLifecycle,
  isWorldLifecycleActive,
  reduceWorldLifecycle,
} from './world.lifecycle';
export type {
  WorldLifecycle,
  WorldLifecycleEvent,
} from './world.lifecycle';
export {
  WORLD_PRESENCE_DEFAULT,
  WORLD_PRESENCE_UNKNOWN,
  WORLD_PRESENCES,
  canTransitionWorldPresence,
  initialWorldPresence,
  reduceWorldPresence,
} from './world.presence';
export type {
  WorldPresence,
  WorldPresenceEvent,
} from './world.presence';
export {
  WORLD_FOCUS_NONE,
  WORLD_FOCUS_SCALE,
  canTransitionWorldFocus,
  reduceWorldFocus,
} from './world.focus';
export type { WorldFocusEvent, WorldFocusRegion } from './world.focus';
export {
  resolveWorldRegionActivation,
} from './world.activation';
export type { WorldRegionActivationIntent } from './world.activation';
export type {
  WorldCapability,
  WorldClimate,
  WorldDefinition,
  WorldId,
  WorldKind,
} from './world.types';
export {
  WORLD_CAPABILITIES,
  WORLD_CLIMATES,
  WORLD_KINDS,
} from './world.types';
export {
  AETHERANIME_WORLD_ID,
  AETHERANIME_WORLD_SLUG,
} from './world.constants';
export { WORLD_REGISTRY } from './world.registry';
export {
  AETHERANIME_REGION_CONTINUUM_ID,
  AETHERANIME_REGION_THRESHOLDS_ID,
  SYSTEM_REGION_AWAITING_KIND_ID,
  SYSTEM_REGION_STAGE_SEALED_ID,
  SYSTEM_REGION_WORLD_ID,
} from './world.region.constants';
export {
  WORLD_REGION_BY_ID,
  WORLD_REGION_REGISTRY,
  WORLD_REGIONS_BY_WORLD,
} from './world.region.registry';
export {
  getAllRegions,
  getRegion,
  getRegionBySlug,
  getRegionsByWorld,
  isRegionRegistered,
  isWorldRegionInteractive,
  resolveInitialRegionFocus,
  resolveWorldRegions,
} from './world.region.helpers';
export { resolvePortalDestination } from './world.region.portal';
export type { PortalDestinationResolution } from './world.region.portal';
export type {
  WorldRegionAccent,
  WorldRegionActivity,
  WorldRegionArtwork,
  WorldRegionAvailability,
  WorldRegionDefinition,
  WorldRegionId,
  WorldRegionPortalDestination,
} from './world.region.types';
export {
  WORLD_REGION_ACCENTS,
  WORLD_REGION_ACTIVITIES,
  WORLD_REGION_AVAILABILITIES,
} from './world.region.types';
export {
  assertUniqueRegionRegistry,
  assertValidWorldRegionDefinition,
  isWorldRegionAvailability,
  validateWorldRegionDefinition,
} from './world.region.validation';
