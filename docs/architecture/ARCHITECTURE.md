# Architecture

## Purpose

This document describes the intended application architecture for the 108-Day Experiment.

Architecture should remain simple and local-first while preserving separation between product behavior, business logic, data integrity, and presentation.

## Architectural principles

- Local-first.
- Minimal dependencies.
- Business logic independent from UI.
- Explicit data-integrity protections.
- Versioned experiment rules.
- Testable domain logic.
- No unnecessary cloud dependency.
- Architectural decisions are recorded as ADRs.

## High-level layers

```text
UI / Presentation
       ↓
Application / Use Cases
       ↓
Domain / Experiment Logic
       ↓
Data Access
       ↓
SQLite
```

The exact framework and implementation details are determined by the actual application scaffold and relevant ADRs.

## UI architecture

UI components should consume application/domain behavior rather than embedding experiment rules throughout presentation code.

Experiment rules such as successful-day scoring must have a single authoritative implementation.

The UI must explicitly handle appropriate:

- loading;
- empty;
- missing;
- error;
- success;
- correction;
- historical states.

## Experiment architecture

Experiment scoring and analysis must be version-aware.

The system must preserve:

- original observations;
- corrections;
- applicable scoring definitions;
- protocol amendments;
- historical results.

Days 1–46 must remain scored under Definition v1.

## Data flow

```text
User observation
    ↓
Validation
    ↓
Domain/application logic
    ↓
Persistence
    ↓
Derived metrics/analysis
    ↓
UI presentation
```

The persistence layer should not depend on UI assumptions.

## Verification

Changes should use the documented workflow, skills, tests, hooks, and `pnpm verify` quality gate once implemented.

## Architectural decisions

See `docs/decisions/` for accepted decisions including local-first architecture, SQLite, Drizzle, experiment data integrity, and no cloud synchronization in v1.
