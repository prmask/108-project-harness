# Agent System

## Purpose

The 108-Day Experiment uses a small, specialized AI engineering team rather than a large collection of generic agents. The agents are project-local instructions stored under `.agents/agents/`.

The system is designed around:

**Research → Understand → Plan → Specify → Test → Implement → Review → Verify → Document → Remember → Improve**

Agents do not replace the project's source-of-truth documents. They operate within them.

## Agent Roster

| # | Agent | Primary responsibility |
|---|---|---|
| 1 | `researcher` | Research unfamiliar technology, APIs, libraries, science, and approaches. |
| 2 | `product-architect` | Convert requirements into product behavior, flows, and acceptance criteria. |
| 3 | `ui-ux-designer` | Design information architecture, interactions, visual UI, data visualization, accessibility, and Figma handoff. |
| 4 | `system-architect` | Design application architecture, data model, boundaries, persistence, APIs, security, and performance. |
| 5 | `implementer` | Implement approved plans and designs in production code. |
| 6 | `test-engineer` | Test application behavior, edge cases, UI interactions, regressions, and data integrity. |
| 7 | `code-reviewer` | Fresh-context review for correctness, maintainability, security, tests, and approved design/spec adherence. |
| 8 | `security-reviewer` | Review secrets, local data, filesystem/tool access, injection, dependencies, APIs, and agent permissions. |
| 9 | `data-integrity` | Protect historical experiment data, scoring, calculations, migrations, and reproducibility. |
| 10 | `experiment-scientist` | Protect scientific validity, evidence interpretation, analytics, and resistance to confirmation bias. |
| 11 | `release-engineer` | Verify builds, tests, migrations, backups, security, release readiness, and documentation. |

## Where Information Belongs

### Agent behavior
Put agent-specific instructions in:

```text
.agents/agents/<agent-name>.md
```

These files define role, responsibilities, rules, collaboration, and output expectations.

### Project-wide rules
Put durable rules that apply to every agent in:

```text
AGENTS.md
```

Examples: no fabricated data, no silent requirement invention, research-first behavior, protected experiment specification, safe destructive-command policy, and source-of-truth hierarchy.

### Experiment truth
Put experiment facts and scientific rules in:

```text
docs/experiment/EXPERIMENT.md
docs/experiment/HYPOTHESES.md
```

Agents must read these when their task touches experiment behavior, scoring, data, or analysis.

### Product behavior
Put application requirements in:

```text
docs/product/
```

Examples: product specification, user flows, acceptance criteria, and feature requirements.

### Technical architecture
Put architecture decisions and technical constraints in:

```text
docs/architecture/
docs/decisions/
```

Use ADRs for important decisions that should remain historically traceable.

### Reusable capabilities
Put reusable procedures in:

```text
.agents/skills/
```

A skill describes how to perform a recurring type of work. It is not another agent.

### Multi-agent sequences
Put repeatable development processes in:

```text
.agents/workflows/
```

Examples: new feature, bug fix, database migration, experiment change, security change, and release.

### Persistent lessons / context
Put non-authoritative working memory in:

```text
.agents/memory/
```

Memory must never override the project specifications or explicit current instructions.

## Recommended Collaboration

### New feature

```text
Product Architect
      ↓
UI/UX Designer + System Architect
      ↓
Test Engineer
      ↓
Implementer
      ↓
Code Reviewer
      ↓
Security Reviewer / Data Integrity / Experiment Scientist (as applicable)
      ↓
Release Engineer
```

Researcher is inserted before decisions whenever unfamiliar technology or external knowledge is involved.

### Experiment or scoring change

```text
Product Architect
      ↓
Experiment Scientist + Data Integrity
      ↓
UI/UX Designer + System Architect
      ↓
Test Engineer
      ↓
Implementer
      ↓
Code Reviewer
      ↓
Release Engineer
```

No agent may silently rewrite historical experiment results.

## Important Boundary

The agent roster is an engineering mechanism. It is not itself the experiment specification. The experiment remains defined by the documents under `docs/experiment/`.
