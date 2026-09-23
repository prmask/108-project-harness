import Database from "better-sqlite3";

const databasePath = "./data/experiment.db";

export function createDatabase(): Database.Database {
  return new Database(databasePath);
}
