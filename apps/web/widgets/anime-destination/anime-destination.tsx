'use client';

import { useCallback, useState, useSyncExternalStore } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

import {
  catalogWatchPathProvider,
  discoveredDestinationMark,
  isOnWatchlist,
  overlayDiscoveredMetadata,
  subscribeWatchlist,
  toggleWatchlist,
  verifiedWatchUrl,
} from '@/shared/anime';
import { ANIME_TYPE_LABEL } from '@/shared/anime/anime.labels';
import { discoveredMalIdFromSlug } from '@/shared/anime/anime.mal.identity';
import type { CanonicalAnime } from '@/shared/anime';
import { spacing } from '@/shared/config/theme';
import { legibility } from '@/shared/lib/graphics';
import { cn } from '@/lib/utils';
import { useWorldScene } from '@/widgets/world-scene/world-scene-context';

import {
  ANIME_ARRIVAL_STAGE_GRID,
  ANIME_ARRIVAL_STAGE_GRID_POSTER,
  ANIME_ARRIVAL_STAGE_GRID_SEAL,
  ANIME_DESTINATION_ALTERNATE,
  ANIME_DESTINATION_COPY,
  ANIME_DESTINATION_COPY_COLUMN,
  ANIME_DESTINATION_EYEBROW,
  ANIME_DESTINATION_GENRES,
  ANIME_DESTINATION_IDENTITY,
  ANIME_DESTINATION_METADATA,
  ANIME_DESTINATION_POSTER_SIZES,
  ANIME_DESTINATION_POSTER_WIDTH,
  ANIME_DESTINATION_STAGE,
  ANIME_DESTINATION_SUPPORTING,
  ANIME_DESTINATION_SUPPORTING_LABEL,
  ANIME_DESTINATION_SUPPORTING_VALUE,
  ANIME_DESTINATION_SYNOPSIS,
  ANIME_DESTINATION_TITLE,
  ANIME_DESTINATION_WATCH_NOW,
  ANIME_DESTINATION_WATCH_NOW_ARROW,
  ANIME_DESTINATION_WATCH_NOW_CROSSING,
  ANIME_DESTINATION_WATCH_NOW_EDGE,
  ANIME_DESTINATION_WATCH_NOW_RULE,
  ANIME_DESTINATION_WATCH_NOW_RULE_MARK,
  ANIME_DESTINATION_WATCH_NOW_UNAVAILABLE,
  ANIME_POSTER_EDGE,
  ANIME_POSTER_PLATE,
  ANIME_POSTER_PRESENCE_SCALE,
  ANIME_SEAL_WIDTH,
  animePosterPreviewCopy,
  ANIME_STATUS_LABEL,
  formatMalSupportingLine,
} from './anime-destination.constants';
import {
  animeDestinationActions,
  animeDestinationBody,
  animeDestinationCopyReduced,
  animeDestinationEnterFrom,
  animeDestinationEnterTo,
  animeDestinationEnterTransition,
  animeDestinationEnterTransitionReduced,
  animeDestinationIdentity,
  animeDestinationPoster,
  animeDestinationPosterReduced,
} from './anime-destination.motion';
import type { AnimeDestinationProps } from './anime-destination.types';
import { openWatchPath } from './anime-destination.watch-now';
import { AnimeDestinationPaths } from './anime-destination-paths';
import { useAnimeMetadata } from './use-anime-metadata';

function useLocalWatchlist(animeId: string, slug: string, title: string) {
  const saved = useSyncExternalStore(
    subscribeWatchlist,
    () => isOnWatchlist(animeId),
    () => false,
  );

  const toggle = useCallback(() => {
    toggleWatchlist({
      animeId,
      slug,
      title,
    });
  }, [animeId, slug, title]);

  return { saved, toggle };
}

function metadataLine(anime: CanonicalAnime): string {
  const parts: string[] = [];
  if (anime.year != null) parts.push(String(anime.year));
  parts.push(ANIME_TYPE_LABEL[anime.type]);
  if (anime.episodeCount != null) {
    parts.push(
      `${anime.episodeCount} ${anime.episodeCount === 1 ? 'episode' : 'episodes'}`,
    );
  }
  parts.push(ANIME_STATUS_LABEL[anime.status]);
  return parts.join(' · ');
}

function DestinationMark({ anime }: { anime: CanonicalAnime }) {
  const malId = discoveredMalIdFromSlug(anime.slug);
  if (malId == null) {
    return (
      <>
        <span className="size-2.5 rotate-45 border border-ring/45 bg-ring/10" />
        <span
          className={cn(
            'mt-3 text-[0.5625rem] uppercase tracking-[0.28em] text-ring/80',
            legibility.copy,
          )}
        >
          {anime.canonicalTitle.slice(0, 1)}
        </span>
      </>
    );
  }

  const mark = discoveredDestinationMark({
    malId,
    title: anime.canonicalTitle,
    genres: anime.genres,
    year: anime.year,
  });

  return (
    <>
      <span
        aria-hidden="true"
        data-slot="anime-discovered-seal"
        className="size-3 rotate-45 border"
        style={{
          borderColor: `hsl(${mark.hue} 42% 58% / 0.55)`,
          backgroundColor: `hsl(${mark.hue} 42% 58% / 0.12)`,
        }}
      />
      <span
        className={cn(
          'mt-3 text-[0.5625rem] uppercase tracking-[0.28em]',
          legibility.copy,
        )}
        style={{ color: `hsl(${mark.hue} 32% 72% / 0.92)` }}
      >
        {mark.glyph}
      </span>
      {mark.inscription ? (
        <span
          className={cn(
            'mt-2 px-2 text-center text-[0.5rem] uppercase tracking-[0.18em] text-ring/55',
            legibility.copy,
          )}
        >
          {mark.inscription}
        </span>
      ) : null}
    </>
  );
}

function AnimePoster({
  anime,
  previewed,
  onTogglePreview,
  reduceMotion,
}: {
  anime: CanonicalAnime;
  previewed: boolean;
  onTogglePreview: () => void;
  reduceMotion: boolean | null;
}) {
  const previewText = animePosterPreviewCopy(anime);
  const label = `${anime.canonicalTitle} destination preview`;

  return (
    <button
      type="button"
      data-slot="anime-poster"
      aria-label={label}
      aria-expanded={previewed}
      onClick={onTogglePreview}
      className={cn(
        'group relative mx-auto block outline-none',
        anime.poster ? ANIME_DESTINATION_POSTER_WIDTH : ANIME_SEAL_WIDTH,
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        !reduceMotion &&
          'motion-safe:transition-transform motion-safe:duration-200',
        !reduceMotion && ANIME_POSTER_PRESENCE_SCALE,
        previewed && !reduceMotion && 'motion-safe:scale-[1.02]',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-y-1 left-0 w-px transition-[width,background-color]',
          ANIME_POSTER_EDGE.rest,
          'group-hover:w-0.5 group-hover:bg-ring in-focus-visible:w-0.5 in-focus-visible:bg-ring',
          previewed && `w-0.5 ${ANIME_POSTER_EDGE.preview}`,
          'motion-reduce:transition-none',
        )}
      />
      <span
        data-slot="anime-poster-plate"
        className={cn(
          'relative flex w-full flex-col items-center justify-center overflow-hidden',
          anime.poster ? 'aspect-[2/3]' : 'aspect-square',
          ANIME_POSTER_PLATE,
        )}
      >
        {anime.poster ? (
          <Image
            src={anime.poster}
            alt=""
            fill
            sizes={ANIME_DESTINATION_POSTER_SIZES}
            className="object-cover object-center"
          />
        ) : (
          <DestinationMark anime={anime} />
        )}
      </span>
      {previewText && anime.poster ? (
        <span
          data-slot="anime-poster-preview"
          className={cn(
            'pointer-events-none absolute inset-x-0 bottom-0 px-2 pb-2 pt-8',
            'bg-gradient-to-t from-background/80 to-transparent',
            'whitespace-pre-line text-left text-[0.625rem] leading-snug text-foreground/80',
            'opacity-0 transition-opacity duration-200',
            'group-hover:opacity-100 in-focus-visible:opacity-100',
            previewed && 'opacity-100',
            'motion-reduce:transition-none',
            legibility.copy,
          )}
        >
          {previewText}
        </span>
      ) : null}
    </button>
  );
}

/**
 * AnimeDestination — a place inside AetherAnime, not a card or modal.
 *
 * Reads arrivedAnime from WorldScene. WorldLayout only places this slot.
 */
export function AnimeDestination({ className }: AnimeDestinationProps) {
  const { arrivedAnime } = useWorldScene();
  const reduceMotion = useReducedMotion();
  const [previewed, setPreviewed] = useState(false);
  const metadata = useAnimeMetadata(arrivedAnime?.slug ?? null);

  const anime = arrivedAnime;
  const watchlist = useLocalWatchlist(
    anime?.id ?? '',
    anime?.slug ?? '',
    anime?.canonicalTitle ?? '',
  );

  if (!anime) return null;

  const presented = overlayDiscoveredMetadata(anime, metadata);

  const posterVariants = reduceMotion
    ? animeDestinationPosterReduced
    : animeDestinationPoster;
  const copyVariants = reduceMotion
    ? animeDestinationCopyReduced
    : animeDestinationIdentity;
  const bodyVariants = reduceMotion
    ? animeDestinationCopyReduced
    : animeDestinationBody;
  const actionVariants = reduceMotion
    ? animeDestinationCopyReduced
    : animeDestinationActions;
  const watchPaths = catalogWatchPathProvider.getByCanonicalAnime(anime);
  const watchUrl = verifiedWatchUrl(watchPaths);
  const canWatch = watchUrl != null;
  const crunchyroll = watchPaths.find((path) => path.provider === 'crunchyroll');
  const studios =
    anime.studios.length > 0 ? anime.studios.join(', ') : 'Unknown studio';
  const genres = presented.genres.join(' · ');
  const alternate = presented.alternateTitle;

  return (
    <motion.div
      data-slot="anime-destination"
      data-anime-id={anime.id}
      data-anime-slug={anime.slug}
      data-watch-now={canWatch ? 'verified' : 'unavailable'}
      data-watch-crunchyroll={crunchyroll?.status ?? 'unknown'}
      data-destination-artwork={anime.poster ? 'poster' : 'seal'}
      className={cn(
        'mx-auto w-full text-center',
        ANIME_DESTINATION_STAGE,
        className,
      )}
      initial={reduceMotion ? false : animeDestinationEnterFrom}
      animate={animeDestinationEnterTo}
      transition={
        reduceMotion
          ? animeDestinationEnterTransitionReduced
          : animeDestinationEnterTransition
      }
    >
      <div
        data-slot="anime-arrival-stage"
        data-destination-artwork={anime.poster ? 'poster' : 'seal'}
        className={cn(
          ANIME_ARRIVAL_STAGE_GRID,
          anime.poster
            ? ANIME_ARRIVAL_STAGE_GRID_POSTER
            : ANIME_ARRIVAL_STAGE_GRID_SEAL,
        )}
      >
        <motion.div
          variants={posterVariants}
          initial={reduceMotion ? false : 'hidden'}
          animate="show"
          className="shrink-0"
        >
          <AnimePoster
            anime={anime}
            previewed={previewed}
            reduceMotion={reduceMotion}
            onTogglePreview={() => setPreviewed((current) => !current)}
          />
        </motion.div>
        <motion.div
          data-slot="anime-destination-copy"
          variants={copyVariants}
          initial={reduceMotion ? false : 'hidden'}
          animate="show"
          className={ANIME_DESTINATION_COPY_COLUMN}
          style={{ gap: spacing.md }}
        >
          <div
            data-slot="anime-destination-identity"
            className={ANIME_DESTINATION_IDENTITY}
            style={{ gap: spacing.xs }}
          >
            <p className={cn(ANIME_DESTINATION_EYEBROW, legibility.copy)}>
              {ANIME_DESTINATION_COPY.eyebrow}
            </p>
            <h2
              data-slot="anime-destination-title"
              className={cn(
                'font-medium leading-tight tracking-[-0.01em] text-foreground',
                ANIME_DESTINATION_TITLE,
                legibility.copy,
              )}
            >
              {anime.canonicalTitle}
            </h2>
            {alternate ? (
              <p
                data-slot="anime-destination-alternate"
                className={cn(ANIME_DESTINATION_ALTERNATE, legibility.copy)}
              >
                {alternate}
              </p>
            ) : null}
            <p
              data-slot="anime-destination-metadata"
              className={cn(ANIME_DESTINATION_METADATA, legibility.copy)}
            >
              {metadataLine(anime)}
            </p>
            {genres ? (
              <p
                data-slot="anime-destination-genres"
                className={cn(ANIME_DESTINATION_GENRES, legibility.copy)}
              >
                {genres}
              </p>
            ) : null}
          </div>
          <motion.div
            variants={actionVariants}
            initial={reduceMotion ? false : 'hidden'}
            animate="show"
            data-slot="anime-destination-actions"
            className="flex w-full flex-col items-center sm:flex-row lg:justify-start"
            style={{ gap: spacing.md }}
          >
            <button
              type="button"
              data-slot="anime-destination-watch-now"
              disabled={!canWatch}
              aria-label={
                canWatch
                  ? ANIME_DESTINATION_COPY.watchNow
                  : ANIME_DESTINATION_COPY.watchNowUnavailable
              }
              onClick={() => {
                if (watchUrl) openWatchPath(watchUrl);
              }}
              className={cn(
                canWatch
                  ? [
                      ANIME_DESTINATION_WATCH_NOW,
                      ANIME_DESTINATION_WATCH_NOW_EDGE,
                      ANIME_DESTINATION_WATCH_NOW_RULE,
                      ANIME_DESTINATION_WATCH_NOW_CROSSING,
                    ]
                  : ANIME_DESTINATION_WATCH_NOW_UNAVAILABLE,
                legibility.copy,
              )}
            >
              {canWatch ? (
                <>
                  {ANIME_DESTINATION_COPY.watchNow}
                  <span
                    aria-hidden="true"
                    data-slot="anime-destination-watch-now-arrow"
                    className={ANIME_DESTINATION_WATCH_NOW_ARROW}
                  >
                    {' '}
                    →
                  </span>
                  <span
                    aria-hidden="true"
                    data-slot="anime-destination-watch-now-rule"
                    className={ANIME_DESTINATION_WATCH_NOW_RULE_MARK}
                  />
                </>
              ) : (
                ANIME_DESTINATION_COPY.watchNowUnavailable
              )}
            </button>
            <button
              type="button"
              aria-pressed={watchlist.saved}
              aria-label={
                watchlist.saved
                  ? ANIME_DESTINATION_COPY.removeWatchlist
                  : ANIME_DESTINATION_COPY.saveWatchlist
              }
              onClick={watchlist.toggle}
              className={cn(
                'text-[0.5625rem] uppercase tracking-[0.28em] text-muted-foreground',
                'border-b border-border/40 pb-0.5',
                'outline-none motion-safe:transition-colors motion-reduce:transition-none',
                'hover:border-ring/50 hover:text-ring/80',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                watchlist.saved && 'border-ring/40 text-ring/80',
                legibility.copy,
              )}
            >
              {watchlist.saved
                ? ANIME_DESTINATION_COPY.savedWatchlist
                : ANIME_DESTINATION_COPY.saveWatchlist}
            </button>
          </motion.div>
          <motion.div
            variants={bodyVariants}
            initial={reduceMotion ? false : 'hidden'}
            animate="show"
            className="flex w-full flex-col items-center lg:items-start"
            style={{ gap: spacing.md }}
          >
            <p
              className={cn(ANIME_DESTINATION_SYNOPSIS, legibility.copy)}
            >
              {presented.synopsis}
            </p>
            <div
              data-slot="anime-destination-supporting"
              className={ANIME_DESTINATION_SUPPORTING}
              style={{ gap: spacing.sm }}
            >
              <div
                data-slot="anime-destination-studio"
                className="flex w-full flex-col items-center lg:items-start"
                style={{ gap: spacing.xs }}
              >
                <p
                  className={cn(
                    ANIME_DESTINATION_SUPPORTING_LABEL,
                    legibility.copy,
                  )}
                >
                  {ANIME_DESTINATION_COPY.studioLabel}
                </p>
                <p
                  className={cn(
                    ANIME_DESTINATION_SUPPORTING_VALUE,
                    legibility.copy,
                  )}
                >
                  {studios}
                </p>
              </div>
              <div
                data-slot="anime-destination-providers"
                className="flex w-full flex-col items-center lg:items-start"
                style={{ gap: spacing.sm }}
              >
                <div
                  className="flex w-full flex-col items-center lg:items-start"
                  style={{ gap: spacing.xs }}
                >
                  <p
                    className={cn(
                      ANIME_DESTINATION_SUPPORTING_LABEL,
                      legibility.copy,
                    )}
                  >
                    {ANIME_DESTINATION_COPY.malLabel}
                  </p>
                  <p
                    data-slot="anime-destination-mal-score"
                    className={cn(
                      ANIME_DESTINATION_SUPPORTING_VALUE,
                      legibility.copy,
                    )}
                  >
                    {formatMalSupportingLine({
                      score: presented.score,
                      rank: presented.rank,
                      scoredBy: presented.scoredBy,
                    })}
                  </p>
                </div>
                <div
                  className="flex w-full flex-col items-center lg:items-start"
                  style={{ gap: spacing.xs }}
                >
                  <p
                    className={cn(
                      ANIME_DESTINATION_SUPPORTING_LABEL,
                      legibility.copy,
                    )}
                  >
                    {ANIME_DESTINATION_COPY.crunchyrollLabel}
                  </p>
                  <p
                    className={cn(
                      ANIME_DESTINATION_SUPPORTING_VALUE,
                      legibility.copy,
                    )}
                  >
                    {ANIME_DESTINATION_COPY.crunchyrollUnavailable}
                  </p>
                </div>
              </div>
            </div>
            <AnimeDestinationPaths
              anime={anime}
              presented={presented}
              metadata={metadata}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

