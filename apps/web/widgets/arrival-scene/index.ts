/**
 * ArrivalScene — Experience Director for the first immersive stage.
 *
 *   import { ArrivalScene } from '@/widgets/arrival-scene';
 */

export { ArrivalScene } from './arrival-scene';
export type {
  ArrivalOrchestrationFrame,
  ArrivalPerformer,
  ArrivalPerformerDirective,
  ArrivalPhase,
  ArrivalPhaseEvent,
} from './arrival-scene.types';
export {
  ARRIVAL_ORCHESTRATION,
  ARRIVAL_PHASE_ORDER,
  ARRIVAL_SEQUENCE,
  ARRIVAL_SEQUENCE_REDUCED,
  dispatchArrivalCeremony,
  getArrivalOrchestration,
  isArrivalCeremonyPhase,
  isArrivalLocked,
  reduceArrivalPhase,
} from './arrival-scene.motion';
