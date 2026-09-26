import Database from "better-sqlite3";
import { describe, expect, it } from "vitest";
import {
  createHealthRunningDurationObservationRepository,
} from "../../src/data/health-running-duration-observation-repository.js";

function createTestDatabase() {
  const database = new Database(":memory:");

  database.exec(`
    CREATE TABLE experiment_day (
      id TEXT PRIMARY KEY NOT NULL
    );

    CREATE TABLE health_running_duration_observation (
      id TEXT PRIMARY KEY NOT NULL,
      experiment_day_id TEXT NOT NULL,
      duration_minutes REAL NOT NULL,
      observed_at TEXT NOT NULL,
      FOREIGN KEY (experiment_day_id) REFERENCES experiment_day(id)
    );
  `);

  database
    .prepare("INSERT INTO experiment_day (id) VALUES (?)")
    .run("day-1");

  database
    .prepare("INSERT INTO experiment_day (id) VALUES (?)")
    .run("day-2");

  return database;
}

describe("health running duration observation repository", () => {
  it("returns observations for the requested day", () => {
    const database = createTestDatabase();

    database
      .prepare(`
        INSERT INTO health_running_duration_observation
          (id, experiment_day_id, duration_minutes, observed_at)
        VALUES (?, ?, ?, ?)
      `)
      .run("duration-1", "day-1", 45, "2026-09-07T06:00:00Z");

    const repository =
      createHealthRunningDurationObservationRepository(database);

    expect(repository.listForDay("day-1")).toEqual([
      {
        id: "duration-1",
        experimentDayId: "day-1",
        durationMinutes: 45,
        observedAt: "2026-09-07T06:00:00Z",
      },
    ]);

    database.close();
  });

  it("preserves decimal duration", () => {
    const database = createTestDatabase();

    database
      .prepare(`
        INSERT INTO health_running_duration_observation
          (id, experiment_day_id, duration_minutes, observed_at)
        VALUES (?, ?, ?, ?)
      `)
      .run("duration-1", "day-1", 45.5, "2026-09-07T06:00:00Z");

    const repository =
      createHealthRunningDurationObservationRepository(database);

    expect(repository.listForDay("day-1")[0]?.durationMinutes).toBe(45.5);

    database.close();
  });

  it("returns empty for a day without observations", () => {
    const database = createTestDatabase();

    const repository =
      createHealthRunningDurationObservationRepository(database);

    expect(repository.listForDay("day-1")).toEqual([]);

    database.close();
  });

  it("excludes observations belonging to another day", () => {
    const database = createTestDatabase();

    database
      .prepare(`
        INSERT INTO health_running_duration_observation
          (id, experiment_day_id, duration_minutes, observed_at)
        VALUES (?, ?, ?, ?)
      `)
      .run("duration-2", "day-2", 60, "2026-09-07T07:00:00Z");

    const repository =
      createHealthRunningDurationObservationRepository(database);

    expect(repository.listForDay("day-1")).toEqual([]);

    database.close();
  });

  it("orders by observedAt and then id", () => {
    const database = createTestDatabase();

    const insert = database.prepare(`
      INSERT INTO health_running_duration_observation
        (id, experiment_day_id, duration_minutes, observed_at)
      VALUES (?, ?, ?, ?)
    `);

    insert.run("duration-b", "day-1", 45, "2026-09-07T06:00:00Z");
    insert.run("duration-a", "day-1", 30, "2026-09-07T06:00:00Z");
    insert.run("duration-c", "day-1", 60, "2026-09-07T07:00:00Z");

    const repository =
      createHealthRunningDurationObservationRepository(database);

    expect(repository.listForDay("day-1").map((item) => item.id)).toEqual([
      "duration-a",
      "duration-b",
      "duration-c",
    ]);

    database.close();
  });
});
