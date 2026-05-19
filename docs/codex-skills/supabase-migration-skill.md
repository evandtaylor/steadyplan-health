# ShiftPlan Supabase Migration Skill

## Purpose

Use this skill only when a task explicitly calls for Supabase schema, SQL, policy, or table changes.

## When To Use

- New table, column, index, RLS policy, or migration file.
- Supabase query/data-shape changes that require schema support.
- Auth/account migration planning.

## Must-Read Context

- `docs/codex-skills/shiftplan-core-rules.md`
- Existing Supabase SQL or migration files.
- Relevant API route data shapes.
- User prompt confirming SQL is allowed.

## Rules

- Stop if SQL is not explicitly requested.
- Do not add Supabase Auth or public account creation unless explicitly requested.
- Do not expose service role keys, URLs, access codes, or environment values.
- Keep migrations narrow, reversible where practical, and documented.
- Preserve existing API behavior unless the task explicitly changes it.
- Keep RLS/security implications visible in the report.

## Required Checks

- Confirm SQL was explicitly authorized.
- Run `npm run lint`.
- Run `npm run build`.
- Review affected API routes for payload compatibility.
- Report every SQL file changed.
- Recommend manual Supabase verification if RLS or production data is involved.

## Report Format

- SQL task:
- SQL files changed:
- API files changed:
- Schema/security impact:
- Backward compatibility:
- Lint/build:
- Manual migration/verification needed:

## Common Mistakes To Avoid

- Sneaking SQL into a no-SQL task.
- Assuming Supabase Auth can be added as a small change.
- Printing environment values while debugging.
- Changing production data shapes without a migration plan.
