import Database from "better-sqlite3";

const databasePath = process.env.DATABASE_PATH ?? "./data/experiment.db";

export function createDatabase(): Database.Database {
  return new Database(databasePath);
}
