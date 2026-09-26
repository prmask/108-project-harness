import type Database from "better-sqlite3";

export type HealthWaistObservationRecord = {
  id: string;
  experimentDayId: string;
  valueCm: number;
  observedAt: string;
};

type HealthWaistObservationRow = {
  id: string;
  experiment_day_id: string;
  value_cm: number;
  observed_at: string;
};

export type HealthWaistObservationRepository = {
  listForDay(
    experimentDayId: string,
  ): readonly HealthWaistObservationRecord[];
};

export function createHealthWaistObservationRepository(
  database: Database.Database,
): HealthWaistObservationRepository {
  return {
    listForDay(experimentDayId) {
      const rows = database
        .prepare(`
          SELECT
            id,
            experiment_day_id,
            value_cm,
            observed_at
          FROM health_waist_observation
          WHERE experiment_day_id = ?
          ORDER BY observed_at ASC, id ASC
        `)
        .all(experimentDayId) as HealthWaistObservationRow[];

      return rows.map((row) => ({
        id: row.id,
        experimentDayId: row.experiment_day_id,
        valueCm: row.value_cm,
        observedAt: row.observed_at,
      }));
    },
  };
}
