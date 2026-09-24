import type Database from "better-sqlite3";
import type { ObservationCorrection } from "../domain/correction.js";
import type { ObservationStatus } from "../domain/scoring.js";

type ObservationCorrectionRow = {
  id: string;
  observation_id: string;
  original_status: string;
  corrected_status: string;
  corrected_at: string;
  reason: string;
};

export type ObservationCorrectionRepository = {
  listForObservation(
    observationId: string,
  ): readonly ObservationCorrection[];

  add(correction: ObservationCorrection): void;
};

export function createObservationCorrectionRepository(
  database: Database.Database,
): ObservationCorrectionRepository {
  return {
    listForObservation(observationId) {
      const rows = database
        .prepare(`
          SELECT
            id,
            observation_id,
            original_status,
            corrected_status,
            corrected_at,
            reason
          FROM observation_correction
          WHERE observation_id = ?
          ORDER BY corrected_at ASC, id ASC
        `)
        .all(observationId) as ObservationCorrectionRow[];

      return rows.map((row) => ({
        id: row.id,
        observationId: row.observation_id,
        originalStatus: row.original_status as ObservationStatus,
        correctedStatus: row.corrected_status as ObservationStatus,
        correctedAt: row.corrected_at,
        reason: row.reason,
      }));
    },

    add(correction) {
      database
        .prepare(`
          INSERT INTO observation_correction (
            id,
            observation_id,
            original_status,
            corrected_status,
            corrected_at,
            reason
          )
          VALUES (?, ?, ?, ?, ?, ?)
        `)
        .run(
          correction.id,
          correction.observationId,
          correction.originalStatus,
          correction.correctedStatus,
          correction.correctedAt,
          correction.reason,
        );
    },
  };
}
