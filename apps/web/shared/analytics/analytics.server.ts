import type { ProductEventPayload } from './analytics.types';
import {
  ANALYTICS_HAD_DESTINATION_COOKIE,
  ANALYTICS_LAST_VISIT_COOKIE,
  ANALYTICS_RETURN_EMITTED_COOKIE,
  ANALYTICS_SESSION_COOKIE,
  ANALYTICS_VISITOR_COOKIE,
} from './analytics.types';

export const ANALYTICS_SESSION_GAP_MS = 30 * 60 * 1000;
export const ANALYTICS_VISITOR_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
export const ANALYTICS_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type AnalyticsCookieBag = Readonly<{
  visitorId?: string;
  lastVisitIso?: string;
  sessionStartedAt?: string;
  returnEmittedForSession?: string;
  hadDestination?: boolean;
}>;

export function isValidVisitorId(value: string | undefined): value is string {
  return typeof value === 'string' && UUID_PATTERN.test(value);
}

export function createVisitorId(): string {
  return crypto.randomUUID();
}

export function parseAnalyticsCookies(
  get: (name: string) => string | undefined,
): AnalyticsCookieBag {
  return {
    visitorId: get(ANALYTICS_VISITOR_COOKIE),
    lastVisitIso: get(ANALYTICS_LAST_VISIT_COOKIE),
    sessionStartedAt: get(ANALYTICS_SESSION_COOKIE),
    returnEmittedForSession: get(ANALYTICS_RETURN_EMITTED_COOKIE),
    hadDestination: get(ANALYTICS_HAD_DESTINATION_COOKIE) === '1',
  };
}

export function computeDaysSinceLastVisit(lastVisitIso: string | undefined): number {
  if (!lastVisitIso) {
    return 0;
  }
  const lastVisit = Date.parse(lastVisitIso);
  if (Number.isNaN(lastVisit)) {
    return 0;
  }
  return Math.floor((Date.now() - lastVisit) / (24 * 60 * 60 * 1000));
}

export function isAnalyticsSessionExpired(sessionStartedAt: string | undefined): boolean {
  if (!sessionStartedAt) {
    return true;
  }
  const started = Date.parse(sessionStartedAt);
  if (Number.isNaN(started)) {
    return true;
  }
  return Date.now() - started >= ANALYTICS_SESSION_GAP_MS;
}

export function shouldEmitReturnVisit(input: {
  visitorId: string | undefined;
  lastVisitIso: string | undefined;
  sessionStartedAt: string | undefined;
  returnEmittedForSession?: string | undefined;
}): boolean {
  if (!isValidVisitorId(input.visitorId) || !input.lastVisitIso) {
    return false;
  }
  if (!isAnalyticsSessionExpired(input.sessionStartedAt)) {
    return false;
  }
  const lastVisit = Date.parse(input.lastVisitIso);
  if (Number.isNaN(lastVisit)) {
    return false;
  }
  return Date.now() - lastVisit >= ANALYTICS_SESSION_GAP_MS;
}

export function buildReturnVisitEvent(input: {
  daysSinceLast: number;
  hadDestination: boolean;
}): Extract<ProductEventPayload, { name: 'return_visit' }> {
  return {
    name: 'return_visit',
    days_since_last: input.daysSinceLast,
    had_destination: input.hadDestination,
  };
}

export function plausibleProps(
  event: ProductEventPayload,
): Record<string, string | number> {
  const props: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(event)) {
    if (key === 'name') {
      continue;
    }
    if (typeof value === 'string' || typeof value === 'number') {
      props[key] = value;
    } else if (typeof value === 'boolean') {
      props[key] = value ? 1 : 0;
    }
  }
  return props;
}

export function isAnalyticsEnabled(): boolean {
  return process.env.ANALYTICS_ENABLED === 'true';
}

export function getPlausibleDomain(): string | undefined {
  const domain = process.env.PLAUSIBLE_DOMAIN?.trim();
  return domain && domain.length > 0 ? domain : undefined;
}

export function getPlausibleApiHost(): string {
  const host = process.env.PLAUSIBLE_API_HOST?.trim();
  return host && host.length > 0 ? host.replace(/\/$/, '') : 'https://plausible.io';
}

export async function forwardProductEventToPlausible(
  event: ProductEventPayload,
): Promise<void> {
  if (!isAnalyticsEnabled()) {
    return;
  }

  const domain = getPlausibleDomain();
  if (!domain) {
    return;
  }

  const endpoint = `${getPlausibleApiHost()}/api/event`;
  await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'AetherAnimeAnalytics/1.0',
    },
    body: JSON.stringify({
      name: event.name,
      domain,
      url: `https://${domain}/api/events`,
      props: plausibleProps(event),
    }),
  }).catch(() => {
    /* fire-and-forget */
  });
}

export function buildAnalyticsCookie(
  name: string,
  value: string,
  maxAgeSeconds: number,
  secure: boolean,
): string {
  const parts = [
    `${name}=${value}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (secure) {
    parts.push('Secure');
  }
  return parts.join('; ');
}

export function buildAnalyticsCookieUpdates(input: {
  visitorId: string;
  nowIso: string;
  sessionStartedAt: string;
  returnVisitEmitted: boolean;
  hadDestination: boolean;
  secure: boolean;
}): string[] {
  const cookies = [
    buildAnalyticsCookie(
      ANALYTICS_VISITOR_COOKIE,
      input.visitorId,
      ANALYTICS_VISITOR_MAX_AGE_SECONDS,
      input.secure,
    ),
    buildAnalyticsCookie(
      ANALYTICS_LAST_VISIT_COOKIE,
      input.nowIso,
      ANALYTICS_COOKIE_MAX_AGE_SECONDS,
      input.secure,
    ),
    buildAnalyticsCookie(
      ANALYTICS_SESSION_COOKIE,
      input.sessionStartedAt,
      ANALYTICS_COOKIE_MAX_AGE_SECONDS,
      input.secure,
    ),
  ];

  if (input.hadDestination) {
    cookies.push(
      buildAnalyticsCookie(
        ANALYTICS_HAD_DESTINATION_COOKIE,
        '1',
        ANALYTICS_COOKIE_MAX_AGE_SECONDS,
        input.secure,
      ),
    );
  }

  if (input.returnVisitEmitted) {
    cookies.push(
      buildAnalyticsCookie(
        ANALYTICS_RETURN_EMITTED_COOKIE,
        input.sessionStartedAt,
        ANALYTICS_COOKIE_MAX_AGE_SECONDS,
        input.secure,
      ),
    );
  }

  return cookies;
}
