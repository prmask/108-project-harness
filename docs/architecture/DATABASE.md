# Database Architecture

## Purpose

The database stores the structured observations and application state required by the 108-Day Experiment.

The database design must prioritize historical integrity and reproducibility.

## Database decision

The v1 database is SQLite.

The selected database access layer is Drizzle ORM.

See:

- `docs/decisions/ADR-002-sqlite.md`
- `docs/decisions/ADR-003-drizzle.md`
- `docs/decisions/ADR-004-experiment-data-integrity.md`

## Data modeling principles

The schema should distinguish, where applicable:

- experiment days;
- protocol conditions;
- observations;
- corrections;
- scoring-definition versions;
- successful-day results;
- metrics;
- hypotheses;
- analysis/interpretation;
- protocol amendments.

The exact schema should be designed from actual product requirements rather than invented prematurely.

## Historical integrity

Historical observations must not be silently overwritten.

Corrections should preserve sufficient information to understand that a correction occurred and what was changed.

Scoring results must remain reproducible using the definition applicable to the day.

Days 1–46 remain scored under Definition v1.

## Missing values

The database must preserve the distinction between:

- an explicitly recorded zero;
- a recorded false/no value;
- a missing/unrecorded observation;
- a corrected observation.

Application queries must not collapse these into one value.

## Migrations

Database changes follow:

```text
schema proposal
→ impact analysis
→ data-integrity review
→ migration plan
→ backup
→ migration
→ migration tests
→ historical-data verification
```

Destructive changes require explicit approval and appropriate safeguards.

## Backup and restore

The project will provide:

```bash
pnpm db:backup
pnpm db:restore
```

once the application database tooling is implemented.

Backup and restore procedures must be tested before being considered reliable.

## UI implications

Database semantics must remain visible in the UI where they affect interpretation.

For example, a missing database value must not appear as `0` merely because the UI component expects a number.

Historical and corrected records should have explicit UI states.
