/**
 * Z-index tokens.
 *
 * Semantic stacking levels that define the layering order of the interface. A
 * single ordered ladder prevents the "z-index arms race" where components
 * escalate arbitrary numbers to sit on top of one another.
 *
 * Values are plain numbers and intentionally spaced apart so intermediate
 * layers can be inserted later without renumbering. Consumers must reference a
 * named level, never a raw integer.
 */

/**
 * Semantic stacking levels (ordered lowest to highest).
 */
export const zIndex = {
  /** Ambient, living backdrops behind everything. */
  background: 0,
  /** Normal page content flow. */
  content: 10,
  /** Persistent navigation and chrome. */
  navigation: 100,
  /** Dimming scrims and dropdown surfaces above content. */
  overlay: 200,
  /** Focused dialogs and modals above the scrim. */
  modal: 300,
  /** Transient notifications above everything else. */
  toast: 400,
} as const;

/**
 * Union of available stacking levels:
 * `'background' | 'content' | 'navigation' | 'overlay' | 'modal' | 'toast'`.
 */
export type ZIndexToken = keyof typeof zIndex;
