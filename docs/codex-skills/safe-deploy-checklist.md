# ShiftPlan Safe Deploy Checklist

## Purpose

Use this checklist before pushing ShiftPlan commits or verifying a live deployment.

## When To Use

- Before pushing local commits to `main`.
- After Vercel deploys a new production commit.
- Before inviting more beta testers after a batch.

## Must-Read Context

- `docs/codex-skills/shiftplan-core-rules.md`
- `docs/codex-report-template.md`
- The user-provided push or verification checklist.

## Rules

- Do not push unless the user explicitly asks.
- Do not modify code during a push-only or verify-only task.
- Do not print environment values.
- Do not run destructive git commands.
- Confirm branch, status, latest commit, and remote before pushing.
- Confirm Stripe links when public site files changed.

## Required Checks

- `git status --short`
- `git branch --show-current`
- `git log -1 --oneline`
- `git remote get-url origin`
- `npm run lint` and `npm run build` when validating a local batch.
- Live route checks after deployment when requested.

## Report Format

- Git status:
- Branch:
- Commit(s):
- Push/deployment result:
- Routes checked:
- Stripe preservation:
- Errors:
- Ready or not ready:

## Common Mistakes To Avoid

- Pushing a dirty tree.
- Pushing the wrong branch.
- Verifying an old deployment.
- Reporting "ready" without noting skipped authenticated `/app` checks.
