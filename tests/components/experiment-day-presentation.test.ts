import { describe, expect, it } from 'vitest';
import type { GetExperimentDayResult } from '../../src/application/get-experiment-day.js';
import { presentExperimentDay } from '../../src/components/experiment-day-presentation.js';

function createResult(
  overrides: Partial<GetExperimentDayResult> = {},
): GetExperimentDayResult {
  return {
    experimentDay: {
      id: 'day-17',
      experimentId: 'experiment-1',
      dayNumber: 17,
      date: '2026-09-23',
    },
    scoringDefinition: {
      version: 'v1',
      effectiveFromDay: 1,
      effectiveToDay: 46,
      requiredCompletedCount: 13,
      expectedCount: 13,
    },
    observations: [
      'completed',
      'completed',
      'completed',
      'completed',
      'completed',
      'completed',
      'completed',
      'completed',
      'completed',
      'completed',
      'completed',
      'completed',
      'completed',
    ],
    dailyResult: {
      dayNumber: 17,
      scoringDefinitionVersion: 'v1',
      completedCount: 13,
      expectedCount: 13,
      successful: true,
    },
    ...overrides,
    threeSixNineSessions: overrides.threeSixNineSessions ?? [],
  };
}

describe('presentExperimentDay', () => {
  it('presents the experiment day and daily result', () => {
    const presentation = presentExperimentDay(createResult());

    expect(presentation.heading).toBe('Day 17');
    expect(presentation.date).toBe('2026-09-23');
    expect(presentation.completedSummary).toBe('13 / 13 completed');
    expect(presentation.resultLabel).toBe('Successful day');
    expect(presentation.scoringDefinitionLabel).toBe('Scoring definition: v1');
  });

  it('does not invent observations when none are recorded', () => {
    const presentation = presentExperimentDay(
      createResult({
        observations: [],
        dailyResult: {
          dayNumber: 17,
          scoringDefinitionVersion: 'v1',
          completedCount: 0,
          expectedCount: 13,
          successful: false,
        },
      }),
    );

    expect(presentation.resultLabel).toBe('No observations recorded');
    expect(presentation.observationLabels).toEqual([]);
  });

  it('preserves missing observations as missing', () => {
    const presentation = presentExperimentDay(
      createResult({
        observations: ['completed', 'missing'],
        dailyResult: {
          dayNumber: 17,
          scoringDefinitionVersion: 'v1',
          completedCount: 1,
          expectedCount: 13,
          successful: false,
        },
      }),
    );

    expect(presentation.observationLabels).toEqual([
      'Protocol condition 1: Completed',
      'Protocol condition 2: Missing',
    ]);
  });

  it('presents the 3-6-9 sessions separately from daily scoring', () => {
    const presentation = presentExperimentDay(
      createResult({
        threeSixNineSessions: [
          {
            id: 'session-morning',
            experimentDayId: 'day-17',
            period: 'morning',
            plannedRepetitions: 3,
            completedRepetitions: 3,
            status: 'completed',
            completedAt: '2026-09-23T06:00:00Z',
          },
          {
            id: 'session-afternoon',
            experimentDayId: 'day-17',
            period: 'afternoon',
            plannedRepetitions: 6,
            completedRepetitions: 4,
            status: 'not_completed',
            completedAt: null,
          },
          {
            id: 'session-evening',
            experimentDayId: 'day-17',
            period: 'evening',
            plannedRepetitions: 9,
            completedRepetitions: 0,
            status: 'missing',
            completedAt: null,
          },
        ],
      }),
    );

    expect(presentation.threeSixNine).toEqual({
      sessions: [
        {
          period: 'morning',
          periodLabel: 'Morning',
          plannedRepetitions: 3,
          completedRepetitions: 3,
          status: 'completed',
          statusLabel: 'Completed',
        },
        {
          period: 'afternoon',
          periodLabel: 'Afternoon',
          plannedRepetitions: 6,
          completedRepetitions: 4,
          status: 'not_completed',
          statusLabel: 'Not completed',
        },
        {
          period: 'evening',
          periodLabel: 'Evening',
          plannedRepetitions: 9,
          completedRepetitions: 0,
          status: 'missing',
          statusLabel: 'Missing',
        },
      ],
      completedRepetitions: 7,
      plannedRepetitions: 18,
      summary: '7 / 18 repetitions',
    });
  });
});
