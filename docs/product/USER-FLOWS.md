# User Flows

This document defines the major user journeys. Detailed screen design belongs in the UX/UI workflow and skill.

## 1. Start the experiment

```text
Open application
    ↓
See experiment status
    ↓
See current day
    ↓
Review today's protocol
    ↓
Begin/continue daily recording
```

The interface should make the current experiment day and protocol status immediately understandable.

## 2. Record daily protocol

```text
Open today's day
    ↓
View protocol conditions
    ↓
Record each observation
    ↓
Leave genuinely unknown items as missing
    ↓
Review recorded observations
    ↓
Save
```

The UI must never force the user to enter zero merely because an observation is unavailable.

## 3. Correct an observation

```text
Open historical/current observation
    ↓
Choose correction
    ↓
Provide corrected value/status and reason where required
    ↓
Preserve original observation
    ↓
Save correction
    ↓
Display current interpretation with history available
```

Corrections must not erase the original evidence.

## 4. Review a day

```text
Open day
    ↓
See protocol observations
    ↓
See successful-day result where applicable
    ↓
See missing observations explicitly
    ↓
Review outcome measurements
    ↓
Review notes/interpretation separately
```

Successful-day status must use the scoring definition applicable to that day.

## 5. Review experiment progress

```text
Open dashboard/analysis
    ↓
Select metric or period
    ↓
View observations
    ↓
See missingness where relevant
    ↓
Compare trends
    ↓
Read interpretation separately from observations
```

The dashboard must not hide unfavorable or incomplete evidence.

## 6. Review hypotheses

```text
Open hypothesis analysis
    ↓
Select hypothesis
    ↓
Review relevant observations
    ↓
Review supporting evidence
    ↓
Review challenging evidence
    ↓
Review neutral/missing evidence
    ↓
Read interpretation
```

The interface must not present an association as proof of causation.

## 7. Review historical days

```text
Select historical day
    ↓
View original observations
    ↓
View applicable scoring definition
    ↓
View corrections/amendments where applicable
```

Historical results must remain reproducible.

## 8. Weekly review

```text
Open weekly review
    ↓
Select applicable seven-day period
    ↓
Review adherence
    ↓
Review outcomes
    ↓
Review supporting/challenging/neutral/missing evidence
    ↓
Record interpretation separately
```

The weekly review is an evidence review, not a motivational scorecard.

## UX/UI verification

For implemented flows, verify:

- keyboard and accessible interaction where applicable;
- responsive layouts;
- loading/empty/error/success states;
- missing-data states;
- correction states;
- historical states;
- clear distinction between observation and interpretation;
- evidence-preserving charts and summaries.
