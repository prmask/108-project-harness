---
command: /implement
workflow: .agents/workflows/new-feature.md
skills:
  - .agents/skills/frontend-feature/SKILL.md
  - .agents/skills/tdd/SKILL.md
  - .agents/skills/ux-ui-design/SKILL.md
---

# /implement

Implement an approved plan or requested change using the project's documented engineering workflow.

## Execution

1. Read `.agents/workflows/new-feature.md`.
2. Load the relevant implementation and TDD skills.
3. Read relevant ADRs and authoritative project specifications.
4. If UI/UX is affected, follow `.agents/workflows/ux-ui-design.md` and the UX/UI skill before or alongside implementation as appropriate.
5. Preserve experiment-data integrity and historical behavior.
6. Write or update tests according to the workflow.
7. Run required verification before reporting completion.

## UI/UX requirements

For interface changes, explicitly account for:
- loading;
- empty;
- missing;
- error;
- success;
- correction;
- historical states;
- responsive behavior;
- accessibility;
- evidence-preserving charts and analytics.

## Rule

Do not implement an unapproved experiment-rule change merely because it appears convenient.
