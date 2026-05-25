# ShiftPlan Private Beta Launch Readiness Report

Date: 2026-05-25

## Status

Founder authenticated QA passed after the latest production deploy. Public, paid, admin-login, and app-login surfaces compile and pass smoke checks. The previous `/app` Schedule access blocker is resolved: a fresh founder login loaded `/app` signed in, Schedule opened without the app access blocker, and the Schedule event flow worked. A lightweight Schedule Week view is now deployed in production and smoke-tested with the founder session.

## What Was Audited

- Required goal file: `docs/goals/SHIFTPLAN_CODEX_GOAL.md`
- Current handoff: `docs/handoffs/PROJECT_HANDOFF.md`
- Required reading note: repo-root `PROJECT_HANDOFF.md` is not present in this checkout; the available handoff is `docs/handoffs/PROJECT_HANDOFF.md`.
- Codex workflow, task queue, core rules, manual QA docs, Master Schedule docs, README, and AGENTS instructions
- Public routes:
  - `/`
  - `/how-it-works`
  - `/beta/shiftplan`
  - `/intake/custom-plan`
  - `/intake/founding-pro`
  - `/intake/founding-pro-weekly`
  - `/privacy`
  - `/terms`
- Protected entry routes:
  - `/app`
  - `/admin`
- Synthetic local `/app` app-shell screens:
  - login
  - Home
  - Schedule
  - Create
  - Plan
  - Settings
- Source-level guardrails for Stripe links, paid intake routes, admin password gates, app access-code session helpers, and safety language
- Founder authenticated production `/app` QA result after the latest deploy
- Production Schedule `List` / `Week` toggle and read-only Week view after commit `e8ff954`

## What Changed

- `src/components/Header.tsx`
  - Removed mobile horizontal overflow from the shared header.
  - Replaced the mobile scroll nav with a wrapped, compact layout.
  - Added a focused mobile beta-login button beside the logo.
  - Kept the full desktop nav, including FAQ, Privacy, Terms, and the full beta-login label.
- `src/app/api/app/access/route.ts` and `src/components/ShiftPlanAppAccess.tsx`
  - Previously fixed the production Schedule access blocker by aligning client app state with server-verified app sessions and scoping new production app-session cookies across `shiftplan.ai` subdomains.
  - Preserved the existing cookie name, access-code hash algorithm, and server-side session verification.
- `docs/shiftplan-private-beta-launch-readiness-report.md`
  - This update records the successful founder authenticated QA result and revised readiness decision.
- `src/components/ShiftPlanAppAccess.tsx`
  - Added a lightweight Schedule `List` / `Week` view toggle.
  - Kept List as the familiar management view.
  - Added a read-only Week view that groups active schedule events Monday-Sunday for the selected week.
  - Preserved existing add, edit, archive, restore, quick add, bulk add, schedule notes, and week-filter behavior.

## What Did Not Change

- Stripe Payment Links
- Stripe webhook behavior
- Paid intake routes
- Paid intake API behavior
- `/admin` auth behavior
- `/admin` manual fulfillment logic
- `/app` access-code hash algorithm
- `/app` cookie name
- `/app` session verification
- Environment variable names
- Supabase SQL/schema/RLS behavior
- Safety/legal positioning
- Schedule API contracts and persistence behavior

## Source Guardrail Evidence

- Stripe Payment Links are still the expected constants in `src/app/page.tsx`:
  - `foundingProPaymentLink` at line 115.
  - `customPlanPaymentLink` at line 116.
- Stripe webhook behavior is still anchored in `src/app/api/stripe/webhook/route.ts`:
  - `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are read at lines 46-47.
  - `checkout.session.completed` remains the event gate at line 78.
  - Founding Pro intake routing still points to `/intake/founding-pro` at line 11.
- Admin protection still uses `ADMIN_PASSWORD` and password comparison in the admin API routes, including:
  - `src/app/api/admin/beta-signups/route.ts`
  - `src/app/api/admin/app-beta/route.ts`
  - `src/app/api/admin/app-access-codes/route.ts`
  - `src/app/api/admin/paid-intake-status/route.ts`
- `/app` access-code auth still uses:
  - Cookie name `shiftplan_app_access` in `src/lib/app-access.ts`.
  - `hashAppAccessCode`, `createAppAccessSession`, and `verifyAppAccessSession` in `src/lib/app-access.ts`.
  - Session cookie lookup in `src/app/app/page.tsx`.
  - App API session verification in `src/app/api/app/*` routes.
- Safety/legal language remains present in the homepage, beta page, intake pages, legal pages, admin generation prompts, `/app` copy, and app-generation prompt.

## Validation Results

- `npm run lint`: passed
- `npm run build`: passed
- Week view commit `e8ff954`: pushed to `origin/main`.
- Vercel production deployment for `e8ff954` reached `READY`.
- Production route smoke checks returned `200` for `/`, `/how-it-works`, `/beta/shiftplan`, `/intake/custom-plan`, `/intake/founding-pro`, `/intake/founding-pro-weekly`, `/app`, `/admin`, `/privacy`, and `/terms`.
- Production authenticated Schedule smoke check passed:
  - `/app` loaded signed in.
  - Schedule opened.
  - List and Week toggles appeared.
  - Week view rendered for Monday, May 25, 2026 through Sunday, May 31, 2026.
  - Existing schedule events appeared in Week view.
  - No test data was created during this smoke check.
- Local route smoke checks returned `200` for all required routes.
- Mobile visual audit at `390px` found no horizontal overflow on all required routes.
- Desktop visual audit at `1440px` found no overflow offenders on all required routes.
- Synthetic signed-cookie `/app` review at `390px` and `1440px` found no horizontal overflow on login, Home, Schedule, Create, Plan, or Settings.
- Synthetic `/app` data-backed tabs showed expected local backend-not-configured messages because this checkout has no local Supabase environment configured.
- Founder authenticated production QA passed after the latest deploy:
  - Fresh founder login worked.
  - `/app` loaded signed in.
  - Schedule opened without the previous app access blocker.
  - Schedule event flow worked.
  - The manual QA blocker is cleared.

## Founder Authenticated QA Result

Status: passed.

Manual founder QA confirmed:

- Fresh `/app` login worked with a founder-approved beta account.
- `/app` loaded the signed-in app shell.
- Schedule opened without `Open ShiftPlan app access before loading schedule events.`
- Schedule event flow worked.
- No schedule access blocker remains for founder QA.
- Production Schedule Week view opened from the founder-authenticated session and displayed existing schedule events in the selected week.

The previous blocker is now resolved. The product is ready for Emily retest, including the new Schedule Week view. Invite 2-3 trusted testers only after Emily's retest confirms the flow is understandable and stable enough for non-founder use.

## Emily Retest Gate

Status: ready, manual pass pending.

Use `docs/shiftplan-emily-retest-runbook.md` for the next production retest. Emily should verify fresh login, Home, Schedule List, Schedule Week, one safe Create/generation flow, plan accuracy, checklist, copy buttons, `.ics` export, feedback, and Settings basics. Do not invite 2-3 trusted testers until this retest passes without a critical blocker.

## Completion Criteria Audit

| Goal requirement | Current evidence | Status |
| --- | --- | --- |
| `npm run lint` passes | Fresh local run passed on 2026-05-24. | Proven |
| `npm run build` passes | Fresh local run passed on 2026-05-24 and listed all required routes. | Proven |
| Public routes compile and are visually smoke-tested | Required public routes compiled, returned `200`, and have mobile/desktop screenshot artifacts. | Proven |
| `/app` compiles | `/app` appears as a dynamic route in the passing build. | Proven |
| `/app` reviewed at mobile and desktop widths | Login and synthetic signed-cookie app shell were reviewed at `390px` and `1440px`; founder authenticated production login passed. | Proven for founder QA scope |
| `/app` login, Home, Schedule, Create, Plan, Settings checked for clarity | Login and synthetic app-shell screens were captured and reviewed; founder authenticated Schedule access and event flow passed. | Proven for founder QA scope |
| Schedule Week view deployed and smoke-tested | Commit `e8ff954` deployed to Vercel production; founder-authenticated `/app` showed List/Week toggle, Week view, and existing schedule events. | Proven for smoke scope |
| One obvious path from Home to request, generation, checklist, and feedback | Home/Create/Plan/Settings shell was reviewed; founder authenticated QA cleared the Schedule blocker. Emily should now retest the end-to-end weekly flow. | Ready for Emily retest |
| UI feels cleaner, simpler, more premium, and less cluttered | Mobile header overflow/clutter was fixed and screenshots show cleaner mobile nav. | Partially proven |
| Mobile layout feels intentional | Required route screenshots and synthetic app screenshots show no horizontal overflow at `390px`. | Proven for smoke scope |
| No critical existing behavior regresses | Build, route smoke, source guardrails, link checks, and founder authenticated Schedule QA passed. | Proven for current launch-readiness scope |
| Stripe links remain unchanged | Source check confirmed both expected Payment Links in `src/app/page.tsx`. | Proven |
| Paid intake routes remain unchanged | Paid intake route files and local route smoke checks remained intact. | Proven for route/source scope |
| Admin/manual fulfillment remains preserved | Source guardrail review found admin password gate/manual flow unchanged; `/admin` route compiled and smoked. | Proven for source/login scope |
| `/app` access-code auth remains preserved | Source review found cookie name, hash helper, and session verifier unchanged; founder fresh login passed after deploy. | Proven |
| Safety language remains lifestyle/routine planning only | Source/document review found safety positioning preserved. | Proven for source scope |
| Final report states audit, changes, validation, routes, QA notes, screenshots, risks, readiness | This report now includes those fields and the remaining blocker. | Proven |

## Goal Report Snapshot

1. Goal status:
   - Founder QA passed; ready for Emily retest.
2. Summary:
   - Public, paid, admin-login, app-login, synthetic app-shell surfaces, and founder authenticated Schedule QA are launch-readiness smoked. The previous Schedule access blocker is resolved.
3. Files changed:
   - `src/components/Header.tsx`
   - `docs/goals/SHIFTPLAN_CODEX_GOAL.md`
   - `docs/handoffs/PROJECT_HANDOFF.md`
   - `docs/shiftplan-private-beta-launch-readiness-report.md`
4. Commits:
   - `b32212a chore: add ShiftPlan goal docs and polish mobile header`
   - `5809d4e fix: restore authenticated schedule access`
   - `bca45d0 fix: align schedule access state with app session`
   - `9db7df4 docs: record successful founder app QA`
   - `e8ff954 feat: add lightweight schedule week view`
5. Lint/build:
   - `npm run lint`: passed.
   - `npm run build`: passed.
6. Routes checked:
   - `/`, `/how-it-works`, `/beta/shiftplan`, `/intake/custom-plan`, `/intake/founding-pro`, `/intake/founding-pro-weekly`, `/app`, `/admin`, `/privacy`, `/terms`.
7. Browser/mobile QA notes:
   - Mobile and desktop route smoke passed. Founder authenticated `/app` QA passed after production deploy, including fresh login, signed-in app load, Schedule access, Schedule event flow, and production Week view smoke.
8. Screenshots:
   - Saved in `/private/tmp/shiftplan-qa/`.
9. Impact:
   - Stripe/payment changed: no.
   - Admin changed: no.
   - App changed: shared header only, no app auth/session/API behavior changed.
   - API changed: no.
   - Database/schema changed: no.
   - Auth changed: no weakening; app-session cookie domain was safely aligned for ShiftPlan production hosts while preserving the cookie name, hash algorithm, and server-side verification.
   - Safety/legal changed: no.
10. What improved:
   - Mobile header is cleaner, no longer horizontally scrolls, and gives beta login a clear compact placement.
   - Schedule now has a lightweight visual Week view for scanning known commitments without replacing the existing List management flow.
11. What was preserved:
   - Stripe links, paid routes, admin/manual fulfillment, app access-code auth, database behavior, environment names, and safety boundaries.
12. Remaining risks:
   - Emily retest is still needed before inviting 2-3 trusted testers.
   - Week view has only had founder-session smoke testing; Emily should verify List/Week clarity and iPhone readability with real use.
13. Blockers:
   - None for founder authenticated Schedule QA; the previous Schedule access blocker is resolved.
14. Recommended next task:
   - Run Emily retest on the deployed app before inviting 2-3 trusted testers, with special attention to Schedule List vs Week, Create with schedule context, checklist, feedback, and calendar export.
15. Ready for founder QA:
   - Passed.
16. Ready for Emily retest:
   - Yes.
17. Ready for 2-3 trusted testers:
   - Wait until Emily retest passes.

## Screenshot Artifacts

Saved under `/private/tmp/shiftplan-qa/`:

- `mobile-root.png`
- `mobile-how-it-works.png`
- `mobile-beta-shiftplan.png`
- `mobile-intake-custom-plan.png`
- `mobile-intake-founding-pro.png`
- `mobile-intake-founding-pro-weekly.png`
- `mobile-app.png`
- `mobile-admin.png`
- `mobile-privacy.png`
- `mobile-terms.png`
- `desktop-root.png`
- `desktop-how-it-works.png`
- `desktop-beta-shiftplan.png`
- `desktop-intake-custom-plan.png`
- `desktop-intake-founding-pro.png`
- `desktop-intake-founding-pro-weekly.png`
- `desktop-app.png`
- `desktop-admin.png`
- `desktop-privacy.png`
- `desktop-terms.png`
- `mobile-app-login-2026-05-24.png`
- `mobile-app-home-synthetic-2026-05-24.png`
- `mobile-app-schedule-synthetic-2026-05-24.png`
- `mobile-app-create-synthetic-2026-05-24.png`
- `mobile-app-plan-synthetic-2026-05-24.png`
- `mobile-app-settings-synthetic-2026-05-24.png`
- `desktop-app-login-2026-05-24.png`
- `desktop-app-home-synthetic-2026-05-24.png`
- `desktop-app-schedule-synthetic-2026-05-24.png`
- `desktop-app-create-synthetic-2026-05-24.png`
- `desktop-app-plan-synthetic-2026-05-24.png`
- `desktop-app-settings-synthetic-2026-05-24.png`

## Founder QA Runbook

Use a founder-approved known-good beta account. Do not use `agent-mode-test@shiftplan.ai` unless the duplicate or expired access-code issue has been cleaned or replaced.

Founder preflight:

- Confirm the test access code is active, unexpired, and labeled clearly in `/admin`.
- Copy the raw access code only at creation/reset time; ShiftPlan does not store raw codes.
- Keep the test to one fresh generated plan unless the founder intentionally wants to spend another generation.
- Do not enter protected health information, medication details, diagnoses, symptoms, emergency details, workplace safety complaints, or sensitive workplace details.
- Keep tester-facing expectations honest: no public accounts, native iPhone app, push notifications, automatic reminders, or Google/Apple Calendar sync yet.

1. Open `/app` on desktop and iPhone Safari.
2. Confirm the private-beta login copy is clear.
3. Try one invalid email/access-code pair and confirm the error is useful.
4. Log in with the known-good beta email/access code.
5. Check Home first: confirm there is one obvious next action.
6. Open Schedule: add one clearly labeled test shift or fixed commitment, then confirm it appears in the right week.
7. Toggle Week view: confirm Monday-Sunday appears, events land on the correct day cards, empty days say "Nothing planned yet.", and mobile does not horizontally scroll.
8. Toggle back to List: confirm edit/archive/restore controls are still easy to find.
9. Open Create: enter a realistic short week using exact shift times, one or two responsibilities, and the safety acknowledgement.
10. Generate exactly one safe test ShiftPlan.
11. Open Plan: confirm dates, shift times, timeline readability, Today/Next Up, checklist grouping, copy buttons, feedback shortcut, and calendar export helper copy.
12. Submit or update one piece of plan feedback.
13. Open Settings: confirm saved defaults are understandable and not required for a first weekly request.
14. Open `/admin`: verify wrong password rejection, valid admin access, App Beta summary signals, App Access Codes list, and latest feedback visibility.
15. Record results in `docs/manual-qa-results-template.md` format, including screenshots for any bug.

Evidence to collect:

- Device, browser, and viewport or orientation.
- Test account label and access-code label, not raw secrets.
- Whether login, generation, checklist, calendar export, copy buttons, feedback, saved defaults, and admin summary each passed.
- Whether Schedule List and Week views both make sense, and whether Week view is readable on iPhone.
- Whether the plan felt realistic, what it assumed wrong, whether the tester would use ShiftPlan weekly, and whether $9/month feels fair if quality holds.
- Screenshots for confusing mobile moments or visual bugs.

## Remaining Risks

- Emily has not yet completed the retest on the latest production app.
- 2-3 trusted testers should wait until Emily confirms the flow is understandable and stable enough for non-founder use.
- `agent-mode-test` should not be used unless the founder confirms the duplicate/expired access-code issue has been cleaned or replaced.
- Production Supabase/Vercel/Stripe/OpenAI settings were not changed or inspected in this docs update.

## Readiness Decision

- Founder QA: passed.
- Emily retest: ready.
- 2-3 trusted testers: wait until Emily retest passes.

## Next Required Step

Run Emily retest on the latest production app. If Emily's pass is clean, prepare the 2-3 trusted tester invite and QA tracking workflow.
