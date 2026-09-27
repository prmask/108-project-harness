import Database from 'better-sqlite3';
import { describe, expect, it } from 'vitest';
import { loadExperimentDay } from '../../src/application/load-experiment-day.js';

function createDatabase(): Database.Database {
  const database = new Database(':memory:');

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
      expected_count INTEGER NOT NULL,
      FOREIGN KEY (experiment_id) REFERENCES experiment(id)
    );

    CREATE TABLE protocol_observation (
      id TEXT PRIMARY KEY,
      experiment_day_id TEXT NOT NULL,
      protocol_item_id TEXT NOT NULL,
      status TEXT NOT NULL,
      observed_at TEXT NOT NULL,
      FOREIGN KEY (experiment_day_id) REFERENCES experiment_day(id)
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

    CREATE TABLE health_waist_observation (
      id TEXT PRIMARY KEY NOT NULL,
      experiment_day_id TEXT NOT NULL,
      value_cm REAL NOT NULL,
      observed_at TEXT NOT NULL,
      FOREIGN KEY (experiment_day_id) REFERENCES experiment_day(id)
    );

    CREATE TABLE health_running_distance_observation (
      id TEXT PRIMARY KEY NOT NULL,
      experiment_day_id TEXT NOT NULL,
      distance_km REAL NOT NULL,
      observed_at TEXT NOT NULL,
      FOREIGN KEY (experiment_day_id) REFERENCES experiment_day(id)
    );

    CREATE TABLE health_running_duration_observation (
      id TEXT PRIMARY KEY NOT NULL,
      experiment_day_id TEXT NOT NULL,
      duration_minutes REAL NOT NULL,
      observed_at TEXT NOT NULL,
      FOREIGN KEY (experiment_day_id) REFERENCES experiment_day(id)
    );

    CREATE TABLE wealth_revenue_observation (
      id TEXT PRIMARY KEY,
      experiment_day_id TEXT NOT NULL,
      amount REAL NOT NULL,
      observed_at TEXT NOT NULL,
      FOREIGN KEY (experiment_day_id) REFERENCES experiment_day(id)
    );

    CREATE TABLE health_weight_observation (
      id TEXT PRIMARY KEY,
      experiment_day_id TEXT NOT NULL,
      value_kg REAL NOT NULL,
      observed_at TEXT NOT NULL,
      FOREIGN KEY (experiment_day_id) REFERENCES experiment_day(id)
    );
  `);

  return database;
}

describe('load experiment day', () => {
  it('returns unavailable when the requested experiment day does not exist', () => {
    const database = createDatabase();

    expect(loadExperimentDay(database, '108-day-experiment', 17)).toEqual({
      status: 'unavailable',
      reason:
        'No experiment day found for experiment 108-day-experiment on day 17',
    });

    database.close();
  });

  it('loads a recorded experiment day and calculates its result', () => {
    const database = createDatabase();

    database
      .prepare('INSERT INTO experiment (id) VALUES (?)')
      .run('108-day-experiment');

    database
      .prepare(
        `
        INSERT INTO experiment_day (
          id,
          experiment_id,
          day_number,
          date
        )
        VALUES (?, ?, ?, ?)
      `,
      )
      .run('day-1', '108-day-experiment', 1, '2026-09-07');

    database
      .prepare(
        `
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
      `,
      )
      .run('scoring-v1', '108-day-experiment', 'v1', 1, 46, 13, 13);

    database
      .prepare(
        `
        INSERT INTO protocol_observation (
          id,
          experiment_day_id,
          protocol_item_id,
          status,
          observed_at
        )
        VALUES (?, ?, ?, ?, ?)
      `,
      )
      .run(
        'observation-1',
        'day-1',
        'wake-0350',
        'completed',
        '2026-09-07T03:50:00Z',
      );

    database
      .prepare(
        `
        INSERT INTO protocol_observation (
          id,
          experiment_day_id,
          protocol_item_id,
          status,
          observed_at
        )
        VALUES (?, ?, ?, ?, ?)
      `,
      )
      .run(
        'observation-2',
        'day-1',
        'run-0520',
        'not_completed',
        '2026-09-07T05:20:00Z',
      );

    const loaded = loadExperimentDay(database, '108-day-experiment', 1);

    expect(loaded).toEqual({
      status: 'available',
      result: {
        experimentDay: {
          id: 'day-1',
          experimentId: '108-day-experiment',
          dayNumber: 1,
          date: '2026-09-07',
        },
        scoringDefinition: {
          version: 'v1',
          effectiveFromDay: 1,
          effectiveToDay: 46,
          requiredCompletedCount: 13,
          expectedCount: 13,
        },
        observations: ['completed', 'not_completed'],
        healthWeightObservations: [],
        healthWaistObservations: [],
        healthRunningDistanceObservations: [],
        healthRunningDurationObservations: [],
        threeSixNineSessions: [],
        wealthRevenueObservations: [],
        dailyResult: {
          dayNumber: 1,
          scoringDefinitionVersion: 'v1',
          completedCount: 1,
          expectedCount: 13,
          successful: false,
        },
      },
    });

    database.close();
  });
});
