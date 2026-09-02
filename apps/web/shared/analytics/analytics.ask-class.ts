import type { AskClass } from './analytics.types';

/** Route classification from Navigator plan — never from raw query text. */
export type NavigatorPlanKind =
  | 'arrive'
  | 'ambiguous'
  | 'semantic'
  | 'discover'
  | 'filter'
  | 'watchlist'
  | 'unknown';

export type DiscoverLookupKind = 'search' | 'similar';

export function askClassFromNavigatorPlan(input: {
  kind: NavigatorPlanKind;
  discoverLookup?: DiscoverLookupKind;
}): AskClass {
  switch (input.kind) {
    case 'arrive':
      return 'exact';
    case 'ambiguous':
      return 'ambiguous';
    case 'semantic':
      return 'descriptive';
    case 'discover':
      return input.discoverLookup === 'similar' ? 'similar' : 'unknown';
    case 'filter':
      return 'filter';
    case 'watchlist':
    case 'unknown':
    default:
      return 'unknown';
  }
}

export function navigatorResultRouteFromPlan(input: {
  kind: NavigatorPlanKind;
}): 'catalog' | 'discovery' | 'semantic' {
  switch (input.kind) {
    case 'arrive':
    case 'ambiguous':
    case 'filter':
    case 'watchlist':
      return 'catalog';
    case 'semantic':
      return 'semantic';
    case 'discover':
    case 'unknown':
    default:
      return 'discovery';
  }
}
