# ShiftPlan Security Review Skill

## Purpose

Use this skill when reviewing changes for secrets exposure, admin access risks, auth scope, payment safety, or data-handling issues.

## When To Use

- Any admin route or admin UI change.
- Any API route change.
- Any Supabase, Stripe, webhook, or session-cookie change.
- Before pushing a larger batch.
- When a task mentions security, secrets, or access.

## Must-Read Context

- `docs/codex-skills/shiftplan-core-rules.md`
- Relevant API/admin files.
- Current user constraints for Stripe, auth, admin, and Supabase.

## Rules

- Never expose secrets, tokens, passwords, raw access codes, or environment variable values.
- Do not weaken admin password or app access checks.
- Do not add Supabase Auth or public accounts unless explicitly requested.
- Do not change Stripe/webhook behavior unless explicitly requested.
- Preserve paid intake and admin/manual fulfillment behavior.
- Prefer read-only changes when reviewing admin data.

## Required Checks

- Inspect changed files for env var printing or secret leakage.
- Confirm no `.env*` files are changed or committed.
- Run `npm run lint`.
- Run `npm run build`.
- For admin/API changes, confirm wrong-password or unauthenticated behavior if practical.
- Report any residual manual security checks.

## Report Format

- Security area reviewed:
- Files changed:
- Secrets/env impact:
- Auth/admin/payment impact:
- API behavior changed or unchanged:
- Lint/build:
- Remaining risks:

## Common Mistakes To Avoid

- Logging request payloads that may contain private details.
- Committing raw beta access codes.
- Expanding API access while trying to improve admin readability.
- Treating schema or auth changes as low-risk.
