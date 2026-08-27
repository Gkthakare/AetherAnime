'use client';

import { createContext, useContext } from 'react';

import type { RegionSceneContextValue } from './region-scene.types';

export const RegionSceneContext = createContext<RegionSceneContextValue | null>(
  null,
);

/**
 * Read Region runtime from under RegionScene.
 * Selection signal is World Focus; RegionScene resolves metadata + status.
 */
export function useRegionScene(): RegionSceneContextValue {
  const value = useContext(RegionSceneContext);
  if (!value) {
    throw new Error('useRegionScene must be used within RegionScene');
  }
  return value;
}
