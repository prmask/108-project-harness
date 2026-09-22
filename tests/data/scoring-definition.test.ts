import { describe, expect, it } from 'vitest';
import { createTestDatabase } from './test-database.js';

describe('scoring definition database contract', () => {
  it('stores the v1 scoring definition for Days 1–46', () => {
    const database = createTestDatabase();

    database.exec(`
      CREATE TABLE scoring_definition (
        id TEXT PRIMARY KEY,
        experiment_id TEXT NOT NULL,
        version TEXT NOT NULL,
        effective_from_day INTEGER NOT NULL,
        effective_to_day INTEGER NOT NULL,
        required_completed_count INTEGER NOT NULL,
        expected_count INTEGER NOT NULL,
        UNIQUE (experiment_id, version)
      );
    `);

    database
      .prepare(
        `
        INSERT INTO experiment (id)
        VALUES (?)
      `,
      )
      .run('experiment-1');

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
      .run('scoring-v1', 'experiment-1', 'v1', 1, 46, 13, 13);

    const result = database
      .prepare(
        `
        SELECT
          version,
          effective_from_day,
          effective_to_day,
          required_completed_count,
          expected_count
        FROM scoring_definition
        WHERE experiment_id = ?
          AND effective_from_day <= ?
          AND effective_to_day >= ?
      `,
      )
      .get('experiment-1', 46, 46);

    expect(result).toEqual({
      version: 'v1',
      effective_from_day: 1,
      effective_to_day: 46,
      required_completed_count: 13,
      expected_count: 13,
    });

    database.close();
  });

  it('stores the v3 scoring definition for Days 47–108', () => {
    const database = createTestDatabase();

    database.exec(`
      CREATE TABLE scoring_definition (
        id TEXT PRIMARY KEY,
        experiment_id TEXT NOT NULL,
        version TEXT NOT NULL,
        effective_from_day INTEGER NOT NULL,
        effective_to_day INTEGER NOT NULL,
        required_completed_count INTEGER NOT NULL,
        expected_count INTEGER NOT NULL
      );
    `);

    database
      .prepare(
        `
        INSERT INTO experiment (id)
        VALUES (?)
      `,
      )
      .run('experiment-1');

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
      .run('scoring-v3', 'experiment-1', 'v3', 47, 108, 8, 13);

    const result = database
      .prepare(
        `
        SELECT version
        FROM scoring_definition
        WHERE experiment_id = ?
          AND effective_from_day <= ?
          AND effective_to_day >= ?
      `,
      )
      .get('experiment-1', 47, 47);

    expect(result).toEqual({
      version: 'v3',
    });

    database.close();
  });

  it('does not resolve a definition outside its effective day range', () => {
    const database = createTestDatabase();

    database.exec(`
      CREATE TABLE scoring_definition (
        id TEXT PRIMARY KEY,
        experiment_id TEXT NOT NULL,
        version TEXT NOT NULL,
        effective_from_day INTEGER NOT NULL,
        effective_to_day INTEGER NOT NULL,
        required_completed_count INTEGER NOT NULL,
        expected_count INTEGER NOT NULL
      );
    `);

    database
      .prepare(
        `
        INSERT INTO experiment (id)
        VALUES (?)
      `,
      )
      .run('experiment-1');

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
      .run('scoring-v1', 'experiment-1', 'v1', 1, 46, 13, 13);

    const result = database
      .prepare(
        `
        SELECT version
        FROM scoring_definition
        WHERE experiment_id = ?
          AND effective_from_day <= ?
          AND effective_to_day >= ?
      `,
      )
      .get('experiment-1', 47, 47);

    expect(result).toBeUndefined();

    database.close();
  });

  it("does not resolve another experiment's scoring definition", () => {
    const database = createTestDatabase();

    database.exec(`
    CREATE TABLE scoring_definition (
      id TEXT PRIMARY KEY,
      experiment_id TEXT NOT NULL,
      version TEXT NOT NULL,
      effective_from_day INTEGER NOT NULL,
      effective_to_day INTEGER NOT NULL,
      required_completed_count INTEGER NOT NULL,
      expected_count INTEGER NOT NULL
    );
  `);

    database
      .prepare(
        `
      INSERT INTO experiment (id)
      VALUES (?), (?)
    `,
      )
      .run('experiment-1', 'experiment-2');

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
      .run('scoring-v1', 'experiment-2', 'v1', 1, 46, 13, 13);

    const result = database
      .prepare(
        `
      SELECT version
      FROM scoring_definition
      WHERE experiment_id = ?
        AND effective_from_day <= ?
        AND effective_to_day >= ?
    `,
      )
      .get('experiment-1', 1, 1);

    expect(result).toBeUndefined();

    database.close();
  });
});
