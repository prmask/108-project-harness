import type Database from "better-sqlite3";

export type HealthRunningDurationObservationRecord = {
  id: string;
  experimentDayId: string;
  durationMinutes: number;
  observedAt: string;
};

type HealthRunningDurationObservationRow = {
  id: string;
  experiment_day_id: string;
  duration_minutes: number;
  observed_at: string;
};

export type HealthRunningDurationObservationRepository = {
  listForDay(
    experimentDayId: string,
  ): readonly HealthRunningDurationObservationRecord[];
};

export function createHealthRunningDurationObservationRepository(
  database: Database.Database,
): HealthRunningDurationObservationRepository {
  return {
    listForDay(experimentDayId) {
      const rows = database
        .prepare(`
          SELECT
            id,
            experiment_day_id,
            duration_minutes,
            observed_at
          FROM health_running_duration_observation
          WHERE experiment_day_id = ?
          ORDER BY observed_at ASC, id ASC
        `)
        .all(experimentDayId) as HealthRunningDurationObservationRow[];

      return rows.map((row) => ({
        id: row.id,
        experimentDayId: row.experiment_day_id,
        durationMinutes: row.duration_minutes,
        observedAt: row.observed_at,
      }));
    },
  };
}
