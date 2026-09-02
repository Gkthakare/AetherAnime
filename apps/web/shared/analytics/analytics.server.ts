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

/** Visitor transport metadata from the incoming browser request — never stored in props. */
export type PlausibleVisitorTransport = Readonly<{
  userAgent?: string;
  forwardedFor?: string;
}>;

export function resolvePlausibleVisitorTransport(input: {
  userAgent: string | null;
  forwardedFor: string | null;
  realIp?: string | null;
}): PlausibleVisitorTransport {
  const userAgent = input.userAgent?.trim();
  const forwardedFor =
    input.forwardedFor?.split(',')[0]?.trim() || input.realIp?.trim() || undefined;

  return {
    ...(userAgent && userAgent.length > 0 ? { userAgent } : {}),
    ...(forwardedFor && forwardedFor.length > 0 ? { forwardedFor } : {}),
  };
}

/** Page URL for Plausible — must reflect the product surface, not /api/events. */
export function plausibleEventUrl(
  event: ProductEventPayload,
  domain: string,
): string {
  const origin = `https://${domain}`;

  switch (event.name) {
    case 'destination_arrived':
      return `${origin}/world/aetheranime?anime=${encodeURIComponent(event.slug)}`;
    case 'world_entered':
    case 'navigator_ask_submitted':
    case 'session_multi_destination':
    case 'return_visit':
      return `${origin}/world/aetheranime`;
    default:
      return `${origin}/world/aetheranime`;
  }
}

export function buildPlausibleForwardHeaders(
  transport: PlausibleVisitorTransport,
): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (transport.userAgent) {
    headers['User-Agent'] = transport.userAgent;
  }
  if (transport.forwardedFor) {
    headers['X-Forwarded-For'] = transport.forwardedFor;
  }

  return headers;
}

export type PlausibleForwardResult = Readonly<{
  recorded: boolean;
  dropped: boolean;
  status: number;
}>;

export async function forwardProductEventToPlausible(
  event: ProductEventPayload,
  transport: PlausibleVisitorTransport = {},
): Promise<PlausibleForwardResult> {
  if (!isAnalyticsEnabled()) {
    return { recorded: false, dropped: false, status: 0 };
  }

  const domain = getPlausibleDomain();
  if (!domain) {
    return { recorded: false, dropped: false, status: 0 };
  }

  const endpoint = `${getPlausibleApiHost()}/api/event`;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: buildPlausibleForwardHeaders(transport),
      body: JSON.stringify({
        name: event.name,
        domain,
        url: plausibleEventUrl(event, domain),
        props: plausibleProps(event),
      }),
    });

    const dropped = response.headers.get('x-plausible-dropped') === '1';
    return {
      recorded: !dropped && response.ok,
      dropped,
      status: response.status,
    };
  } catch {
    return { recorded: false, dropped: false, status: 0 };
  }
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
