# ShiftPlan Phase 2 Authenticated QA Report

Date tested: 2026-05-21 11:55 EDT

## Test Account Used

- Email: `agent-mode-test@shiftplan.ai`
- Access code: provided `agent-mode-test` QA code
- Environment: live production site at `https://www.shiftplan.ai`

## Baseline Repo Status

- Git status before QA: clean
- Branch: `main`
- Latest commit before QA: `44e8659 Record ShiftPlan master schedule founder decisions`
- `npm run lint`: passed
- `npm run build`: passed
- Stripe links in source:
  - Founding Pro: unchanged
  - Custom 7-Day: unchanged

## Live Route Smoke Check

All requested production routes returned `200` by HTTP status check:

- `/`
- `/beta/shiftplan`
- `/intake/custom-plan`
- `/intake/founding-pro`
- `/intake/founding-pro-weekly`
- `/app`
- `/admin`
- `/privacy`
- `/terms`

Additional notes:

- `/app` loads at the route level.
- `/admin` loads at the route level.
- Homepage source includes the expected Stripe payment links.
- Browser console/runtime inspection was not available through the browser automation tooling in this session.

## Authenticated Login Result

Status: blocked.

The live app access API returned:

```text
That email and access code did not work.
```

Because the test account could not authenticate, authenticated `/app` QA was stopped per instructions. No weekly request was created and no AI plan was generated.

Rerun after reported reset:

- Date/time: 2026-05-21 23:54 EDT
- Result: still blocked
- HTTP status: `401`
- Message: `That email and access code did not work.`

Recommended action:

- Confirm the `agent-mode-test@shiftplan.ai` access record exists in the live production database.
- Confirm the record is active, unexpired, and tied to the intended raw code.
- If needed, reset the app access code again in `/admin` and copy the newly generated raw code exactly once.
- After reset, rerun the authenticated QA pass from Task 2 onward.

## Create Flow Result

Status: not tested.

Reason: authenticated login failed, so the Create tab and signed-in Create flow were not available.

## Workout Builder Result

Status: not tested.

Reason: authenticated login failed, so the Workout Builder could not be exercised in the signed-in `/app` flow.

## Generation Result

Status: not tested.

Reason: authenticated login failed. No fresh plan was generated.

## Fresh Plan Quality Ratings

No fresh plan was generated, so ratings are unavailable.

- Plan usefulness: not rated
- Human tone: not rated
- Timeline clarity: not rated
- Workout usefulness: not rated
- Too long: not rated
- Would a tester know how to use it: not rated

## Plan View Result

Status: not tested.

Reason: authenticated login failed, so saved plans, Today / Next Up, checklist, calendar export, copy buttons, and feedback could not be tested through the signed-in UI.

## Checklist Result

Status: not tested.

Reason: authenticated login failed.

## Calendar, Copy, And Feedback Result

Status: not tested.

Reason: authenticated login failed.

## Settings Result

Status: not tested.

Reason: authenticated login failed.

## Admin Access-Code Result

Status: not tested.

Reason: admin authentication credentials were not available in this task, and the instructions said not to guess credentials or expose secrets.

## Issues Fixed

None.

No runtime changes were made because the only confirmed blocker was account access, not an app behavior issue found inside authenticated QA.

## Issues Deferred

- `agent-mode-test@shiftplan.ai` access code needs reset/reactivation before authenticated QA can continue.
- Browser console/runtime inspection should be rerun when browser automation is available.
- Full Tasks 3-8 should be rerun after successful login.
- App Access Codes admin QA should be run only when admin authentication is safely available.

## Readiness Decision

- Ready for Emily retest: no, not from this QA pass. The repeatable test account must be fixed first.
- Ready for 2-3 more beta testers: no, not from this QA pass. Fresh authenticated generation, checklist, calendar export, and feedback still need to pass.
