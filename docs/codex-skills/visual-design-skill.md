# ShiftPlan Visual Design Skill

## Purpose

Use this skill when improving ShiftPlan UI, visual hierarchy, mobile layout, copy density, or page composition.

## When To Use

- Public homepage or beta page visual polish.
- `/app` layout, saved-plan display, dashboard flow, or mobile readability.
- `/admin` readability that does not change behavior.
- Design cleanup after tester feedback.

## Must-Read Context

- `docs/codex-skills/shiftplan-core-rules.md`
- `docs/codex-task-queue.md`
- Existing components near the area being changed.
- Current safety/legal copy before shortening or moving it.

## Rules

- Do not change Stripe links unless explicitly requested.
- Preserve `/app` logic, saved data, admin behavior, and paid intake routes.
- Keep ShiftPlan lifestyle/routine planning only.
- Preserve safety/legal language.
- No medical, treatment, workplace safety, medication, supplement, or mental health claims.
- Keep mobile-first dark theme decisions consistent with the current app.
- Avoid broad redesigns unless the task explicitly requests one.
- Use existing design patterns before inventing new ones.

## Required Checks

- Review changed UI at the code level for text overflow, mobile stacking, and repeated copy.
- Run `npm run lint`.
- Run `npm run build`.
- Confirm changed routes compile.
- Confirm Stripe links are unchanged when public site files are touched.

## Report Format

- UI area changed:
- Files changed:
- What became clearer or more compact:
- Existing behavior preserved:
- Lint/build:
- Risks or manual QA needed:

## Common Mistakes To Avoid

- Turning the homepage into a generic SaaS landing page.
- Adding decorative UI that increases scrolling without improving flow.
- Removing safety copy instead of making it compact.
- Replacing real app logic with static demos.
- Making `/app` feel like a text document again.
