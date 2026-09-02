export type {
  AskClass,
  ArrivalVia,
  AnimeOrigin,
  NavigatorResultRoute,
  ProductEventName,
  ProductEventPayload,
  WatchlistAction,
  WorldEntrySource,
} from './analytics.types';

export {
  ANALYTICS_HAD_DESTINATION_COOKIE,
  ANALYTICS_LAST_VISIT_COOKIE,
  ANALYTICS_RETURN_EMITTED_COOKIE,
  ANALYTICS_SESSION_COOKIE,
  ANALYTICS_VISITOR_COOKIE,
  CORE_PRODUCT_EVENTS,
  FORBIDDEN_PROPERTY_KEYS,
  GROWTH_PRODUCT_EVENTS,
  PRODUCT_EVENT_NAMES,
} from './analytics.types';

export {
  askClassFromNavigatorPlan,
  navigatorResultRouteFromPlan,
  type DiscoverLookupKind,
  type NavigatorPlanKind,
} from './analytics.ask-class';

export { emitProductEvent, serializeProductEvent } from './analytics.emit';
export { resetProductEventDedupe, shouldEmitProductEvent } from './analytics.dedupe';
export {
  consumeArrivalVia,
  getAnalyticsSessionId,
  getDistinctDestinationCount,
  hasVisitedDestination,
  markArrivalVia,
  noteDistinctDestination,
  resetAnalyticsSessionForTests,
} from './analytics.session';
export { resolveAnimeOrigin } from './analytics.origin';
export {
  recordDestinationArrival,
  recordNavigatorAskSubmitted,
  recordWorldEntered,
  resolveWorldEntrySource,
} from './analytics.record';
export {
  buildProductEventDedupeKey,
  isGrowthEvent,
  validateProductEvent,
} from './analytics.validate';
