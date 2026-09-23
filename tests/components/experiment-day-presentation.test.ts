import { describe, expect, it } from 'vitest';
import { presentExperimentDay } from '../../src/components/experiment-day-presentation.js';
import type { GetExperimentDayResult } from '../../src/application/get-experiment-day.js';

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
  };
}

describe('presentExperimentDay', () => {
  it('presents the experiment day and daily result', () => {
    const presentation = presentExperimentDay(createResult());

    expect(presentation.heading).toBe('Day 17');
    expect(presentation.date).toBe('2026-09-23');
    expect(presentation.completedSummary).toBe('13 / 13 completed');
    expect(presentation.resultLabel).toBe('Successful day');
    expect(presentation.scoringDefinitionLabel).toBe(
      'Scoring definition: v1',
    );
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
});
