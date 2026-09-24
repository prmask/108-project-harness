import type Database from "better-sqlite3";
import { getExperimentDay } from "./get-experiment-day.js";
import { createExperimentDayRepository } from "../data/experiment-day-repository.js";
import { createProtocolObservationRepository } from "../data/protocol-observation-repository.js";
import { createScoringDefinitionRepository } from "../data/scoring-definition-repository.js";
import { createObservationCorrectionRepository } from "../data/observation-correction-repository.js";

export type LoadExperimentDayResult =
  | {
      status: "available";
      result: ReturnType<typeof getExperimentDay>;
    }
  | {
      status: "unavailable";
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
    });

    return {
      status: "available",
      result,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("No experiment day found")
    ) {
      return {
        status: "unavailable",
        reason: error.message,
      };
    }

    throw error;
  }
}
