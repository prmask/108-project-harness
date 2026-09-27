import type Database from "better-sqlite3";

export type WealthRevenueObservationRecord = {
  id: string;
  experimentDayId: string;
  amount: number;
  observedAt: string;
};

type WealthRevenueObservationRow = {
  id: string;
  experiment_day_id: string;
  amount: number;
  observed_at: string;
};

export type WealthRevenueObservationRepository = {
  listForDay(
    experimentDayId: string,
  ): readonly WealthRevenueObservationRecord[];
};

export function createWealthRevenueObservationRepository(
  database: Database.Database,
): WealthRevenueObservationRepository {
  return {
    listForDay(experimentDayId) {
      const rows = database
        .prepare(`
          SELECT
            id,
            experiment_day_id,
            amount,
            observed_at
          FROM wealth_revenue_observation
          WHERE experiment_day_id = ?
          ORDER BY observed_at ASC, id ASC
        `)
        .all(experimentDayId) as WealthRevenueObservationRow[];

      return rows.map((row) => ({
        id: row.id,
        experimentDayId: row.experiment_day_id,
        amount: row.amount,
        observedAt: row.observed_at,
      }));
    },
  };
}
