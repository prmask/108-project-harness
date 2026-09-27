import { execFileSync } from 'node:child_process';
import Database from 'better-sqlite3';
import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

const root = process.cwd();
const backupScript = join(root, 'scripts/db-backup.mjs');
const restoreScript = join(root, 'scripts/db-restore.mjs');

describe('database backup and restore', () => {
  test('creates a backup and restores the backup state', () => {
    const directory = mkdtempSync(join(tmpdir(), 'experiment-backup-'));
    const databasePath = join(directory, 'experiment.db');
    const backupDirectory = join(directory, 'backups');

    try {
      const database = new Database(databasePath);
      database.exec(
        'CREATE TABLE historical_test (id INTEGER PRIMARY KEY, value TEXT NOT NULL)',
      );
      database.prepare('INSERT INTO historical_test (value) VALUES (?)').run(
        'protected-history',
      );
      database.close();

      execFileSync('node', [backupScript], {
        cwd: root,
        env: {
          ...process.env,
          DATABASE_PATH: databasePath,
          BACKUP_DIRECTORY: backupDirectory,
        },
        stdio: 'pipe',
      });

      const createdBackup = new Database(
        join(
          backupDirectory,
          readdirSync(backupDirectory)[0],
        ),
        { readonly: true },
      );
      expect(
        createdBackup
          .prepare('SELECT value FROM historical_test WHERE id = 1')
          .get(),
      ).toEqual({ value: 'protected-history' });
      createdBackup.close();

      const changedDatabase = new Database(databasePath);
      changedDatabase
        .prepare('UPDATE historical_test SET value = ? WHERE id = 1')
        .run('changed-after-backup');
      changedDatabase.close();

      const backupFile = readdirSync(backupDirectory)[0];

      execFileSync('node', [restoreScript, join(backupDirectory, backupFile)], {
        cwd: root,
        env: {
          ...process.env,
          DATABASE_PATH: databasePath,
        },
        stdio: 'pipe',
      });

      const restoredDatabase = new Database(databasePath, { readonly: true });
      expect(
        restoredDatabase
          .prepare('SELECT value FROM historical_test WHERE id = 1')
          .get(),
      ).toEqual({ value: 'protected-history' });
      restoredDatabase.close();
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
