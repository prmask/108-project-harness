import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { createGitTestRepo } from './helpers/git-test-repo.js';

const root = process.cwd();
const hook = join(root, '.agents/hooks/check-database-change.sh');

type ProcessError = {
  status?: number;
  stdout?: string | Buffer;
  stderr?: string | Buffer;
};

function runHook(repo: string, env?: NodeJS.ProcessEnv) {
  try {
    const output = execFileSync('bash', [hook], {
      cwd: repo,
      encoding: 'utf8',
      env: {
        ...process.env,
        ...env,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    return {
      code: 0,
      output,
    };
  } catch (error: unknown) {
    const processError = error as ProcessError;

    return {
      code: processError.status ?? 1,
      output: `${processError.stdout ?? ''}${processError.stderr ?? ''}`,
    };
  }
}

describe('database change hook', () => {
  test('passes when no database-related file is staged', () => {
    const testRepo = createGitTestRepo();

    try {
      writeFileSync(
        join(testRepo.path, 'normal.txt'),
        'ordinary project text\n',
      );

      testRepo.git('add', 'normal.txt');

      const result = runHook(testRepo.path);

      expect(result.code).toBe(0);
      expect(result.output).toContain(
        'Database change check passed: no database/schema change detected.',
      );
    } finally {
      testRepo.cleanup();
    }
  });

  test('blocks a staged database change without migration verification', () => {
    const testRepo = createGitTestRepo();

    try {
      const migrationDir = join(testRepo.path, 'db', 'migrations');

      mkdirSync(migrationDir, { recursive: true });

      writeFileSync(
        join(migrationDir, '001-test.sql'),
        'CREATE TABLE test_table (id INTEGER);\n',
      );

      testRepo.git('add', 'db/migrations/001-test.sql');

      const result = runHook(testRepo.path);

      expect(result.code).not.toBe(0);
      expect(result.output).toContain(
        'BLOCKED: database/schema change detected without explicit migration verification.',
      );
    } finally {
      testRepo.cleanup();
    }
  });

  test('allows a staged database change with explicit migration verification', () => {
    const testRepo = createGitTestRepo();

    try {
      const migrationDir = join(testRepo.path, 'db', 'migrations');

      mkdirSync(migrationDir, { recursive: true });

      writeFileSync(
        join(migrationDir, '001-test.sql'),
        'CREATE TABLE test_table (id INTEGER);\n',
      );

      testRepo.git('add', 'db/migrations/001-test.sql');

      const result = runHook(testRepo.path, {
        MIGRATION_VERIFIED: 'true',
      });

      expect(result.code).toBe(0);
      expect(result.output).toContain(
        'Database change check passed with explicit migration verification.',
      );
    } finally {
      testRepo.cleanup();
    }
  });
});
