import Database from "better-sqlite3";
import { describe, expect, it } from "vitest";
import { loadExperimentDay } from "../../src/application/load-experiment-day.js";

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

    CREATE TABLE scoring_definition (
      id TEXT PRIMARY KEY,
      experiment_id TEXT NOT NULL,
      version TEXT NOT NULL,
      effective_from_day INTEGER NOT NULL,
      effective_to_day INTEGER NOT NULL,
      required_completed_count INTEGER NOT NULL,
      expected_count INTEGER NOT NULL,
      FOREIGN KEY (experiment_id) REFERENCES experiment(id)
    );

    CREATE TABLE protocol_observation (
      id TEXT PRIMARY KEY,
      experiment_day_id TEXT NOT NULL,
      protocol_item_id TEXT NOT NULL,
      status TEXT NOT NULL,
      observed_at TEXT NOT NULL,
      FOREIGN KEY (experiment_day_id) REFERENCES experiment_day(id)
    );
  `);

  return database;
}

describe("load experiment day", () => {
  it("returns unavailable when the requested experiment day does not exist", () => {
    const database = createDatabase();

    expect(
      loadExperimentDay(database, "108-day-experiment", 17),
    ).toEqual({
      status: "unavailable",
      reason:
        "No experiment day found for experiment 108-day-experiment on day 17",
    });

    database.close();
  });
});
