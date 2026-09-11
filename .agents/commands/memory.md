---
command: /memory
workflow: .agents/workflows/memory-management.md
skills:
  - .agents/skills/memory-management/SKILL.md
---

# /memory

Record, update, verify, or promote durable project context.

## Execution

1. Read `.agents/workflows/memory-management.md`.
2. Load `memory-management`.
3. Determine whether the information belongs in memory or in an authoritative document.
4. Verify consequential information against current project truth before recording it.
5. Store durable context in `.agents/memory/` only when appropriate.
6. Promote important architectural, product, experiment, or UX/UI decisions into their authoritative documents rather than relying on memory.

## Rule

Memory is context, not authority. It must never silently override ADRs, experiment specifications, product requirements, or `AGENTS.md`.
