import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const databasePath = path.resolve("data/e2e.db");

fs.mkdirSync(path.dirname(databasePath), { recursive: true });
fs.rmSync(databasePath, { force: true });

const sqlite = new Database(databasePath);
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: "drizzle" });

sqlite
  .prepare("INSERT INTO experiment (id) VALUES (?)")
  .run("108-day-experiment");

sqlite
  .prepare(`
    INSERT INTO protocol_definition (
      id, experiment_id, version, effective_from_day, effective_to_day
    )
    VALUES (?, ?, ?, ?, ?)
  `)
  .run(
    "e2e-protocol-v1",
    "108-day-experiment",
    "v1",
    1,
    108,
  );

const insertProtocolItem = sqlite.prepare(`
  INSERT INTO protocol_item (
    id, protocol_definition_id, item_order, description, required
  )
  VALUES (?, ?, ?, ?, ?)
`);

for (let i = 1; i <= 13; i += 1) {
  insertProtocolItem.run(
    `e2e-protocol-item-${i}`,
    "e2e-protocol-v1",
    i,
    `E2E protocol condition ${i}`,
    1,
  );
}

const insertDay = sqlite.prepare(`
  INSERT INTO experiment_day (id, experiment_id, day_number, date)
  VALUES (?, ?, ?, ?)
`);

insertDay.run("e2e-day-46", "108-day-experiment", 46, "2026-10-22");
insertDay.run("e2e-day-47", "108-day-experiment", 47, "2026-10-23");

sqlite
  .prepare(`
    INSERT INTO scoring_definition (
      id, experiment_id, version, effective_from_day,
      effective_to_day, required_completed_count, expected_count
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  .run("e2e-scoring-v1", "108-day-experiment", "v1", 1, 46, 13, 13);

sqlite
  .prepare(`
    INSERT INTO scoring_definition (
      id, experiment_id, version, effective_from_day,
      effective_to_day, required_completed_count, expected_count
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  .run("e2e-scoring-v3", "108-day-experiment", "v3", 47, 108, 8, 13);

const insertObservation = sqlite.prepare(`
  INSERT INTO protocol_observation (
    id, experiment_day_id, protocol_item_id, status, observed_at
  )
  VALUES (?, ?, ?, ?, ?)
`);

for (let i = 1; i <= 13; i += 1) {
  insertObservation.run(
    `e2e-day-46-observation-${i}`,
    "e2e-day-46",
    `e2e-protocol-item-${i}`,
    "completed",
    "2026-10-22T08:00:00Z",
  );
}

for (let i = 1; i <= 13; i += 1) {
  insertObservation.run(
    `e2e-day-47-observation-${i}`,
    "e2e-day-47",
    `e2e-protocol-item-${i}`,
    i <= 8 ? "completed" : "not_completed",
    "2026-10-23T08:00:00Z",
  );
}

sqlite.close();

console.log(`E2E database seeded: ${databasePath}`);
