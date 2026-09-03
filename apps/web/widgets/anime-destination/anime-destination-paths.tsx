'use client';

import { useId } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import type { AnimeDiscoveryCandidate, AnimeMetadata, CanonicalAnime } from '@/shared/anime';
import type { DestinationMetadataOverlay } from '@/shared/anime/anime.metadata';
import { spacing } from '@/shared/config/theme';
import { legibility } from '@/shared/lib/graphics';
import { DURATION, EASING, STAGGER } from '@/shared/lib/motion';
import { cn } from '@/lib/utils';
import { navigatorPathFromDiscovery } from '@/widgets/world-navigator/world-navigator.paths';

import {
  ANIME_DESTINATION_COPY,
  ANIME_DESTINATION_PATH_BUTTON,
  ANIME_DESTINATION_PATH_HINT,
  ANIME_DESTINATION_PATH_TITLE,
  ANIME_DESTINATION_PATHS,
  ANIME_DESTINATION_STORY_CHAMBER,
  ANIME_DESTINATION_STORY_RECORD,
  ANIME_DESTINATION_STORY_RETURN,
  ANIME_DESTINATION_STORY_RULE,
  ANIME_DESTINATION_KINSHIP_BRANCH,
  ANIME_DESTINATION_KINSHIP_CONSTELLATION,
  ANIME_DESTINATION_KINSHIP_META,
  ANIME_DESTINATION_KINSHIP_PATH,
  ANIME_DESTINATION_KINSHIP_TITLE,
} from './anime-destination.constants';
import {
  destinationAvailablePaths,
  destinationKinshipAvailable,
  destinationSignalTags,
  destinationStoryRecord,
  type DestinationPathId,
} from './anime-destination.paths';
import type { NeighboringWorldsState } from './use-neighboring-worlds';

function KinshipConstellation({
  candidates,
  onSelect,
}: {
  readonly candidates: ReadonlyArray<AnimeDiscoveryCandidate>;
  readonly onSelect: (key: string) => void;
}) {
  const reduceMotion = useReducedMotion();
  const paths = candidates.map((candidate) =>
    navigatorPathFromDiscovery(candidate),
  );

  return (
    <ul
      data-slot="anime-destination-kinship-constellation"
      className={ANIME_DESTINATION_KINSHIP_CONSTELLATION}
      style={{ gap: spacing.xs }}
    >
      {paths.map((path, index) => (
        <motion.li
          key={path.key}
          className={ANIME_DESTINATION_KINSHIP_BRANCH}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: reduceMotion ? 0 : DURATION.FAST,
            delay: reduceMotion ? 0 : index * STAGGER.FAST,
            ease: EASING.standard,
          }}
        >
          <button
            type="button"
            data-slot="anime-destination-kinship-path"
            onClick={() => onSelect(path.key)}
            className={cn(ANIME_DESTINATION_KINSHIP_PATH, legibility.copy)}
          >
            <span className={ANIME_DESTINATION_KINSHIP_TITLE}>{path.title}</span>
            {path.meta ? (
              <span className={ANIME_DESTINATION_KINSHIP_META}>{path.meta}</span>
            ) : null}
            {path.context ? (
              <span className={ANIME_DESTINATION_KINSHIP_META}>{path.context}</span>
            ) : null}
          </button>
        </motion.li>
      ))}
    </ul>
  );
}

function KinshipReveal({
  kinship,
  networkOpen,
  onSelect,
}: {
  readonly kinship: NeighboringWorldsState;
  readonly networkOpen: boolean;
  readonly onSelect: (key: string) => void;
}) {
  if (kinship.status === 'loading' || kinship.status === 'idle') {
    return (
      <p className={cn('text-sm text-muted-foreground/70', legibility.copy)}>
        {ANIME_DESTINATION_COPY.kinshipListening}
      </p>
    );
  }
  if (kinship.status === 'empty') {
    return (
      <p className={cn('text-sm text-muted-foreground/70', legibility.copy)}>
        {ANIME_DESTINATION_COPY.kinshipEmpty}
      </p>
    );
  }
  if (networkOpen) {
    return (
      <div className="flex flex-col" style={{ gap: spacing.xs }}>
        <p className={cn('text-sm text-muted-foreground/70', legibility.copy)}>
          {ANIME_DESTINATION_COPY.kinshipAnswered}
        </p>
        <a
          href="#anime-universe-beyond"
          className={cn(
            'min-h-11 text-[0.6875rem] uppercase tracking-[0.22em] text-foreground/80',
            'border-b border-border/40 pb-1 self-start',
            'outline-none motion-safe:transition-colors motion-reduce:transition-none',
            'hover:border-ring/50 hover:text-ring',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            legibility.copy,
          )}
        >
          {ANIME_DESTINATION_COPY.beyondApproach}
        </a>
      </div>
    );
  }
  return (
    <KinshipConstellation candidates={kinship.candidates} onSelect={onSelect} />
  );
}

function StoryChamber({ story }: { readonly story: string }) {
  return (
    <div
      data-slot="anime-destination-story-chamber"
      className={ANIME_DESTINATION_STORY_CHAMBER}
    >
      <p className={cn(ANIME_DESTINATION_STORY_RECORD, legibility.copy)}>
        {story}
      </p>
      <hr aria-hidden="true" className={ANIME_DESTINATION_STORY_RULE} />
      <p
        aria-hidden="true"
        className={cn(ANIME_DESTINATION_STORY_RETURN, legibility.copy)}
      >
        {ANIME_DESTINATION_COPY.storyReturn}
      </p>
    </div>
  );
}

function PathReveal({
  pathId,
  story,
  signals,
  kinship,
  networkOpen,
  onKinshipSelect,
}: {
  readonly pathId: DestinationPathId;
  readonly story: string | null;
  readonly signals: ReadonlyArray<string>;
  readonly kinship: NeighboringWorldsState;
  readonly networkOpen: boolean;
  readonly onKinshipSelect: (key: string) => void;
}) {
  if (pathId === 'story' && story) {
    return <StoryChamber story={story} />;
  }
  if (pathId === 'signals') {
    return (
      <ul className="flex flex-col" style={{ gap: spacing.xs }}>
        {signals.map((tag) => (
          <li
            key={tag}
            className={cn(
              'text-[0.6875rem] uppercase tracking-[0.2em] text-foreground/75',
              legibility.copy,
            )}
          >
            {tag}
          </li>
        ))}
      </ul>
    );
  }
  if (pathId === 'kinship') {
    return (
      <div aria-live="polite">
        <KinshipReveal
          kinship={kinship}
          networkOpen={networkOpen}
          onSelect={onKinshipSelect}
        />
      </div>
    );
  }
  return null;
}

type DestinationPathsProps = {
  readonly anime: CanonicalAnime;
  readonly presented: DestinationMetadataOverlay;
  readonly metadata: AnimeMetadata | null;
  readonly explorePath: DestinationPathId | null;
  readonly onExplore: (id: DestinationPathId | null) => void;
  readonly kinship: NeighboringWorldsState;
  readonly onKinshipSelect: (key: string) => void;
  readonly networkOpen: boolean;
};

export function AnimeDestinationPaths({
  anime,
  ...rest
}: DestinationPathsProps) {
  return <DestinationPathsInner key={anime.slug} anime={anime} {...rest} />;
}

function DestinationPathsInner({
  anime,
  presented,
  metadata,
  explorePath,
  onExplore,
  kinship,
  onKinshipSelect,
  networkOpen,
}: DestinationPathsProps) {
  const reduceMotion = useReducedMotion();
  const baseId = useId();
  const activePath = explorePath;

  const story = destinationStoryRecord(
    presented.synopsis,
    metadata?.synopsis ?? null,
  );
  const signals = destinationSignalTags({
    genres: presented.genres,
    synopsis: presented.synopsis,
  });
  const kinshipAvailable = destinationKinshipAvailable(anime);
  const paths = destinationAvailablePaths({
    story,
    signalCount: signals.length,
    kinshipAvailable,
    copy: ANIME_DESTINATION_COPY,
  });

  const togglePath = (id: DestinationPathId) => {
    if (activePath === id) {
      onExplore(null);
      return;
    }
    onExplore(id);
  };

  if (paths.length === 0) return null;

  const panelHidden = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, height: 0 };
  const panelShow = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, height: 'auto' };
  const panelTransition = {
    duration: reduceMotion ? 0 : DURATION.FAST,
    ease: EASING.standard,
  };

  return (
    <div
      data-slot="anime-destination-paths"
      className={ANIME_DESTINATION_PATHS}
      style={{ gap: spacing.xs }}
    >
      <h2
        data-slot="anime-universe-paths-here"
        className={cn(
          'text-[0.5625rem] uppercase tracking-[0.28em] text-muted-foreground/55',
          legibility.copy,
        )}
      >
        {ANIME_DESTINATION_COPY.pathsHere}
      </h2>
      <p
        className={cn(
          'text-[0.5625rem] uppercase tracking-[0.28em] text-muted-foreground/55',
          legibility.copy,
        )}
      >
        {ANIME_DESTINATION_COPY.pathsEyebrow}
      </p>
      <div data-slot="anime-universe-path-fork">
        {paths.map((path) => {
          const expanded = activePath === path.id;
          const panelId = `${baseId}-${path.id}`;
          const labelId = `${panelId}-threshold`;
          return (
            <div key={path.id} className="w-full">
              <button
                type="button"
                id={labelId}
                data-slot="anime-destination-path"
                data-path={path.id}
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => togglePath(path.id)}
                className={cn(ANIME_DESTINATION_PATH_BUTTON, legibility.copy)}
              >
                <span className={ANIME_DESTINATION_PATH_TITLE}>{path.label}</span>
                <span className={ANIME_DESTINATION_PATH_HINT}>{path.hint}</span>
              </button>
              <AnimatePresence initial={false}>
                {expanded ? (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={labelId}
                    initial={reduceMotion ? false : panelHidden}
                    animate={panelShow}
                    exit={reduceMotion ? { opacity: 0 } : panelHidden}
                    transition={panelTransition}
                    className="overflow-hidden px-3 pb-4 pt-3 text-left"
                  >
                    <PathReveal
                      pathId={path.id}
                      story={story}
                      signals={signals}
                      kinship={kinship}
                      networkOpen={networkOpen}
                      onKinshipSelect={onKinshipSelect}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
