import type Database from 'better-sqlite3';

export type EvidenceCategory =
  | 'supporting'
  | 'challenging'
  | 'alternative_explanation';

export type EvidenceObservationRecord = {
  id: string;
  experimentDayId: string;
  hypothesisId: string;
  category: EvidenceCategory;
  observation: string;
  recordedAt: string;
};

type EvidenceObservationRow = {
  id: string;
  experiment_day_id: string;
  hypothesis_id: string;
  category: string;
  observation: string;
  recorded_at: string;
};

export type EvidenceObservationRepository = {
  listForDay(
    experimentDayId: string,
  ): readonly EvidenceObservationRecord[];
};

export function createEvidenceObservationRepository(
  database: Database.Database,
): EvidenceObservationRepository {
  return {
    listForDay(experimentDayId) {
      const rows = database
        .prepare(`
          SELECT
            id,
            experiment_day_id,
            hypothesis_id,
            category,
            observation,
            recorded_at
          FROM evidence_observation
          WHERE experiment_day_id = ?
          ORDER BY recorded_at ASC, id ASC
        `)
        .all(experimentDayId) as EvidenceObservationRow[];

      return rows.map((row) => ({
        id: row.id,
        experimentDayId: row.experiment_day_id,
        hypothesisId: row.hypothesis_id,
        category: row.category as EvidenceCategory,
        observation: row.observation,
        recordedAt: row.recorded_at,
      }));
    },
  };
}
