import Database from "better-sqlite3";
import { afterEach, describe, expect, it } from "vitest";
import {
  createHealthWaistObservationRepository,
} from "../../src/data/health-waist-observation-repository.js";

const databases: Database.Database[] = [];

function createDatabase() {
  const database = new Database(":memory:");

  database.exec(`
    CREATE TABLE experiment_day (
      id TEXT PRIMARY KEY NOT NULL,
      experiment_id TEXT NOT NULL,
      day_number INTEGER NOT NULL,
      date TEXT NOT NULL
    );

    CREATE TABLE health_waist_observation (
      id TEXT PRIMARY KEY NOT NULL,
      experiment_day_id TEXT NOT NULL,
      value_cm REAL NOT NULL,
      observed_at TEXT NOT NULL,
      FOREIGN KEY (experiment_day_id) REFERENCES experiment_day(id)
    );
  `);

  databases.push(database);

  return database;
}

afterEach(() => {
  for (const database of databases.splice(0)) {
    database.close();
  }
});

describe("health waist observation repository", () => {
  it("returns observations for the requested day", () => {
    const database = createDatabase();

    database
      .prepare(`
        INSERT INTO experiment_day (id, experiment_id, day_number, date)
        VALUES (?, ?, ?, ?)
      `)
      .run("day-1", "experiment-1", 1, "2026-09-07");

    database
      .prepare(`
        INSERT INTO health_waist_observation
          (id, experiment_day_id, value_cm, observed_at)
        VALUES (?, ?, ?, ?)
      `)
      .run("waist-1", "day-1", 110.5, "2026-09-07T07:00:00Z");

    const repository =
      createHealthWaistObservationRepository(database);

    expect(repository.listForDay("day-1")).toEqual([
      {
        id: "waist-1",
        experimentDayId: "day-1",
        valueCm: 110.5,
        observedAt: "2026-09-07T07:00:00Z",
      },
    ]);
  });

  it("preserves decimal waist values", () => {
    const database = createDatabase();

    database
      .prepare(`
        INSERT INTO experiment_day (id, experiment_id, day_number, date)
        VALUES (?, ?, ?, ?)
      `)
      .run("day-1", "experiment-1", 1, "2026-09-07");

    database
      .prepare(`
        INSERT INTO health_waist_observation
          (id, experiment_day_id, value_cm, observed_at)
        VALUES (?, ?, ?, ?)
      `)
      .run("waist-1", "day-1", 110.75, "2026-09-07T07:00:00Z");

    const repository =
      createHealthWaistObservationRepository(database);

    expect(repository.listForDay("day-1")[0]?.valueCm).toBe(110.75);
  });

  it("returns an empty list when the day has no observations", () => {
    const database = createDatabase();

    database
      .prepare(`
        INSERT INTO experiment_day (id, experiment_id, day_number, date)
        VALUES (?, ?, ?, ?)
      `)
      .run("day-1", "experiment-1", 1, "2026-09-07");

    const repository =
      createHealthWaistObservationRepository(database);

    expect(repository.listForDay("day-1")).toEqual([]);
  });

  it("does not return observations belonging to another day", () => {
    const database = createDatabase();

    database
      .prepare(`
        INSERT INTO experiment_day (id, experiment_id, day_number, date)
        VALUES (?, ?, ?, ?), (?, ?, ?, ?)
      `)
      .run(
        "day-1",
        "experiment-1",
        1,
        "2026-09-07",
        "day-2",
        "experiment-1",
        2,
        "2026-09-08",
      );

    database
      .prepare(`
        INSERT INTO health_waist_observation
          (id, experiment_day_id, value_cm, observed_at)
        VALUES (?, ?, ?, ?)
      `)
      .run("waist-2", "day-2", 109.5, "2026-09-08T07:00:00Z");

    const repository =
      createHealthWaistObservationRepository(database);

    expect(repository.listForDay("day-1")).toEqual([]);
  });

  it("orders observations by observed time and then id", () => {
    const database = createDatabase();

    database
      .prepare(`
        INSERT INTO experiment_day (id, experiment_id, day_number, date)
        VALUES (?, ?, ?, ?)
      `)
      .run("day-1", "experiment-1", 1, "2026-09-07");

    const insert = database.prepare(`
      INSERT INTO health_waist_observation
        (id, experiment_day_id, value_cm, observed_at)
      VALUES (?, ?, ?, ?)
    `);

    insert.run("waist-b", "day-1", 110.0, "2026-09-07T08:00:00Z");
    insert.run("waist-a", "day-1", 110.5, "2026-09-07T07:00:00Z");

    const repository =
      createHealthWaistObservationRepository(database);

    expect(repository.listForDay("day-1")).toEqual([
      {
        id: "waist-a",
        experimentDayId: "day-1",
        valueCm: 110.5,
        observedAt: "2026-09-07T07:00:00Z",
      },
      {
        id: "waist-b",
        experimentDayId: "day-1",
        valueCm: 110.0,
        observedAt: "2026-09-07T08:00:00Z",
      },
    ]);
  });
});
