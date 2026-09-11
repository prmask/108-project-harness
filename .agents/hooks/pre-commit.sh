#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

HOOKS_DIR="$ROOT/.agents/hooks"

"$HOOKS_DIR/check-secrets.sh"
"$HOOKS_DIR/check-database-change.sh"
"$HOOKS_DIR/check-experiment-change.sh"

if [[ ! -f package.json ]]; then
  echo "Pre-commit checks: package.json not found; code checks cannot run yet." >&2
  echo "Install the application scaffold before enabling the full pre-commit hook." >&2
  exit 1
fi

command -v pnpm >/dev/null 2>&1 || {
  echo "Pre-commit checks require pnpm." >&2
  exit 1
}

pnpm typecheck
pnpm test

echo "Pre-commit checks passed."
