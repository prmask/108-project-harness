import Database from "better-sqlite3";
import { describe, expect, it } from "vitest";
import {
  createProtocolObservationRepository,
} from "../../src/data/protocol-observation-repository.js";

function createDatabase(): Database.Database {
  const database = new Database(":memory:");

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

  database.exec(`
    INSERT INTO protocol_observation (
      id,
      experiment_day_id,
      protocol_item_id,
      status,
      observed_at
    )
    VALUES
      (
        'observation-1',
        'day-1',
        'wake-0350',
        'completed',
        '2026-09-07T03:50:00Z'
      ),
      (
        'observation-2',
        'day-1',
        'run-0520',
        'not_completed',
        '2026-09-07T05:20:00Z'
      ),
      (
        'observation-3',
        'day-1',
        'sleep-2200',
        'missing',
        '2026-09-07T22:00:00Z'
      ),
      (
        'observation-4',
        'day-2',
        'wake-0350',
        'completed',
        '2026-09-08T03:50:00Z'
      );
  `);

  return database;
}

describe("protocol observation repository", () => {
  it("returns observations for the requested experiment day", () => {
    const database = createDatabase();
    const repository = createProtocolObservationRepository(database);

    expect(repository.listForDay("day-1")).toEqual([
      {
        id: "observation-1",
        protocolItemId: "wake-0350",
        status: "completed",
        observedAt: "2026-09-07T03:50:00Z",
      },
      {
        id: "observation-2",
        protocolItemId: "run-0520",
        status: "not_completed",
        observedAt: "2026-09-07T05:20:00Z",
      },
      {
        id: "observation-3",
        protocolItemId: "sleep-2200",
        status: "missing",
        observedAt: "2026-09-07T22:00:00Z",
      },
    ]);

    database.close();
  });

  it("preserves observation statuses", () => {
    const database = createDatabase();
    const repository = createProtocolObservationRepository(database);

    const observations = repository.listForDay("day-1");

    expect(observations.map((observation) => observation.status)).toEqual([
      "completed",
      "not_completed",
      "missing",
    ]);

    database.close();
  });

  it("returns an empty array when the day has no observations", () => {
    const database = createDatabase();
    const repository = createProtocolObservationRepository(database);

    expect(repository.listForDay("day-with-no-observations")).toEqual([]);

    database.close();
  });

  it("does not return observations belonging to another day", () => {
    const database = createDatabase();
    const repository = createProtocolObservationRepository(database);

    expect(repository.listForDay("day-2")).toEqual([
      {
        id: "observation-4",
        protocolItemId: "wake-0350",
        status: "completed",
        observedAt: "2026-09-08T03:50:00Z",
      },
    ]);

    database.close();
  });
});
