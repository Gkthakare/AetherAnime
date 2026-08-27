/**
 * Local-first watchlist. Persists the minimum stable representation only.
 *
 * Key: aetheranime.watchlist.v1
 * Identity: { animeId, slug }
 * Optional presentation: title
 */

export const WATCHLIST_STORAGE_KEY = 'aetheranime.watchlist.v1';
export const WATCHLIST_CHANGE_EVENT = 'aetheranime:watchlist';

export type WatchlistEntry = {
  readonly animeId: string;
  readonly slug: string;
  readonly savedAt: string;
  readonly title?: string;
};

export type WatchlistStore = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

function emitWatchlistChange() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(WATCHLIST_CHANGE_EVENT));
}

/** Subscribe to same-tab and cross-tab watchlist writes. */
export function subscribeWatchlist(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => onChange();
  window.addEventListener('storage', handler);
  window.addEventListener(WATCHLIST_CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(WATCHLIST_CHANGE_EVENT, handler);
  };
}

function resolveStore(store?: WatchlistStore): WatchlistStore | null {
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

function parseEntries(raw: string | null): WatchlistEntry[] {
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed.flatMap((entry) => {
    if (entry === null || typeof entry !== 'object') return [];
    const record = entry as Record<string, unknown>;
    if (
      typeof record.animeId !== 'string' ||
      typeof record.slug !== 'string' ||
      typeof record.savedAt !== 'string'
    ) {
      return [];
    }
    const title = optionalTitle(record.title);
    return [
      {
        animeId: record.animeId,
        slug: record.slug,
        savedAt: record.savedAt,
        ...(title ? { title } : {}),
      },
    ];
  });
}

export function readWatchlist(
  store?: WatchlistStore,
): ReadonlyArray<WatchlistEntry> {
  const storage = resolveStore(store);
  if (!storage) return [];
  try {
    return parseEntries(storage.getItem(WATCHLIST_STORAGE_KEY));
  } catch {
    return [];
  }
}

export function isOnWatchlist(
  animeId: string,
  store?: WatchlistStore,
): boolean {
  return readWatchlist(store).some((entry) => entry.animeId === animeId);
}

/**
 * Add or remove a watchlist row. Returns whether the anime is saved after
 * the attempt. Storage failure leaves the previous in-memory read (empty).
 * Identity is animeId + slug. Title is presentation only.
 */
export function toggleWatchlist(
  entry: {
    readonly animeId: string;
    readonly slug: string;
    readonly title?: string;
  },
  store?: WatchlistStore,
  now: string = new Date().toISOString(),
): boolean {
  const storage = resolveStore(store);
  if (!storage) return false;
  try {
    const current = parseEntries(storage.getItem(WATCHLIST_STORAGE_KEY));
    const exists = current.some((row) => row.animeId === entry.animeId);
    const title = optionalTitle(entry.title);
    const next = exists
      ? current.filter((row) => row.animeId !== entry.animeId)
      : [
          ...current,
          {
            animeId: entry.animeId,
            slug: entry.slug,
            savedAt: now,
            ...(title ? { title } : {}),
          },
        ];
    storage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(next));
    emitWatchlistChange();
    return !exists;
  } catch {
    return false;
  }
}
