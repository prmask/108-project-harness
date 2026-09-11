# 108-Day Experiment

A local-first personal laboratory for running, recording, and analyzing a 108-day experiment.

## Experiment

- Duration: 108 days
- Period: 7 September 2026 – 23 December 2026
- Starting weight: 87.7 kg
- Target weight: 75 kg
- Financial target: ₹3,00,000/month
- Goal statement: “I create 3 lakh per month through focused, valuable work that I consistently execute.”

The application is an **experiment/research instrument**, not a generic habit tracker.

## Project principles

- Research before implementation when uncertainty matters.
- Do not invent requirements.
- Keep business logic independent from UI.
- Missing data is not zero.
- Observation is distinct from interpretation.
- Correlation is not causation.
- Historical experiment data is protected.
- Historical scoring definitions are versioned.
- Protocol changes require explicit approval and an amendment.
- Never claim work or verification that did not actually occur.

## Knowledge hierarchy

```text
AGENTS.md
    ↓
Product / Experiment / Architecture documentation
    ↓
Architecture Decision Records
    ↓
Research
    ↓
.agents/memory
```

`AGENTS.md` is the project constitution. The documents under `docs/` are authoritative project knowledge. ADRs record meaningful architectural decisions. Memory provides context but is not authority.

## Engineering harness

The project uses:

- `.agents/agents/` — specialist agents
- `.agents/skills/` — reusable methods
- `.agents/workflows/` — documented processes
- `.agents/commands/` — thin command entry points
- `.agents/hooks/` — automatic guardrails
- `.agents/memory/` — durable non-authoritative context

## UI/UX

The UI is part of the research instrument.

Interface work must preserve:

- missing vs zero;
- historical records;
- correction states;
- observation vs interpretation;
- unfavorable and incomplete evidence;
- responsive behavior;
- accessibility;
- appropriate loading, empty, error, success, and historical states.

Charts and dashboards must not imply unsupported causation.

## Development

The development command contract is documented in:

`docs/development/DEVELOPMENT-COMMANDS.md`

The primary local quality gate will be:

```bash
pnpm verify
```

Once the application scaffold exists, it must run lint, typecheck, tests, and build.

## Status

This repository is being built incrementally. Documentation and harness components must not be treated as evidence that application functionality has already been implemented.
