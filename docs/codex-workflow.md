# ShiftPlan Codex Workflow

This workflow keeps ChatGPT planning, Codex implementation, commits, and reports consistent across handoffs.

## Roles

- ChatGPT keeps the product context, priorities, and task queue current.
- Codex reads the task queue, works in the repo, verifies changes, commits completed work, and reports back.
- The user moves reports between ChatGPT and Codex when needed.

## Standard Flow

1. ChatGPT creates or updates [codex-task-queue.md](./codex-task-queue.md).
2. Codex reads the task queue and the core rules before starting work.
3. Codex completes one task or a clearly safe batch.
4. Codex runs `npm run lint` and `npm run build` before each commit.
5. Codex creates separate commits for separate tasks.
6. Codex reports using [codex-report-template.md](./codex-report-template.md).
7. The user pastes the Codex report back to ChatGPT.
8. ChatGPT decides the next task, updates the queue, or asks Codex to push/verify.

## Codex Start Checklist

- Confirm the repo path.
- Check `git status --short`.
- Read the current task and constraints.
- Identify files likely to change.
- Confirm no task requires Stripe, admin, auth, schema, or safety changes unless explicitly requested.

## Commit Rules

- Keep commits small and task-specific.
- Do not mix unrelated public site, `/app`, `/admin`, API, and docs changes in one commit.
- Run lint/build before each commit.
- Do not commit broken or partially verified runtime changes.
- Do not push unless the user asks for a push.

## Reporting Rules

- Use the report template.
- Include commit hashes.
- Call out skipped or blocked tasks clearly.
- State whether SQL is needed.
- State whether Stripe, paid intake, `/admin`, `/app`, or safety language changed.
- State whether the work is safe to push.

## Stop Conditions

Stop and report before continuing if a task:

- Requires a Supabase schema change not explicitly requested.
- Requires Stripe changes not explicitly requested.
- Requires Supabase Auth or public account creation.
- Risks breaking paid intake routes or `/admin` fulfillment.
- Weakens safety/legal language.
- Would require exposing secrets or printing environment values.
