import type { GetExperimentDayResult } from '../application/get-experiment-day.js';

export type ExperimentDayPresentation = {
  heading: string;
  date: string;
  completedSummary: string;
  resultLabel: string;
  scoringDefinitionLabel: string;
  observationLabels: readonly string[];
};

function observationLabel(status: string): string {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'not_completed':
      return 'Not completed';
    case 'missing':
      return 'Missing';
    default:
      return 'Unknown';
  }
}

export function presentExperimentDay(
  result: GetExperimentDayResult,
): ExperimentDayPresentation {
  return {
    heading: `Day ${result.experimentDay.dayNumber}`,
    date: result.experimentDay.date,
    completedSummary:
      `${result.dailyResult.completedCount} / ` +
      `${result.dailyResult.expectedCount} completed`,
    resultLabel:
      result.observations.length === 0
        ? 'No observations recorded'
        : result.dailyResult.successful
          ? 'Successful day'
          : 'Unsuccessful day',
    scoringDefinitionLabel:
      `Scoring definition: ${result.scoringDefinition.version}`,
    observationLabels: result.observations.map(
      (status, index) =>
        `Protocol condition ${index + 1}: ${observationLabel(status)}`,
    ),
  };
}
