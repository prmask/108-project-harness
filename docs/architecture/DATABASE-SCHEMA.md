# Database Schema Design

## Status

Draft

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

## Open Design Questions

- Exact field types
- Observation status representation
- Protocol-definition effective-date representation
- Correction representation
- Daily-result immutability/recalculation policy
- Database constraints and indexes

