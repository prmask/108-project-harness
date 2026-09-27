import type Database from 'better-sqlite3';

export type OpportunityObservationRecord = {
  id: string;
  experimentDayId: string;
  whatHappened: string;
  source: string;
  isUnexpected: boolean;
  goalRelated: boolean;
  actionTaken: string;
  potentialValue: number | null;
  actualValue: number | null;
  outcome: string;
  notes: string;
};

type OpportunityObservationRow = {
  id: string;
  experiment_day_id: string;
  what_happened: string;
  source: string;
  is_unexpected: number;
  goal_related: number;
  action_taken: string;
  potential_value: number | null;
  actual_value: number | null;
  outcome: string;
  notes: string;
};

export type OpportunityObservationRepository = {
  listForDay(
    experimentDayId: string,
  ): readonly OpportunityObservationRecord[];
};

export function createOpportunityObservationRepository(
  database: Database.Database,
): OpportunityObservationRepository {
  return {
    listForDay(experimentDayId) {
      const rows = database
        .prepare(`
          SELECT
            id,
            experiment_day_id,
            what_happened,
            source,
            is_unexpected,
            goal_related,
            action_taken,
            potential_value,
            actual_value,
            outcome,
            notes
          FROM opportunity_observation
          WHERE experiment_day_id = ?
          ORDER BY id ASC
        `)
        .all(experimentDayId) as OpportunityObservationRow[];

      return rows.map((row) => ({
        id: row.id,
        experimentDayId: row.experiment_day_id,
        whatHappened: row.what_happened,
        source: row.source,
        isUnexpected: row.is_unexpected === 1,
        goalRelated: row.goal_related === 1,
        actionTaken: row.action_taken,
        potentialValue: row.potential_value,
        actualValue: row.actual_value,
        outcome: row.outcome,
        notes: row.notes,
      }));
    },
  };
}
