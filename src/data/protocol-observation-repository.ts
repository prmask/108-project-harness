import type Database from "better-sqlite3";
import type { ObservationStatus } from "../domain/scoring.js";

type ProtocolObservationRow = {
  status: string;
};

export type ProtocolObservationRepository = {
  listForDay(
    experimentDayId: string,
  ): readonly ObservationStatus[];
};

export function createProtocolObservationRepository(
  database: Database.Database,
): ProtocolObservationRepository {
  return {
    listForDay(
      experimentDayId: string,
    ): readonly ObservationStatus[] {
      const rows = database
        .prepare(`
          SELECT status
          FROM protocol_observation
          WHERE experiment_day_id = ?
          ORDER BY observed_at ASC, id ASC
        `)
        .all(experimentDayId) as ProtocolObservationRow[];

      return rows.map((row) => row.status as ObservationStatus);
    },
  };
}
