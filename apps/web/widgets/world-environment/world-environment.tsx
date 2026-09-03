'use client';

import { useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { AETHERANIME_ASSETS } from '@/shared/config/assets';
import { WORLD_CLIMATES } from '@/shared/world';

import { AnimeArrivalAtmosphere } from '@/widgets/anime-arrival-atmosphere';

import { EnvironmentDepth } from './environment-depth';
import { EnvironmentPlateLayer } from './environment-plate-layer';
import { worldArrivalAtmosphere } from './world-arrival.atmosphere';
import { worldLivingPresence } from './world-living-presence';
import './world-living-presence.css';
import './world-idle-presence.css';
import './world-idle-geography.css';
import './world-destination-presence.css';
import { EnvironmentCrossingFrame } from './world-realm-crossing.view';
import { worldRealmCrossing } from './world-realm-crossing';
import {
  WORLD_ENVIRONMENT_ARTWORK_GRADE,
  WORLD_ENVIRONMENT_BASE,
  WORLD_ENVIRONMENT_DEPTH_FOREGROUND_TREATMENT,
  WORLD_ENVIRONMENT_DEPTH_LAYER_SIZE,
  WORLD_ENVIRONMENT_DEPTH_MIDGROUND_TREATMENT,
  WORLD_ENVIRONMENT_DEPTH_TRANSFORM,
  WORLD_ENVIRONMENT_DEPTH_VEIL,
  WORLD_ENVIRONMENT_DESTINATION_ATMOSPHERE,
  WORLD_ENVIRONMENT_DESTINATION_LIGHT_TRANSITION,
  WORLD_ENVIRONMENT_DIMENSIONAL_LIGHT,
  WORLD_ENVIRONMENT_FAR_GRADE,
  WORLD_ENVIRONMENT_FAR_LANDSCAPE_SIZE,
  WORLD_ENVIRONMENT_FAR_PORTRAIT_SIZE,
  WORLD_ENVIRONMENT_FOREGROUND_HAZE,
  WORLD_ENVIRONMENT_GEOGRAPHY_STATIC_TRANSFORM,
  WORLD_ENVIRONMENT_IDENTITY_ATMOSPHERE,
  WORLD_ENVIRONMENT_IDENTITY_VEIL,
  WORLD_ENVIRONMENT_LANDSCAPE_SIZE,
  WORLD_ENVIRONMENT_MIDGROUND_CONTINUATION_TREATMENT,
  WORLD_ENVIRONMENT_PORTRAIT_SIZE,
  WORLD_ENVIRONMENT_VIGNETTE,
} from './world-environment.constants';
import type { WorldEnvironmentProps } from './world-environment.types';

const environment = AETHERANIME_ASSETS.worlds.aetheranime.environment;

/**
 * WorldEnvironment — decorative, presentation-only world artwork.
 *
 * A 2.5D composition rather than a rendered scene. Back to front:
 *
 *   base            scene colour, always painted
 *   far             geographic horizon beyond the landmark (TASK-058-E, static)
 *   distance        identity orientation plate — the recognizable landmark
 *   mid-continuation geographic bridge (TASK-058-E, static, landscape-only)
 *   midground       sparse middle-distance accent, alpha
 *   depth veil      aerial perspective, settling over the midground
 *   dimensional     the cyan glow the world is lit by
 *   destination     focused-region atmosphere — existing climate gradient
 *   anime field     TASK-075 Option D environmental poster when poster exists
 *   foreground      near framing architecture, alpha
 *   identity climate  destination acknowledgement around the title
 *   identity veil   readability backing under the world title
 *   vignette        frame falloff
 *   haze            atmospheric close-out
 *
 * Far / mid-continuation are inert outside World Idle. Identity, sparse mid,
 * and foreground still take fine-pointer parallax. No WebGL, canvas, or 3D.
 *
 * Destination atmosphere and the identity climate wash are presentation props,
 * not Focus. WorldScene derives idle / region / arrival from arrivedAnime
 * existence plus existing region climate metadata. This component only paints
 * those tokens. No Focus, Registry, or URL.
 */
export function WorldEnvironment({
  className,
  destinationClimate = null,
  atmosphere,
  poster = null,
  transportActive = false,
}: Readonly<WorldEnvironmentProps>) {
  const presentation =
    atmosphere ??
    worldArrivalAtmosphere({
      arrivedAnime: null,
      regionClimate: destinationClimate,
    });
  const climate = presentation.climate;
  const reduceMotion = useReducedMotion();
  const crossing = worldRealmCrossing({
    atmosphere: presentation,
    reduceMotion: !!reduceMotion,
  });
  const living = worldLivingPresence({
    atmosphere: presentation,
    reduceMotion: !!reduceMotion,
    transportActive,
  });
  return (
    <div
      data-slot="world-environment"
      data-atmosphere-source={presentation.source}
      data-anime-artwork={poster ? 'present' : 'absent'}
      data-living={living.active ? 'true' : 'false'}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className,
      )}
    >
      <div
        data-slot="world-environment-base"
        className="absolute inset-0"
        style={{ backgroundColor: WORLD_ENVIRONMENT_BASE }}
      />

      <EnvironmentCrossingFrame
        arrivalKey={crossing.key}
        spatial={crossing.spatial}
      >
        <EnvironmentDepth>
        <div
          data-slot="world-environment-living"
          className="aether-living-depth absolute inset-0 origin-center"
        >
        <EnvironmentPlateLayer
          slot="world-environment-far"
          landscape={environment.far.landscape}
          portrait={environment.far.portrait}
          landscapeSize={WORLD_ENVIRONMENT_FAR_LANDSCAPE_SIZE}
          portraitSize={WORLD_ENVIRONMENT_FAR_PORTRAIT_SIZE}
          transform={WORLD_ENVIRONMENT_GEOGRAPHY_STATIC_TRANSFORM}
          priority
          imageClassName={WORLD_ENVIRONMENT_FAR_GRADE}
        />

        <EnvironmentPlateLayer
          slot="world-environment-image"
          landscape={environment.landscape}
          portrait={environment.portrait}
          landscapeSize={WORLD_ENVIRONMENT_LANDSCAPE_SIZE}
          portraitSize={WORLD_ENVIRONMENT_PORTRAIT_SIZE}
          transform={WORLD_ENVIRONMENT_DEPTH_TRANSFORM.distance}
          priority
          imageClassName={WORLD_ENVIRONMENT_ARTWORK_GRADE}
        />

        <EnvironmentPlateLayer
          slot="world-environment-midground-continuation"
          landscape={environment.depth.midgroundContinuation.landscape}
          landscapeSize={WORLD_ENVIRONMENT_DEPTH_LAYER_SIZE}
          transform={WORLD_ENVIRONMENT_GEOGRAPHY_STATIC_TRANSFORM}
          imageClassName={WORLD_ENVIRONMENT_MIDGROUND_CONTINUATION_TREATMENT}
        />

        <EnvironmentPlateLayer
          slot="world-environment-midground-architecture"
          landscape={environment.depth.midground.landscape}
          landscapeSize={WORLD_ENVIRONMENT_DEPTH_LAYER_SIZE}
          transform={WORLD_ENVIRONMENT_DEPTH_TRANSFORM.midground}
          imageClassName={WORLD_ENVIRONMENT_DEPTH_MIDGROUND_TREATMENT}
        />

        <div
          data-slot="world-environment-depth"
          className="absolute inset-0"
          style={{ background: WORLD_ENVIRONMENT_DEPTH_VEIL }}
        />

        </div>

        <div
          data-slot="world-environment-light"
          className="aether-living-light absolute will-change-[opacity]"
          style={{ background: WORLD_ENVIRONMENT_DIMENSIONAL_LIGHT }}
        />
        <div
          data-slot="world-environment-ask"
          className="absolute inset-0 opacity-0 motion-reduce:!transition-none"
          style={{
            background: WORLD_ENVIRONMENT_DIMENSIONAL_LIGHT,
            transition: WORLD_ENVIRONMENT_DESTINATION_LIGHT_TRANSITION,
          }}
        />

        <div
          data-slot="world-environment-destination-light"
          data-destination-climate={climate ?? 'none'}
          className="absolute inset-0"
        >
          {WORLD_CLIMATES.map((token) => (
            <div
              key={token}
              data-slot="world-environment-destination-atmosphere"
              data-climate={token}
              className="absolute inset-0 motion-reduce:!transition-none"
              style={{
                background: WORLD_ENVIRONMENT_DESTINATION_ATMOSPHERE[token],
                opacity:
                  climate === token ? presentation.destinationOpacity : 0,
                transition: WORLD_ENVIRONMENT_DESTINATION_LIGHT_TRANSITION,
              }}
            />
          ))}
        </div>

        <AnimeArrivalAtmosphere poster={poster} />

        <EnvironmentPlateLayer
          slot="world-environment-foreground-architecture"
          landscape={environment.depth.foreground.landscape}
          landscapeSize={WORLD_ENVIRONMENT_DEPTH_LAYER_SIZE}
          transform={WORLD_ENVIRONMENT_DEPTH_TRANSFORM.foreground}
          imageClassName={WORLD_ENVIRONMENT_DEPTH_FOREGROUND_TREATMENT}
        />

        <div
          data-slot="world-environment-identity-atmosphere"
          data-destination-climate={climate ?? 'none'}
          className="absolute inset-0 motion-reduce:!transition-none"
          style={{
            background: climate
              ? WORLD_ENVIRONMENT_IDENTITY_ATMOSPHERE[climate]
              : undefined,
            opacity: climate ? presentation.identityOpacity : 0,
            transition: WORLD_ENVIRONMENT_DESTINATION_LIGHT_TRANSITION,
          }}
        />

        <div
          data-slot="world-environment-identity-veil"
          className="absolute inset-0"
          style={{ background: WORLD_ENVIRONMENT_IDENTITY_VEIL }}
        />

        <div
          data-slot="world-environment-vignette"
          className="absolute inset-0"
          style={{ background: WORLD_ENVIRONMENT_VIGNETTE }}
        />

        <div
          data-slot="world-environment-foreground"
          className="aether-living-haze absolute inset-x-[-8%] bottom-[-18%] h-[48%]"
          style={{ background: WORLD_ENVIRONMENT_FOREGROUND_HAZE }}
        />
        </EnvironmentDepth>
      </EnvironmentCrossingFrame>
    </div>
  );
}
