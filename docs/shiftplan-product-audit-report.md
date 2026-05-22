# ShiftPlan Product Quality Audit

Date/time: 2026-05-22 09:05 EDT

## Scope

Audited the current ShiftPlan product surfaces before founder/manual QA:

- Public website: homepage, beta route, paid intake routes, privacy, and terms.
- `/app` private beta structure: Home, Schedule, Create, Plan, and Settings.
- Master Schedule v0 UX and its connection to Home/Create/generation/calendar export.
- Workout Builder, checklist, saved plan actions, feedback, and app safety copy.
- Admin beta tooling from source, including App Access Codes duplicate/reset UX and read-only Master Schedule summaries.
- Customer-side AI generation prompt.

Live public route checks returned 200 for `/`, `/beta/shiftplan`, `/intake/custom-plan`, `/intake/founding-pro`, `/intake/founding-pro-weekly`, `/app`, `/admin`, `/privacy`, and `/terms`.

## Summary

The product direction is coherent: ShiftPlan now reads as a weekly life-planning app for shift workers, with Master Schedule becoming the long-range input layer without replacing the simple weekly flow. The main remaining risk is not architecture; it is manual QA confidence across real devices and fresh generated outputs.

The highest-confidence issues were stale or overlong text, not broken product logic. Fixes stayed small and avoided schema, auth, Stripe, paid intake, and admin security changes.

## Fixes Made

- Updated homepage app/private-beta feature language so checklist and calendar export are no longer described as future work.
- Shortened the unauthenticated `/app` safety note while keeping the full safety acknowledgment in the Create flow.
- Renamed the Home schedule CTA from a generation-sounding action to "Use this week in Create."
- Replaced stale feedback chips for already-shipped features with future/polish-oriented options.
- Shortened the required AI output safety note while preserving detailed safety boundaries in the prompt.

## Areas Reviewed Without Runtime Changes

- Create flow: required fields, week start, exact schedule, schedule context, and save/generate structure are already clear enough for manual QA.
- Workout Builder: optional profile vs current-week plan distinction is understandable; application confirmation already exists.
- Master Schedule: Add Event, bulk quick add, notes, archive/restore, week filter, and Home/Create connections are usable enough for founder QA.
- Plan view: Today/checklist/timeline/action grouping is already aligned with the simplified app flow.
- Admin: duplicate access-code warning, reset guidance, hidden hashes/raw code behavior, and read-only schedule summary are appropriate from source review.
- Safety/legal: boundaries remain plain and conservative; no new medical, treatment, workplace safety, emergency, or health-data claims were added.

## Remaining Risks

- Authenticated browser QA was not completed in this pass because the session runtime did not have a Playwright browser package available.
- Fresh plan quality still needs one real generated plan review after these prompt changes.
- Master Schedule needs founder/manual QA with real schedule events to verify that it feels useful without becoming calendar-clone clutter.
- Mobile Safari still needs hands-on checks for Create, checklist persistence, calendar export, Schedule bulk quick add, and feedback.
- App Access Codes should be tested with a clean single active test record before inviting more beta testers.

## Manual QA Checklist

- Log in with a clean private-beta test account.
- Confirm Home, Schedule, Create, Plan, and Settings are visible and understandable.
- Add one work shift, one appointment, one deadline, and one workout/training block in Schedule.
- Confirm Home shows "This week from your schedule" and the CTA opens Create with context.
- Confirm Create shows "Known this week" and appends schedule context without overwriting user text.
- Save one weekly request and generate exactly one fresh plan.
- Confirm dates, work shifts, schedule events, workouts, checklist, and safety note are accurate and compact.
- Test checklist expand/collapse, hide completed, local persistence, copy buttons, calendar export, and feedback.
- Test `/admin` wrong-password 401 and verify admin summary does not expose event notes, raw codes, or code hashes.

## Readiness

Ready for Emily/founder retest after local changes are pushed and deployed. Ready for 2-3 more beta testers only after one clean authenticated QA pass confirms login, fresh generation, checklist, calendar export, and Schedule event CRUD.
