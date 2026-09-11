# Security Architecture

## Purpose

Security protects the confidentiality, integrity, and availability of the personal experiment data and the application itself.

The local-first design reduces some external exposure but does not eliminate local security risks.

## Principles

- Minimize data collection.
- Minimize external data transmission.
- Keep secrets out of source control.
- Validate untrusted input.
- Use least privilege.
- Protect database integrity.
- Avoid unnecessary dependencies.
- Review security-sensitive changes explicitly.

## Local-first security

The primary experiment database is local in v1.

Cloud synchronization is explicitly out of scope for v1. See `docs/decisions/ADR-005-no-cloud-sync-v1.md`.

Local-first does not mean automatically secure. The application and local environment must still protect stored data and prevent unauthorized modification.

## Data integrity

Security includes protection against accidental or malicious modification of experiment history.

The system should preserve:

- original observations;
- corrections;
- scoring definitions;
- protocol amendments;
- historical results.

Database migrations must be reviewed and verified.

## Secrets

Secrets, credentials, private keys, API tokens, and environment-specific credentials must not be committed to the repository.

The security hook and project workflows should detect common secret patterns.

## Input handling

All externally or user-provided values must be validated at the appropriate application/domain boundary.

Do not rely solely on UI validation for integrity or security.

## Dependencies

Dependencies should be kept minimal and reviewed for security and maintenance implications.

## Security verification

The project will provide:

```bash
pnpm security
```

once the actual security tooling is implemented.

Security-sensitive changes should follow:

`.agents/workflows/security-change.md`

and:

`.agents/skills/security-review/SKILL.md`

## UI/UX security considerations

Security and usability must be considered together.

UI changes must not:

- expose private experiment data unnecessarily;
- make destructive actions easy to trigger accidentally;
- hide important confirmation or correction information;
- obscure whether an action changes historical data.

Destructive or irreversible actions should have appropriate safeguards and clear user feedback.
