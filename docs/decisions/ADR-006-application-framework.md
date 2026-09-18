# ADR-006 — Application Framework

## Context

The 108-Day Experiment application requires a web application framework for the
V1 local-first application.

The existing architecture defines the application layers but does not select
a specific web framework.

## Decision

V1 will use:

- Next.js
- React
- TypeScript

The application will use the existing local-first architecture with:

- SQLite
- Drizzle ORM
- Zod
- Vitest

Additional UI and testing dependencies will be introduced when required by
implemented vertical slices rather than installed prematurely.

## Scope

This decision establishes the application framework only.

It does not authorize:

- cloud synchronization;
- hosted databases;
- authentication;
- external APIs;
- unnecessary infrastructure.

Those remain governed by existing architecture decisions.

## Consequences

### Positive

- Provides the application framework required for the V1 UI.
- Works with the existing TypeScript foundation.
- Supports the planned layered architecture.
- Allows incremental implementation of vertical slices.

### Negative

- Introduces a larger application dependency surface than the current
  harness-only repository.
- Future framework changes would require an architectural review.

## Status

Accepted
