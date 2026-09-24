import Database from "better-sqlite3";
import { describe, expect, it } from "vitest";
import { createObservationCorrectionRepository } from "../../src/data/observation-correction-repository.js";

function createDatabase() {
  const database = new Database(":memory:");

  database.exec(`
    CREATE TABLE observation_correction (
      id TEXT PRIMARY KEY,
      observation_id TEXT NOT NULL,
      original_status TEXT NOT NULL,
      corrected_status TEXT NOT NULL,
      corrected_at TEXT NOT NULL,
      reason TEXT NOT NULL
    );
  `);

  return database;
}

describe("observation correction repository", () => {
  it("stores and retrieves an auditable correction", () => {
    const database = createDatabase();
    const repository = createObservationCorrectionRepository(database);

    repository.add({
      id: "correction-1",
      observationId: "observation-1",
      originalStatus: "not_completed",
      correctedStatus: "completed",
      correctedAt: "2026-09-23T10:00:00.000Z",
      reason: "The observation was recorded incorrectly.",
    });

    expect(repository.listForObservation("observation-1")).toEqual([
      {
        id: "correction-1",
        observationId: "observation-1",
        originalStatus: "not_completed",
        correctedStatus: "completed",
        correctedAt: "2026-09-23T10:00:00.000Z",
        reason: "The observation was recorded incorrectly.",
      },
    ]);
  });

  it("preserves correction history when multiple corrections exist", () => {
    const database = createDatabase();
    const repository = createObservationCorrectionRepository(database);

    repository.add({
      id: "correction-1",
      observationId: "observation-1",
      originalStatus: "not_completed",
      correctedStatus: "completed",
      correctedAt: "2026-09-23T10:00:00.000Z",
      reason: "First correction.",
    });

    repository.add({
      id: "correction-2",
      observationId: "observation-1",
      originalStatus: "completed",
      correctedStatus: "not_completed",
      correctedAt: "2026-09-23T11:00:00.000Z",
      reason: "Second correction.",
    });

    const corrections = repository.listForObservation("observation-1");

    expect(corrections).toHaveLength(2);
    expect(corrections[0]?.id).toBe("correction-1");
    expect(corrections[1]?.id).toBe("correction-2");
  });

  it("orders same-timestamp corrections deterministically by id", () => {
    const database = createDatabase();
    const repository = createObservationCorrectionRepository(database);

    repository.add({
      id: "correction-b",
      observationId: "observation-1",
      originalStatus: "not_completed",
      correctedStatus: "completed",
      correctedAt: "2026-09-23T10:00:00.000Z",
      reason: "Second correction.",
    });

    repository.add({
      id: "correction-a",
      observationId: "observation-1",
      originalStatus: "completed",
      correctedStatus: "not_completed",
      correctedAt: "2026-09-23T10:00:00.000Z",
      reason: "First correction.",
    });

    const corrections = repository.listForObservation("observation-1");

    expect(corrections.map((correction) => correction.id)).toEqual([
      "correction-a",
      "correction-b",
    ]);
  });

  it("returns no corrections when an observation has none", () => {
    const database = createDatabase();
    const repository = createObservationCorrectionRepository(database);

    expect(repository.listForObservation("observation-1")).toEqual([]);
  });
});
