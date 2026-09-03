'use client';

import { useEffect, useState } from 'react';

/**
 * Destination universe coordinate — section presence only.
 *
 * IntersectionObserver marks the current spatial index entry.
 * Does not append content, hijack scroll, or invent a second navigator.
 */

const SECTION_TO_ID: Record<string, string> = {
  overview: 'anime-universe-hero',
  story: 'anime-universe-story',
  world: 'anime-universe-world',
  record: 'anime-universe-record',
  paths: 'anime-universe-paths',
  beyond: 'anime-universe-beyond',
};

function elementIdFor(sectionId: string): string {
  return SECTION_TO_ID[sectionId] ?? `anime-universe-${sectionId}`;
}

export function useUniverseHere(
  sectionIds: ReadonlyArray<string>,
): string {
  const key = sectionIds.join('|');
  const fallback = sectionIds[0] ?? 'overview';
  const [here, setHere] = useState(fallback);
  const active = sectionIds.includes(here) ? here : fallback;

  useEffect(() => {
    const ids = key.length > 0 ? key.split('|') : [];
    if (ids.length === 0) return;

    const nodes = ids
      .map((id) => document.getElementById(elementIdFor(id)))
      .filter((node): node is HTMLElement => node != null);

    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const htmlId = visible.target.id;
        const match = ids.find((id) => elementIdFor(id) === htmlId);
        if (match) setHere(match);
      },
      {
        root: null,
        threshold: [0.2, 0.45, 0.7],
        rootMargin: '-18% 0px -42% 0px',
      },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [key]);

  return active;
}
