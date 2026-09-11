# ADR-005 — No Cloud Sync in v1

## Context

The application is intentionally local-first. Cloud synchronization would introduce additional infrastructure, authentication, conflict resolution, privacy considerations, failure modes, and data-integrity risks.

These concerns are not necessary to validate the core 108-day experiment.

## Decision

**Cloud synchronization is explicitly out of scope for v1.**

The application will not automatically synchronize experiment data to a cloud service in v1.

Any future synchronization capability requires a new architectural decision and must preserve experiment-data integrity.

## Alternatives

1. Implement cloud synchronization in v1.
2. Use a hosted database as the primary source of truth.
3. Add optional synchronization immediately but keep local storage.
4. Defer synchronization until a concrete need is established.

## Consequences

### Positive

- Keeps v1 architecture simpler.
- Avoids sync conflict and merge problems.
- Reduces privacy and security surface area.
- Keeps the experiment operational without internet access.
- Allows synchronization to be designed later from actual requirements.

### Negative

- No automatic multi-device synchronization in v1.
- The user must manage backups explicitly.
- A future sync feature may require schema and architecture changes.

## Date

2026-09-10

## Status

Accepted
