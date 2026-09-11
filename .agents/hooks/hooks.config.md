# Hooks Configuration

These scripts are stored in `.agents/hooks/` and are intended to be connected to the hook/event system of the AI coding environment or Git.

## Hook mapping

| Event | Script | Action |
|---|---|---|
| After TypeScript edit | `after-typescript-edit.sh` | Format + lint |
| Before commit | `pre-commit.sh` | Secrets + DB + experiment + UI checks + typecheck + tests |
| Database-related change | `check-database-change.sh` | Detect and require migration verification |
| Experiment documentation change | `check-experiment-change.sh` | Warn/block until explicit approval |
| Destructive command | `guard-destructive-command.sh` | Block unless explicitly approved |
| Significant frontend/design change | `check-ui-change.sh` | Warn and route to UX/UI workflow |
| Experiment-facing UI/analytics | `check-ui-change.sh` | Additional experiment-integrity warning |

## Approval environment variables

- `MIGRATION_VERIFIED=true`
- `EXPERIMENT_CHANGE_APPROVED=true`
- `DESTRUCTIVE_COMMAND_APPROVED=true`

These are deliberate escape hatches and must only be set after the corresponding workflow has actually been completed. Do not put them in `.env` or commit them as configuration.

## Important

`.agents/hooks/` is the repository's hook library. The actual automatic execution depends on the host coding environment's hook configuration.

Do not claim a hook is active until it has been registered and tested in that environment.
