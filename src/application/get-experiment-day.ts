import type { ExperimentDayRecord } from "../data/experiment-day-repository.js";
import type { ProtocolObservationRepository } from "../data/protocol-observation-repository.js";
import type { ObservationCorrectionRepository } from "../data/observation-correction-repository.js";
import type { ScoringDefinition } from "../domain/scoring.js";
import type {
  HealthWeightObservationRecord,
  HealthWeightObservationRepository,
} from "../data/health-weight-observation-repository.js";
import type { ScoringDefinitionRepository } from "../data/scoring-definition-repository.js";
import type {
  ThreeSixNineSessionRecord,
  ThreeSixNineSessionRepository,
} from "../data/three-six-nine-session-repository.js";
import {
  calculateDailyResult,
  type DailyResult,
  type ObservationStatus,
} from "../domain/scoring.js";
import {
  getEffectiveObservationStatus,
  type ProtocolObservation,
} from "../domain/correction.js";
import type { ExperimentDayRepository } from "../data/experiment-day-repository.js";

export type GetExperimentDayResult = {
  experimentDay: ExperimentDayRecord;
  scoringDefinition: ScoringDefinition;
  observations: readonly ObservationStatus[];
  dailyResult: DailyResult;
  threeSixNineSessions: readonly ThreeSixNineSessionRecord[];
  healthWeightObservations: readonly HealthWeightObservationRecord[];
};

type GetExperimentDayDependencies = {
  experimentDayRepository: ExperimentDayRepository;
  scoringDefinitionRepository: ScoringDefinitionRepository;
  protocolObservationRepository: ProtocolObservationRepository;
  observationCorrectionRepository: ObservationCorrectionRepository;
  threeSixNineSessionRepository: ThreeSixNineSessionRepository;
  healthWeightObservationRepository: HealthWeightObservationRepository;
};

type GetExperimentDayInput = GetExperimentDayDependencies & {
  experimentId: string;
  dayNumber: number;
};

export function getExperimentDay({
  experimentId,
  dayNumber,
  experimentDayRepository,
  scoringDefinitionRepository,
  protocolObservationRepository,
  observationCorrectionRepository,
  threeSixNineSessionRepository,
  healthWeightObservationRepository,
}: GetExperimentDayInput): GetExperimentDayResult {
  const experimentDay = experimentDayRepository.resolveForDay(
    experimentId,
    dayNumber,
  );

  const threeSixNineSessions =
    threeSixNineSessionRepository.listForDay(
      experimentDay.id,
    );

  const healthWeightObservations =
    healthWeightObservationRepository.listForDay(
      experimentDay.id,
    );

  const scoringDefinition =
    scoringDefinitionRepository.resolveForDay(
      experimentId,
      dayNumber,
    );

  const observationRecords =
    protocolObservationRepository.listForDay(
      experimentDay.id,
    );

  const observations = observationRecords.map((observation) => {
    const protocolObservation: ProtocolObservation = {
      id: observation.id,
      dayNumber,
      protocolItemId: observation.protocolItemId,
      status: observation.status,
      observedAt: observation.observedAt,
    };

    const corrections =
      observationCorrectionRepository.listForObservation(
        observation.id,
      );

    return getEffectiveObservationStatus(
      protocolObservation,
      corrections,
    );
  });

  const dailyResult = calculateDailyResult(
    dayNumber,
    scoringDefinition,
    observations,
  );

  return {
    experimentDay,
    scoringDefinition,
    observations,
    dailyResult,
    threeSixNineSessions,
    healthWeightObservations,
  };
}
