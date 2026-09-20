export const EXPERIMENT_START_DATE = "2026-09-07";
export const EXPERIMENT_TOTAL_DAYS = 108;

export type ExperimentDay = {
  dayNumber: number;
  date: string;
};

export function createExperimentDay(dayNumber: number): ExperimentDay {
  if (
    !Number.isInteger(dayNumber) ||
    dayNumber < 1 ||
    dayNumber > EXPERIMENT_TOTAL_DAYS
  ) {
    throw new Error(`Invalid experiment day: ${dayNumber}`);
  }

  const startDate = new Date(`${EXPERIMENT_START_DATE}T00:00:00Z`);

  startDate.setUTCDate(startDate.getUTCDate() + dayNumber - 1);

  return {
    dayNumber,
    date: startDate.toISOString().slice(0, 10),
  };
}
