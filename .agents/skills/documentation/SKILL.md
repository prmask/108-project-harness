# Documentation

## Purpose
Keep project documentation accurate, discoverable, and aligned with the implemented system.

## Information Placement
- Project-wide rules: `AGENTS.md`
- Agent behavior: `.agents/agents/`
- Reusable procedures: `.agents/skills/`
- Agent collaboration: `.agents/workflows/`
- Experiment truth: `docs/experiment/`
- Product requirements: `docs/product/`
- Technical architecture: `docs/architecture/`
- Decisions: `docs/decisions/`
- Research: `docs/research/`
- Non-authoritative context: `.agents/memory/`

## Procedure
1. Identify what changed.
2. Determine whether documentation is affected.
3. Update the authoritative document rather than duplicating information.
4. Preserve version/history when the change is consequential.
5. Check examples against actual behavior.
6. Remove stale claims when appropriate.
7. Keep documentation concise enough to remain usable.

## Rules
- Documentation must not describe unimplemented behavior.
- Memory is not authority.
- Important decisions belong in ADRs.
- Experiment changes must preserve historical definitions.

## Output
Updated documentation, files affected, and any unresolved documentation gaps.
