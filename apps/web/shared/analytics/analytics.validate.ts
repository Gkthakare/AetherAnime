import {
  FORBIDDEN_PROPERTY_KEYS,
  GROWTH_PRODUCT_EVENTS,
  PRODUCT_EVENT_NAMES,
  type ProductEventName,
  type ProductEventPayload,
} from './analytics.types';

const MAX_STRING_LENGTH = 128;
const MAX_RESULT_COUNT = 500;
const MAX_DISTINCT_COUNT = 50;
const MAX_DAYS_SINCE_LAST = 3650;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isForbiddenKey(key: string): boolean {
  const lower = key.toLowerCase();
  return FORBIDDEN_PROPERTY_KEYS.some((forbidden) => lower === forbidden);
}

function hasForbiddenKeys(value: unknown): boolean {
  if (!isPlainObject(value)) {
    return false;
  }

  for (const key of Object.keys(value)) {
    if (isForbiddenKey(key)) {
      return true;
    }
    if (hasForbiddenKeys(value[key])) {
      return true;
    }
  }

  return false;
}

function isNonEmptyString(value: unknown, maxLength = MAX_STRING_LENGTH): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= maxLength;
}

function isBoundedInt(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;
}

function validateCommonSessionId(value: unknown): value is string {
  return isNonEmptyString(value, 64);
}

export function validateProductEvent(input: unknown):
  | { ok: true; event: ProductEventPayload }
  | { ok: false; reason: string } {
  if (!isPlainObject(input)) {
    return { ok: false, reason: 'payload must be an object' };
  }

  if (hasForbiddenKeys(input)) {
    return { ok: false, reason: 'forbidden property detected' };
  }

  const name = input.name;
  if (!isNonEmptyString(name) || !PRODUCT_EVENT_NAMES.includes(name as ProductEventName)) {
    return { ok: false, reason: 'invalid event name' };
  }

  switch (name as ProductEventName) {
    case 'world_entered': {
      const source = input.source;
      if (!['home', 'direct', 'return'].includes(String(source))) {
        return { ok: false, reason: 'invalid world_entered.source' };
      }
      if (!validateCommonSessionId(input.session_id)) {
        return { ok: false, reason: 'invalid world_entered.session_id' };
      }
      return {
        ok: true,
        event: {
          name: 'world_entered',
          source: source as 'home' | 'direct' | 'return',
          session_id: input.session_id,
        },
      };
    }
    case 'navigator_ask_submitted': {
      const askClass = input.ask_class;
      if (
        !['exact', 'ambiguous', 'descriptive', 'similar', 'filter', 'unknown'].includes(
          String(askClass),
        )
      ) {
        return { ok: false, reason: 'invalid navigator_ask_submitted.ask_class' };
      }
      if (!validateCommonSessionId(input.session_id)) {
        return { ok: false, reason: 'invalid navigator_ask_submitted.session_id' };
      }
      return {
        ok: true,
        event: {
          name: 'navigator_ask_submitted',
          ask_class: askClass as ProductEventPayload extends { name: 'navigator_ask_submitted' }
            ? ProductEventPayload['ask_class']
            : never,
          session_id: input.session_id,
        },
      };
    }
    case 'navigator_results_shown': {
      if (!isBoundedInt(input.result_count, 0, MAX_RESULT_COUNT)) {
        return { ok: false, reason: 'invalid navigator_results_shown.result_count' };
      }
      if (!['catalog', 'discovery', 'semantic'].includes(String(input.route))) {
        return { ok: false, reason: 'invalid navigator_results_shown.route' };
      }
      if (!validateCommonSessionId(input.session_id)) {
        return { ok: false, reason: 'invalid navigator_results_shown.session_id' };
      }
      return {
        ok: true,
        event: {
          name: 'navigator_results_shown',
          result_count: input.result_count,
          route: input.route as 'catalog' | 'discovery' | 'semantic',
          session_id: input.session_id,
        },
      };
    }
    case 'destination_arrived': {
      if (!isNonEmptyString(input.anime_id, 64)) {
        return { ok: false, reason: 'invalid destination_arrived.anime_id' };
      }
      if (!isNonEmptyString(input.slug, 128)) {
        return { ok: false, reason: 'invalid destination_arrived.slug' };
      }
      if (!['catalog', 'discovered'].includes(String(input.origin))) {
        return { ok: false, reason: 'invalid destination_arrived.origin' };
      }
      if (!['navigator', 'continue', 'url', 'kinship'].includes(String(input.via))) {
        return { ok: false, reason: 'invalid destination_arrived.via' };
      }
      if (!validateCommonSessionId(input.session_id)) {
        return { ok: false, reason: 'invalid destination_arrived.session_id' };
      }
      return {
        ok: true,
        event: {
          name: 'destination_arrived',
          anime_id: input.anime_id,
          slug: input.slug,
          origin: input.origin as 'catalog' | 'discovered',
          via: input.via as 'navigator' | 'continue' | 'url' | 'kinship',
          session_id: input.session_id,
        },
      };
    }
    case 'destination_settled': {
      if (!isNonEmptyString(input.anime_id, 64)) {
        return { ok: false, reason: 'invalid destination_settled.anime_id' };
      }
      if (!validateCommonSessionId(input.session_id)) {
        return { ok: false, reason: 'invalid destination_settled.session_id' };
      }
      return {
        ok: true,
        event: {
          name: 'destination_settled',
          anime_id: input.anime_id,
          session_id: input.session_id,
        },
      };
    }
    case 'session_multi_destination': {
      if (!isBoundedInt(input.distinct_count, 2, MAX_DISTINCT_COUNT)) {
        return { ok: false, reason: 'invalid session_multi_destination.distinct_count' };
      }
      if (!validateCommonSessionId(input.session_id)) {
        return { ok: false, reason: 'invalid session_multi_destination.session_id' };
      }
      return {
        ok: true,
        event: {
          name: 'session_multi_destination',
          distinct_count: input.distinct_count,
          session_id: input.session_id,
        },
      };
    }
    case 'return_visit': {
      if (!isBoundedInt(input.days_since_last, 0, MAX_DAYS_SINCE_LAST)) {
        return { ok: false, reason: 'invalid return_visit.days_since_last' };
      }
      if (typeof input.had_destination !== 'boolean') {
        return { ok: false, reason: 'invalid return_visit.had_destination' };
      }
      return {
        ok: true,
        event: {
          name: 'return_visit',
          days_since_last: input.days_since_last,
          had_destination: input.had_destination,
        },
      };
    }
    case 'continue_used': {
      if (!isNonEmptyString(input.anime_id, 64)) {
        return { ok: false, reason: 'invalid continue_used.anime_id' };
      }
      if (!validateCommonSessionId(input.session_id)) {
        return { ok: false, reason: 'invalid continue_used.session_id' };
      }
      return {
        ok: true,
        event: {
          name: 'continue_used',
          anime_id: input.anime_id,
          session_id: input.session_id,
        },
      };
    }
    case 'watchlist_saved': {
      if (!isNonEmptyString(input.anime_id, 64)) {
        return { ok: false, reason: 'invalid watchlist_saved.anime_id' };
      }
      if (!['add', 'remove'].includes(String(input.action))) {
        return { ok: false, reason: 'invalid watchlist_saved.action' };
      }
      if (!validateCommonSessionId(input.session_id)) {
        return { ok: false, reason: 'invalid watchlist_saved.session_id' };
      }
      return {
        ok: true,
        event: {
          name: 'watchlist_saved',
          anime_id: input.anime_id,
          action: input.action as 'add' | 'remove',
          session_id: input.session_id,
        },
      };
    }
    case 'home_viewed': {
      if (!isNonEmptyString(input.entry_path, 256)) {
        return { ok: false, reason: 'invalid home_viewed.entry_path' };
      }
      if (!validateCommonSessionId(input.session_id)) {
        return { ok: false, reason: 'invalid home_viewed.session_id' };
      }
      return {
        ok: true,
        event: {
          name: 'home_viewed',
          entry_path: input.entry_path,
          session_id: input.session_id,
        },
      };
    }
    default:
      return { ok: false, reason: 'unsupported event name' };
  }
}

export function isGrowthEvent(name: ProductEventName): boolean {
  return (GROWTH_PRODUCT_EVENTS as readonly string[]).includes(name);
}

export function buildProductEventDedupeKey(event: ProductEventPayload): string {
  switch (event.name) {
    case 'world_entered':
      return `${event.name}:${event.session_id}`;
    case 'navigator_ask_submitted':
      return `${event.name}:${event.session_id}:${event.ask_class}`;
    case 'navigator_results_shown':
      return `${event.name}:${event.session_id}:${event.route}:${event.result_count}`;
    case 'destination_arrived':
      return `${event.name}:${event.session_id}:${event.anime_id}`;
    case 'destination_settled':
      return `${event.name}:${event.session_id}:${event.anime_id}`;
    case 'session_multi_destination':
      return `${event.name}:${event.session_id}:${event.distinct_count}`;
    case 'return_visit':
      return `${event.name}:${event.days_since_last}:${event.had_destination}`;
    case 'continue_used':
      return `${event.name}:${event.session_id}:${event.anime_id}`;
    case 'watchlist_saved':
      return `${event.name}:${event.session_id}:${event.anime_id}:${event.action}`;
    case 'home_viewed':
      return `${event.name}:${event.session_id}:${event.entry_path}`;
    default: {
      const _exhaustive: never = event;
      return String(_exhaustive);
    }
  }
}
