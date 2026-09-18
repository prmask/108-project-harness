import { spawnSync } from 'node:child_process';

const result = spawnSync(
  process.execPath,
  ['.harness/record-evidence.mjs', 'pnpm', 'verify'],
  {
    stdio: 'inherit',
    shell: false,
  },
);

const exitCode =
  typeof result.status === 'number'
    ? result.status
    : 1;

if (exitCode === 0) {
  console.log('\nINDEPENDENT VERIFICATION: PASS');
} else {
  console.error(`\nINDEPENDENT VERIFICATION: FAIL (exit ${exitCode})`);
}

process.exit(exitCode);
