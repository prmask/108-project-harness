# 108-Day Experiment Hooks

Hooks are automatic guardrails.

## Guardrails

- TypeScript edits → formatting and linting.
- Pre-commit → secrets, database, experiment, UI checks, typecheck, and tests.
- Database changes → migration verification.
- Experiment specification changes → explicit approval.
- Destructive commands → explicit approval.
- Significant UI changes → UX/UI workflow warning.
- Experiment-facing UI/analytics changes → scientific-integrity warning.

## Relationship

- `AGENTS.md` = what rules must be obeyed.
- `.agents/agents/` = who performs specialized work.
- `.agents/skills/` = how reusable work is performed.
- `.agents/workflows/` = in what order work is performed.
- `.agents/hooks/` = automatic guardrails.
- `docs/` = authoritative project and experiment information.

UX/UI is included as a guardrail because interface and visualization changes can affect both usability and interpretation of experiment evidence.
