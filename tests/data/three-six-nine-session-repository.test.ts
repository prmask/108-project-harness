import Database from "better-sqlite3";
import { describe, expect, it } from "vitest";
import {
  createThreeSixNineSessionRepository,
} from "../../src/data/three-six-nine-session-repository.js";

function createDatabase(): Database.Database {
  const database = new Database(":memory:");

  database.exec(`
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

  database.exec(`
    INSERT INTO three_six_nine_session (
      id,
      experiment_day_id,
      period,
      planned_repetitions,
      completed_repetitions,
      status,
      completed_at
    )
    VALUES
      (
        'session-evening',
        'day-1',
        'evening',
        9,
        9,
        'completed',
        '2026-09-07T20:00:00Z'
      ),
      (
        'session-morning',
        'day-1',
        'morning',
        3,
        3,
        'completed',
        '2026-09-07T06:00:00Z'
      ),
      (
        'session-afternoon',
        'day-1',
        'afternoon',
        6,
        0,
        'not_completed',
        NULL
      ),
      (
        'session-other-day',
        'day-2',
        'morning',
        3,
        3,
        'completed',
        '2026-09-08T06:00:00Z'
      );
  `);

  return database;
}

describe("3-6-9 session repository", () => {
  it("returns sessions for the requested experiment day in 3-6-9 order", () => {
    const database = createDatabase();
    const repository = createThreeSixNineSessionRepository(database);

    expect(repository.listForDay("day-1")).toEqual([
      {
        id: "session-morning",
        experimentDayId: "day-1",
        period: "morning",
        plannedRepetitions: 3,
        completedRepetitions: 3,
        status: "completed",
        completedAt: "2026-09-07T06:00:00Z",
      },
      {
        id: "session-afternoon",
        experimentDayId: "day-1",
        period: "afternoon",
        plannedRepetitions: 6,
        completedRepetitions: 0,
        status: "not_completed",
        completedAt: null,
      },
      {
        id: "session-evening",
        experimentDayId: "day-1",
        period: "evening",
        plannedRepetitions: 9,
        completedRepetitions: 9,
        status: "completed",
        completedAt: "2026-09-07T20:00:00Z",
      },
    ]);

    database.close();
  });

  it("returns an empty array when the day has no sessions", () => {
    const database = createDatabase();
    const repository = createThreeSixNineSessionRepository(database);

    expect(repository.listForDay("day-with-no-sessions")).toEqual([]);

    database.close();
  });

  it("does not return sessions belonging to another day", () => {
    const database = createDatabase();
    const repository = createThreeSixNineSessionRepository(database);

    expect(repository.listForDay("day-2")).toEqual([
      {
        id: "session-other-day",
        experimentDayId: "day-2",
        period: "morning",
        plannedRepetitions: 3,
        completedRepetitions: 3,
        status: "completed",
        completedAt: "2026-09-08T06:00:00Z",
      },
    ]);

    database.close();
  });
});
