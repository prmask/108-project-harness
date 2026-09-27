import Database from 'better-sqlite3';
import { describe, expect, it } from 'vitest';
import {
  createEvidenceObservationRepository,
} from '../../src/data/evidence-observation-repository.js';

function createTestDatabase() {
  const database = new Database(':memory:');

  database.exec(`
    CREATE TABLE experiment_day (
      id TEXT PRIMARY KEY
    );

    CREATE TABLE evidence_observation (
      id TEXT PRIMARY KEY,
      experiment_day_id TEXT NOT NULL,
      hypothesis_id TEXT NOT NULL,
      category TEXT NOT NULL,
      observation TEXT NOT NULL,
      recorded_at TEXT NOT NULL,
      FOREIGN KEY (experiment_day_id) REFERENCES experiment_day(id)
    );
  `);

  database.prepare('INSERT INTO experiment_day (id) VALUES (?)').run('day-1');
  database.prepare('INSERT INTO experiment_day (id) VALUES (?)').run('day-2');

  return database;
}

describe('evidence observation repository', () => {
  it('returns evidence for the requested day', () => {
    const database = createTestDatabase();

    database
      .prepare(`
        INSERT INTO evidence_observation
          (id, experiment_day_id, hypothesis_id, category, observation, recorded_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .run(
        'evidence-1',
        'day-1',
        'H1',
        'supporting',
        'Revenue increased after sustained protocol execution.',
        '2026-09-27T10:00:00Z',
      );

    const repository = createEvidenceObservationRepository(database);

    expect(repository.listForDay('day-1')).toEqual([
      {
        id: 'evidence-1',
        experimentDayId: 'day-1',
        hypothesisId: 'H1',
        category: 'supporting',
        observation: 'Revenue increased after sustained protocol execution.',
        recordedAt: '2026-09-27T10:00:00Z',
      },
    ]);
  });

  it('preserves supporting, challenging, and alternative-explanation categories', () => {
    const database = createTestDatabase();

    const insert = database.prepare(`
      INSERT INTO evidence_observation
        (id, experiment_day_id, hypothesis_id, category, observation, recorded_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insert.run('e1', 'day-1', 'H1', 'supporting', 'Supporting observation', '2026-09-27T10:00:00Z');
    insert.run('e2', 'day-1', 'H1', 'challenging', 'Challenging observation', '2026-09-27T11:00:00Z');
    insert.run('e3', 'day-1', 'H1', 'alternative_explanation', 'Alternative explanation', '2026-09-27T12:00:00Z');

    const repository = createEvidenceObservationRepository(database);

    expect(repository.listForDay('day-1').map((item) => item.category)).toEqual([
      'supporting',
      'challenging',
      'alternative_explanation',
    ]);
  });

  it('returns an empty list when no evidence exists', () => {
    const database = createTestDatabase();

    expect(createEvidenceObservationRepository(database).listForDay('day-1')).toEqual([]);
  });

  it('excludes evidence from another day', () => {
    const database = createTestDatabase();

    database
      .prepare(`
        INSERT INTO evidence_observation
          (id, experiment_day_id, hypothesis_id, category, observation, recorded_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .run('evidence-2', 'day-2', 'H2', 'challenging', 'Other day', '2026-09-27T10:00:00Z');

    expect(createEvidenceObservationRepository(database).listForDay('day-1')).toEqual([]);
  });
});
