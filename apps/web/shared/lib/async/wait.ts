/**
 * Abortable delay used by ceremony schedules.
 *
 * Emotional timing is expressed in seconds (matching Framer Motion), so the
 * scheduler never converts to milliseconds at the call site.
 */

/**
 * Resolve after `seconds`.
 *
 * When a `signal` is supplied, the promise rejects with an `AbortError` on abort
 * (or immediately, if it is already aborted) and the pending timer is cleared.
 */
export function wait(seconds: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const id = setTimeout(() => resolve(), seconds * 1000);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(id);
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true },
    );
  });
}
