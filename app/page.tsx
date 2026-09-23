import { ExperimentDayView } from '../src/components/experiment-day-view.js';

export default function HomePage() {
  return (
    <ExperimentDayView
      result={{
        experimentDay: {
          id: 'demo-day-17',
          experimentId: '108-day-experiment',
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
      }}
    />
  );
}
