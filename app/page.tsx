import { createDatabase } from "../src/data/database.js";
import { loadExperimentDay } from "../src/application/load-experiment-day.js";
import { ExperimentDayView } from "../src/components/experiment-day-view.js";

const experimentId = "108-day-experiment";
const dayNumber = 1;

export default function HomePage() {
  const database = createDatabase();

  try {
    const loaded = loadExperimentDay(
      database,
      experimentId,
      dayNumber,
    );

    if (loaded.status === "unavailable") {
      return (
        <main>
          <header>
            <p>108-Day Experiment</p>
            <h1>Experiment day unavailable</h1>
          </header>

          <section aria-labelledby="unavailable-heading">
            <h2 id="unavailable-heading">No experiment day available</h2>
            <p>{loaded.reason}</p>
          </section>
        </main>
      );
    }

    return <ExperimentDayView result={loaded.result} />;
  } finally {
    database.close();
  }
}
