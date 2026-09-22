import Database from "better-sqlite3";
import { describe, expect, it } from "vitest";
import {
  createScoringDefinitionRepository,
} from "../../src/data/scoring-definition-repository.js";

function createDatabase(): Database.Database {
  const database = new Database(":memory:");

  database.exec(`
    CREATE TABLE scoring_definition (
      id TEXT PRIMARY KEY,
      experiment_id TEXT NOT NULL,
      version TEXT NOT NULL,
      effective_from_day INTEGER NOT NULL,
      effective_to_day INTEGER NOT NULL,
      required_completed_count INTEGER NOT NULL,
      expected_count INTEGER NOT NULL,
      UNIQUE (experiment_id, version)
    );
  `);

  database
    .prepare(`
      INSERT INTO scoring_definition (
        id,
        experiment_id,
        version,
        effective_from_day,
        effective_to_day,
        required_completed_count,
        expected_count
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      "scoring-v1",
      "experiment-1",
      "v1",
      1,
      46,
      13,
      13,
    );

  database
    .prepare(`
      INSERT INTO scoring_definition (
        id,
        experiment_id,
        version,
        effective_from_day,
        effective_to_day,
        required_completed_count,
        expected_count
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      "scoring-v3",
      "experiment-1",
      "v3",
      47,
      108,
      8,
      13,
    );

  return database;
}

describe("scoring definition repository", () => {
  it("resolves v1 for Day 1", () => {
    const database = createDatabase();
    const repository = createScoringDefinitionRepository(database);

    expect(repository.resolveForDay("experiment-1", 1)).toEqual({
      version: "v1",
      effectiveFromDay: 1,
      effectiveToDay: 46,
      requiredCompletedCount: 13,
      expectedCount: 13,
    });

    database.close();
  });

  it("resolves v1 for Day 46", () => {
    const database = createDatabase();
    const repository = createScoringDefinitionRepository(database);

    expect(repository.resolveForDay("experiment-1", 46).version).toBe("v1");

    database.close();
  });

  it("resolves v3 for Day 47", () => {
    const database = createDatabase();
    const repository = createScoringDefinitionRepository(database);

    expect(repository.resolveForDay("experiment-1", 47)).toEqual({
      version: "v3",
      effectiveFromDay: 47,
      effectiveToDay: 108,
      requiredCompletedCount: 8,
      expectedCount: 13,
    });

    database.close();
  });

  it("resolves v3 for Day 108", () => {
    const database = createDatabase();
    const repository = createScoringDefinitionRepository(database);

    expect(repository.resolveForDay("experiment-1", 108).version).toBe("v3");

    database.close();
  });

  it("throws when no scoring definition applies", () => {
    const database = createDatabase();
    const repository = createScoringDefinitionRepository(database);

    expect(() =>
      repository.resolveForDay("experiment-1", 109),
    ).toThrow("No scoring definition found");

    database.close();
  });
});
