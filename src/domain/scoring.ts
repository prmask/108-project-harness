export type ScoringDefinition = {
  version: "v1" | "v3";
  effectiveFromDay: number;
  effectiveToDay: number;
  requiredCompletedCount: number;
  expectedCount: number;
};

export type DailyResult = {
  dayNumber: number;
  scoringDefinitionVersion: ScoringDefinition["version"];
  completedCount: number;
  expectedCount: number;
  successful: boolean;
};

const V1: ScoringDefinition = {
  version: "v1",
  effectiveFromDay: 1,
  effectiveToDay: 46,
  requiredCompletedCount: 13,
  expectedCount: 13,
};

const V3: ScoringDefinition = {
  version: "v3",
  effectiveFromDay: 47,
  effectiveToDay: 108,
  requiredCompletedCount: 8,
  expectedCount: 13,
};

export function getScoringDefinitionForDay(
  dayNumber: number,
): ScoringDefinition {
  if (
    !Number.isInteger(dayNumber) ||
    dayNumber < 1 ||
    dayNumber > 108
  ) {
    throw new Error(`Invalid experiment day: ${dayNumber}`);
  }

  return dayNumber <= 46 ? V1 : V3;
}

export type ObservationStatus =
  | "completed"
  | "not_completed"
  | "missing";

export function calculateDailyResult(
  dayNumber: number,
  definition: ScoringDefinition,
  observations: readonly ObservationStatus[],
): DailyResult {
  const completedCount = observations.filter(
    (status) => status === "completed",
  ).length;

  return {
    dayNumber,
    scoringDefinitionVersion: definition.version,
    completedCount,
    expectedCount: definition.expectedCount,
    successful:
      completedCount >= definition.requiredCompletedCount,
  };
}
