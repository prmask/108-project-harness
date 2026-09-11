# Experiment Change Workflow

## Purpose
Control changes that could alter the meaning, comparability, or validity of the 108-Day Experiment.

## Flow
Requested change
→ Experiment Scientist
→ Data Integrity
→ Impact analysis
→ Explicit user approval
→ Version specification
→ Record amendment
→ UX/Architecture/Implementation as needed
→ Tests
→ Historical verification
→ Documentation

## Steps

1. Identify exactly what is proposed to change.
2. Read `AGENTS.md`, `docs/experiment/EXPERIMENT.md`, and `docs/experiment/HYPOTHESES.md`.
3. Determine whether the change affects experiment meaning or comparability.
4. Experiment Scientist evaluates methodological implications.
5. Data Integrity evaluates historical-data implications.
6. Explain risks and effects to the user when consequential.
7. Obtain explicit user authorization before changing the experiment.
8. Preserve the previous definition.
9. Version the new definition and record date, reason, and authorization.
10. Implement the change.
11. Add/update tests.
12. Verify historical results remain governed by their original definitions.
13. Update experiment documentation and relevant UI/analytics.

## Non-negotiable Rules
- Never silently change the experiment.
- Never retroactively apply a later scoring definition to earlier days.
- Missing data is not zero.
- Never modify historical records to improve results.
