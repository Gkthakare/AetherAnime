/**
 * World Memory — where the traveller has actually been.
 *
 * Key: aetheranime.memory.v1
 * Identity: animeId
 * Recency: lastArrivedAt (epoch ms)
 * Optional presentation: title
 *
 * Records places, not visits: re-arriving an identity updates its recency
 * instead of appending a row. Distinct from Watchlist (explicit saving) and
 * Kinship (relatedness) — those never write here.
 *
 * The domain owns validation, ordering, and the cap so consumers never sort,
 * deduplicate, or trust storage themselves.
 */

export const MEMORY_STORAGE_KEY = 'aetheranime.memory.v1';
export const MEMORY_CHANGE_EVENT = 'aetheranime:memory';

/** Remembered identities retained locally. Oldest fall off first. */
export const MEMORY_LIMIT = 60;

export type MemoryEntry = {
  readonly animeId: string;
  readonly slug: string;
  readonly lastArrivedAt: number;
  readonly title?: string;
};

export type MemoryStore = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

/**
 * Minimum arrival shape. Structural by design: CanonicalAnime satisfies it,
 * and nothing wider than these three fields can reach storage.
 */
export type ArrivedPlace = {
  readonly id: string;
  readonly slug: string;
  readonly canonicalTitle?: string;
};

function emitMemoryChange() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(MEMORY_CHANGE_EVENT));
}

/** Subscribe to same-tab and cross-tab memory writes. */
export function subscribeMemory(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (event: Event) => {
    // Cross-tab writes to other keys are not memory changes. A cleared
    // storage reports a null key and must still notify.
    if (event.type === 'storage') {
      const key = (event as StorageEvent).key;
      if (key != null && key !== MEMORY_STORAGE_KEY) return;
    }
    onChange();
  };
  window.addEventListener('storage', handler);
  window.addEventListener(MEMORY_CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(MEMORY_CHANGE_EVENT, handler);
  };
}

function resolveStore(store?: MemoryStore): MemoryStore | null {
  if (store) return store;
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function optionalTitle(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function validTimestamp(value: unknown): number | null {
  if (typeof value !== 'number') return null;
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}

/** Newest first. animeId breaks ties so equal timestamps stay deterministic. */
function byRecency(a: MemoryEntry, b: MemoryEntry): number {
  if (a.lastArrivedAt !== b.lastArrivedAt) {
    return b.lastArrivedAt - a.lastArrivedAt;
  }
  if (a.animeId === b.animeId) return 0;
  return a.animeId < b.animeId ? -1 : 1;
}

function decode(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Storage is untrusted input. Only complete, well-formed rows survive, so a
 * corrupt value degrades to empty memory and the next write heals it.
 */
function parseEntries(raw: string | null): MemoryEntry[] {
  if (!raw) return [];
  const parsed = decode(raw);
  if (!Array.isArray(parsed)) return [];
  const seen = new Set<string>();
  const entries = parsed.flatMap<MemoryEntry>((entry) => {
    if (entry === null || typeof entry !== 'object') return [];
    const record = entry as Record<string, unknown>;
    if (typeof record.animeId !== 'string' || record.animeId.length === 0) {
      return [];
    }
    if (typeof record.slug !== 'string' || record.slug.length === 0) return [];
    const lastArrivedAt = validTimestamp(record.lastArrivedAt);
    if (lastArrivedAt === null) return [];
    if (seen.has(record.animeId)) return [];
    seen.add(record.animeId);
    const title = optionalTitle(record.title);
    return [
      {
        animeId: record.animeId,
        slug: record.slug,
        lastArrivedAt,
        ...(title ? { title } : {}),
      },
    ];
  });
  return entries.sort(byRecency).slice(0, MEMORY_LIMIT);
}

/** Remembered places, newest first. Never throws. */
export function readMemory(store?: MemoryStore): ReadonlyArray<MemoryEntry> {
  const storage = resolveStore(store);
  if (!storage) return [];
  try {
    return parseEntries(storage.getItem(MEMORY_STORAGE_KEY));
  } catch {
    return [];
  }
}

/** The most recently remembered places, capped by the domain. */
export function recentMemories(
  limit: number,
  store?: MemoryStore,
): ReadonlyArray<MemoryEntry> {
  if (!Number.isFinite(limit) || limit <= 0) return [];
  return readMemory(store).slice(0, Math.floor(limit));
}

/**
 * Record a committed arrival. Existing identities move to the front with a
 * fresh timestamp rather than gaining a second row. Returns whether the write
 * landed — an unavailable store is a silent no-op, never an application error.
 */
export function rememberArrival(
  place: ArrivedPlace,
  store?: MemoryStore,
  now: number = Date.now(),
): boolean {
  if (!place.id || !place.slug) return false;
  const lastArrivedAt = validTimestamp(now);
  if (lastArrivedAt === null) return false;
  const storage = resolveStore(store);
  if (!storage) return false;
  try {
    const current = parseEntries(storage.getItem(MEMORY_STORAGE_KEY));
    const previous = current.find((row) => row.animeId === place.id);
    const title = optionalTitle(place.canonicalTitle) ?? previous?.title;
    const entry: MemoryEntry = {
      animeId: place.id,
      slug: place.slug,
      lastArrivedAt,
      ...(title ? { title } : {}),
    };
    const next = [
      entry,
      ...current.filter((row) => row.animeId !== place.id),
    ]
      .sort(byRecency)
      .slice(0, MEMORY_LIMIT);
    storage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(next));
    emitMemoryChange();
    return true;
  } catch {
    return false;
  }
}
