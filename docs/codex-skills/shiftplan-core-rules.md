# ShiftPlan Core Rules For Codex

These rules apply to ShiftPlan work unless the user explicitly overrides them for a specific task.

## Product Boundaries

- Keep ShiftPlan focused on lifestyle organization and routine planning.
- Do not provide medical advice, diagnosis, treatment, fatigue treatment, burnout treatment, sleep disorder guidance, medication guidance, supplement guidance, healthcare guidance, mental health guidance, workplace safety guidance, or emergency support.
- Preserve safety and legal language.
- Do not make medical, treatment, safety, or clinical claims.

## Protected Areas

- Do not change Stripe links unless explicitly asked.
- Do not break paid intake routes or paid intake API behavior.
- Do not break `/app`.
- Do not break `/admin` or manual fulfillment.
- Do not expose secrets.
- Do not print environment variable values.
- Do not change Supabase schema unless explicitly requested.
- Do not add Supabase Auth unless explicitly requested.
- Do not add public account creation unless explicitly requested.

## Engineering Rules

- Run `npm run lint` before each commit.
- Run `npm run build` before each commit.
- Make separate commits for separate tasks.
- Keep changes scoped to the requested task.
- Prefer no-SQL solutions when the task allows it.
- Preserve existing data payload shapes unless the task explicitly requires a compatible change.
- Do not use destructive git commands.

## Reporting Rules

- Report files changed.
- Report commit hashes.
- Report lint/build status.
- Report SQL needed or not.
- Report Stripe, `/app`, `/admin`, paid intake, auth, and safety impact.
- Report known issues or manual QA still needed.
