# Experiment Analysis

## Purpose

Analysis exists to evaluate what the observed evidence shows, what it does not show, and how that evidence relates to the stated hypotheses.

## Analysis principles

### Observation before interpretation

The system should first present what was recorded.

Interpretation must be identifiable as interpretation rather than appearing to be a measured fact.

### Missing data

Missing observations remain missing.

The analysis must not silently convert missing values into zero, failure, success, or an inferred value.

### Correlation vs causation

A temporal relationship or correlation does not by itself establish that the protocol caused an outcome.

The system must avoid causal language unless supported by an appropriate evidentiary basis.

### Historical integrity

Historical scoring must use the definition applicable to the relevant day.

Days 1–46 remain scored under Definition v1 and must never be retroactively recalculated under later definitions.

## Hypotheses

The primary hypotheses include:

### H1

Sustained protocol adherence improves financial outcomes.

### H2

Repeatedly internalizing the achieved-goal state improves focus, behavior, opportunity recognition, and execution.

### H3

Health and discipline transformation improves other areas through behavioral mechanisms.

### H4 — Exploratory

Financial improvement may exceed what can be explained by observable behavioral mechanisms.

H4 is difficult to establish and may remain unsupported or inconclusive.

## Evidence classification

Weekly and experiment reviews should distinguish:

- supporting evidence;
- challenging evidence;
- neutral evidence;
- missing evidence.

This prevents analysis from selecting only evidence that supports a preferred conclusion.

## Recommended analysis sequence

```text
1. Validate data completeness
2. Preserve missingness
3. Confirm metric/scoring versions
4. Describe observations
5. Examine relevant patterns
6. Identify supporting/challenging/neutral evidence
7. State uncertainty
8. Interpret cautiously
9. Compare interpretation with hypotheses
10. Record conclusions without overstating causality
```

## UI/UX requirements for analysis

Dashboards and reports must:

- show missingness where it affects interpretation;
- avoid hiding unfavorable results;
- distinguish raw observations from derived metrics;
- distinguish derived metrics from interpretation;
- avoid visually implying causal direction without evidence;
- make time periods and metric definitions clear;
- preserve historical scoring.

Charts should include enough context to prevent misleading interpretation, particularly around incomplete periods, changed definitions, and small samples.

## Analysis changes

Changes to analytical definitions must be documented.

Changes that affect protected historical experiment results must not silently overwrite previous results. Where necessary, preserve the previous analysis/version and record the change.
