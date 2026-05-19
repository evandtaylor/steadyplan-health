# ShiftPlan App Feature Skill

## Purpose

Use this skill for low-risk `/app` improvements that support private beta usability without adding auth, public accounts, SQL, or payment changes.

## When To Use

- Weekly request UX improvements.
- Saved preferences clarity.
- Saved plan display polish.
- Checklist, feedback, request reuse, or calendar export refinements.
- Mobile-first app flow improvements based on tester feedback.

## Must-Read Context

- `docs/codex-skills/shiftplan-core-rules.md`
- `docs/codex-task-queue.md`
- `src/components/ShiftPlanAppAccess.tsx`
- Relevant `/api/app/*` route only if the task explicitly touches behavior.

## Rules

- Preserve all existing `/app` functionality unless the user explicitly changes scope.
- Do not add Supabase Auth or public account creation.
- Do not add SQL unless the selected task explicitly requires it.
- Do not change database payload shapes unless they are already compatible.
- Do not add Google/Apple calendar sync, reminders, push notifications, or native iOS.
- Keep exact work shifts required for generation.
- Preserve checklist extraction, calendar export, feedback, saved preferences, usage limits, and request reuse.
- Keep safety boundaries visible and intact.

## Required Checks

- Run `npm run lint`.
- Run `npm run build`.
- Confirm `/app` compiles.
- Confirm no paid intake, Stripe, auth, or admin files changed unless explicitly intended.
- For display-only work, confirm original saved plan body data remains unchanged.

## Report Format

- App feature/task:
- Files changed:
- User flow impact:
- Preserved functionality:
- Lint/build:
- SQL/auth/payment impact:
- Manual QA needed:

## Common Mistakes To Avoid

- Overwriting `ShiftPlanAppAccess` wholesale.
- Mixing unrelated app polish with API changes.
- Creating hidden schema requirements.
- Adding voice recording, reminders, calendar sync, or push notifications.
- Making freeform weekly input replace exact shift details.
