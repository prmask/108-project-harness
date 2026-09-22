import { describe, expect, it } from "vitest";
import { createTestDatabase } from "./test-database.js";

describe("experiment day database contract", () => {
  it("requires an experiment day number and date", () => {
    const database = createTestDatabase();

    database.exec(`
      INSERT INTO experiment (id)
      VALUES ('experiment-1');

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
    `);

    const day = database
      .prepare(`
        SELECT experiment_id, day_number, date
        FROM experiment_day
        WHERE id = ?
      `)
      .get("day-1") as {
        experiment_id: string;
        day_number: number;
        date: string;
      };

    expect(day).toEqual({
      experiment_id: "experiment-1",
      day_number: 1,
      date: "2026-09-07",
    });

    database.close();
  });

  it("requires day numbers to be unique within an experiment", () => {
    const database = createTestDatabase();

    database.exec(`
      INSERT INTO experiment (id)
      VALUES ('experiment-1');

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
    `);

    expect(() => {
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
        .run(
          "day-2",
          "experiment-1",
          1,
          "2026-09-08",
        );
    }).toThrow();

    database.close();
  });

  it("requires dates to be unique within an experiment", () => {
    const database = createTestDatabase();

    database.exec(`
      INSERT INTO experiment (id)
      VALUES ('experiment-1');

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
    `);

    expect(() => {
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
        .run(
          "day-2",
          "experiment-1",
          2,
          "2026-09-07",
        );
    }).toThrow();

    database.close();
  });
});
