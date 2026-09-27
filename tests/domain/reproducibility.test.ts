import { describe, expect, it } from "vitest";
import {
  buildHistoricalResults,
  type HistoricalDayResult,
} from "../../src/domain/reproducibility.js";

describe("buildHistoricalResults", () => {
  it("preserves the historical scoring definition and result", () => {
    const result = buildHistoricalResults([
      {
        dayNumber: 30,
        scoringDefinitionVersion: "v1",
        completedCount: 10,
        expectedCount: 13,
        successful: false,
      },
      {
        dayNumber: 47,
        scoringDefinitionVersion: "v3",
        completedCount: 10,
        expectedCount: 13,
        successful: true,
      },
    ]);

    const expected: HistoricalDayResult[] = [
      {
        dayNumber: 30,
        scoringDefinitionVersion: "v1",
        completedCount: 10,
        expectedCount: 13,
        successful: false,
      },
      {
        dayNumber: 47,
        scoringDefinitionVersion: "v3",
        completedCount: 10,
        expectedCount: 13,
        successful: true,
      },
    ];

    expect(result).toEqual(expected);
  });

  it("returns an empty result for no historical days", () => {
    expect(buildHistoricalResults([])).toEqual([]);
  });
});
