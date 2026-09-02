/**
 * Product analytics event contract — TASK-086.
 * Coarse structured properties only. Never raw Navigator text.
 */

export const CORE_PRODUCT_EVENTS = [
  'world_entered',
  'navigator_ask_submitted',
  'destination_arrived',
  'session_multi_destination',
  'return_visit',
] as const;

export const GROWTH_PRODUCT_EVENTS = [
  'navigator_results_shown',
  'destination_settled',
  'continue_used',
  'watchlist_saved',
  'home_viewed',
] as const;

export const PRODUCT_EVENT_NAMES = [
  ...CORE_PRODUCT_EVENTS,
  ...GROWTH_PRODUCT_EVENTS,
] as const;

export type ProductEventName = (typeof PRODUCT_EVENT_NAMES)[number];

export type WorldEntrySource = 'home' | 'direct' | 'return';

export type AskClass =
  | 'exact'
  | 'ambiguous'
  | 'descriptive'
  | 'similar'
  | 'filter'
  | 'unknown';

export type NavigatorResultRoute = 'catalog' | 'discovery' | 'semantic';

export type AnimeOrigin = 'catalog' | 'discovered';

export type ArrivalVia = 'navigator' | 'continue' | 'url' | 'kinship';

export type WatchlistAction = 'add' | 'remove';

/** Allowed property keys per event — enforced by validateProductEvent. */
export type ProductEventPayload =
  | {
      readonly name: 'world_entered';
      readonly source: WorldEntrySource;
      readonly session_id: string;
    }
  | {
      readonly name: 'navigator_ask_submitted';
      readonly ask_class: AskClass;
      readonly session_id: string;
    }
  | {
      readonly name: 'navigator_results_shown';
      readonly result_count: number;
      readonly route: NavigatorResultRoute;
      readonly session_id: string;
    }
  | {
      readonly name: 'destination_arrived';
      readonly anime_id: string;
      readonly slug: string;
      readonly origin: AnimeOrigin;
      readonly via: ArrivalVia;
      readonly session_id: string;
    }
  | {
      readonly name: 'destination_settled';
      readonly anime_id: string;
      readonly session_id: string;
    }
  | {
      readonly name: 'session_multi_destination';
      readonly distinct_count: number;
      readonly session_id: string;
    }
  | {
      readonly name: 'return_visit';
      readonly days_since_last: number;
      readonly had_destination: boolean;
    }
  | {
      readonly name: 'continue_used';
      readonly anime_id: string;
      readonly session_id: string;
    }
  | {
      readonly name: 'watchlist_saved';
      readonly anime_id: string;
      readonly action: WatchlistAction;
      readonly session_id: string;
    }
  | {
      readonly name: 'home_viewed';
      readonly entry_path: string;
      readonly session_id: string;
    };

export const FORBIDDEN_PROPERTY_KEYS = [
  'query',
  'prompt',
  'text',
  'transcript',
  'intent',
  'semantic_intent',
  'user_input',
  'message',
  'voice',
  'ip',
  'fingerprint',
  'user_agent',
  'mouse',
  'keystroke',
] as const;

export const ANALYTICS_VISITOR_COOKIE = 'aether_vid';
export const ANALYTICS_LAST_VISIT_COOKIE = 'aether_last';
export const ANALYTICS_SESSION_COOKIE = 'aether_sess';
export const ANALYTICS_RETURN_EMITTED_COOKIE = 'aether_ret';
export const ANALYTICS_HAD_DESTINATION_COOKIE = 'aether_had_dest';
