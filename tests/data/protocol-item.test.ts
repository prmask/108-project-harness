import { describe, expect, it } from "vitest";
import { createTestDatabase } from "./test-database.js";

describe("protocol item database contract", () => {
  it("stores a protocol item belonging to a protocol definition", () => {
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

      CREATE TABLE protocol_item (
        id TEXT PRIMARY KEY,
        protocol_definition_id TEXT NOT NULL,
        item_order INTEGER NOT NULL,
        description TEXT NOT NULL,
        required INTEGER NOT NULL,
        FOREIGN KEY (protocol_definition_id) REFERENCES protocol_definition(id),
        UNIQUE (protocol_definition_id, id),
        UNIQUE (protocol_definition_id, item_order)
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
      .run("protocol-v1", "experiment-1", "v1", 1, 108);

    database
      .prepare(`
        INSERT INTO protocol_item (
          id,
          protocol_definition_id,
          item_order,
          description,
          required
        )
        VALUES (?, ?, ?, ?, ?)
      `)
      .run(
        "wake-0350",
        "protocol-v1",
        1,
        "03:50 Wake",
        1,
      );

    const item = database
      .prepare(`
        SELECT
          id,
          protocol_definition_id,
          item_order,
          description,
          required
        FROM protocol_item
        WHERE id = ?
      `)
      .get("wake-0350");

    expect(item).toEqual({
      id: "wake-0350",
      protocol_definition_id: "protocol-v1",
      item_order: 1,
      description: "03:50 Wake",
      required: 1,
    });

    database.close();
  });

  it("requires protocol item order to be unique within a protocol definition", () => {
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

      CREATE TABLE protocol_item (
        id TEXT PRIMARY KEY,
        protocol_definition_id TEXT NOT NULL,
        item_order INTEGER NOT NULL,
        description TEXT NOT NULL,
        required INTEGER NOT NULL,
        FOREIGN KEY (protocol_definition_id) REFERENCES protocol_definition(id),
        UNIQUE (protocol_definition_id, item_order)
      );
    `);

    database
      .prepare(`
        INSERT INTO protocol_definition
        VALUES (?, ?, ?, ?, ?)
      `)
      .run("protocol-v1", "experiment-1", "v1", 1, 108);

    database
      .prepare(`
        INSERT INTO protocol_item
        VALUES (?, ?, ?, ?, ?)
      `)
      .run("wake-0350", "protocol-v1", 1, "03:50 Wake", 1);

    expect(() => {
      database
        .prepare(`
          INSERT INTO protocol_item
          VALUES (?, ?, ?, ?, ?)
        `)
        .run(
          "prayer-0405",
          "protocol-v1",
          1,
          "04:05 Light lamp + prayer",
          1,
        );
    }).toThrow();

    database.close();
  });
});
