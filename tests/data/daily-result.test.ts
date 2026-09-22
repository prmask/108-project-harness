import { describe, expect, it } from "vitest";
import { createTestDatabase } from "./test-database.js";

describe("daily result database contract", () => {
  it("stores a daily result with the scoring definition used", () => {
    const database = createTestDatabase();

    database.exec(`
      CREATE TABLE daily_result (
        id TEXT PRIMARY KEY,
        experiment_day_id TEXT NOT NULL,
        scoring_definition_version TEXT NOT NULL,
        completed_count INTEGER NOT NULL,
        expected_count INTEGER NOT NULL,
        successful INTEGER NOT NULL,
        FOREIGN KEY (experiment_day_id) REFERENCES experiment_day(id),
        UNIQUE (experiment_day_id)
      );
    `);

    database
      .prepare(`
        INSERT INTO experiment (id)
        VALUES (?)
      `)
      .run("experiment-1");

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
        INSERT INTO daily_result (
          id,
          experiment_day_id,
          scoring_definition_version,
          completed_count,
          expected_count,
          successful
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .run("result-1", "day-1", "v1", 13, 13, 1);

    const result = database
      .prepare(`
        SELECT
          experiment_day_id,
          scoring_definition_version,
          completed_count,
          expected_count,
          successful
        FROM daily_result
        WHERE id = ?
      `)
      .get("result-1");

    expect(result).toEqual({
      experiment_day_id: "day-1",
      scoring_definition_version: "v1",
      completed_count: 13,
      expected_count: 13,
      successful: 1,
    });

    database.close();
  });

  it("allows a result to preserve the v3 scoring definition", () => {
    const database = createTestDatabase();

    database.exec(`
      CREATE TABLE daily_result (
        id TEXT PRIMARY KEY,
        experiment_day_id TEXT NOT NULL,
        scoring_definition_version TEXT NOT NULL,
        completed_count INTEGER NOT NULL,
        expected_count INTEGER NOT NULL,
        successful INTEGER NOT NULL
      );
    `);

    database
      .prepare(`
        INSERT INTO daily_result (
          id,
          experiment_day_id,
          scoring_definition_version,
          completed_count,
          expected_count,
          successful
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .run("result-47", "day-47", "v3", 8, 13, 1);

    const result = database
      .prepare(`
        SELECT scoring_definition_version
        FROM daily_result
        WHERE id = ?
      `)
      .get("result-47") as {
        scoring_definition_version: string;
      };

    expect(result.scoring_definition_version).toBe("v3");

    database.close();
  });

  it("allows only one current daily result per experiment day", () => {
    const database = createTestDatabase();

    database.exec(`
      CREATE TABLE daily_result (
        id TEXT PRIMARY KEY,
        experiment_day_id TEXT NOT NULL,
        scoring_definition_version TEXT NOT NULL,
        completed_count INTEGER NOT NULL,
        expected_count INTEGER NOT NULL,
        successful INTEGER NOT NULL,
        UNIQUE (experiment_day_id)
      );
    `);

    database
      .prepare(`
        INSERT INTO daily_result (
          id,
          experiment_day_id,
          scoring_definition_version,
          completed_count,
          expected_count,
          successful
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .run("result-1", "day-1", "v1", 13, 13, 1);

    expect(() => {
      database
        .prepare(`
          INSERT INTO daily_result (
            id,
            experiment_day_id,
            scoring_definition_version,
            completed_count,
            expected_count,
            successful
          )
          VALUES (?, ?, ?, ?, ?, ?)
        `)
        .run("result-2", "day-1", "v1", 12, 13, 0);
    }).toThrow();

    database.close();
  });
});
