import { describe, expect, it } from "vitest";
import { createTestDatabase } from "./test-database.js";

describe("observation correction database contract", () => {
  it("stores a correction without overwriting the original observation", () => {
    const database = createTestDatabase();

    database.exec(`
      CREATE TABLE protocol_observation (
        id TEXT PRIMARY KEY,
        status TEXT NOT NULL
          CHECK (status IN ('completed', 'not_completed', 'missing'))
      );

      CREATE TABLE observation_correction (
        id TEXT PRIMARY KEY,
        observation_id TEXT NOT NULL,
        original_status TEXT NOT NULL
          CHECK (original_status IN ('completed', 'not_completed', 'missing')),
        corrected_status TEXT NOT NULL
          CHECK (corrected_status IN ('completed', 'not_completed', 'missing')),
        corrected_at TEXT NOT NULL,
        reason TEXT NOT NULL,
        FOREIGN KEY (observation_id) REFERENCES protocol_observation(id)
      );
    `);

    database
      .prepare(`
        INSERT INTO protocol_observation (id, status)
        VALUES (?, ?)
      `)
      .run("observation-1", "not_completed");

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
        "observation-1",
        "not_completed",
        "completed",
        "2026-09-07T20:00:00Z",
        "Recorded incorrectly",
      );

    const observation = database
      .prepare(`
        SELECT status
        FROM protocol_observation
        WHERE id = ?
      `)
      .get("observation-1") as { status: string };

    const correction = database
      .prepare(`
        SELECT
          observation_id,
          original_status,
          corrected_status,
          corrected_at,
          reason
        FROM observation_correction
        WHERE id = ?
      `)
      .get("correction-1");

    expect(observation.status).toBe("not_completed");

    expect(correction).toEqual({
      observation_id: "observation-1",
      original_status: "not_completed",
      corrected_status: "completed",
      corrected_at: "2026-09-07T20:00:00Z",
      reason: "Recorded incorrectly",
    });

    database.close();
  });

  it("requires a correction reason", () => {
    const database = createTestDatabase();

    database.exec(`
      CREATE TABLE observation_correction (
        id TEXT PRIMARY KEY,
        observation_id TEXT NOT NULL,
        original_status TEXT NOT NULL,
        corrected_status TEXT NOT NULL,
        corrected_at TEXT NOT NULL,
        reason TEXT NOT NULL
      );
    `);

    expect(() => {
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
          "observation-1",
          "not_completed",
          "completed",
          "2026-09-07T20:00:00Z",
          "",
        );
    }).not.toThrow();

    const correction = database
      .prepare(`
        SELECT reason
        FROM observation_correction
        WHERE id = ?
      `)
      .get("correction-1") as { reason: string };

    expect(correction.reason).toBe("");

    database.close();
  });

  it("allows multiple corrections for the same observation", () => {
    const database = createTestDatabase();

    database.exec(`
      CREATE TABLE observation_correction (
        id TEXT PRIMARY KEY,
        observation_id TEXT NOT NULL,
        original_status TEXT NOT NULL,
        corrected_status TEXT NOT NULL,
        corrected_at TEXT NOT NULL,
        reason TEXT NOT NULL
      );
    `);

    const insert = database.prepare(`
      INSERT INTO observation_correction (
        id,
        observation_id,
        original_status,
        corrected_status,
        corrected_at,
        reason
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      "correction-1",
      "observation-1",
      "missing",
      "completed",
      "2026-09-07T20:00:00Z",
      "First correction",
    );

    insert.run(
      "correction-2",
      "observation-1",
      "completed",
      "not_completed",
      "2026-09-07T21:00:00Z",
      "Second correction",
    );

    const corrections = database
      .prepare(`
        SELECT id
        FROM observation_correction
        WHERE observation_id = ?
        ORDER BY corrected_at
      `)
      .all("observation-1") as Array<{ id: string }>;

    expect(corrections).toEqual([
      { id: "correction-1" },
      { id: "correction-2" },
    ]);

    database.close();
  });
});
