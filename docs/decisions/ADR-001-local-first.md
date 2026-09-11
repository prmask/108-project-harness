# ADR-001 — Local-First Architecture

## Context

The 108-Day Experiment is a personal laboratory and research instrument. Daily observations and experiment data should remain available without requiring a network connection or cloud service.

The architecture should minimize external dependencies and reduce unnecessary data movement.

## Decision

The application will use a **local-first architecture** for v1.

Core experiment data and primary application behavior must work locally without requiring cloud infrastructure.

## Alternatives

1. Cloud-first architecture.
2. Cloud-only data storage.
3. Local-first with optional future synchronization.

## Consequences

### Positive

- Works without network access.
- Keeps primary experiment data under the user's control.
- Reduces infrastructure complexity.
- Supports reliable daily logging.

### Negative

- Multi-device synchronization is not available in v1.
- Backup and recovery require explicit local mechanisms.
- Future sync, if introduced, will require a deliberate architectural decision.

## Date

2026-09-10

## Status

Accepted
