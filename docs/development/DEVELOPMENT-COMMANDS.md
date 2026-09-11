# Development Commands

## Purpose

This document defines the development-command contract for the 108-Day Experiment application.

The commands are the standard developer interface for running, testing, verifying, and maintaining the project.

The command contract is defined before the application tooling is fully implemented. A command must not be treated as available until its underlying tool and script actually exist and have been verified.

## Command Set

The project should eventually provide:

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm verify

pnpm db:generate
pnpm db:migrate
pnpm db:backup
pnpm db:restore

pnpm security
```

## Minimum Verification Gate

`pnpm verify` is the project's primary local quality gate.

Once the application scaffold and tooling exist, it must run:

```text
pnpm lint
+
pnpm typecheck
+
pnpm test
+
pnpm build
```

A failure in any required stage must cause `pnpm verify` to fail.

The command must report actual execution results. It must never claim that a check passed when that check was not executed.

## Command Responsibilities

### `pnpm dev`

Starts the local development environment.

The development environment must support efficient iteration without requiring unnecessary cloud services.

### `pnpm build`

Creates a production build using the project's actual application tooling.

Build success does not by itself mean the feature is functionally or visually verified.

### `pnpm lint`

Runs the project's configured linting rules.

### `pnpm typecheck`

Runs the project's TypeScript/type validation.

### `pnpm test`

Runs unit and applicable integration tests. Business logic should be tested independently from UI implementation wherever practical.

### `pnpm test:e2e`

Runs end-to-end tests for critical user workflows.

For experiment-facing flows, E2E coverage should verify important states such as normal entry, missing data, empty states, correction flows, historical records, and relevant errors.

### `pnpm verify`

Runs the minimum verification gate:

```text
lint
→ typecheck
→ unit/integration tests
→ build
```

As the application matures, the pipeline may be expanded after additional checks are actually implemented.

### Database commands

`pnpm db:generate` generates database artifacts required by the selected database tooling.

`pnpm db:migrate` applies migrations. Database changes must follow:

```text
schema change
→ migration plan
→ backup where required
→ migration
→ migration verification
→ historical-data verification
```

`pnpm db:backup` creates a recoverable local database backup.

`pnpm db:restore` restores a valid backup. Restore procedures must be tested and must verify protected historical experiment data.

### `pnpm security`

Runs the project's configured security checks. It must not be considered complete until the underlying tooling and checks exist.

## Future Verification Layers

The minimum `pnpm verify` gate is intentionally small at first.

As the project matures, verification should eventually include:

```text
lint
+
typecheck
+
unit/integration tests
+
build
+
E2E
+
security
+
migration checks
+
UI/UX verification
+
experiment-integrity checks
```

These checks should be added only when their tooling and verification procedures exist.

## UI/UX Verification

The application is a research instrument, so a technically successful build is not sufficient for UI/UX correctness.

Changes affecting screens, navigation, forms, dashboards, charts, reports, or evidence presentation must follow the documented UX/UI workflow and skill.

Where applicable, verification must cover:

- information hierarchy and clarity;
- interaction behavior;
- loading, empty, missing, error, success, correction, and historical states;
- responsive behavior;
- accessibility;
- visual consistency;
- evidence-preserving analytics.

The interface must not:

- represent missing experiment data as zero;
- hide unfavorable or incomplete evidence;
- silently alter historical scoring;
- combine observation and interpretation misleadingly;
- imply causation where the data only establishes observation or association.

## Experiment Integrity

Development commands must support the experiment's integrity rules.

In particular:

- Missing data is not zero.
- Historical observations are protected.
- Historical scoring definitions are versioned.
- Days 1–46 remain scored under Definition v1 and must not be retroactively recalculated under later definitions.
- Protocol changes require the documented approval and amendment process.
- Database migrations require historical-data verification.
- Analytics and UI must preserve the distinction between evidence and interpretation.

## Relationship to the Engineering Harness

Development commands are executable project interfaces.

They are not substitutes for:

- `AGENTS.md` — project constitution;
- `docs/` — authoritative project and experiment documentation;
- `docs/decisions/` — architecture decisions;
- `.agents/workflows/` — documented engineering workflows;
- `.agents/skills/` — reusable methods;
- `.agents/commands/` — short AI command entry points;
- `.agents/hooks/` — automatic guardrails.

A development command must implement the relevant documented behavior rather than inventing a separate process.

## Current Status

The command names and responsibilities are defined by this document.

The actual `package.json` scripts should be added when the application scaffold and underlying tools are present.

Until then, do not report these commands as implemented merely because they are documented here.
