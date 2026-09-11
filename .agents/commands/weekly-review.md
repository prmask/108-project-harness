---
command: /weekly-review
workflow: .agents/workflows/weekly-review.md
skills:
  - .agents/skills/data-analysis/SKILL.md
  - .agents/skills/experiment-integrity/SKILL.md
---

# /weekly-review

Run the documented weekly experiment review.

## Execution

1. Read `.agents/workflows/weekly-review.md`.
2. Load `data-analysis` and `experiment-integrity`.
3. Review the latest applicable seven-day period.
4. Separate supporting, challenging, neutral, and missing evidence.
5. Do not convert missing observations into negative or positive outcomes.
6. Do not infer causation from temporal association alone.
7. Preserve historical scoring definitions.
8. If the review is surfaced through UI, ensure the presentation does not hide unfavorable or incomplete evidence.

## Rule

The weekly review is an evidence review, not a motivational scorecard.
