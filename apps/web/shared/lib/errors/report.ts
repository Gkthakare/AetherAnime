/**
 * Error reporting — the single channel a swallowed failure must travel through.
 *
 * Ceremony code runs in event handlers, timers, and promises, where React error
 * boundaries never see a throw. Instead of dropping those failures (or throwing
 * them into an unhandled rejection nobody observes), every catch site reports
 * here with a scope, so failures stay visible in the console today and can be
 * forwarded to telemetry tomorrow by registering a reporter once.
 */

import { toError } from './normalize';

/** Normalized failure handed to the active reporter. */
export type ErrorReport = {
  /** Where the failure happened, e.g. `PortalCTA.sequence`. */
  scope: string;
  /** The failure, coerced to an Error (original value kept as `cause`). */
  error: Error;
  /** Optional structured context for triage. */
  detail?: Record<string, unknown>;
};

export type ErrorReporter = (report: ErrorReport) => void;

let reporter: ErrorReporter | null = null;

/**
 * Register (or clear, with `null`) the app-wide reporter.
 * Console logging always happens; the reporter is an additional sink.
 */
export function setErrorReporter(next: ErrorReporter | null): void {
  reporter = next;
}

/**
 * Report a caught failure and return it normalized, so call sites can rethrow
 * or store it without re-deriving an Error.
 */
export function reportError(
  scope: string,
  error: unknown,
  detail?: Record<string, unknown>,
): Error {
  const normalized = toError(error);

  if (detail === undefined) {
    console.error(`[${scope}]`, normalized);
  } else {
    console.error(`[${scope}]`, normalized, detail);
  }

  if (reporter) {
    try {
      reporter({ scope, error: normalized, detail });
    } catch (reporterError) {
      // A broken sink must never mask the failure it was meant to record.
      console.error('[errors.reporter]', toError(reporterError));
    }
  }

  return normalized;
}
