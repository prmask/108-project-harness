# Database Schema Design

## Status

Finalized

## Purpose

Define the minimum database model required for the first vertical slice of
the 108-Day Experiment application while preserving experiment integrity,
historical reproducibility, missing-data semantics, and auditable corrections.

## Scope

This design covers:

- Experiment
- Experiment Day
- Protocol Definition
- Protocol Item
- Protocol Observation
- Observation Correction
- Scoring Definition
- Daily Result
- Experiment Amendment

It does not yet define Health, Mind, Work, Wealth, Opportunities, Analytics,
or Hypothesis Analysis.

## Integrity Principles

- Missing data must not be represented as zero or not-completed.
- Observations are distinct from derived interpretations and results.
- Historical observations must not be silently overwritten.
- Corrections must preserve the original observation.
- Scoring definitions are versioned.
- Protocol definitions are versioned.
- Historical days remain associated with the definitions applicable to them.
- Experiment amendments are explicit and auditable.
- Derived daily results must identify the scoring definition used.

## Entities

### Experiment

One record representing the 108-Day Experiment.

### Experiment Day

Represents one numbered day within the experiment.

### Protocol Definition

A versioned definition of the daily protocol.

### Protocol Item

One condition within a protocol definition.

### Protocol Observation

The observed state of one protocol item on one experiment day.

### Observation Correction

An auditable correction to a protocol observation.

### Scoring Definition

A versioned definition determining whether a day is successful.

### Daily Result

The derived result calculated from observations using a specific scoring definition.

### Experiment Amendment

An authorized change to the experiment definition.

## Initial Scoring Definitions

- Version 1: Days 1–46, 13/13 required.
- Version 3: Days 47–108, at least 8/13 required.

Historical days must not be retroactively recalculated under a later definition.

## Initial Protocol

The initial protocol contains 13 conditions.

The exact protocol items are authoritative in the experiment specification and
must be represented as data rather than hard-coded throughout the UI.

## Database Design Decisions

### Field Types

- IDs use `TEXT`.
- Version and descriptive fields use `TEXT`.
- Day numbers and counts use `INTEGER`.
- Dates use ISO `YYYY-MM-DD` `TEXT`.
- Timestamps use ISO-8601 UTC `TEXT`.
- SQLite booleans use `INTEGER`.
- Observation status uses constrained `TEXT`.

### Observation Status

Observation status is a required `TEXT` value with exactly three allowed states:

- `completed`
- `not_completed`
- `missing`

Missing is distinct from not-completed and completed.

The database must enforce the allowed values with a `CHECK` constraint.

### Protocol Versioning

Protocol definitions are versioned records containing:

- version
- effective-from day
- effective-to day

The initial protocol is version `v1`, effective for Days 1–108.

Protocol items belong to a specific protocol definition.

Historical observations remain associated with the protocol definition applicable to their experiment day and must not be silently reassigned after a later protocol amendment.

### Observation Corrections

Corrections are separate, appendable audit records referencing the original observation.

Each correction records:

- observation ID
- original status
- corrected status
- reason
- correction timestamp

The original observation is preserved and is never silently overwritten.

Multiple corrections may exist for the same observation so the correction history remains auditable.

### Daily Result Policy

Daily results are derived records.

A daily result records the scoring definition used to produce it.

A result may be recalculated when a valid observation correction changes the underlying evidence.

A later scoring definition must never silently recalculate historical days.

Historical results remain traceable to the scoring definition applicable to the day.

### Database Constraints and Indexes

The database must use structural constraints including:

- `NOT NULL`
- `UNIQUE`
- `CHECK`
- foreign-key constraints

Important uniqueness constraints include:

- one experiment day number per experiment
- one experiment date per experiment
- one protocol version per experiment
- unique protocol-item order within a protocol definition
- unique protocol-item identifier within a protocol definition
- one original observation per experiment day and protocol item
- one current daily result per experiment day

Observation corrections are not unique per observation because multiple corrections are permitted.

Indexes should support:

- experiment-day lookup
- protocol-definition resolution
- protocol-observation retrieval
- observation-correction history
- scoring-definition resolution
- daily-result lookup
- experiment-amendment history

Database constraints enforce structural integrity. Experiment-specific behavioral rules remain in the domain/application layer.
