# ShiftPlan Admin Feature Skill

## Purpose

Use this skill for safe `/admin` improvements, especially App Beta readability, manual fulfillment support, and internal QA workflows.

## When To Use

- Read-only admin display improvements.
- App Beta admin scanning improvements.
- App Access Codes copy or QA documentation.
- Manual fulfillment UI clarity that does not change security or business logic.

## Must-Read Context

- `docs/codex-skills/shiftplan-core-rules.md`
- `src/app/admin/AdminDashboard.tsx`
- Relevant `/api/admin/*` route only if the task explicitly changes behavior.
- Current paid/manual fulfillment rules in the user prompt.

## Rules

- Do not weaken admin password checks or route protections.
- Do not print or expose environment values.
- Do not change manual fulfillment behavior unless explicitly requested.
- Do not change paid intake route behavior.
- Prefer read-only display changes.
- Keep App Access Codes raw-code warnings intact.
- No schema changes unless explicitly requested.

## Required Checks

- Run `npm run lint`.
- Run `npm run build`.
- Confirm `/admin` compiles.
- If admin API behavior changes, test wrong-password rejection.
- Confirm no Stripe, paid intake, auth, or `/app` behavior changed unintentionally.

## Report Format

- Admin area changed:
- Files changed:
- Read-only or behavior-changing:
- Security impact:
- Manual fulfillment impact:
- Lint/build:
- Manual QA needed:

## Common Mistakes To Avoid

- Logging passwords, tokens, or environment values.
- Adding admin actions when the task asks for readability only.
- Changing paid fulfillment prompts or delivery flows during unrelated admin polish.
- Mixing App Beta admin changes with App Access Code behavior changes.
