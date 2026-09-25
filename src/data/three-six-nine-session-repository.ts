import type Database from "better-sqlite3";

export type ThreeSixNinePeriod =
  | "morning"
  | "afternoon"
  | "evening";

export type ThreeSixNineStatus =
  | "completed"
  | "not_completed"
  | "missing";

export type ThreeSixNineSessionRecord = {
  id: string;
  experimentDayId: string;
  period: ThreeSixNinePeriod;
  plannedRepetitions: number;
  completedRepetitions: number;
  status: ThreeSixNineStatus;
  completedAt: string | null;
};

type ThreeSixNineSessionRow = {
  id: string;
  experiment_day_id: string;
  period: string;
  planned_repetitions: number;
  completed_repetitions: number;
  status: string;
  completed_at: string | null;
};

export type ThreeSixNineSessionRepository = {
  listForDay(
    experimentDayId: string,
  ): readonly ThreeSixNineSessionRecord[];
};

export function createThreeSixNineSessionRepository(
  database: Database.Database,
): ThreeSixNineSessionRepository {
  return {
    listForDay(experimentDayId) {
      const rows = database
        .prepare(`
          SELECT
            id,
            experiment_day_id,
            period,
            planned_repetitions,
            completed_repetitions,
            status,
            completed_at
          FROM three_six_nine_session
          WHERE experiment_day_id = ?
          ORDER BY
            CASE period
              WHEN 'morning' THEN 1
              WHEN 'afternoon' THEN 2
              WHEN 'evening' THEN 3
            END
        `)
        .all(experimentDayId) as ThreeSixNineSessionRow[];

      return rows.map((row) => ({
        id: row.id,
        experimentDayId: row.experiment_day_id,
        period: row.period as ThreeSixNinePeriod,
        plannedRepetitions: row.planned_repetitions,
        completedRepetitions: row.completed_repetitions,
        status: row.status as ThreeSixNineStatus,
        completedAt: row.completed_at,
      }));
    },
  };
}
