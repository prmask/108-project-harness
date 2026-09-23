import type Database from "better-sqlite3";

type ExperimentDayRow = {
  id: string;
  experiment_id: string;
  day_number: number;
  date: string;
};

export type ExperimentDayRecord = {
  id: string;
  experimentId: string;
  dayNumber: number;
  date: string;
};

export type ExperimentDayRepository = {
  resolveForDay(
    experimentId: string,
    dayNumber: number,
  ): ExperimentDayRecord;
};

export function createExperimentDayRepository(
  database: Database.Database,
): ExperimentDayRepository {
  return {
    resolveForDay(
      experimentId: string,
      dayNumber: number,
    ): ExperimentDayRecord {
      const row = database
        .prepare(`
          SELECT
            id,
            experiment_id,
            day_number,
            date
          FROM experiment_day
          WHERE experiment_id = ?
            AND day_number = ?
        `)
        .get(
          experimentId,
          dayNumber,
        ) as ExperimentDayRow | undefined;

      if (!row) {
        throw new Error(
          `No experiment day found for experiment ${experimentId} on day ${dayNumber}`,
        );
      }

      return {
        id: row.id,
        experimentId: row.experiment_id,
        dayNumber: row.day_number,
        date: row.date,
      };
    },
  };
}
