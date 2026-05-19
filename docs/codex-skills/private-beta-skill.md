# ShiftPlan Private Beta Skill

## Purpose

Use this skill for beta operations, tester workflow docs, QA checklists, follow-up messages, and beta-readiness decisions.

## When To Use

- Tester tracking templates.
- Manual QA plans.
- Follow-up message docs.
- App Access Codes QA documentation.
- Deciding when to invite more testers.

## Must-Read Context

- `docs/codex-skills/shiftplan-core-rules.md`
- `docs/codex-task-queue.md`
- `docs/shiftplan-phase-2-manual-qa.md` if present.
- `docs/tester-app-walkthrough.md` if tester-facing flow is involved.

## Rules

- Start with small tester batches.
- Do not add public account creation or Supabase Auth.
- Do not automate email follow-ups unless explicitly requested.
- Do not create or expose real access codes in docs.
- Avoid collecting sensitive health, workplace safety, or medical details.
- Build from repeated patterns, not one-off requests.

## Required Checks

- Run `npm run lint`.
- Run `npm run build`.
- Confirm docs only unless task explicitly requests runtime changes.
- Confirm no secrets or real tester private data are included.
- Keep manual QA tasks visible when they are still pending.

## Report Format

- Beta ops artifact:
- Files changed:
- Tester flow supported:
- Privacy/safety considerations:
- Lint/build:
- Next manual QA step:

## Common Mistakes To Avoid

- Treating private beta as a public launch.
- Scaling tester invites before fresh `/app` QA passes.
- Including real access codes or private tester details in git.
- Building new features before collecting repeated tester evidence.
