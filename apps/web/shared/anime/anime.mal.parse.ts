/**
 * MAL JSON shape checks shared by details and discovery adapters.
 *
 * Payload mapping stays in the normalizers. This file only answers
 * "is this JSON value a record / string / finite number / named list?"
 */

export function asRecord(value: unknown): Record<string, unknown> | null {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

export function asFiniteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function asString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** MAL `{ name }` arrays — genres, studios, and similar named nodes. */
export function namedList(value: unknown): ReadonlyArray<string> {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    const name = asString(asRecord(entry)?.name);
    return name ? [name] : [];
  });
}
