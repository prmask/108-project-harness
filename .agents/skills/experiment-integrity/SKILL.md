# Experiment Integrity

## Purpose
Protect the validity, reproducibility, and historical meaning of the 108-Day Experiment.

## When to Use
Use for changes involving protocol, scoring, dates, hypotheses, goal statement, measurements, calculations, analytics, historical records, experiment-facing UI, or amendments.

## Procedure
1. Read `AGENTS.md`, `docs/experiment/EXPERIMENT.md`, and `docs/experiment/HYPOTHESES.md`.
2. Identify the proposed change.
3. Determine whether it changes experimental meaning or comparability.
4. Identify affected historical and future records.
5. Require explicit user authorization for an experiment amendment.
6. Preserve the previous definition and version the amendment.
7. Never recalculate historical results under a later definition unless explicitly required for a separate, clearly labeled analysis.
8. Add or update tests.
9. Verify data integrity and reproducibility.
10. Document the change and its rationale.

## Rules
- Missing data is not zero.
- Observation is not interpretation.
- Correlation is not causation.
- Supporting evidence and challenging evidence must both remain visible.
- The system must be capable of concluding Not Supported or Inconclusive.
- Never modify the experiment merely to make it easier to pass.

## Output
Impact assessment, authorization/amendment record, affected definitions, tests, integrity verification, and documentation.
