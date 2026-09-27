import { describe, expect, it } from 'vitest';
import {
  calculateExperimentAnalytics,
  type AnalyticsDay,
} from '../../src/domain/analytics.js';

describe('calculateExperimentAnalytics', () => {
  it('aggregates successful and unsuccessful days', () => {
    const days: AnalyticsDay[] = [
      {
        successful: true,
        completedCount: 13,
        expectedCount: 13,
        threeSixNineCompletedSessions: 3,
        threeSixNineExpectedSessions: 3,
      },
      {
        successful: false,
        completedCount: 10,
        expectedCount: 13,
        threeSixNineCompletedSessions: 2,
        threeSixNineExpectedSessions: 3,
      },
    ];

    expect(calculateExperimentAnalytics(days)).toEqual({
      successfulDays: 1,
      unsuccessfulDays: 1,
      completedConditions: 23,
      expectedConditions: 26,
      overallAdherence: 23 / 26,
      threeSixNineCompletedSessions: 5,
      threeSixNineExpectedSessions: 6,
    });
  });

  it('returns zero adherence when there are no days', () => {
    expect(calculateExperimentAnalytics([])).toEqual({
      successfulDays: 0,
      unsuccessfulDays: 0,
      completedConditions: 0,
      expectedConditions: 0,
      overallAdherence: 0,
      threeSixNineCompletedSessions: 0,
      threeSixNineExpectedSessions: 0,
    });
  });

  it('aggregates missing conditions without treating them as completed', () => {
    const days: AnalyticsDay[] = [
      {
        successful: false,
        completedCount: 0,
        expectedCount: 13,
        threeSixNineCompletedSessions: 0,
        threeSixNineExpectedSessions: 3,
      },
    ];

    expect(calculateExperimentAnalytics(days)).toEqual({
      successfulDays: 0,
      unsuccessfulDays: 1,
      completedConditions: 0,
      expectedConditions: 13,
      overallAdherence: 0,
      threeSixNineCompletedSessions: 0,
      threeSixNineExpectedSessions: 3,
    });
  });
});
