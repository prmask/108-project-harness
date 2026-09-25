import type Database from "better-sqlite3";

export type HealthWeightObservationRecord = {
  id: string;
  experimentDayId: string;
  valueKg: number;
  observedAt: string;
};

type HealthWeightObservationRow = {
  id: string;
  experiment_day_id: string;
  value_kg: number;
  observed_at: string;
};

export type HealthWeightObservationRepository = {
  listForDay(
    experimentDayId: string,
  ): readonly HealthWeightObservationRecord[];
};

export function createHealthWeightObservationRepository(
  database: Database.Database,
): HealthWeightObservationRepository {
  return {
    listForDay(experimentDayId) {
      const rows = database
        .prepare(`
          SELECT
            id,
            experiment_day_id,
            value_kg,
            observed_at
          FROM health_weight_observation
          WHERE experiment_day_id = ?
          ORDER BY observed_at ASC, id ASC
        `)
        .all(experimentDayId) as HealthWeightObservationRow[];

      return rows.map((row) => ({
        id: row.id,
        experimentDayId: row.experiment_day_id,
        valueKg: row.value_kg,
        observedAt: row.observed_at,
      }));
    },
  };
}
