import { describe, expect, it } from "vitest";
import { createTestDatabase } from "./test-database.js";

describe("protocol definition database contract", () => {
  it("stores a protocol version with its effective day range", () => {
    const database = createTestDatabase();

    database.exec(`
      INSERT INTO experiment (id)
      VALUES ('experiment-1');
    `);

    database.exec(`
      CREATE TABLE protocol_definition (
        id TEXT PRIMARY KEY,
        experiment_id TEXT NOT NULL,
        version TEXT NOT NULL,
        effective_from_day INTEGER NOT NULL,
        effective_to_day INTEGER NOT NULL,
        FOREIGN KEY (experiment_id) REFERENCES experiment(id),
        UNIQUE (experiment_id, version)
      );
    `);

    database
      .prepare(`
        INSERT INTO protocol_definition (
          id,
          experiment_id,
          version,
          effective_from_day,
          effective_to_day
        )
        VALUES (?, ?, ?, ?, ?)
      `)
      .run(
        "protocol-v1",
        "experiment-1",
        "v1",
        1,
        108,
      );

    const definition = database
      .prepare(`
        SELECT experiment_id, version, effective_from_day, effective_to_day
        FROM protocol_definition
        WHERE id = ?
      `)
      .get("protocol-v1") as {
        experiment_id: string;
        version: string;
        effective_from_day: number;
        effective_to_day: number;
      };

    expect(definition).toEqual({
      experiment_id: "experiment-1",
      version: "v1",
      effective_from_day: 1,
      effective_to_day: 108,
    });

    database.close();
  });

  it("requires protocol versions to be unique within an experiment", () => {
    const database = createTestDatabase();

    database.exec(`
      INSERT INTO experiment (id)
      VALUES ('experiment-1');

      CREATE TABLE protocol_definition (
        id TEXT PRIMARY KEY,
        experiment_id TEXT NOT NULL,
        version TEXT NOT NULL,
        effective_from_day INTEGER NOT NULL,
        effective_to_day INTEGER NOT NULL,
        FOREIGN KEY (experiment_id) REFERENCES experiment(id),
        UNIQUE (experiment_id, version)
      );
    `);

    database
      .prepare(`
        INSERT INTO protocol_definition (
          id,
          experiment_id,
          version,
          effective_from_day,
          effective_to_day
        )
        VALUES (?, ?, ?, ?, ?)
      `)
      .run(
        "protocol-v1",
        "experiment-1",
        "v1",
        1,
        108,
      );

    expect(() => {
      database
        .prepare(`
          INSERT INTO protocol_definition (
            id,
            experiment_id,
            version,
            effective_from_day,
            effective_to_day
          )
          VALUES (?, ?, ?, ?, ?)
        `)
        .run(
          "protocol-v1-duplicate",
          "experiment-1",
          "v1",
          1,
          108,
        );
    }).toThrow();

    database.close();
  });
});
