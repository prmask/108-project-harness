# ADR-002 — SQLite

## Context

The application needs a durable local database for structured experiment observations, protocol records, metrics, and related application data.

The project is local-first and should use a simple architecture with minimal operational overhead.

## Decision

The application will use **SQLite** as the primary database for v1.

## Alternatives

1. PostgreSQL.
2. MySQL/MariaDB.
3. Browser-only storage such as localStorage or IndexedDB.
4. A hosted database service.

## Consequences

### Positive

- Excellent fit for a local-first application.
- No separate database server is required.
- Simple backup and portability.
- Mature transactional and relational database semantics.

### Negative

- Multi-user and distributed write scenarios are not the target.
- Future cloud synchronization will require additional architecture.
- Large-scale concurrent workloads are outside the intended v1 scope.

## Date

2026-09-10

## Status

Accepted
