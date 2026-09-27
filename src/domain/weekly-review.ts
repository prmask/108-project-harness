export type WeeklyReviewInput = {
  successfulDays: number;
  totalDays: number;
  completedConditions: number;
  expectedConditions: number;
  missedConditions: number;
  financialOutcomeCount: number;
  opportunityCount: number;
  supportingEvidenceCount: number;
  challengingEvidenceCount: number;
  alternativeExplanationCount: number;
  missingDataCount: number;
};

export type WeeklyReview = WeeklyReviewInput & {
  protocolAdherence: number;
};

export function calculateWeeklyReview(input: WeeklyReviewInput): WeeklyReview {
  return {
    ...input,
    protocolAdherence:
      input.expectedConditions === 0
        ? 0
        : input.completedConditions / input.expectedConditions,
  };
}
