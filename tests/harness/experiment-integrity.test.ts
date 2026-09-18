import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { createGitTestRepo } from './helpers/git-test-repo.js';

const root = process.cwd();
const hook = join(root, '.agents/hooks/check-experiment-change.sh');

function runHook(repo: string, env?: NodeJS.ProcessEnv) {
  try {
    const output = execFileSync('bash', [hook], {
      cwd: repo,
      encoding: 'utf8',
      env: {
        ...process.env,
        EXPERIMENT_CHANGE_APPROVED: undefined,
        ...env,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    return {
      code: 0,
      output,
    };
  } catch (error: unknown) {
    const processError = error as {
      status?: number;
      stdout?: string | Buffer;
      stderr?: string | Buffer;
    };

    return {
      code: processError.status ?? 1,
      output: `${processError.stdout ?? ''}${processError.stderr ?? ''}`,
    };
  }
}

describe('experiment integrity hook', () => {
  test('passes when no experiment file is staged', () => {
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
        'Experiment change check passed: no experiment specification change detected.',
      );
    } finally {
      testRepo.cleanup();
    }
  });

  test('blocks a staged experiment change without approval', () => {
    const testRepo = createGitTestRepo();

    try {
      const experimentDir = join(testRepo.path, 'docs', 'experiment');
      mkdirSync(experimentDir, { recursive: true });

      writeFileSync(
        join(experimentDir, 'test-change.md'),
        'temporary experiment definition change\n',
      );

      testRepo.git('add', 'docs/experiment/test-change.md');

      const result = runHook(testRepo.path);

      expect(result.code).not.toBe(0);
      expect(result.output).toContain(
        'BLOCKED: explicit experiment-change approval is required.',
      );
    } finally {
      testRepo.cleanup();
    }
  });

  test('allows a staged experiment change with explicit approval', () => {
    const testRepo = createGitTestRepo();

    try {
      const experimentDir = join(testRepo.path, 'docs', 'experiment');
      mkdirSync(experimentDir, { recursive: true });

      writeFileSync(
        join(experimentDir, 'test-change.md'),
        'temporary approved experiment definition change\n',
      );

      testRepo.git('add', 'docs/experiment/test-change.md');

      const result = runHook(testRepo.path, {
        EXPERIMENT_CHANGE_APPROVED: 'true',
      });

      expect(result.code).toBe(0);
      expect(result.output).toContain(
        'Experiment change check passed with explicit approval.',
      );
    } finally {
      testRepo.cleanup();
    }
  });
});
