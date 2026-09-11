---
command: /experiment-review
workflow: .agents/workflows/experiment-change.md
skills:
  - .agents/skills/experiment-integrity/SKILL.md
  - .agents/skills/data-analysis/SKILL.md
---

# /experiment-review

Review an experiment-related change, analysis, interpretation, or proposed protocol modification.

## Execution

1. Read the relevant experiment documents and `.agents/workflows/experiment-change.md`.
2. Load `experiment-integrity`.
3. Load `data-analysis` when analyzing observed data.
4. Check the versioned scoring definitions and historical-data protections.
5. Distinguish observation, analysis, interpretation, and hypothesis.
6. Treat missing data as missing, not zero.
7. Check for confirmation bias and unsupported causal claims.
8. For experiment-facing UI or charts, review whether the design could hide unfavorable evidence or imply causation.
9. If a protocol/rule change is proposed, require the documented approval and amendment process.

## Rule

Do not silently recalculate protected historical experiment results.
