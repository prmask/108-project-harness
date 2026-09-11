---
command: /review
workflow: .agents/workflows/new-feature.md
skills:
  - .agents/skills/code-review/SKILL.md
  - .agents/skills/ux-ui-design/SKILL.md
---

# /review

Perform a fresh-context review of a completed change.

## Execution

1. Read the owning workflow and relevant ADRs.
2. Load `code-review`.
3. Review against requirements, architecture, tests, security, maintainability, and scope.
4. If UI/UX changed, load `ux-ui-design` and review information architecture, interaction states, accessibility, responsive behavior, and experiment-integrity implications.
5. For experiment-facing screens, check that unfavorable/missing evidence is not hidden and that visualizations do not imply unsupported causation.
6. Identify concrete findings and required fixes.

## Rule

Review independently of the implementation context where practical; do not merely restate the implementer's claims.
