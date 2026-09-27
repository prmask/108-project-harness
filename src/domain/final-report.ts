import type { DailyResult } from "./scoring.js";
import type { HealthWeightObservationRecord } from "../data/health-weight-observation-repository.js";
import type { WealthRevenueObservationRecord } from "../data/wealth-revenue-observation-repository.js";
import type { OpportunityObservationRecord } from "../data/opportunity-observation-repository.js";
import type { ThreeSixNineSessionRecord } from "../data/three-six-nine-session-repository.js";
import type { EvidenceObservationRecord } from "../data/evidence-observation-repository.js";

export type FinalReport = {
  successfulDays: number;
  unsuccessfulDays: number;
  overallAdherence: number;
  threeSixNineCompletedSessions: number;
  threeSixNineExpectedSessions: number;
  startingWeightKg: number | null;
  endingWeightKg: number | null;
  revenueTotal: number;
  opportunityCount: number;
  potentialOpportunityValue: number;
  actualOpportunityValue: number;
  supportingEvidenceCount: number;
  challengingEvidenceCount: number;
  alternativeExplanationCount: number;
};

export function buildFinalReport(input: {
  dailyResults: readonly DailyResult[];
  threeSixNineSessions: readonly ThreeSixNineSessionRecord[];
  weightObservations: readonly HealthWeightObservationRecord[];
  revenueObservations: readonly WealthRevenueObservationRecord[];
  opportunities: readonly OpportunityObservationRecord[];
  evidenceObservations: readonly EvidenceObservationRecord[];
}): FinalReport {
  const completedConditions = input.dailyResults.reduce(
    (total, day) => total + day.completedCount,
    0,
  );

  const expectedConditions = input.dailyResults.reduce(
    (total, day) => total + day.expectedCount,
    0,
  );

  return {
    successfulDays: input.dailyResults.filter((day) => day.successful).length,
    unsuccessfulDays: input.dailyResults.filter((day) => !day.successful).length,
    overallAdherence:
      expectedConditions === 0 ? 0 : completedConditions / expectedConditions,
    threeSixNineCompletedSessions: input.threeSixNineSessions.filter(
      (session) => session.status === "completed",
    ).length,
    threeSixNineExpectedSessions: input.threeSixNineSessions.length,
    startingWeightKg: input.weightObservations[0]?.valueKg ?? null,
    endingWeightKg:
      input.weightObservations[input.weightObservations.length - 1]?.valueKg ??
      null,
    revenueTotal: input.revenueObservations.reduce(
      (total, observation) => total + observation.amount,
      0,
    ),
    opportunityCount: input.opportunities.length,
    potentialOpportunityValue: input.opportunities.reduce(
      (total, opportunity) => total + (opportunity.potentialValue ?? 0),
      0,
    ),
    actualOpportunityValue: input.opportunities.reduce(
      (total, opportunity) => total + (opportunity.actualValue ?? 0),
      0,
    ),
    supportingEvidenceCount: input.evidenceObservations.filter(
      (evidence) => evidence.category === "supporting",
    ).length,
    challengingEvidenceCount: input.evidenceObservations.filter(
      (evidence) => evidence.category === "challenging",
    ).length,
    alternativeExplanationCount: input.evidenceObservations.filter(
      (evidence) => evidence.category === "alternative_explanation",
    ).length,
  };
}
