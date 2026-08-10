/**
 * Error normalization — turn unknown throw values into inspectable Errors.
 *
 * JavaScript allows throwing anything, and `unknown` is where every `catch`
 * starts. Every reporting or boundary path in the app funnels values through
 * here so no failure is reduced to `[object Object]` or dropped for not being
 * an `Error` instance.
 */

/** Human-readable description of a non-Error throw value. */
function describeValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'symbol') return value.toString();
  if (typeof value === 'object' && value !== null) {
    try {
      return JSON.stringify(value) ?? String(value);
    } catch {
      // Circular or non-serializable payload — the tag is still better than nothing.
      return Object.prototype.toString.call(value);
    }
  }
  return String(value);
}

/**
 * Coerce any caught value into an `Error`, preserving the original as `cause`
 * when it was not already one.
 */
export function toError(value: unknown): Error {
  if (value instanceof Error) return value;
  return new Error(describeValue(value), { cause: value });
}

/**
 * Whether a caught value is a cancellation rather than a failure.
 *
 * Aborted ceremonies (unmount, restart) are expected control flow and must not
 * be reported as errors — while genuine failures must never be mistaken for one.
 */
export function isAbortError(value: unknown): boolean {
  if (typeof DOMException !== 'undefined' && value instanceof DOMException) {
    return value.name === 'AbortError';
  }
  return value instanceof Error && value.name === 'AbortError';
}
