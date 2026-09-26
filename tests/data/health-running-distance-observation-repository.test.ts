import Database from "better-sqlite3";
import { describe, expect, it } from "vitest";
import {
  createHealthRunningDistanceObservationRepository,
} from "../../src/data/health-running-distance-observation-repository.js";

function createTestDatabase() {
  const database = new Database(":memory:");

  database.exec(`
    CREATE TABLE experiment_day (
      id TEXT PRIMARY KEY NOT NULL
    );

    CREATE TABLE health_running_distance_observation (
      id TEXT PRIMARY KEY NOT NULL,
      experiment_day_id TEXT NOT NULL,
      distance_km REAL NOT NULL,
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

describe("health running distance observation repository", () => {
  it("returns observations for the requested day", () => {
    const database = createTestDatabase();

    database
      .prepare(`
        INSERT INTO health_running_distance_observation
          (id, experiment_day_id, distance_km, observed_at)
        VALUES (?, ?, ?, ?)
      `)
      .run("distance-1", "day-1", 5, "2026-09-07T06:00:00Z");

    const repository =
      createHealthRunningDistanceObservationRepository(database);

    expect(repository.listForDay("day-1")).toEqual([
      {
        id: "distance-1",
        experimentDayId: "day-1",
        distanceKm: 5,
        observedAt: "2026-09-07T06:00:00Z",
      },
    ]);

    database.close();
  });

  it("preserves decimal distance", () => {
    const database = createTestDatabase();

    database
      .prepare(`
        INSERT INTO health_running_distance_observation
          (id, experiment_day_id, distance_km, observed_at)
        VALUES (?, ?, ?, ?)
      `)
      .run("distance-1", "day-1", 5.73, "2026-09-07T06:00:00Z");

    const repository =
      createHealthRunningDistanceObservationRepository(database);

    expect(repository.listForDay("day-1")[0]?.distanceKm).toBe(5.73);

    database.close();
  });

  it("returns empty for a day without observations", () => {
    const database = createTestDatabase();

    const repository =
      createHealthRunningDistanceObservationRepository(database);

    expect(repository.listForDay("day-1")).toEqual([]);

    database.close();
  });

  it("excludes observations belonging to another day", () => {
    const database = createTestDatabase();

    database
      .prepare(`
        INSERT INTO health_running_distance_observation
          (id, experiment_day_id, distance_km, observed_at)
        VALUES (?, ?, ?, ?)
      `)
      .run("distance-2", "day-2", 10, "2026-09-07T07:00:00Z");

    const repository =
      createHealthRunningDistanceObservationRepository(database);

    expect(repository.listForDay("day-1")).toEqual([]);

    database.close();
  });

  it("orders by observedAt and then id", () => {
    const database = createTestDatabase();

    const insert = database.prepare(`
      INSERT INTO health_running_distance_observation
        (id, experiment_day_id, distance_km, observed_at)
      VALUES (?, ?, ?, ?)
    `);

    insert.run("distance-b", "day-1", 5.2, "2026-09-07T06:00:00Z");
    insert.run("distance-a", "day-1", 3.1, "2026-09-07T06:00:00Z");
    insert.run("distance-c", "day-1", 7.4, "2026-09-07T07:00:00Z");

    const repository =
      createHealthRunningDistanceObservationRepository(database);

    expect(repository.listForDay("day-1").map((item) => item.id)).toEqual([
      "distance-a",
      "distance-b",
      "distance-c",
    ]);

    database.close();
  });
});
