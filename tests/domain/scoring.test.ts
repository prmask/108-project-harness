import { describe, expect, it } from "vitest";
import {
  calculateDailyResult,
  getScoringDefinitionForDay,
} from "../../src/domain/scoring.js";

const completed = (count: number) =>
  Array.from({ length: count }, () => "completed" as const);

describe("Scoring", () => {
  it("uses scoring definition v1 for Day 1", () => {
    expect(getScoringDefinitionForDay(1)).toMatchObject({
      version: "v1",
      requiredCompletedCount: 13,
      expectedCount: 13,
    });
  });

  it("calculates a result using the supplied scoring definition", () => {
    const definition = {
      version: "v3" as const,
      effectiveFromDay: 47,
      effectiveToDay: 108,
      requiredCompletedCount: 8,
      expectedCount: 13,
    };

    const result = calculateDailyResult(
      47,
      definition,
      completed(8),
    );

    expect(result).toEqual({
      dayNumber: 47,
      scoringDefinitionVersion: "v3",
      completedCount: 8,
      expectedCount: 13,
      successful: true,
    });
  });

  it("uses scoring definition v1 for Day 46", () => {
    expect(getScoringDefinitionForDay(46)).toMatchObject({
      version: "v1",
      requiredCompletedCount: 13,
    });
  });

  it("uses scoring definition v3 for Day 47", () => {
    expect(getScoringDefinitionForDay(47)).toMatchObject({
      version: "v3",
      requiredCompletedCount: 8,
      expectedCount: 13,
    });
  });

  it("uses scoring definition v3 for Day 108", () => {
    expect(getScoringDefinitionForDay(108)).toMatchObject({
      version: "v3",
      requiredCompletedCount: 8,
    });
  });

  it("requires all 13 conditions for success under v1", () => {
    const definition = getScoringDefinitionForDay(1);

    expect(
      calculateDailyResult(1, definition, completed(13)).successful,
    ).toBe(true);

    expect(
      calculateDailyResult(1, definition, completed(12)).successful,
    ).toBe(false);
  });

  it("requires at least 8 conditions for success under v3", () => {
    const definition = getScoringDefinitionForDay(47);

    expect(
      calculateDailyResult(47, definition, completed(8)).successful,
    ).toBe(true);

    expect(
      calculateDailyResult(47, definition, completed(7)).successful,
    ).toBe(false);
  });

  it("does not count missing observations as completed", () => {
    const definition = getScoringDefinitionForDay(47);

    const result = calculateDailyResult(47, definition, [
      ...completed(7),
      "missing",
      "not_completed",
      "missing",
    ]);

    expect(result.completedCount).toBe(7);
    expect(result.successful).toBe(false);
  });

  it("records the scoring definition used for the result", () => {
    const v1 = getScoringDefinitionForDay(1);
    const v3 = getScoringDefinitionForDay(47);

    expect(
      calculateDailyResult(1, v1, completed(13)).scoringDefinitionVersion,
    ).toBe("v1");

    expect(
      calculateDailyResult(47, v3, completed(8)).scoringDefinitionVersion,
    ).toBe("v3");
  });

  it("does not apply v3 retroactively to Days 1–46", () => {
    expect(getScoringDefinitionForDay(46).version).toBe("v1");
  });
});
