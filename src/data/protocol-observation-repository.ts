import type Database from "better-sqlite3";
import type { ObservationStatus } from "../domain/scoring.js";

export type ProtocolObservationRecord = {
  id: string;
  protocolItemId: string;
  status: ObservationStatus;
  observedAt: string;
};

type ProtocolObservationRow = {
  id: string;
  protocol_item_id: string;
  status: string;
  observed_at: string;
};

export type ProtocolObservationRepository = {
  listForDay(
    experimentDayId: string,
  ): readonly ProtocolObservationRecord[];
};

export function createProtocolObservationRepository(
  database: Database.Database,
): ProtocolObservationRepository {
  return {
    listForDay(experimentDayId) {
      const rows = database
        .prepare(`
          SELECT
            id,
            protocol_item_id,
            status,
            observed_at
          FROM protocol_observation
          WHERE experiment_day_id = ?
          ORDER BY observed_at ASC, id ASC
        `)
        .all(experimentDayId) as ProtocolObservationRow[];

      return rows.map((row) => ({
        id: row.id,
        protocolItemId: row.protocol_item_id,
        status: row.status as ObservationStatus,
        observedAt: row.observed_at,
      }));
    },
  };
}
