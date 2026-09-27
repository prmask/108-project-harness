export type AnalyticsDay = {
  successful: boolean;
  completedCount: number;
  expectedCount: number;
  threeSixNineCompletedSessions: number;
  threeSixNineExpectedSessions: number;
};

export type ExperimentAnalytics = {
  successfulDays: number;
  unsuccessfulDays: number;
  completedConditions: number;
  expectedConditions: number;
  overallAdherence: number;
  threeSixNineCompletedSessions: number;
  threeSixNineExpectedSessions: number;
};

export function calculateExperimentAnalytics(
  days: readonly AnalyticsDay[],
): ExperimentAnalytics {
  const successfulDays = days.filter((day) => day.successful).length;

  const completedConditions = days.reduce(
    (total, day) => total + day.completedCount,
    0,
  );

  const expectedConditions = days.reduce(
    (total, day) => total + day.expectedCount,
    0,
  );

  const threeSixNineCompletedSessions = days.reduce(
    (total, day) => total + day.threeSixNineCompletedSessions,
    0,
  );

  const threeSixNineExpectedSessions = days.reduce(
    (total, day) => total + day.threeSixNineExpectedSessions,
    0,
  );

  return {
    successfulDays,
    unsuccessfulDays: days.length - successfulDays,
    completedConditions,
    expectedConditions,
    overallAdherence:
      expectedConditions === 0 ? 0 : completedConditions / expectedConditions,
    threeSixNineCompletedSessions,
    threeSixNineExpectedSessions,
  };
}
