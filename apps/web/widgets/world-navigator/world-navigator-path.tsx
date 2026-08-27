'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { spacing } from '@/shared/config/theme';
import { legibility } from '@/shared/lib/graphics';
import { cn } from '@/lib/utils';

import {
  worldNavigatorPathFrom,
  worldNavigatorPathStagger,
  worldNavigatorPathTo,
  worldNavigatorPathTransition,
} from './world-navigator.motion';
import {
  WORLD_NAVIGATOR_PATH,
  type NavigatorPathView,
} from './world-navigator.paths';

export type WorldNavigatorPathListProps = {
  readonly slot: string;
  readonly paths: ReadonlyArray<NavigatorPathView>;
  readonly onSelect: (key: string) => void;
};

export function WorldNavigatorPathList({
  slot,
  paths,
  onSelect,
}: WorldNavigatorPathListProps) {
  const reduceMotion = useReducedMotion();

  if (paths.length === 0) return null;

  return (
    <ul
      data-slot={slot}
      className={WORLD_NAVIGATOR_PATH.list}
      style={{ gap: spacing.xs }}
    >
      {paths.map((path, index) => (
        <motion.li
          key={path.key}
          className="w-full"
          initial={reduceMotion ? false : worldNavigatorPathFrom}
          animate={worldNavigatorPathTo}
          transition={{
            ...worldNavigatorPathTransition,
            delay: reduceMotion ? 0 : index * worldNavigatorPathStagger,
          }}
        >
          <button
            type="button"
            data-slot="world-navigator-path"
            onClick={() => onSelect(path.key)}
            className={cn(WORLD_NAVIGATOR_PATH.item, legibility.copy)}
          >
            <span className={WORLD_NAVIGATOR_PATH.title}>{path.title}</span>
            {path.meta ? (
              <span className={WORLD_NAVIGATOR_PATH.meta}>{path.meta}</span>
            ) : null}
            {path.context ? (
              <span className={WORLD_NAVIGATOR_PATH.context}>{path.context}</span>
            ) : null}
          </button>
        </motion.li>
      ))}
    </ul>
  );
}
