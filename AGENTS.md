# AGENTS.md

# 108-Day Experiment — Agent Constitution

## 1. Project Identity

This repository contains the software system for the **108-Day Experiment**.

The application is a **local-first personal experiment platform** designed to help the user execute, observe, measure, and analyze a 108-day personal protocol.

The experiment investigates whether sustained improvement in physical health, discipline, mental state, work behavior, and intentional goal visualization is associated with substantial improvement in financial outcomes.

The application is simultaneously:

1. A personal execution system.
2. A longitudinal data collection system.
3. A personal analytics system.
4. An experiment journal.
5. An evidence-analysis system.

The application must not merely function as a habit tracker.

It must preserve the distinction between:

```
Protocol
    ↓
Internal state
    ↓
Behavior
    ↓
Opportunities
    ↓
Financial outcomes
```

The system must make it possible to examine this chain retrospectively.

---

# 2. Core Development Philosophy

The project follows a research-first, specification-first, test-first development philosophy.

The standard development loop is:

```
Understand
    ↓
Research
    ↓
Plan
    ↓
Specify
    ↓
Test
    ↓
Implement
    ↓
Review
    ↓
Verify
    ↓
Document
    ↓
Remember
    ↓
Improve
```

Agents must not skip stages merely because a task appears simple.

The depth of the process should be proportional to the risk and complexity of the change.

---

# 3. Authority Hierarchy

When information conflicts, use the following order of authority:

1. Explicit current user instruction
2. Experiment specification
3. Product specification
4. Architecture decisions
5. AGENTS.md
6. Skills (`engineering-harness02/skills/`, accessible via `.agents/skills/`)
7. Memory (`engineering-harness02/core/memory/`, accessible via `.agents/memory/`)
8. Agent assumptions

Lower-level information must not silently override higher-level information.

If two authoritative documents conflict, stop and report the conflict rather than choosing arbitrarily.

---

# 4. General Engineering Principles

## 4.1 Research before implementation

Research unfamiliar:

- libraries
- frameworks
- APIs
- database capabilities
- browser APIs
- security mechanisms
- scientific/statistical methods
- third-party integrations

before implementation.

Prefer current primary documentation.

Do not rely on remembered APIs when current documentation can be consulted.

Record important research findings in:

```
docs/research/
```

---

## 4.2 Never invent requirements

Agents must not invent product requirements.

If a requirement is ambiguous and the ambiguity materially affects architecture, behavior, data integrity, or the experiment, ask for clarification.

Do not silently choose a behavior and present it as if it were specified.

Reasonable implementation details may be chosen autonomously when they do not alter product behavior or experimental meaning.

---

## 4.3 Prefer simple architecture

Use the simplest architecture capable of satisfying the requirements.

Do not introduce:

- microservices
- unnecessary APIs
- unnecessary abstractions
- unnecessary dependencies
- unnecessary state-management libraries
- cloud infrastructure
- authentication
- background services
- external databases

unless there is a demonstrated requirement.

Complexity must be justified.

---

## 4.4 Minimize dependencies

Before adding a dependency, determine:

1. Why it is necessary.
2. Whether the existing stack can solve the problem.
3. Whether the dependency is actively maintained.
4. Its security implications.
5. Its bundle/runtime cost.
6. Whether it creates unnecessary architectural coupling.

Do not install libraries merely because an agent is familiar with them.

---

## 4.5 Business logic must be independent of UI

Calculations and experiment rules must not be embedded directly inside React components.

Separate:

```
UI
  ↓
Application logic
  ↓
Domain logic
  ↓
Data persistence
```

Important calculations must be independently testable.

---

# 5. Data Integrity

Historical experiment data is valuable and must be treated as durable evidence.

Agents must assume that once recorded, historical observations are important.

## Never

- fabricate measurements
- infer missing measurements
- silently overwrite observations
- silently delete observations
- convert missing values into zero
- change historical protocol results
- change historical financial values
- rewrite journal entries
- alter historical experiment dates
- retroactively change calculations without preserving the previous methodology

If a correction is necessary, preserve the original record and record the correction.

---

# 6. Missing Data

Missing data is not zero.

Examples:

If the user did not record weight:

```
weight = NULL
```

not:

```
weight = 0
```

If revenue was not recorded:

```
revenue = NULL
```

not:

```
revenue = ₹0
```

If a workout was not logged:

```
workout = UNKNOWN
```

not:

```
workout = NOT DONE
```

The application must distinguish between:

- completed
- not completed
- skipped
- unknown
- not applicable
- not recorded

where appropriate.

---

# 7. Observation vs Interpretation

The application must distinguish between:

## Observation

Something directly recorded or objectively calculated.

Example:

> "I received three new business enquiries this week."

## Interpretation

A possible explanation for the observation.

Example:

> "My increased confidence may have improved my networking."

## Hypothesis

A broader proposition being tested.

Example:

> "Improved internal state causes increased opportunity recognition."

Agents must not convert interpretations into facts.

The UI and analytics must preserve this distinction.

---

# 8. Experiment Integrity

The 108-day experiment is a defined experiment, not merely a collection of habits.

The experiment specification is authoritative.

Once the experiment begins, the protocol must be treated as immutable unless the user explicitly authorizes an amendment.

The application must never silently modify:

- start date
- end date
- duration
- protocol
- successful-day definition
- goal statement
- repetition schedule
- hypotheses
- target values
- measurement definitions
- scoring methodology

---

# 9. Protocol Amendments

If the user requests a change to the experiment after it has begun:

1. Identify the requested change.
2. Explain its potential effect on comparability.
3. Obtain explicit user authorization.
4. Record the amendment.
5. Record the date.
6. Record the reason.
7. Preserve the previous definition.
8. Version the changed definition.
9. Never rewrite historical records to make them conform to the new definition.

Example:

If the original successful-day requirement is:

```
13/13 protocol items completed
```

and the user later changes it to:

```
10/13
```

the application must preserve the original 13/13 rule for previous days.

It must not recalculate previous days using 10/13.

---

# 10. Experiment Hypothesis Integrity

The application must be capable of disproving or failing to support the user's hypothesis.

Do not design analytics to confirm the hypothesis.

Do not selectively display favorable measurements.

Do not hide failed days.

Do not hide unfavorable financial results.

Do not automatically label correlations as causation.

The system must present:

- evidence supporting a hypothesis
- evidence contradicting a hypothesis
- neutral observations
- alternative explanations
- missing information
- uncertainty

The goal is evidence, not confirmation.

---

# 11. Health Data

Health measurements are observational data.

The application may calculate trends and descriptive statistics.

It must not present unsupported medical diagnoses or medical conclusions.

Do not fabricate:

- weight
- waist
- heart rate
- sleep
- exercise
- nutrition
- fasting
- running performance

If a measurement is unavailable, preserve it as unavailable.

Health calculations must be deterministic and reproducible.

---

# 12. Financial Data

Financial records are observational data.

Do not fabricate:

- revenue
- expenses
- profit
- customers
- leads
- opportunities
- cash received

Do not confuse:

```
potential opportunity value
```

with:

```
realized revenue
```

Do not confuse:

```
revenue
```

with:

```
profit
```

Do not treat an estimate as an actual financial result unless explicitly marked as an estimate.

---

# 13. Goal Visualization and 3-6-9 Practice

The 3-6-9 practice is part of the user's experimental protocol.

The application should support:

```
Morning: 3 repetitions
Afternoon: 6 repetitions
Evening: 9 repetitions
```

The purpose of the practice, as defined by the user, is to:

- repeatedly focus attention on the goal
- identify the internal feeling associated with having achieved the goal
- refine awareness of that feeling
- internalize the desired state
- use that state to influence behavior and focus

The application must record the practice without assuming that the practice has a scientifically established manifestation effect.

The system should distinguish:

```
practice completed
```

from:

```
desired outcome achieved
```

Do not present the 3-6-9 practice as scientifically proven to cause financial outcomes.

---

# 14. Goal Statement

The current goal statement is:

> I create ₹3 lakh per month through focused, valuable work that I consistently execute.

The wording must not be silently changed.

If the user changes the goal statement, treat that as an experiment amendment and preserve the previous version.

---

# 15. Daily Protocol

The current protocol is:

```
03:50 — Wake
04:05 — Light lamp and pray
04:10 — Hanuman Chalisa
04:20 — Meditation
04:50 — Surya Namaskar
05:20 — Run
06:00 — Wake Lakshmi
08:00 — Kettlebell routine
09:00 — Start work
10:00 — 3 boiled eggs and vegetables
13:30 — Lunch
18:00 — Start 16-hour fast
22:00 — Sleep
```

The protocol must be represented as data rather than hard-coded throughout the UI.

---

# 16. Definition of a Successful Day

A successful day is defined by execution of the prescribed daily protocol.

The user's definition is not:

> "I was productive all day."

The user may consider the day successful even if substantial leisure or unproductive activity occurs after the required protocol has been completed.

The application must therefore distinguish:

```
Protocol success
```

from:

```
Overall productivity
```

and:

```
Financial success
```

These are different variables.

---

# 17. Experiment Metrics

The system should track at minimum:

## Protocol

- scheduled item
- completion
- completion time where relevant
- skipped
- missed
- successful day
- daily adherence
- cumulative adherence
- streaks

## Goal practice

- morning repetitions
- afternoon repetitions
- evening repetitions
- total repetitions
- desired state
- feeling
- visualization
- insight
- state before
- state after

## Mind

- energy
- focus
- confidence
- clarity
- calm
- certainty
- gratitude
- possibility
- identity observations

## Health

- weight
- waist
- sleep
- sleep quality
- run distance
- run duration
- running performance
- kettlebell performance
- fasting
- nutrition adherence

## Work

- focused work
- deep work
- tasks completed
- projects worked on
- sales attempts
- proposals
- leads
- customers
- content/products created

## Wealth

- revenue
- cash received
- expenses
- profit
- customers
- leads
- potential opportunity value
- realized opportunity value

## Opportunities

- description
- source
- unexpected/not unexpected
- action taken
- potential value
- actual value
- outcome

---

# 18. Experiment Analysis

Analytics must distinguish:

```
Measurement
↓
Trend
↓
Correlation
↓
Possible mechanism
↓
Hypothesis
```

Do not skip directly from measurement to causation.

For example:

Incorrect:

> "Running caused my revenue to increase."

Preferred:

> "Running adherence increased during the same period that revenue increased."

Then investigate possible mechanisms.

Possible explanations may include:

- increased energy
- increased focused work
- increased sales activity
- increased confidence
- unrelated market conditions
- seasonality
- delayed effects from previous work
- random variation

The experiment-analysis system must consider alternative explanations.

---

# 19. Testing Requirements

Important business and experiment calculations must have automated tests.

Tests must cover:

- daily scoring
- protocol adherence
- 3-6-9 repetition counts
- date calculations
- 108-day boundaries
- weight changes
- financial calculations
- revenue/profit separation
- missing data
- monthly aggregation
- weekly aggregation
- experiment amendments
- historical data preservation

Every bug that can reasonably be prevented by a regression test should receive a regression test.

---

# 20. Review Requirements

Significant changes should be reviewed using fresh context whenever practical.

The reviewer should not assume that the implementation is correct merely because the implementation agent reports success.

Review:

- requirements
- architecture
- correctness
- tests
- data integrity
- security
- experiment integrity
- unnecessary complexity

---

# 21. Security

This application contains potentially sensitive personal, health, financial, journal, and business information.

Default to local-first operation.

Do not introduce remote data transmission unless explicitly required.

Do not expose the local database unnecessarily.

Never commit:

- API keys
- passwords
- tokens
- credentials
- private configuration

Protect:

```
.env
local databases
backups
exports
```

Use least privilege for agent tools and external integrations.

Do not install external tools, MCP servers, packages, or integrations without a legitimate project requirement.

---

# 22. Database Rules

The database must preserve historical integrity.

Schema changes require:

1. migration planning
2. migration implementation
3. migration testing
4. data-integrity verification

Never modify production/local experiment data manually when a deterministic migration can perform the change safely.

Before destructive migrations, create a backup.

---

# 23. UI Principles

The application is a serious personal experiment instrument.

It is not primarily a gamified habit tracker.

Prefer:

- clarity
- speed of data entry
- evidence
- trends
- chronology
- useful comparisons
- minimal friction
- honest representation of uncertainty

Avoid excessive:

- badges
- confetti
- arbitrary points
- motivational manipulation
- fake achievements
- gamification that obscures the experiment

The UI should help the user execute the protocol and understand the evidence.

---

# 24. Data Entry Principles

Daily logging should require minimal interaction.

Prefer:

- one-click completion
- keyboard-friendly controls
- sensible defaults
- quick numerical entry
- clear timestamps
- editable records
- explicit correction mechanisms

Never silently discard user-entered information.

---

# 25. Documentation

Architecture and important decisions must be documented.

Use:

```
docs/architecture/
docs/research/
docs/decisions/
docs/experiment/
```

If implementation changes architecture, update the architecture documentation.

If an important architectural decision is made, create an Architecture Decision Record.

Documentation must not describe behavior that the application does not actually implement.

---

# 26. Memory

Project memory is useful for:

- lessons learned
- recurring implementation patterns
- known pitfalls
- development preferences
- temporary context
- handoffs

Stored under `engineering-harness02/core/memory/` (accessible via `.agents/memory/`).

Memory is not authoritative.

When memory conflicts with project documentation, project documentation wins.

Important decisions must be promoted from memory into authoritative documentation.

Never use memory as justification for changing the experiment specification.

---

# 27. Git

Use Git for all development.

Keep commits small and logically coherent.

Prefer:

```
feat:
fix:
refactor:
test:
docs:
chore:
```

Do not mix unrelated changes in a single commit.

Do not rewrite Git history unless explicitly requested.

---

# 28. Change Scope

Agents should make the smallest change that correctly satisfies the request.

Do not:

- refactor unrelated code
- redesign unrelated components
- change dependencies unnecessarily
- modify experiment rules while implementing unrelated features
- rewrite working code merely for stylistic preference

If a larger architectural problem is discovered, document it separately unless fixing it is required for the current task.

---

# 29. No Fabricated Success

Agents must never claim that something works without verification.

Do not say:

> "Tests pass"

unless tests were actually run.

Do not say:

> "The build works"

unless the build was actually executed successfully.

Do not say:

> "The feature is complete"

unless the acceptance criteria have been verified.

Evidence must support claims.

---

# 30. Standard Development Workflow

For significant work:

```
1. Understand the request
2. Read relevant project documentation
3. Research unfamiliar technology
4. Identify affected components
5. Produce an implementation plan
6. Define acceptance criteria
7. Design tests
8. Implement
9. Run automated tests
10. Run typecheck/lint/build
11. Perform review
12. Perform security/data-integrity review when applicable
13. Verify behavior
14. Update documentation
15. Update memory when useful
16. Commit
```

The workflow may be shortened for trivial changes when no meaningful risk exists.

---

# 31. Definition of Done

A task is not complete merely because code has been written.

A significant feature is complete when:

- requirements are satisfied
- architecture is consistent
- tests exist
- tests pass
- typecheck passes
- lint passes
- build passes
- data integrity is preserved
- security implications have been considered
- documentation is updated where necessary
- acceptance criteria are verified

---

# 32. Agent Behavior

Agents should behave as specialized members of an engineering team.

Agents must:

- state assumptions
- distinguish facts from assumptions
- ask when ambiguity is consequential
- research when required
- preserve project conventions
- use existing abstractions where appropriate
- avoid unnecessary complexity
- verify their work
- report failures honestly

Agents must not:

- fabricate evidence
- silently change requirements
- silently change experiment rules
- hide failed tests
- hide uncertainty
- delete user data to make tests pass
- modify historical experiment records to improve results
- optimize the application toward proving the hypothesis

---

# 33. Special Rule: Protect the Experiment

The software exists to measure the experiment.

Therefore:

> **The application must never change the experiment merely to make the experiment easier to pass.**

If a requested software change could alter experimental validity, identify the risk before implementation.

The system must favor accurate evidence over encouraging results.

---

# 34. Special Rule: The User Owns the Experiment

The user has final authority over:

- experiment design
- protocol
- hypotheses
- goals
- amendments
- interpretation

Agents may identify methodological problems and recommend alternatives.

Agents must not silently impose their preferred experimental design.

---

# 35. Special Rule: Evidence Before Interpretation

When analyzing the experiment:

```
Facts first.
Interpretation second.
Causality last.
```

The system should be capable of saying:

> "We don't know."

Uncertainty is a valid result.

---

# 36. Project Objective

The ultimate objective is not merely to build a functioning application.

The objective is to build a reliable instrument that allows the user to answer, after 108 days:

> **What happened when I consistently lived according to this protocol?**

And more specifically:

1. Did my physical health improve?
2. Did my mental state change?
3. Did my behavior change?
4. Did my ability to execute change?
5. Did opportunities change?
6. Did my financial situation change?
7. Did the changes occur together?
8. What plausible mechanisms connect them?
9. What alternative explanations exist?
10. What evidence supports or challenges the original hypotheses?

The application should make these questions answerable from recorded evidence rather than memory or hindsight.
