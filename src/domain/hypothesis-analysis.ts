export type HypothesisId = "H1" | "H2" | "H3" | "H4";

export type EvidenceCategory =
  | "supporting"
  | "challenging"
  | "alternative_explanation";

export type HypothesisEvidence = {
  hypothesisId: HypothesisId;
  category: EvidenceCategory;
  observation: string;
};

export type HypothesisAnalysis = {
  hypothesisId: HypothesisId;
  supportingEvidence: string[];
  challengingEvidence: string[];
  alternativeExplanations: string[];
};

export function analyzeHypothesis(
  hypothesisId: HypothesisId,
  evidence: readonly HypothesisEvidence[],
): HypothesisAnalysis {
  const relevant = evidence.filter(
    (item) => item.hypothesisId === hypothesisId,
  );

  return {
    hypothesisId,
    supportingEvidence: relevant
      .filter((item) => item.category === "supporting")
      .map((item) => item.observation),
    challengingEvidence: relevant
      .filter((item) => item.category === "challenging")
      .map((item) => item.observation),
    alternativeExplanations: relevant
      .filter((item) => item.category === "alternative_explanation")
      .map((item) => item.observation),
  };
}
