/**
 * Color tokens.
 *
 * The semantic color palette of AetherAnime and the single source of truth for
 * every hue in the product. Colors are named by *role* (what the color is for),
 * never by *value* (what the color looks like) and never by component, so a
 * surface stays a surface even if its hex changes.
 *
 * These are raw, framework-agnostic CSS color strings. Any renderer — the web
 * client, a future canvas layer, native, or VR — reads the same values. The
 * graphics foundation derives its gradients, glows, and borders from this
 * palette; nothing above theme should hard-code a color.
 *
 * Web integration (single source of truth): every role below is mirrored into
 * the shadcn/Tailwind CSS variables in `app/globals.css` (`:root` and `.dark`),
 * which is how the theme reaches rendered pixels. CSS cannot import TypeScript,
 * so those variables are currently a hand-maintained reflection of this file —
 * this module is authoritative; edit a value here first, then update the
 * matching `--*` variable in `globals.css`. A future build step can generate
 * that bridge automatically without changing this contract.
 */

/**
 * Semantic colors (CSS color values).
 *
 * The dark, atmospheric base establishes the "world beyond the screen"; brand
 * hues supply the neon, magical accents; status hues communicate state.
 */
export const colors = {
  /** Deepest backdrop — the void the world sits on. */
  background: '#070B14',
  /** Default resting surface for panels and cards. */
  surface: '#111827',
  /** Lifted surface for nested, floating, or focused content. */
  surfaceElevated: '#1B2437',

  /** Primary readable text on dark surfaces. */
  text: '#F8FAFC',
  /** De-emphasized text: captions, hints, secondary labels. */
  textMuted: '#94A3B8',

  /** Primary brand color for key actions and identity. */
  primary: '#6C63FF',
  /** Accent brand color for highlights, focus, and emphasis. */
  accent: '#00F5D4',

  /** Positive state: confirmations and successful outcomes. */
  success: '#22C55E',
  /** Cautionary state: warnings and non-blocking issues. */
  warning: '#F59E0B',
  /** Destructive state: errors and irreversible actions. */
  danger: '#EF4444',
} as const;

/**
 * Union of available color roles:
 * `'background' | 'surface' | 'surfaceElevated' | 'text' | 'textMuted' |
 *  'primary' | 'accent' | 'success' | 'warning' | 'danger'`.
 */
export type ColorToken = keyof typeof colors;
