'use client';

import { useCallback, useSyncExternalStore } from 'react';
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
import { DURATION } from '@/shared/lib/motion';
import { cn } from '@/lib/utils';
import { useWorldScene } from '@/widgets/world-scene/world-scene-context';

import {
  ANIME_DESTINATION_ALTERNATE,
  ANIME_DESTINATION_COPY,
  ANIME_DESTINATION_GENRES,
  ANIME_DESTINATION_METADATA,
  ANIME_DESTINATION_POSTER_SIZES,
  ANIME_DESTINATION_STAGE,
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
  ANIME_STATUS_LABEL,
  formatMalSupportingLine,
  formatUniverseRecordLine,
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
import {
  destinationHasRecordSection,
  destinationHasWorldSection,
  destinationIdentityStatement,
  destinationUniverseNav,
} from './anime-destination.universe';
import { useAnimeMetadata } from './use-anime-metadata';
import './anime-destination.universe.css';

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

function UniverseFigure({ anime }: { anime: CanonicalAnime }) {
  return (
    <div
      data-slot="anime-universe-figure"
      data-figure={anime.poster ? 'poster' : 'seal'}
      aria-hidden="true"
    >
      {anime.poster ? (
        <Image
          src={anime.poster}
          alt=""
          fill
          priority
          sizes={ANIME_DESTINATION_POSTER_SIZES}
          className="object-cover object-center"
        />
      ) : (
        <DestinationMark anime={anime} />
      )}
    </div>
  );
}

/**
 * AnimeDestination — an arrived anime universe inside AetherAnime.
 *
 * Reads arrivedAnime from WorldScene. WorldLayout places the universe stage.
 */
export function AnimeDestination({ className }: AnimeDestinationProps) {
  const { arrivedAnime, clearAnimeArrival } = useWorldScene();
  const reduceMotion = useReducedMotion();
  const metadata = useAnimeMetadata(arrivedAnime?.slug ?? null);

  const anime = arrivedAnime;
  const watchlist = useLocalWatchlist(
    anime?.id ?? '',
    anime?.slug ?? '',
    anime?.canonicalTitle ?? '',
  );

  if (!anime) return null;

  const presented = overlayDiscoveredMetadata(anime, metadata);
  const statement = destinationIdentityStatement(presented.synopsis);
  const nav = destinationUniverseNav({
    synopsis: presented.synopsis,
    year: anime.year,
    genres: presented.genres,
    studios: anime.studios,
    episodeCount: anime.episodeCount,
    score: presented.score,
  });
  const showWorld = destinationHasWorldSection({
    year: anime.year,
    genres: presented.genres,
    studios: anime.studios,
  });
  const showRecord = destinationHasRecordSection({
    episodeCount: anime.episodeCount,
    score: presented.score,
  });
  const recordLine = formatUniverseRecordLine({
    episodeCount: anime.episodeCount,
    status: anime.status,
  });
  const malLine = formatMalSupportingLine({
    score: presented.score,
    rank: presented.rank,
    scoredBy: presented.scoredBy,
  });

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
      key={anime.id}
      data-slot="anime-destination"
      data-universe=""
      data-anime-id={anime.id}
      data-anime-slug={anime.slug}
      data-destination-arrival={anime.id}
      data-watch-now={canWatch ? 'verified' : 'unavailable'}
      data-watch-crunchyroll={crunchyroll?.status ?? 'unknown'}
      data-destination-artwork={anime.poster ? 'poster' : 'seal'}
      className={cn(ANIME_DESTINATION_STAGE, className)}
      initial={reduceMotion ? false : animeDestinationEnterFrom}
      animate={animeDestinationEnterTo}
      transition={
        reduceMotion
          ? animeDestinationEnterTransitionReduced
          : animeDestinationEnterTransition
      }
    >
      <article data-slot="anime-universe">
        <nav
          data-slot="anime-universe-index"
          aria-label={ANIME_DESTINATION_COPY.universeIndex}
        >
          <ol className="flex flex-col items-end" style={{ gap: spacing.sm }}>
            {nav.map((entry) => (
              <li key={entry.id}>
                <a
                  href={entry.href}
                  className={cn(
                    'block py-1 text-[0.5rem] uppercase tracking-[0.28em] text-muted-foreground/55',
                    'outline-none hover:text-foreground/80',
                    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    legibility.copy,
                  )}
                >
                  {entry.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <header
          id="anime-universe-hero"
          data-slot="anime-universe-hero"
        >
          <div data-slot="anime-arrival-stage" className="contents">
          <motion.div
            variants={posterVariants}
            initial={reduceMotion ? false : 'hidden'}
            animate="show"
            className="pointer-events-none absolute inset-0"
          >
            <UniverseFigure anime={anime} />
          </motion.div>
          <div data-slot="anime-universe-identity">
            <button
              type="button"
              data-slot="anime-universe-exit"
              onClick={clearAnimeArrival}
              className={cn(
                'mb-6 text-[0.5625rem] uppercase tracking-[0.28em] text-muted-foreground/70',
                'outline-none hover:text-foreground/85',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                legibility.copy,
              )}
            >
              ← {ANIME_DESTINATION_COPY.returnContinuum}
            </button>
            <motion.div
              data-slot="anime-destination-copy"
              variants={copyVariants}
              initial={reduceMotion ? false : 'hidden'}
              animate="show"
              className="flex flex-col items-start"
              style={{ gap: spacing.sm }}
            >
              <div
                data-slot="anime-destination-identity"
                className="flex flex-col items-start"
                style={{ gap: spacing.xs }}
              >
                <h1
                  data-slot="anime-destination-title"
                  className={cn(
                    'text-foreground',
                    ANIME_DESTINATION_TITLE,
                    legibility.copy,
                  )}
                >
                  {anime.canonicalTitle}
                </h1>
                {alternate ? (
                  <p
                    data-slot="anime-destination-alternate"
                    className={cn(ANIME_DESTINATION_ALTERNATE, legibility.copy)}
                  >
                    {alternate}
                  </p>
                ) : null}
                {statement ? (
                  <p
                    data-slot="anime-universe-statement"
                    className={legibility.copy}
                  >
                    {statement}
                  </p>
                ) : null}
                <p
                  data-slot="anime-destination-metadata"
                  className={cn(ANIME_DESTINATION_METADATA, legibility.copy)}
                >
                  {metadataLine(anime)}
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={actionVariants}
              initial={reduceMotion ? false : 'hidden'}
              animate="show"
              data-slot="anime-destination-actions"
              className="flex flex-wrap items-center"
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
            {presented.synopsis ? (
              <a
                href="#anime-universe-story"
                data-slot="anime-universe-enter"
                className={cn(
                  'outline-none',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  legibility.copy,
                )}
              >
                {ANIME_DESTINATION_COPY.enterStory}
              </a>
            ) : null}
          </div>
          </div>
        </header>

        {presented.synopsis ? (
          <motion.section
            id="anime-universe-story"
            data-slot="anime-universe-section"
            variants={bodyVariants}
            initial={reduceMotion ? false : 'hidden'}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.28 }}
          >
            <p data-slot="anime-universe-kicker" className={legibility.copy}>
              {ANIME_DESTINATION_COPY.story}
            </p>
            <p className={cn(ANIME_DESTINATION_SYNOPSIS, legibility.copy)}>
              {presented.synopsis}
            </p>
          </motion.section>
        ) : null}

        {showWorld ? (
          <motion.section
            id="anime-universe-world"
            data-slot="anime-universe-section"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.28 }}
            transition={{ duration: reduceMotion ? 0 : DURATION.NORMAL }}
          >
            <p data-slot="anime-universe-kicker" className={legibility.copy}>
              {ANIME_DESTINATION_COPY.worldSection}
            </p>
            {genres ? (
              <p
                data-slot="anime-destination-genres"
                className={cn(
                  ANIME_DESTINATION_GENRES,
                  'text-[clamp(1.15rem,3vw,2rem)] tracking-[0.16em]',
                  legibility.copy,
                )}
              >
                {genres}
              </p>
            ) : null}
            <div
              data-slot="anime-destination-supporting"
              className="mt-10 flex max-w-md flex-col"
              style={{ gap: spacing.md }}
            >
              <div data-slot="anime-destination-studio" style={{ gap: spacing.xs }}>
                <p className={cn(ANIME_DESTINATION_SUPPORTING_LABEL, legibility.copy)}>
                  {ANIME_DESTINATION_COPY.studioLabel}
                </p>
                <p className={cn(ANIME_DESTINATION_SUPPORTING_VALUE, 'text-base', legibility.copy)}>
                  {studios}
                </p>
              </div>
            </div>
          </motion.section>
        ) : null}

        {showRecord ? (
          <motion.section
            id="anime-universe-record"
            data-slot="anime-universe-section"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.28 }}
            transition={{ duration: reduceMotion ? 0 : DURATION.NORMAL }}
          >
            <p data-slot="anime-universe-kicker" className={legibility.copy}>
              {ANIME_DESTINATION_COPY.recordSection}
            </p>
            {recordLine ? (
              <p
                className={cn(
                  'text-[clamp(1.35rem,3.4vw,2.4rem)] leading-tight text-foreground/85',
                  legibility.copy,
                )}
              >
                {recordLine}
              </p>
            ) : null}
            <div
              data-slot="anime-destination-providers"
              className="mt-10 flex max-w-lg flex-col"
              style={{ gap: spacing.md }}
            >
              <div style={{ gap: spacing.xs }}>
                <p className={cn(ANIME_DESTINATION_SUPPORTING_LABEL, legibility.copy)}>
                  {ANIME_DESTINATION_COPY.malLabel}
                </p>
                <p
                  data-slot="anime-destination-mal-score"
                  className={cn(ANIME_DESTINATION_SUPPORTING_VALUE, 'text-base', legibility.copy)}
                >
                  {malLine}
                </p>
              </div>
              <div style={{ gap: spacing.xs }}>
                <p className={cn(ANIME_DESTINATION_SUPPORTING_LABEL, legibility.copy)}>
                  {ANIME_DESTINATION_COPY.crunchyrollLabel}
                </p>
                <p className={cn(ANIME_DESTINATION_SUPPORTING_VALUE, 'text-base', legibility.copy)}>
                  {ANIME_DESTINATION_COPY.crunchyrollUnavailable}
                </p>
              </div>
            </div>
          </motion.section>
        ) : null}

        <div id="anime-universe-paths">
          <AnimeDestinationPaths
            anime={anime}
            presented={presented}
            metadata={metadata}
          />
        </div>

        <section
          id="anime-universe-beyond"
          data-slot="anime-universe-section"
          className="items-center"
        >
          <div data-slot="anime-universe-beyond" className="flex flex-col items-center">
            <p data-slot="anime-universe-kicker" className={legibility.copy}>
              {ANIME_DESTINATION_COPY.beyondEyebrow}
            </p>
            <p
              className={cn(
                'max-w-xl text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.03em] text-foreground',
                legibility.copy,
              )}
            >
              {ANIME_DESTINATION_COPY.beyondTitle}
            </p>
            <p
              className={cn(
                'mt-4 max-w-md text-sm leading-relaxed text-foreground/65',
                legibility.copy,
              )}
            >
              {ANIME_DESTINATION_COPY.beyondBody}
            </p>
            <p
              data-slot="anime-universe-infinity"
              aria-hidden="true"
            >
              ∞
            </p>
            <button
              type="button"
              data-slot="anime-universe-return"
              onClick={clearAnimeArrival}
              className={cn(
                'text-[0.6875rem] uppercase tracking-[0.28em] text-foreground/80',
                'border-b border-border/40 pb-1',
                'outline-none motion-safe:transition-colors motion-reduce:transition-none',
                'hover:border-ring/50 hover:text-ring',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                legibility.copy,
              )}
            >
              {ANIME_DESTINATION_COPY.returnContinuum}
            </button>
          </div>
        </section>
      </article>
    </motion.div>
  );
}
