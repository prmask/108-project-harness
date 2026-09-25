import type { GetExperimentDayResult } from '../application/get-experiment-day.js';
import { presentExperimentDay } from './experiment-day-presentation.js';

type ExperimentDayViewProps = {
  result: GetExperimentDayResult;
};

export function ExperimentDayView({
  result,
}: ExperimentDayViewProps) {
  const presentation = presentExperimentDay(result);

  return (
    <main>
      <header>
        <p>108-Day Experiment</p>
        <h1>{presentation.heading}</h1>
        <p>{presentation.date}</p>
      </header>

      <section aria-labelledby="daily-result-heading">
        <h2 id="daily-result-heading">Daily result</h2>

        <p>{presentation.completedSummary}</p>
        <p>{presentation.resultLabel}</p>
        <p>{presentation.scoringDefinitionLabel}</p>
      </section>

      <section aria-labelledby="protocol-heading">
        <h2 id="protocol-heading">Protocol observations</h2>

        {presentation.observationLabels.length === 0 ? (
          <p>No observations recorded for this day.</p>
        ) : (
          <ul>
            {presentation.observationLabels.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="three-six-nine-heading">
        <h2 id="three-six-nine-heading">3-6-9 Goal Practice</h2>

        <ul>
          {presentation.threeSixNine.sessions.map((session) => (
            <li key={session.period}>
              <strong>{session.periodLabel}</strong>{" "}
              {session.completedRepetitions} / {session.plannedRepetitions}{" "}
              repetitions — {session.statusLabel}
            </li>
          ))}
        </ul>

        <p>Total: {presentation.threeSixNine.summary}</p>
      </section>
    </main>
  );
}
