import type { ObservationStatus } from "./scoring.js";

export type ProtocolObservation = {
  id: string;
  dayNumber: number;
  protocolItemId: string;
  status: ObservationStatus;
  observedAt: string;
};

export type ObservationCorrection = {
  id: string;
  observationId: string;
  originalStatus: ObservationStatus;
  correctedStatus: ObservationStatus;
  correctedAt: string;
  reason: string;
};

export type CorrectedObservation = {
  observation: ProtocolObservation;
  correction: ObservationCorrection;
};

export function correctObservation(
  observation: ProtocolObservation,
  correctedStatus: ObservationStatus,
  reason: string,
  correctionId = `correction-${observation.id}`,
  correctedAt = new Date().toISOString(),
): CorrectedObservation {
  if (!reason.trim()) {
    throw new Error("Correction reason is required");
  }

  return {
    observation: { ...observation },
    correction: {
      id: correctionId,
      observationId: observation.id,
      originalStatus: observation.status,
      correctedStatus,
      correctedAt,
      reason,
    },
  };
}
