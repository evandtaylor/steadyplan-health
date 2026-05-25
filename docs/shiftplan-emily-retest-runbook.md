# ShiftPlan Emily Retest Runbook

Date prepared: 2026-05-25

Use this for the next manual Emily retest on production after founder QA passed and the Schedule Week view shipped.

## Current Status

- Founder authenticated QA passed.
- The previous `/app` Schedule access blocker is resolved.
- The Schedule `List` / `Week` toggle is deployed to production.
- Emily retest is the next manual gate.
- Invite 2-3 trusted testers only after Emily completes this retest without a critical blocker.

## Guardrails

- Use a founder-approved working beta account/session.
- Do not use `agent-mode-test` unless the founder confirms the duplicate/expired access-code issue is cleaned up or replaced.
- Do not share raw access codes, secrets, hashes, environment values, or private tester details in notes.
- Generate exactly one plan during this retest.
- Keep all test content lifestyle and routine planning only.
- Do not test Google Calendar sync, Apple Calendar sync, recurrence, public signup, native iOS, push notifications, Supabase Auth, Stripe payments, SQL, or admin security changes.

## Test Data

Week start: Monday, May 25, 2026

Work schedule:

- Monday 7a-7p
- Wednesday 7a-7p
- Friday 7a-7p

Known events:

- Tuesday 10:00 AM grocery pickup
- Thursday 2:00 PM appointment
- Saturday 9:00 AM family breakfast

Priorities:

- sleep
- simple meals
- two moderate workouts
- laundry
- groceries
- family time

Safety note:

- ShiftPlan is for lifestyle and routine planning only. Review any generated plan before using it.

## Retest Order

1. Open `https://www.shiftplan.ai/app` in a fresh browser session.
2. Confirm login works with the approved beta account.
3. Confirm Home loads signed in and shows one clear primary action.
4. Open Schedule.
5. Confirm `List` is still the familiar default schedule management view.
6. Add one harmless schedule event for the test week.
7. Confirm the event appears in List.
8. Edit the event.
9. Archive the event.
10. Restore it if restore is available.
11. Switch to `Week`.
12. Confirm Week shows Monday through Sunday for the selected week.
13. Confirm active events appear on the correct day cards with time, title, and category when present.
14. Confirm empty days say `Nothing planned yet.`
15. On iPhone Safari, confirm Week stacks cleanly with no horizontal overflow.
16. Return to Create.
17. Enter the safe test week and work schedule.
18. Use schedule context if the option is visible.
19. Include the workout preference: two moderate workouts.
20. Save the request.
21. Generate exactly one plan.
22. Confirm plan dates match Monday, May 25, 2026 through Sunday, May 31, 2026.
23. Confirm Monday, Wednesday, and Friday 7a-7p shifts are respected.
24. Confirm known events are respected and not scheduled over.
25. Confirm Today / Next Up appears or falls back cleanly.
26. Confirm checklist is present, grouped by day when possible, and can be checked.
27. Confirm Copy Summary, Copy Plan, and Copy Checklist work where browser permissions allow.
28. Confirm Download Calendar creates or opens an `.ics` export and does not add automatic reminders.
29. Submit feedback for the generated plan.
30. Check Settings basics only if safe: saved defaults load, save, and reload.
31. If founder/admin access is available, check App Beta summary without exposing raw codes or hashes.

## Stop Conditions

Stop and record the issue if any of these happen:

- Login fails.
- Schedule shows `Open ShiftPlan app access before loading schedule events.`
- Schedule event persistence fails.
- Week view has horizontal overflow on iPhone.
- Create cannot save a request.
- Generation fails.
- Generated plan ignores the entered dates, shifts, or known events.
- Checklist, calendar export, or feedback fails in a way that blocks normal beta use.
- A risky code, auth, payment, admin, database, or SQL change would be required.

## Recording Results

Record findings in `docs/manual-qa-results-template.md`.

Minimum result fields:

- tester/device/browser
- login result
- Home result
- Schedule List result
- Schedule Week result
- Create/generation result
- Plan date/shift/event accuracy
- checklist result
- copy button result
- calendar export result
- feedback result
- Settings result
- bugs with screenshots
- final ready/not-ready decision

## Pass Decision

Emily retest passes if:

- Login, Home, Schedule List, Schedule Week, Create, one generation, Plan review, checklist, calendar export, feedback, and Settings basics all work without a critical blocker.
- No secret, access-code, auth, payment, admin, or database behavior is exposed or changed.
- iPhone Schedule Week view is understandable and has no horizontal overflow.

After a pass, ShiftPlan is ready to invite 2-3 trusted testers.
