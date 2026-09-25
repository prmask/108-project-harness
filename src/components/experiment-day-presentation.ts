import type { GetExperimentDayResult } from '../application/get-experiment-day.js';
import type {
  ThreeSixNinePeriod,
  ThreeSixNineStatus,
} from '../data/three-six-nine-session-repository.js';

export type ThreeSixNineSessionPresentation = {
  period: ThreeSixNinePeriod;
  periodLabel: string;
  plannedRepetitions: number;
  completedRepetitions: number;
  status: ThreeSixNineStatus;
  statusLabel: string;
};

export type ThreeSixNinePresentation = {
  sessions: readonly ThreeSixNineSessionPresentation[];
  completedRepetitions: number;
  plannedRepetitions: number;
  summary: string;
};

export type ExperimentDayPresentation = {
  heading: string;
  date: string;
  completedSummary: string;
  resultLabel: string;
  scoringDefinitionLabel: string;
  observationLabels: readonly string[];
  threeSixNine: ThreeSixNinePresentation;
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

function periodLabel(period: ThreeSixNinePeriod): string {
  switch (period) {
    case 'morning':
      return 'Morning';
    case 'afternoon':
      return 'Afternoon';
    case 'evening':
      return 'Evening';
  }
}

function threeSixNineStatusLabel(status: ThreeSixNineStatus): string {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'not_completed':
      return 'Not completed';
    case 'missing':
      return 'Missing';
  }
}

export function presentExperimentDay(
  result: GetExperimentDayResult,
): ExperimentDayPresentation {
  const threeSixNineSessions = result.threeSixNineSessions.map((session) => ({
    period: session.period,
    periodLabel: periodLabel(session.period),
    plannedRepetitions: session.plannedRepetitions,
    completedRepetitions: session.completedRepetitions,
    status: session.status,
    statusLabel: threeSixNineStatusLabel(session.status),
  }));

  const threeSixNineCompleted = threeSixNineSessions.reduce(
    (total, session) => total + session.completedRepetitions,
    0,
  );

  const threeSixNinePlanned = threeSixNineSessions.reduce(
    (total, session) => total + session.plannedRepetitions,
    0,
  );

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
    threeSixNine: {
      sessions: threeSixNineSessions,
      completedRepetitions: threeSixNineCompleted,
      plannedRepetitions: threeSixNinePlanned,
      summary:
        `${threeSixNineCompleted} / ${threeSixNinePlanned} repetitions`,
    },
  };
}
