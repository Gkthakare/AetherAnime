import type { NextRequest } from 'next/server';

import {
  buildAnalyticsCookieUpdates,
  buildReturnVisitEvent,
  computeDaysSinceLastVisit,
  createVisitorId,
  forwardProductEventToPlausible,
  isAnalyticsSessionExpired,
  isValidVisitorId,
  parseAnalyticsCookies,
  shouldEmitReturnVisit,
} from '@/shared/analytics/analytics.server';
import { validateProductEvent } from '@/shared/analytics/analytics.validate';

function readCookie(request: NextRequest, name: string): string | undefined {
  return request.cookies.get(name)?.value;
}

/**
 * Server-trusted product event ingress. Validates coarse events, manages
 * anonymous visitor cookies, and forwards to Plausible when configured.
 * Never stores Navigator text. Always returns 204 — failure is silent.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 204 });
  }

  const validated = validateProductEvent(body);
  if (!validated.ok) {
    return new Response(null, { status: 204 });
  }

  const cookies = parseAnalyticsCookies((name) => readCookie(request, name));
  const nowIso = new Date().toISOString();
  const secure = process.env.NODE_ENV === 'production';
  const visitorId = isValidVisitorId(cookies.visitorId)
    ? cookies.visitorId
    : createVisitorId();

  const sessionExpired = isAnalyticsSessionExpired(cookies.sessionStartedAt);
  const sessionStartedAt = sessionExpired ? nowIso : (cookies.sessionStartedAt ?? nowIso);

  let hadDestination = cookies.hadDestination ?? false;
  if (validated.event.name === 'destination_arrived') {
    hadDestination = true;
  }

  const eventsToForward = [validated.event];

  if (
    shouldEmitReturnVisit({
      visitorId: cookies.visitorId,
      lastVisitIso: cookies.lastVisitIso,
      sessionStartedAt: cookies.sessionStartedAt,
      returnEmittedForSession: cookies.returnEmittedForSession,
    })
  ) {
    eventsToForward.unshift(
      buildReturnVisitEvent({
        daysSinceLast: computeDaysSinceLastVisit(cookies.lastVisitIso),
        hadDestination,
      }),
    );
  }

  await Promise.all(eventsToForward.map((event) => forwardProductEventToPlausible(event)));

  const response = new Response(null, { status: 204 });
  for (const cookie of buildAnalyticsCookieUpdates({
    visitorId,
    nowIso,
    sessionStartedAt,
    returnVisitEmitted: eventsToForward.some((event) => event.name === 'return_visit'),
    hadDestination,
    secure,
  })) {
    response.headers.append('Set-Cookie', cookie);
  }

  return response;
}
