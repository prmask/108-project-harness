import Database from "better-sqlite3";
import { describe, expect, it } from "vitest";
import { createExperimentDayRepository } from "../../src/data/experiment-day-repository.js";
import { createProtocolObservationRepository } from "../../src/data/protocol-observation-repository.js";
import { createObservationCorrectionRepository } from "../../src/data/observation-correction-repository.js";
import { createScoringDefinitionRepository } from "../../src/data/scoring-definition-repository.js";
import { getExperimentDay } from "../../src/application/get-experiment-day.js";
import { createThreeSixNineSessionRepository } from "../../src/data/three-six-nine-session-repository.js";

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

    CREATE TABLE observation_correction (
      id TEXT PRIMARY KEY,
      observation_id TEXT NOT NULL,
      original_status TEXT NOT NULL,
      corrected_status TEXT NOT NULL,
      corrected_at TEXT NOT NULL,
      reason TEXT NOT NULL,
      FOREIGN KEY (observation_id) REFERENCES protocol_observation(id)
    );

    CREATE TABLE three_six_nine_session (
      id TEXT PRIMARY KEY,
      experiment_day_id TEXT NOT NULL,
      period TEXT NOT NULL,
      planned_repetitions INTEGER NOT NULL,
      completed_repetitions INTEGER NOT NULL,
      status TEXT NOT NULL,
      completed_at TEXT
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

  database
    .prepare(`
      INSERT INTO three_six_nine_session (
        id,
        experiment_day_id,
        period,
        planned_repetitions,
        completed_repetitions,
        status,
        completed_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      "session-morning",
      "day-1",
      "morning",
      3,
      3,
      "completed",
      "2026-09-07T06:00:00Z",
    );

  database
    .prepare(`
      INSERT INTO three_six_nine_session (
        id,
        experiment_day_id,
        period,
        planned_repetitions,
        completed_repetitions,
        status,
        completed_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      "session-afternoon",
      "day-1",
      "afternoon",
      6,
      4,
      "not_completed",
      null,
    );

  database
    .prepare(`
      INSERT INTO three_six_nine_session (
        id,
        experiment_day_id,
        period,
        planned_repetitions,
        completed_repetitions,
        status,
        completed_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      "session-evening",
      "day-1",
      "evening",
      9,
      0,
      "missing",
      null,
    );

  return database;
}

function createApplicationInput(database: Database.Database, dayNumber = 1) {
  return {
    experimentId: "experiment-1",
    dayNumber,
    experimentDayRepository: createExperimentDayRepository(database),
    scoringDefinitionRepository: createScoringDefinitionRepository(database),
    protocolObservationRepository:
      createProtocolObservationRepository(database),
    observationCorrectionRepository:
      createObservationCorrectionRepository(database),
    threeSixNineSessionRepository:
      createThreeSixNineSessionRepository(database),
  };
}

describe("getExperimentDay", () => {
  it("composes day, scoring definition, observations, and daily result", () => {
    const database = createTestDatabase();

    const result = getExperimentDay(
      createApplicationInput(database),
    );

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

  it("applies a correction without overwriting the original observation", () => {
    const database = createTestDatabase();

    database
      .prepare(`
        INSERT INTO observation_correction (
          id,
          observation_id,
          original_status,
          corrected_status,
          corrected_at,
          reason
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .run(
        "correction-1",
        "observation-2",
        "not_completed",
        "completed",
        "2026-09-07T08:00:00Z",
        "Confirmed after reviewing my record.",
      );

    const result = getExperimentDay(
      createApplicationInput(database),
    );

    expect(result.observations).toEqual([
      "completed",
      "completed",
    ]);

    expect(result.dailyResult.completedCount).toBe(2);

    const original = database
      .prepare(`
        SELECT status
        FROM protocol_observation
        WHERE id = ?
      `)
      .get("observation-2") as { status: string };

    expect(original.status).toBe("not_completed");

    database.close();
  });

  it("uses the latest correction while preserving the complete correction history", () => {
    const database = createTestDatabase();

    database
      .prepare(`
        INSERT INTO observation_correction (
          id,
          observation_id,
          original_status,
          corrected_status,
          corrected_at,
          reason
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .run(
        "correction-1",
        "observation-2",
        "not_completed",
        "completed",
        "2026-09-07T08:00:00Z",
        "First correction after reviewing the record.",
      );

    database
      .prepare(`
        INSERT INTO observation_correction (
          id,
          observation_id,
          original_status,
          corrected_status,
          corrected_at,
          reason
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .run(
        "correction-2",
        "observation-2",
        "completed",
        "not_completed",
        "2026-09-07T09:00:00Z",
        "Second correction after a further review.",
      );

    const result = getExperimentDay(
      createApplicationInput(database),
    );

    expect(result.observations).toEqual([
      "completed",
      "not_completed",
    ]);

    expect(result.dailyResult.completedCount).toBe(1);

    const original = database
      .prepare(`
        SELECT status
        FROM protocol_observation
        WHERE id = ?
      `)
      .get("observation-2") as { status: string };

    expect(original.status).toBe("not_completed");

    const corrections = database
      .prepare(`
        SELECT
          id,
          original_status,
          corrected_status,
          corrected_at,
          reason
        FROM observation_correction
        WHERE observation_id = ?
        ORDER BY corrected_at ASC, id ASC
      `)
      .all("observation-2") as Array<{
        id: string;
        original_status: string;
        corrected_status: string;
        corrected_at: string;
        reason: string;
      }>;

    expect(corrections).toEqual([
      {
        id: "correction-1",
        original_status: "not_completed",
        corrected_status: "completed",
        corrected_at: "2026-09-07T08:00:00Z",
        reason: "First correction after reviewing the record.",
      },
      {
        id: "correction-2",
        original_status: "completed",
        corrected_status: "not_completed",
        corrected_at: "2026-09-07T09:00:00Z",
        reason: "Second correction after a further review.",
      },
    ]);

    database.close();
  });

  it("does not invent observations when none are recorded", () => {
    const database = createTestDatabase();

    database.prepare(`
      DELETE FROM protocol_observation
    `).run();

    const result = getExperimentDay(
      createApplicationInput(database),
    );

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

    const result = getExperimentDay(
      createApplicationInput(database, 47),
    );

    expect(result.scoringDefinition.version).toBe("v3");
    expect(result.dailyResult.scoringDefinitionVersion).toBe("v3");

    database.close();
  });
});
