import { describe, expect, it } from "vitest";
import { createExperimentDay } from "../../src/domain/experiment-day.js";

describe("Experiment Day", () => {
  it("maps Day 1 to 7 September 2026", () => {
    expect(createExperimentDay(1)).toEqual({
      dayNumber: 1,
      date: "2026-09-07",
    });
  });

  it("maps Day 108 to 23 December 2026", () => {
    expect(createExperimentDay(108)).toEqual({
      dayNumber: 108,
      date: "2026-12-23",
    });
  });

  it("rejects day 0", () => {
    expect(() => createExperimentDay(0)).toThrow();
  });

  it("rejects day 109", () => {
    expect(() => createExperimentDay(109)).toThrow();
  });

  it("rejects negative day numbers", () => {
    expect(() => createExperimentDay(-1)).toThrow();
  });

  it("rejects non-integer day numbers", () => {
    expect(() => createExperimentDay(1.5)).toThrow();
  });
});
