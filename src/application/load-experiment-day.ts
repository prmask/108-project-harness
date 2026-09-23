import { getExperimentDay } from "./get-experiment-day.js";
import { createExperimentDayRepository } from "../data/experiment-day-repository.js";
import { createProtocolObservationRepository } from "../data/protocol-observation-repository.js";
import { createScoringDefinitionRepository } from "../data/scoring-definition-repository.js";
import type { GetExperimentDayResult } from "./get-experiment-day.js";
import type Database from "better-sqlite3";

export type LoadExperimentDayResult =
  | {
      status: "available";
      result: GetExperimentDayResult;
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
      scoringDefinitionRepository:
        createScoringDefinitionRepository(database),
      protocolObservationRepository:
        createProtocolObservationRepository(database),
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
