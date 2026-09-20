import { describe, expect, it } from "vitest";
import {
  correctObservation,
  type ProtocolObservation,
} from "../../src/domain/correction.js";

const original: ProtocolObservation = {
  id: "observation-1",
  dayNumber: 1,
  protocolItemId: "wake-0350",
  status: "not_completed",
  observedAt: "2026-09-07T06:00:00.000Z",
};

describe("Observation Correction", () => {
  it("preserves the original observation", () => {
    const result = correctObservation(
      original,
      "completed",
      "Confirmed after reviewing my record.",
      "correction-1",
      "2026-09-07T08:00:00.000Z",
    );

    expect(result.observation).toEqual(original);
    expect(result.correction.originalStatus).toBe("not_completed");
  });

  it("creates an auditable correction record", () => {
    const result = correctObservation(
      original,
      "completed",
      "Confirmed after reviewing my record.",
      "correction-1",
      "2026-09-07T08:00:00.000Z",
    );

    expect(result.correction).toMatchObject({
      id: "correction-1",
      observationId: "observation-1",
      originalStatus: "not_completed",
      correctedStatus: "completed",
      reason: "Confirmed after reviewing my record.",
      correctedAt: "2026-09-07T08:00:00.000Z",
    });
  });

  it("allows the corrected observation to be retrieved", () => {
    const result = correctObservation(
      original,
      "completed",
      "Confirmed after reviewing my record.",
    );

    expect(result.correction.correctedStatus).toBe("completed");
  });

  it("keeps missing distinct from not_completed", () => {
    const missing: ProtocolObservation = {
      ...original,
      id: "observation-2",
      status: "missing",
    };

    const result = correctObservation(
      missing,
      "not_completed",
      "Later confirmed not completed.",
    );

    expect(result.correction.originalStatus).toBe("missing");
    expect(result.correction.correctedStatus).toBe("not_completed");
    expect(result.correction.originalStatus).not.toBe(
      result.correction.correctedStatus,
    );
  });

  it("does not silently overwrite historical evidence", () => {
    const result = correctObservation(
      original,
      "completed",
      "Confirmed after reviewing my record.",
    );

    expect(original.status).toBe("not_completed");
    expect(result.observation.status).toBe("not_completed");
  });
});
