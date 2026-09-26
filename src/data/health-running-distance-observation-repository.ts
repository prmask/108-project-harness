import type Database from "better-sqlite3";

export type HealthRunningDistanceObservationRecord = {
  id: string;
  experimentDayId: string;
  distanceKm: number;
  observedAt: string;
};

type HealthRunningDistanceObservationRow = {
  id: string;
  experiment_day_id: string;
  distance_km: number;
  observed_at: string;
};

export type HealthRunningDistanceObservationRepository = {
  listForDay(
    experimentDayId: string,
  ): readonly HealthRunningDistanceObservationRecord[];
};

export function createHealthRunningDistanceObservationRepository(
  database: Database.Database,
): HealthRunningDistanceObservationRepository {
  return {
    listForDay(experimentDayId) {
      const rows = database
        .prepare(`
          SELECT
            id,
            experiment_day_id,
            distance_km,
            observed_at
          FROM health_running_distance_observation
          WHERE experiment_day_id = ?
          ORDER BY observed_at ASC, id ASC
        `)
        .all(experimentDayId) as HealthRunningDistanceObservationRow[];

      return rows.map((row) => ({
        id: row.id,
        experimentDayId: row.experiment_day_id,
        distanceKm: row.distance_km,
        observedAt: row.observed_at,
      }));
    },
  };
}
