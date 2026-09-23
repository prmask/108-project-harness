import Database from "better-sqlite3";
import { describe, expect, it } from "vitest";
import {
  createExperimentDayRepository,
} from "../../src/data/experiment-day-repository.js";

function createDatabase(): Database.Database {
  const database = new Database(":memory:");

  database.exec(`
    CREATE TABLE experiment (
      id TEXT PRIMARY KEY
    );

    CREATE TABLE experiment_day (
      id TEXT PRIMARY KEY,
      experiment_id TEXT NOT NULL,
      day_number INTEGER NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY (experiment_id) REFERENCES experiment(id),
      UNIQUE (experiment_id, day_number),
      UNIQUE (experiment_id, date)
    );
  `);

  database.exec(`
    INSERT INTO experiment (id)
    VALUES ('experiment-1'), ('experiment-2');

    INSERT INTO experiment_day (
      id,
      experiment_id,
      day_number,
      date
    )
    VALUES
      ('day-1', 'experiment-1', 1, '2026-09-07'),
      ('day-2', 'experiment-1', 2, '2026-09-08'),
      ('other-day-1', 'experiment-2', 1, '2026-09-07');
  `);

  return database;
}

describe("experiment day repository", () => {
  it("resolves a day for the requested experiment", () => {
    const database = createDatabase();
    const repository = createExperimentDayRepository(database);

    expect(repository.resolveForDay("experiment-1", 1)).toEqual({
      id: "day-1",
      experimentId: "experiment-1",
      dayNumber: 1,
      date: "2026-09-07",
    });

    database.close();
  });

  it("resolves the requested day number and date", () => {
    const database = createDatabase();
    const repository = createExperimentDayRepository(database);

    expect(repository.resolveForDay("experiment-1", 2)).toEqual({
      id: "day-2",
      experimentId: "experiment-1",
      dayNumber: 2,
      date: "2026-09-08",
    });

    database.close();
  });

  it("does not return a day belonging to another experiment", () => {
    const database = createDatabase();
    const repository = createExperimentDayRepository(database);

    expect(() =>
      repository.resolveForDay("experiment-1", 3),
    ).toThrow("No experiment day found");

    database.close();
  });

  it("throws when the requested day does not exist", () => {
    const database = createDatabase();
    const repository = createExperimentDayRepository(database);

    expect(() =>
      repository.resolveForDay("experiment-1", 108),
    ).toThrow("No experiment day found");

    database.close();
  });
});
