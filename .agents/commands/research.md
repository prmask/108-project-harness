---
command: /research
workflow: .agents/workflows/research.md
skills:
  - .agents/skills/research-first/SKILL.md
---

# /research

Research a question, requirement, technology, architectural option, or uncertainty before implementation.

## Execution

1. Read `.agents/workflows/research.md`.
2. Load `research-first`.
3. Identify what is known, unknown, and decision-relevant.
4. Consult authoritative project documents and relevant ADRs.
5. For current external information, use appropriate external sources and distinguish sourced facts from inference.
6. Produce a concise evidence-backed research result and recommendation only where the evidence supports one.

## Rule

Do not use research as a pretext to reopen accepted architectural decisions without a concrete reason.
