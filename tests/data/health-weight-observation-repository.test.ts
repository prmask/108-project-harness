import Database from "better-sqlite3";
import { describe, expect, it } from "vitest";
import {
  createHealthWeightObservationRepository,
} from "../../src/data/health-weight-observation-repository.js";

function createDatabase(): Database.Database {
  const database = new Database(":memory:");

  database.exec(`
    CREATE TABLE experiment_day (
      id TEXT PRIMARY KEY,
      experiment_id TEXT NOT NULL,
      day_number INTEGER NOT NULL,
      date TEXT NOT NULL
    );

    CREATE TABLE health_weight_observation (
      id TEXT PRIMARY KEY,
      experiment_day_id TEXT NOT NULL,
      value_kg REAL NOT NULL,
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

    INSERT INTO health_weight_observation (
      id,
      experiment_day_id,
      value_kg,
      observed_at
    )
    VALUES
      (
        'weight-1',
        'day-1',
        87.7,
        '2026-09-07T06:00:00Z'
      ),
      (
        'weight-2',
        'day-1',
        87.4,
        '2026-09-07T20:00:00Z'
      ),
      (
        'weight-3',
        'day-2',
        87.2,
        '2026-09-08T06:00:00Z'
      );
  `);

  return database;
}

describe("health weight observation repository", () => {
  it("returns weight observations for the requested experiment day", () => {
    const database = createDatabase();
    const repository = createHealthWeightObservationRepository(database);

    expect(repository.listForDay("day-1")).toEqual([
      {
        id: "weight-1",
        experimentDayId: "day-1",
        valueKg: 87.7,
        observedAt: "2026-09-07T06:00:00Z",
      },
      {
        id: "weight-2",
        experimentDayId: "day-1",
        valueKg: 87.4,
        observedAt: "2026-09-07T20:00:00Z",
      },
    ]);

    database.close();
  });

  it("preserves decimal kilogram measurements", () => {
    const database = createDatabase();
    const repository = createHealthWeightObservationRepository(database);

    expect(repository.listForDay("day-1")[0]?.valueKg).toBe(87.7);

    database.close();
  });

  it("returns an empty array when the day has no weight observations", () => {
    const database = createDatabase();
    const repository = createHealthWeightObservationRepository(database);

    expect(repository.listForDay("day-with-no-weight")).toEqual([]);

    database.close();
  });

  it("does not return observations belonging to another day", () => {
    const database = createDatabase();
    const repository = createHealthWeightObservationRepository(database);

    expect(repository.listForDay("day-2")).toEqual([
      {
        id: "weight-3",
        experimentDayId: "day-2",
        valueKg: 87.2,
        observedAt: "2026-09-08T06:00:00Z",
      },
    ]);

    database.close();
  });
});
