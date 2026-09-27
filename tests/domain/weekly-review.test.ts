import { describe, expect, it } from 'vitest';
import {
  calculateWeeklyReview,
  type WeeklyReviewInput,
} from '../../src/domain/weekly-review.js';

describe('calculateWeeklyReview', () => {
  it('summarizes the defined weekly review measures', () => {
    const input: WeeklyReviewInput = {
      successfulDays: 5,
      totalDays: 7,
      completedConditions: 70,
      expectedConditions: 91,
      missedConditions: 21,
      financialOutcomeCount: 2,
      opportunityCount: 3,
      supportingEvidenceCount: 4,
      challengingEvidenceCount: 1,
      alternativeExplanationCount: 2,
      missingDataCount: 5,
    };

    expect(calculateWeeklyReview(input)).toEqual({
      ...input,
      protocolAdherence: 70 / 91,
    });
  });

  it('returns zero adherence when there are no expected conditions', () => {
    const input: WeeklyReviewInput = {
      successfulDays: 0,
      totalDays: 0,
      completedConditions: 0,
      expectedConditions: 0,
      missedConditions: 0,
      financialOutcomeCount: 0,
      opportunityCount: 0,
      supportingEvidenceCount: 0,
      challengingEvidenceCount: 0,
      alternativeExplanationCount: 0,
      missingDataCount: 0,
    };

    expect(calculateWeeklyReview(input)).toEqual({
      ...input,
      protocolAdherence: 0,
    });
  });
});
