import { describe, expect, it } from "vitest";
import { createTestDatabase } from "./test-database.js";

describe("protocol observation database contract", () => {
  it("stores a completed observation with its day and protocol item", () => {
    const database = createTestDatabase();

    database.exec(`
      INSERT INTO experiment (id)
      VALUES ('experiment-1');

      CREATE TABLE protocol_item (
        id TEXT PRIMARY KEY
      );

      CREATE TABLE protocol_observation (
        id TEXT PRIMARY KEY,
        experiment_day_id TEXT NOT NULL,
        protocol_item_id TEXT NOT NULL,
        status TEXT NOT NULL
          CHECK (status IN ('completed', 'not_completed', 'missing')),
        observed_at TEXT NOT NULL,
        FOREIGN KEY (experiment_day_id) REFERENCES experiment_day(id),
        FOREIGN KEY (protocol_item_id) REFERENCES protocol_item(id),
        UNIQUE (experiment_day_id, protocol_item_id)
      );
    `);

    database.exec(`
      INSERT INTO experiment_day (
        id,
        experiment_id,
        day_number,
        date
      )
      VALUES (
        'day-1',
        'experiment-1',
        1,
        '2026-09-07'
      );

      INSERT INTO protocol_item (id)
      VALUES ('wake-0350');
    `);

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

    const observation = database
      .prepare(`
        SELECT
          experiment_day_id,
          protocol_item_id,
          status,
          observed_at
        FROM protocol_observation
        WHERE id = ?
      `)
      .get("observation-1");

    expect(observation).toEqual({
      experiment_day_id: "day-1",
      protocol_item_id: "wake-0350",
      status: "completed",
      observed_at: "2026-09-07T03:50:00Z",
    });

    database.close();
  });

  it("allows missing as a distinct observation status", () => {
    const database = createTestDatabase();

    database.exec(`
      CREATE TABLE protocol_observation (
        id TEXT PRIMARY KEY,
        status TEXT NOT NULL
          CHECK (status IN ('completed', 'not_completed', 'missing'))
      );
    `);

    database
      .prepare(`
        INSERT INTO protocol_observation (id, status)
        VALUES (?, ?)
      `)
      .run("observation-1", "missing");

    const observation = database
      .prepare(`
        SELECT status
        FROM protocol_observation
        WHERE id = ?
      `)
      .get("observation-1") as { status: string };

    expect(observation.status).toBe("missing");

    database.close();
  });

  it("rejects statuses outside the defined observation values", () => {
    const database = createTestDatabase();

    database.exec(`
      CREATE TABLE protocol_observation (
        id TEXT PRIMARY KEY,
        status TEXT NOT NULL
          CHECK (status IN ('completed', 'not_completed', 'missing'))
      );
    `);

    expect(() => {
      database
        .prepare(`
          INSERT INTO protocol_observation (id, status)
          VALUES (?, ?)
        `)
        .run("observation-1", "unknown");
    }).toThrow();

    database.close();
  });

  it("allows only one original observation per day and protocol item", () => {
    const database = createTestDatabase();

    database.exec(`
      CREATE TABLE protocol_observation (
        id TEXT PRIMARY KEY,
        experiment_day_id TEXT NOT NULL,
        protocol_item_id TEXT NOT NULL,
        status TEXT NOT NULL
          CHECK (status IN ('completed', 'not_completed', 'missing')),
        observed_at TEXT NOT NULL,
        UNIQUE (experiment_day_id, protocol_item_id)
      );
    `);

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

    expect(() => {
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
          "wake-0350",
          "not_completed",
          "2026-09-07T04:00:00Z",
        );
    }).toThrow();

    database.close();
  });
});
