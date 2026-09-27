import Database from "better-sqlite3";
import { describe, expect, it } from "vitest";
import {
  createWealthRevenueObservationRepository,
} from "../../src/data/wealth-revenue-observation-repository.js";

function createDatabase(): Database.Database {
  const database = new Database(":memory:");

  database.exec(`
    CREATE TABLE experiment_day (
      id TEXT PRIMARY KEY,
      experiment_id TEXT NOT NULL,
      day_number INTEGER NOT NULL,
      date TEXT NOT NULL
    );

    CREATE TABLE wealth_revenue_observation (
      id TEXT PRIMARY KEY,
      experiment_day_id TEXT NOT NULL,
      amount REAL NOT NULL,
      observed_at TEXT NOT NULL,
      FOREIGN KEY (experiment_day_id) REFERENCES experiment_day(id)
    );

    INSERT INTO experiment_day (
      id,
      experiment_id,
      day_number,
      date
    )
    VALUES
      ('day-1', 'experiment-1', 1, '2026-09-07'),
      ('day-2', 'experiment-1', 2, '2026-09-08');

    INSERT INTO wealth_revenue_observation (
      id,
      experiment_day_id,
      amount,
      observed_at
    )
    VALUES
      (
        'revenue-1',
        'day-1',
        300000,
        '2026-09-07T06:00:00Z'
      ),
      (
        'revenue-2',
        'day-1',
        150000,
        '2026-09-07T20:00:00Z'
      ),
      (
        'revenue-3',
        'day-2',
        50000,
        '2026-09-08T06:00:00Z'
      );
  `);

  return database;
}

describe("wealth revenue observation repository", () => {
  it("returns revenue observations for the requested experiment day", () => {
    const database = createDatabase();
    const repository = createWealthRevenueObservationRepository(database);

    expect(repository.listForDay("day-1")).toEqual([
      {
        id: "revenue-1",
        experimentDayId: "day-1",
        amount: 300000,
        observedAt: "2026-09-07T06:00:00Z",
      },
      {
        id: "revenue-2",
        experimentDayId: "day-1",
        amount: 150000,
        observedAt: "2026-09-07T20:00:00Z",
      },
    ]);

    database.close();
  });

  it("preserves decimal revenue amounts", () => {
    const database = createDatabase();
    const repository = createWealthRevenueObservationRepository(database);

    expect(repository.listForDay("day-1")[0]?.amount).toBe(300000);

    database.close();
  });

  it("returns an empty array when the day has no revenue observations", () => {
    const database = createDatabase();
    const repository = createWealthRevenueObservationRepository(database);

    expect(repository.listForDay("day-with-no-weight")).toEqual([]);

    database.close();
  });

  it("does not return observations belonging to another day", () => {
    const database = createDatabase();
    const repository = createWealthRevenueObservationRepository(database);

    expect(repository.listForDay("day-2")).toEqual([
      {
        id: "revenue-3",
        experimentDayId: "day-2",
        amount: 50000,
        observedAt: "2026-09-08T06:00:00Z",
      },
    ]);

    database.close();
  });
});
