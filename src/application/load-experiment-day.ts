import type Database from 'better-sqlite3';
import { createExperimentDayRepository } from '../data/experiment-day-repository.js';
import { createHealthRunningDistanceObservationRepository } from '../data/health-running-distance-observation-repository.js';
import { createHealthRunningDurationObservationRepository } from '../data/health-running-duration-observation-repository.js';
import { createHealthWaistObservationRepository } from '../data/health-waist-observation-repository.js';
import { createHealthWeightObservationRepository } from '../data/health-weight-observation-repository.js';
import { createObservationCorrectionRepository } from '../data/observation-correction-repository.js';
import { createProtocolObservationRepository } from '../data/protocol-observation-repository.js';
import { createScoringDefinitionRepository } from '../data/scoring-definition-repository.js';
import { createThreeSixNineSessionRepository } from '../data/three-six-nine-session-repository.js';
import { getExperimentDay } from './get-experiment-day.js';

export type LoadExperimentDayResult =
  | {
      status: 'available';
      result: ReturnType<typeof getExperimentDay>;
    }
  | {
      status: 'unavailable';
      reason: string;
    };

export function loadExperimentDay(
  database: Database.Database,
  experimentId: string,
  dayNumber: number,
): LoadExperimentDayResult {
  try {
    const result = getExperimentDay({
      experimentId,
      dayNumber,
      experimentDayRepository: createExperimentDayRepository(database),
      scoringDefinitionRepository: createScoringDefinitionRepository(database),
      protocolObservationRepository:
        createProtocolObservationRepository(database),
      observationCorrectionRepository:
        createObservationCorrectionRepository(database),
      threeSixNineSessionRepository:
        createThreeSixNineSessionRepository(database),
      healthWeightObservationRepository:
        createHealthWeightObservationRepository(database),
      healthWaistObservationRepository:
        createHealthWaistObservationRepository(database),
      healthRunningDistanceObservationRepository:
        createHealthRunningDistanceObservationRepository(database),
      healthRunningDurationObservationRepository:
        createHealthRunningDurationObservationRepository(database),
    });

    return {
      status: 'available',
      result,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('No experiment day found')
    ) {
      return {
        status: 'unavailable',
        reason: error.message,
      };
    }

    throw error;
  }
}
