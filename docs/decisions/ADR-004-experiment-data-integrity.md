# ADR-004 — Experiment Data Integrity

## Context

The application is a research instrument for a 108-day experiment. Historical observations and scoring are evidence, not ordinary mutable application state.

The system must prevent implementation convenience, UI behavior, or later interpretation from silently changing the experiment's historical record.

## Decision

Experiment data will be designed and implemented with explicit integrity protections:

1. Historical observations must be preserved.
2. Missing data is not equivalent to zero.
3. Observation must remain separate from interpretation.
4. Historical scoring definitions must be versioned.
5. Days 1–46 must remain scored under Definition v1 and must not be retroactively recalculated under later definitions.
6. Experiment protocol changes require explicit approval and a recorded amendment.
7. Corrections must preserve an auditable distinction between the original observation and the correction.
8. Analytics and UI must not hide unfavorable, incomplete, contradictory, or missing evidence.
9. Charts and other visualizations must not imply causation when the evidence only supports association or observation.
10. Data migrations must be tested and historical experiment data verified after migration.

## Alternatives

1. Treat all application records as freely mutable.
2. Recalculate historical scores whenever the current scoring rule changes.
3. Convert missing values to zero for simpler calculations.
4. Store observations and interpretations together.
5. Rely only on UI conventions rather than data-level protections.

## Consequences

### Positive

- Preserves the scientific integrity of the experiment.
- Makes historical analysis reproducible.
- Reduces the risk of accidental data loss or silent reinterpretation.
- Makes evidence and uncertainty visible to the user.
- Supports trustworthy analytics and UI.

### Negative

- Requires more explicit data modeling.
- Corrections and protocol amendments need additional records and workflow.
- Some apparently simple UI or database changes require review.
- Historical data may be less convenient to mutate, intentionally.

## Date

2026-09-10

## Status

Accepted
