import type { DailyResult } from "./scoring.js";

export type HistoricalDayResult = {
  dayNumber: number;
  scoringDefinitionVersion: DailyResult["scoringDefinitionVersion"];
  completedCount: number;
  expectedCount: number;
  successful: boolean;
};

export function buildHistoricalResults(
  results: readonly DailyResult[],
): HistoricalDayResult[] {
  return results.map((result) => ({
    dayNumber: result.dayNumber,
    scoringDefinitionVersion: result.scoringDefinitionVersion,
    completedCount: result.completedCount,
    expectedCount: result.expectedCount,
    successful: result.successful,
  }));
}
