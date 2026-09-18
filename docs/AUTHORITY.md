# Authority and Conflict Resolution

## Purpose

This document defines the authority hierarchy for the 108-Day Experiment engineering system.

Its purpose is to prevent outdated memory, reusable skills, agent assumptions, or implementation convenience from overriding the current experiment and product truth.

## Authority hierarchy

When two sources disagree, use this order:

```text
1. Explicit current user instruction
2. Experiment specification
3. Product specification
4. Architecture decisions
5. AGENTS.md
6. Skills
7. Memory
8. Agent assumptions
```

The higher-authority source wins.

## 1. Explicit current user instruction

A clear instruction given by the user in the current interaction has the highest authority.

An explicit instruction must not be confused with an inferred preference.

Example:

```text
User explicitly says:
"Change the successful-day threshold."

```

This is an explicit instruction.

By contrast:

```text
"The user probably wants a more forgiving threshold."
```

is an agent assumption and has the lowest authority.

If an explicit current instruction changes an experiment rule, the experiment-change/amendment process must still be followed where required. Authority determines which instruction governs; it does not bypass required integrity controls.

## 2. Experiment specification

The experiment specification defines the experiment itself, including its protocol, scoring definitions, hypotheses, metrics, dates, and experiment rules.

Relevant documents include:

```text
docs/experiment/
```

Experiment rules must not be silently changed by product, architecture, UX, skills, memory, or agent assumptions.

Historical experiment results must remain protected.

### Experiment-document authority is scoped

The experiment specification is composed of documents with explicitly
defined responsibilities. Authority within the experiment domain is
determined by scope, not by filename or by a generic claim that one
document is authoritative for everything.

The following responsibilities are authoritative:

| Responsibility                                                                      | Authoritative document                         |
| ----------------------------------------------------------------------------------- | ---------------------------------------------- |
| Experiment purpose, hypotheses, dates, overall protocol, and experiment-level rules | `docs/experiment/EXPERIMENT.md`                |
| Canonical 13 daily protocol conditions                                              | `docs/experiment/EXPERIMENT.md`                |
| Successful-day definition and version history                                       | `docs/experiment/successful-day-definition.md` |
| Historical successful-day scoring                                                   | `docs/experiment/successful-day-definition.md` |
| Amendments to the successful-day definition                                         | `docs/experiment/successful-day-definition.md` |
| Other experiment/protocol amendments                                                | `docs/experiment/EXPERIMENT.md`                |

`docs/experiment/EXPERIMENT.md` does not override the versioned
successful-day definitions maintained in
`docs/experiment/successful-day-definition.md`.

`docs/experiment/successful-day-definition.md` does not override the
experiment protocol, hypotheses, dates, or other experiment-level
requirements defined by `docs/experiment/EXPERIMENT.md`.

Where a change crosses these scopes, the experiment-change/amendment
workflow must be used. No agent may resolve a cross-scope conflict by
silently editing either document.

## 3. Product specification

The product specification defines what the application is intended to do for the user.

Relevant documents include:

```text
docs/product/
```

Product requirements must be consistent with the experiment specification.

When a product requirement conflicts with an experiment rule, the experiment rule governs and the conflict must be resolved explicitly.

## 4. Architecture decisions

Accepted architectural decisions govern implementation choices.

Relevant documents include:

```text
docs/decisions/
docs/architecture/
```

Architecture decisions must support higher-authority experiment and product requirements.

A new architectural decision may supersede an old ADR through the documented ADR process; an agent must not silently rewrite history.

## 5. AGENTS.md

`AGENTS.md` is the project-wide engineering constitution.

It defines durable engineering rules and agent behavior.

It must not be used to silently override the experiment or product specifications.

## 6. Skills

Skills define reusable methods for performing work.

Examples include:

- research-first;
- UX/UI design;
- TDD;
- database changes;
- code review;
- security review;
- experiment integrity.

Skills describe **how** to perform work. They do not create or override product or experiment requirements.

## 7. Memory

Project memory provides durable context that may help agents work efficiently.

Memory is not authoritative.

Memory can become stale.

Agents must verify consequential memory against higher-authority sources before relying on it.

Memory must never silently override experiment, product, architecture, or project rules.

## 8. Agent assumptions

Agent assumptions are the lowest-authority information.

Agents may make reasonable implementation assumptions only when they do not alter requirements, experimental meaning, architecture decisions, data semantics, security posture, or UX intent.

If an assumption materially affects those areas, the agent must stop and ask for clarification or use the appropriate documented workflow.

## Conflict-resolution procedure

When a conflict is detected:

```text
Conflict detected
        ↓
Identify the sources
        ↓
Rank sources using this hierarchy
        ↓
Follow the highest-authority source
        ↓
Do not silently rewrite the lower-authority source
        ↓
Determine whether the lower source is stale
        ↓
Update it through the appropriate workflow
```

If two sources at the same authority level conflict, do not choose arbitrarily. Stop and report the conflict.

## Experiment-rule conflicts

If a proposed change affects:

- protocol conditions;
- successful-day definitions;
- historical scoring;
- hypotheses;
- metrics;
- experiment dates;
- interpretation methodology;

the experiment-change workflow must be used.

No agent may silently change protected experiment history.

## UI/UX conflicts

UI/UX decisions must respect the highest applicable authority.

For example:

```text
Experiment specification:
Missing data ≠ zero

UX proposal:
Display missing data as zero

Result:
The experiment specification wins.
The UI must represent missingness explicitly.
```

The UI must also preserve:

- historical scoring;
- original observations and corrections;
- unfavorable or incomplete evidence;
- observation vs interpretation;
- uncertainty and missingness;
- truthful chart semantics.

Visual design must not imply causation that the evidence does not establish.

## What agents must not do

Agents must not:

- use old memory to override current experiment rules;
- treat an agent assumption as a requirement;
- silently rewrite an ADR to resolve a conflict;
- silently rewrite experiment history;
- silently change scoring definitions;
- treat missing data as zero because a UI component expects a number;
- hide unfavorable evidence to make a dashboard look better;
- present an interpretation as an observation;
- claim a decision is approved when it is not.

## Authority does not eliminate workflow requirements

A higher-authority instruction may determine **what** should happen, while the relevant workflow determines **how** it must safely happen.

For example:

```text
User explicitly requests experiment-rule change
        ↓
User instruction has highest authority
        ↓
Experiment-change workflow
        ↓
Impact analysis
        ↓
Explicit amendment/versioning
        ↓
Implementation
        ↓
Historical verification
```

The authority hierarchy therefore governs conflicts without bypassing experiment integrity, security, testing, or review controls.

## Maintenance

Changes to this authority hierarchy are themselves architectural/governance changes and should be made deliberately.

Do not duplicate a different hierarchy in lower-level skills, memory, or agent files.
