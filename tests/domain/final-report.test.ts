import { describe, expect, it } from "vitest";
import {
  buildFinalReport,
  type FinalReport,
} from "../../src/domain/final-report.js";

describe("buildFinalReport", () => {
  it("aggregates the currently implemented final-report measures", () => {
    const report = buildFinalReport({
      dailyResults: [
        {
          dayNumber: 1,
          scoringDefinitionVersion: "v1",
          completedCount: 13,
          expectedCount: 13,
          successful: true,
        },
        {
          dayNumber: 47,
          scoringDefinitionVersion: "v3",
          completedCount: 8,
          expectedCount: 13,
          successful: true,
        },
      ],
      threeSixNineSessions: [
        {
          id: "s1",
          experimentDayId: "d1",
          period: "morning",
          plannedRepetitions: 3,
          completedRepetitions: 3,
          status: "completed",
          completedAt: "2026-09-07T06:00:00Z",
        },
        {
          id: "s2",
          experimentDayId: "d1",
          period: "afternoon",
          plannedRepetitions: 6,
          completedRepetitions: 0,
          status: "not_completed",
          completedAt: null,
        },
      ],
      weightObservations: [
        {
          id: "w1",
          experimentDayId: "d1",
          valueKg: 87.7,
          observedAt: "2026-09-07T07:00:00Z",
        },
        {
          id: "w2",
          experimentDayId: "d2",
          valueKg: 86.9,
          observedAt: "2026-09-08T07:00:00Z",
        },
      ],
      revenueObservations: [
        {
          id: "r1",
          experimentDayId: "d1",
          amount: 10000,
          observedAt: "2026-09-07T12:00:00Z",
        },
        {
          id: "r2",
          experimentDayId: "d2",
          amount: 5000,
          observedAt: "2026-09-08T12:00:00Z",
        },
      ],
      opportunities: [
        {
          id: "o1",
          experimentDayId: "d1",
          whatHappened: "New lead",
          source: "Referral",
          isUnexpected: true,
          goalRelated: true,
          actionTaken: "Followed up",
          potentialValue: 50000,
          actualValue: 10000,
          outcome: "Converted",
          notes: "",
        },
      ],
      evidenceObservations: [
        {
          id: "e1",
          experimentDayId: "d1",
          hypothesisId: "H1",
          category: "supporting",
          observation: "Revenue increased.",
          recordedAt: "2026-09-07T18:00:00Z",
        },
        {
          id: "e2",
          experimentDayId: "d2",
          hypothesisId: "H1",
          category: "challenging",
          observation: "Some periods showed no increase.",
          recordedAt: "2026-09-08T18:00:00Z",
        },
        {
          id: "e3",
          experimentDayId: "d2",
          hypothesisId: "H1",
          category: "alternative_explanation",
          observation: "Existing pipeline.",
          recordedAt: "2026-09-08T18:00:00Z",
        },
      ],
    });

    const expected: FinalReport = {
      successfulDays: 2,
      unsuccessfulDays: 0,
      overallAdherence: 21 / 26,
      threeSixNineCompletedSessions: 1,
      threeSixNineExpectedSessions: 2,
      startingWeightKg: 87.7,
      endingWeightKg: 86.9,
      revenueTotal: 15000,
      opportunityCount: 1,
      potentialOpportunityValue: 50000,
      actualOpportunityValue: 10000,
      supportingEvidenceCount: 1,
      challengingEvidenceCount: 1,
      alternativeExplanationCount: 1,
    };

    expect(report).toEqual(expected);
  });

  it("preserves missing weight as null", () => {
    expect(
      buildFinalReport({
        dailyResults: [],
        threeSixNineSessions: [],
        weightObservations: [],
        revenueObservations: [],
        opportunities: [],
        evidenceObservations: [],
      }),
    ).toEqual({
      successfulDays: 0,
      unsuccessfulDays: 0,
      overallAdherence: 0,
      threeSixNineCompletedSessions: 0,
      threeSixNineExpectedSessions: 0,
      startingWeightKg: null,
      endingWeightKg: null,
      revenueTotal: 0,
      opportunityCount: 0,
      potentialOpportunityValue: 0,
      actualOpportunityValue: 0,
      supportingEvidenceCount: 0,
      challengingEvidenceCount: 0,
      alternativeExplanationCount: 0,
    });
  });
});
