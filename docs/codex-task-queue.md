# ShiftPlan Codex Task Queue

This is the living task queue for ShiftPlan Phase 2 work. ChatGPT can update this file before handing work to Codex, and Codex should read it before starting implementation.

## Current Phase

Phase 2: private beta polish, app experience, tester feedback, and product usability.

## Current Product Status

- Public ShiftPlan site is live.
- Paid/manual MVP routes are working and must be preserved.
- Stripe Payment Links are working and must not be changed unless explicitly requested.
- `/app` private beta access-code flow is live.
- `/app` weekly requests, customer-side AI generation, saved preferences, saved plans, feedback, usage limits, request reuse, grouped checklist, and calendar export are live.
- `/admin` manual fulfillment and app beta/admin views are live.
- ShiftPlan remains lifestyle and routine planning only.

## Current Priorities

- Keep the beta flow quick and understandable.
- Reduce unnecessary scrolling and reading before the main action.
- Make generated plans feel human, practical, and daily timeline based.
- Preserve safety boundaries and avoid medical, treatment, workplace safety, medication, supplement, or emergency guidance.
- Keep each change small enough to review, test, and commit separately.

## Pending Codex Tasks

Add new tasks here with enough context for Codex to complete one task or a safe batch.

| Priority | Task | Scope | Commit Message | Status |
| --- | --- | --- | --- | --- |
| P1 | Manual live QA on iPhone using the mobile checklist | Docs/manual QA only | N/A | Pending |
| P2 | Verify one fresh timeline plan generation with a valid beta session | `/app` QA only | N/A | Pending |
| P2 | Review older saved plan rendering for leftover markdown separators | `/app` display polish | TBD | Pending |

## Manual QA Tasks

- Test `/app` on iPhone Safari.
- Confirm Add to Home Screen instructions are easy to follow.
- Confirm weekly request date entry works on mobile and desktop.
- Generate exactly one test plan when safe.
- Confirm checklist grouping by day still works.
- Confirm calendar `.ics` download works in a real browser.
- Confirm feedback save/update still works.
- Confirm no browser console errors on homepage or `/app`.

## Blocked Tasks

Use this section for work that should not continue without approval.

| Task | Reason Blocked | Needed Decision |
| --- | --- | --- |
| Public account creation | Requires auth, billing, privacy, and migration decisions | Wait |
| Supabase Auth | Explicitly out of current scope | Wait |
| Native iOS app | Explicitly out of current scope | Wait |
| Push notifications/reminders | Explicitly out of current scope | Wait |

## Completed Recent Commits

- `6252f07` Humanize ShiftPlan homepage copy
- `d2be851` Reduce ShiftPlan app dashboard scrolling
- `99ea86b` Clarify ShiftPlan saved preference fields
- `1c57614` Add ShiftPlan weekly freeform input
- `e3b3214` Add ShiftPlan weekly request quick chips
- `96fd55c` Make ShiftPlan app plans timeline based
- `6ed03c9` Clean ShiftPlan saved plan rendering
- `fc3acf8` Reduce ShiftPlan duplicate checklist display
- `641faf4` Add ShiftPlan mobile QA checklist

## Report Format

Use [codex-report-template.md](./codex-report-template.md) for final reports.

At minimum, report:

- Task completed
- Files changed
- Commits
- Lint/build results
- SQL needed or not
- Stripe/admin/app impact
- Routes checked
- Errors
- Safe to push
- Manual QA needed
- Recommended next task
