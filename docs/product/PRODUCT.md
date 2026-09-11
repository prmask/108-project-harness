# Product Specification

## Purpose

The 108-Day Experiment application is a personal laboratory and research instrument for executing a defined daily protocol, recording observations, tracking outcomes, and analyzing relationships between behavior and results.

It is not intended to be a generic habit tracker.

## Primary user goal

Enable the user to:

1. execute the 108-day protocol;
2. record daily observations accurately;
3. see progress without distorting the evidence;
4. analyze health, discipline, work, and financial outcomes;
5. review hypotheses against observed evidence.

## Core product areas

### Daily experiment

The application should support recording the defined daily protocol and its observations.

The current protocol contains 13 conditions:

1. 03:50 Wake
2. 04:05 Light lamp + prayer
3. 04:10 Hanuman Chalisa
4. 04:20 Meditation
5. 04:50 Surya Namaskar
6. 05:20 Run
7. 06:00 Wake Lakshmi
8. 08:00 Kettlebell routine
9. 09:00 Start work
10. 10:00 Breakfast
11. 13:30 Lunch
12. 18:00 Begin 16-hour fast
13. 22:00 Sleep

### 3-6-9 structure

The experiment uses:

- 3 morning actions
- 6 afternoon actions
- 9 evening actions

for 18 planned actions per day and 1,944 planned actions across 108 days.

### Outcomes

The product should allow relevant outcomes to be recorded and analyzed, including weight and financial outcomes, without confusing outcome measurements with protocol adherence.

### Experiment analysis

The product should support evidence-based review of:

- successful-day performance;
- protocol adherence;
- outcome trends;
- hypothesis-relevant observations;
- missing data;
- supporting, challenging, and neutral evidence.

## Product integrity requirements

- Missing data must remain distinguishable from zero.
- Observations must remain distinct from interpretations.
- Historical scoring must remain tied to its applicable definition version.
- Days 1–46 remain scored under Definition v1 and must not be retroactively recalculated under later definitions.
- Corrections must preserve an auditable history.
- Protocol amendments must be explicit and approved.
- The product must not fabricate missing observations or outcomes.

## UX/UI principles

The interface should make the correct action easy without turning the experiment into a gamified score-chasing system.

Important states include:

- first-use/onboarding;
- today's protocol;
- incomplete day;
- missing observation;
- corrected observation;
- successful day;
- unsuccessful day;
- historical day;
- empty analysis;
- loading;
- error;
- unavailable/incomplete data.

Analytics should clearly distinguish measured observations from interpretations.

Charts should communicate uncertainty and missingness where relevant and must not visually imply causal relationships that have not been established.

## Out of scope for v1

The product should not silently expand into:

- cloud synchronization;
- a generic social habit platform;
- unsupported automated causal conclusions;
- retrospective changes to protected experiment scoring.

Specific future capabilities require documented requirements and, where architectural impact exists, an ADR.
