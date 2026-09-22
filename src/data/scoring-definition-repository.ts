import type Database from "better-sqlite3";
import type { ScoringDefinition } from "../domain/scoring.js";

type ScoringDefinitionRow = {
  version: string;
  effective_from_day: number;
  effective_to_day: number;
  required_completed_count: number;
  expected_count: number;
};

export function createScoringDefinitionRepository(
  database: Database.Database,
) {
  return {
    resolveForDay(
      experimentId: string,
      dayNumber: number,
    ): ScoringDefinition {
      const row = database
        .prepare(`
          SELECT
            version,
            effective_from_day,
            effective_to_day,
            required_completed_count,
            expected_count
          FROM scoring_definition
          WHERE experiment_id = ?
            AND effective_from_day <= ?
            AND effective_to_day >= ?
        `)
        .get(
          experimentId,
          dayNumber,
          dayNumber,
        ) as ScoringDefinitionRow | undefined;

      if (!row) {
        throw new Error(
          `No scoring definition found for experiment ${experimentId} on day ${dayNumber}`,
        );
      }

      return {
        version: row.version as ScoringDefinition["version"],
        effectiveFromDay: row.effective_from_day,
        effectiveToDay: row.effective_to_day,
        requiredCompletedCount: row.required_completed_count,
        expectedCount: row.expected_count,
      };
    },
  };
}
