import { describe, expect, it } from "vitest";
import {
  analyzeHypothesis,
  type HypothesisEvidence,
} from "../../src/domain/hypothesis-analysis.js";

describe("analyzeHypothesis", () => {
  it("groups evidence by category for the requested hypothesis", () => {
    const evidence: HypothesisEvidence[] = [
      {
        hypothesisId: "H1",
        category: "supporting",
        observation: "Revenue increased during sustained execution.",
      },
      {
        hypothesisId: "H1",
        category: "challenging",
        observation: "One financial period showed no improvement.",
      },
      {
        hypothesisId: "H1",
        category: "alternative_explanation",
        observation: "A pre-existing customer opportunity contributed.",
      },
      {
        hypothesisId: "H2",
        category: "supporting",
        observation: "3-6-9 practice was completed consistently.",
      },
    ];

    expect(analyzeHypothesis("H1", evidence)).toEqual({
      hypothesisId: "H1",
      supportingEvidence: ["Revenue increased during sustained execution."],
      challengingEvidence: ["One financial period showed no improvement."],
      alternativeExplanations: [
        "A pre-existing customer opportunity contributed.",
      ],
    });
  });

  it("returns empty evidence when none is recorded for the hypothesis", () => {
    expect(analyzeHypothesis("H4", [])).toEqual({
      hypothesisId: "H4",
      supportingEvidence: [],
      challengingEvidence: [],
      alternativeExplanations: [],
    });
  });
});
