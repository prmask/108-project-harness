# ADR-003 — Drizzle ORM

## Context

The application needs a typed database access layer while retaining close control over SQL, schema definitions, and migrations.

The project values simple architecture and explicit data behavior.

## Decision

The application will use **Drizzle ORM** for database schema definition, typed queries, and migrations.

## Alternatives

1. Prisma.
2. Raw SQL without an ORM/query builder.
3. Another TypeScript ORM/query builder.

## Consequences

### Positive

- Strong TypeScript integration.
- SQL remains relatively visible and explicit.
- Schema and migrations can be kept close to the application code.
- Fits the project's preference for a lightweight database layer.

### Negative

- The team must understand both Drizzle and SQL.
- Changing ORM later would require migration/access-layer work.
- Database behavior must still be reviewed directly; the ORM does not replace data-integrity review.

## Date

2026-09-10

## Status

Accepted
