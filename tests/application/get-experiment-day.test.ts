import Database from "better-sqlite3";
import { describe, expect, it } from "vitest";
import { createExperimentDayRepository } from "../../src/data/experiment-day-repository.js";
import { createProtocolObservationRepository } from "../../src/data/protocol-observation-repository.js";
import { createScoringDefinitionRepository } from "../../src/data/scoring-definition-repository.js";
import { getExperimentDay } from "../../src/application/get-experiment-day.js";

function createTestDatabase() {
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
      expected_count INTEGER NOT NULL
    );

    CREATE TABLE protocol_observation (
      id TEXT PRIMARY KEY,
      experiment_day_id TEXT NOT NULL,
      protocol_item_id TEXT NOT NULL,
      status TEXT NOT NULL CHECK (
        status IN ('completed', 'not_completed', 'missing')
      ),
      observed_at TEXT NOT NULL,
      UNIQUE (experiment_day_id, protocol_item_id)
    );
  `);

  database.prepare(`INSERT INTO experiment (id) VALUES (?)`).run("experiment-1");

  database
    .prepare(`
      INSERT INTO experiment_day (
        id,
        experiment_id,
        day_number,
        date
      )
      VALUES (?, ?, ?, ?)
    `)
    .run("day-1", "experiment-1", 1, "2026-09-07");

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
    .run("scoring-v1", "experiment-1", "v1", 1, 46, 13, 13);

  database
    .prepare(`
      INSERT INTO protocol_observation (
        id,
        experiment_day_id,
        protocol_item_id,
        status,
        observed_at
      )
      VALUES (?, ?, ?, ?, ?)
    `)
    .run(
      "observation-1",
      "day-1",
      "wake-0350",
      "completed",
      "2026-09-07T03:50:00Z",
    );

  database
    .prepare(`
      INSERT INTO protocol_observation (
        id,
        experiment_day_id,
        protocol_item_id,
        status,
        observed_at
      )
      VALUES (?, ?, ?, ?, ?)
    `)
    .run(
      "observation-2",
      "day-1",
      "run-0520",
      "not_completed",
      "2026-09-07T05:20:00Z",
    );

  return database;
}

describe("getExperimentDay", () => {
  it("composes day, scoring definition, observations, and daily result", () => {
    const database = createTestDatabase();

    const result = getExperimentDay({
      experimentId: "experiment-1",
      dayNumber: 1,
      experimentDayRepository: createExperimentDayRepository(database),
      scoringDefinitionRepository: createScoringDefinitionRepository(database),
      protocolObservationRepository:
        createProtocolObservationRepository(database),
    });

    expect(result.experimentDay).toEqual({
      id: "day-1",
      experimentId: "experiment-1",
      dayNumber: 1,
      date: "2026-09-07",
    });

    expect(result.scoringDefinition).toEqual({
      version: "v1",
      effectiveFromDay: 1,
      effectiveToDay: 46,
      requiredCompletedCount: 13,
      expectedCount: 13,
    });

    expect(result.observations).toEqual([
      "completed",
      "not_completed",
    ]);

    expect(result.dailyResult).toEqual({
      dayNumber: 1,
      scoringDefinitionVersion: "v1",
      completedCount: 1,
      expectedCount: 13,
      successful: false,
    });

    database.close();
  });

  it("does not invent observations when none are recorded", () => {
    const database = createTestDatabase();

    database.prepare(`
      DELETE FROM protocol_observation
    `).run();

    const result = getExperimentDay({
      experimentId: "experiment-1",
      dayNumber: 1,
      experimentDayRepository: createExperimentDayRepository(database),
      scoringDefinitionRepository: createScoringDefinitionRepository(database),
      protocolObservationRepository:
        createProtocolObservationRepository(database),
    });

    expect(result.observations).toEqual([]);
    expect(result.dailyResult.completedCount).toBe(0);

    database.close();
  });

  it("uses the scoring definition resolved for the requested day", () => {
    const database = createTestDatabase();

    database
      .prepare(`
        INSERT INTO experiment_day (
          id,
          experiment_id,
          day_number,
          date
        )
        VALUES (?, ?, ?, ?)
      `)
      .run("day-47", "experiment-1", 47, "2026-10-23");

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
      .run("scoring-v3", "experiment-1", "v3", 47, 108, 8, 13);

    const result = getExperimentDay({
      experimentId: "experiment-1",
      dayNumber: 47,
      experimentDayRepository: createExperimentDayRepository(database),
      scoringDefinitionRepository: createScoringDefinitionRepository(database),
      protocolObservationRepository:
        createProtocolObservationRepository(database),
    });

    expect(result.scoringDefinition.version).toBe("v3");
    expect(result.dailyResult.scoringDefinitionVersion).toBe("v3");

    database.close();
  });
});
