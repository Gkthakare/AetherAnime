'use client';

import { createContext, useContext } from 'react';

import type { WorldSceneContextValue } from './world-scene.types';

export const WorldSceneContext = createContext<WorldSceneContextValue | null>(
  null,
);

/**
 * Read shared world orchestration context from under WorldScene.
 * Features observe `lifecycle` here — never duplicate a second machine.
 */
export function useWorldScene(): WorldSceneContextValue {
  const value = useContext(WorldSceneContext);
  if (!value) {
    throw new Error('useWorldScene must be used within WorldScene');
  }
  return value;
}
