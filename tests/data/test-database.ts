import Database from "better-sqlite3";

export function createTestDatabase(): Database.Database {
  const database = new Database(":memory:");

  database.exec(`
    CREATE TABLE experiment (
      id TEXT PRIMARY KEY
    );

    CREATE TABLE experiment_day (
      id TEXT PRIMARY KEY,
      experiment_id TEXT NOT NULL,
      day_number INTEGER NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY (experiment_id) REFERENCES experiment(id),
      UNIQUE (experiment_id, day_number),
      UNIQUE (experiment_id, date)
    );
  `);

  return database;
}
