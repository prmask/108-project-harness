#!/usr/bin/env bash
set -euo pipefail

changed="$(git diff --cached --name-only 2>/dev/null || true)"

ui_changed="$(printf '%s\n' "$changed" | grep -E '(^|/)(src/app|src/components|src/features|src/pages|components|pages|docs/product/design)(/|$)' || true)"

if [ -n "$ui_changed" ]; then
  echo "UI/DESIGN CHANGE DETECTED:"
  printf '%s\n' "$ui_changed"
  echo
  echo "Review whether this is a significant UX/UI change."
  echo "Significant changes should follow .agents/workflows/ux-ui-design.md."
fi

experiment_ui_changed="$(printf '%s\n' "$changed" | grep -Ei '(dashboard|analytics|chart|hypothesis|experiment|evidence|report)' | grep -E '(^|/)(src|docs)(/|$)' || true)"

if [ -n "$experiment_ui_changed" ]; then
  echo
  echo "WARNING: Experiment-facing UI/analytics modified."
  printf '%s\n' "$experiment_ui_changed"
  echo
  echo "Verify that the change:"
  echo "  - does not hide unfavorable evidence"
  echo "  - does not display missing data as zero"
  echo "  - does not imply causation from correlation"
  echo "  - preserves observation vs interpretation"
  echo "  - preserves historical scoring visibility"
fi
