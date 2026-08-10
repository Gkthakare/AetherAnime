/**
 * Test setup — jsdom shims.
 *
 * jsdom ships no `matchMedia`, which reduced-motion aware widgets query.
 * The stub reports full motion; tests that need the reduced path override
 * `window.matchMedia` themselves.
 */
import { beforeEach } from 'vitest';

function stubMatchMedia(): void {
  if (typeof window === 'undefined') return;

  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

beforeEach(stubMatchMedia);
