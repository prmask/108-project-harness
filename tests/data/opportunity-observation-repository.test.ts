import Database from 'better-sqlite3';
import { describe, expect, it } from 'vitest';
import {
  createOpportunityObservationRepository,
} from '../../src/data/opportunity-observation-repository.js';

function createDatabase() {
  const database = new Database(':memory:');

  database.exec(`
    CREATE TABLE experiment_day (
      id TEXT PRIMARY KEY
    );

    CREATE TABLE opportunity_observation (
      id TEXT PRIMARY KEY,
      experiment_day_id TEXT NOT NULL,
      what_happened TEXT NOT NULL,
      source TEXT NOT NULL,
      is_unexpected INTEGER NOT NULL,
      goal_related INTEGER NOT NULL,
      action_taken TEXT NOT NULL,
      potential_value REAL,
      actual_value REAL,
      outcome TEXT NOT NULL,
      notes TEXT NOT NULL
    );
  `);

  return database;
}

describe('opportunity observation repository', () => {
  it('returns observations for the requested day', () => {
    const database = createDatabase();

    database.exec(`
      INSERT INTO experiment_day (id) VALUES ('day-1'), ('day-2');

      INSERT INTO opportunity_observation (
        id, experiment_day_id, what_happened, source,
        is_unexpected, goal_related, action_taken,
        potential_value, actual_value, outcome, notes
      ) VALUES (
        'opportunity-1', 'day-1', 'A client requested a new service',
        'Existing client', 1, 1, 'Sent proposal',
        50000, 30000, 'Won', 'First opportunity from this client'
      );

      INSERT INTO opportunity_observation (
        id, experiment_day_id, what_happened, source,
        is_unexpected, goal_related, action_taken,
        potential_value, actual_value, outcome, notes
      ) VALUES (
        'opportunity-2', 'day-2', 'Another opportunity',
        'Referral', 0, 1, 'Followed up',
        10000, NULL, 'Open', 'Still pending'
      );
    `);

    const repository = createOpportunityObservationRepository(database);

    expect(repository.listForDay('day-1')).toEqual([
      {
        id: 'opportunity-1',
        experimentDayId: 'day-1',
        whatHappened: 'A client requested a new service',
        source: 'Existing client',
        isUnexpected: true,
        goalRelated: true,
        actionTaken: 'Sent proposal',
        potentialValue: 50000,
        actualValue: 30000,
        outcome: 'Won',
        notes: 'First opportunity from this client',
      },
    ]);

    database.close();
  });

  it('preserves missing actual value as null', () => {
    const database = createDatabase();

    database.exec(`
      INSERT INTO experiment_day (id) VALUES ('day-1');

      INSERT INTO opportunity_observation (
        id, experiment_day_id, what_happened, source,
        is_unexpected, goal_related, action_taken,
        potential_value, actual_value, outcome, notes
      ) VALUES (
        'opportunity-1', 'day-1', 'Potential opportunity',
        'Referral', 1, 0, 'Contacted',
        25000, NULL, 'Pending', 'No realized value yet'
      );
    `);

    const repository = createOpportunityObservationRepository(database);

    expect(repository.listForDay('day-1')[0]?.actualValue).toBeNull();

    database.close();
  });

  it('returns an empty list when the day has no opportunities', () => {
    const database = createDatabase();

    database.exec(`
      INSERT INTO experiment_day (id) VALUES ('day-with-no-opportunities');
    `);

    const repository = createOpportunityObservationRepository(database);

    expect(
      repository.listForDay('day-with-no-opportunities'),
    ).toEqual([]);

    database.close();
  });

  it('excludes opportunities belonging to another day', () => {
    const database = createDatabase();

    database.exec(`
      INSERT INTO experiment_day (id) VALUES ('day-1'), ('day-2');

      INSERT INTO opportunity_observation (
        id, experiment_day_id, what_happened, source,
        is_unexpected, goal_related, action_taken,
        potential_value, actual_value, outcome, notes
      ) VALUES (
        'opportunity-1', 'day-2', 'Other opportunity',
        'Referral', 0, 1, 'Followed up',
        10000, NULL, 'Open', 'Other day'
      );
    `);

    const repository = createOpportunityObservationRepository(database);

    expect(repository.listForDay('day-1')).toEqual([]);

    database.close();
  });
});
