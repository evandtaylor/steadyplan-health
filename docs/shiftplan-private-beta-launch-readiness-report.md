# ShiftPlan Private Beta Launch Readiness Report

Date: 2026-05-24

## Status

Partially complete. Public, paid, admin-login, and app-login surfaces compile and pass mobile/desktop smoke checks. A synthetic local `/app` signed-cookie pass reviewed the authenticated app shell and tabs at mobile and desktop widths, but real authenticated `/app` QA still requires a founder-approved working beta account/access code.

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

## What Changed

- `src/components/Header.tsx`
  - Removed mobile horizontal overflow from the shared header.
  - Replaced the mobile scroll nav with a wrapped, compact layout.
  - Added a focused mobile beta-login button beside the logo.
  - Kept the full desktop nav, including FAQ, Privacy, Terms, and the full beta-login label.

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
- Local route smoke checks returned `200` for all required routes.
- Mobile visual audit at `390px` found no horizontal overflow on all required routes.
- Desktop visual audit at `1440px` found no overflow offenders on all required routes.
- Synthetic signed-cookie `/app` review at `390px` and `1440px` found no horizontal overflow on login, Home, Schedule, Create, Plan, or Settings.
- Synthetic `/app` data-backed tabs showed expected local backend-not-configured messages because this checkout has no local Supabase environment configured.
- Real beta email/access-code login, Supabase-backed persistence, generation, feedback, usage limits, and admin beta summary were not verified in this pass.

## Completion Criteria Audit

| Goal requirement | Current evidence | Status |
| --- | --- | --- |
| `npm run lint` passes | Fresh local run passed on 2026-05-24. | Proven |
| `npm run build` passes | Fresh local run passed on 2026-05-24 and listed all required routes. | Proven |
| Public routes compile and are visually smoke-tested | Required public routes compiled, returned `200`, and have mobile/desktop screenshot artifacts. | Proven |
| `/app` compiles | `/app` appears as a dynamic route in the passing build. | Proven |
| `/app` reviewed at mobile and desktop widths | Login and synthetic signed-cookie app shell were reviewed at `390px` and `1440px`. | Partially proven |
| `/app` login, Home, Schedule, Create, Plan, Settings checked for clarity | Login and synthetic app-shell screens were captured and reviewed. Real data-backed behavior was not verified. | Partially proven |
| One obvious path from Home to request, generation, checklist, and feedback | Home/Create/Plan/Settings shell was reviewed, but generation, saved plan checklist, and feedback need a real beta session. | Not proven |
| UI feels cleaner, simpler, more premium, and less cluttered | Mobile header overflow/clutter was fixed and screenshots show cleaner mobile nav. | Partially proven |
| Mobile layout feels intentional | Required route screenshots and synthetic app screenshots show no horizontal overflow at `390px`. | Proven for smoke scope |
| No critical existing behavior regresses | Build, route smoke, source guardrails, and link checks passed. Real backend flows still need manual QA. | Partially proven |
| Stripe links remain unchanged | Source check confirmed both expected Payment Links in `src/app/page.tsx`. | Proven |
| Paid intake routes remain unchanged | Paid intake route files and local route smoke checks remained intact. | Proven for route/source scope |
| Admin/manual fulfillment remains preserved | Source guardrail review found admin password gate/manual flow unchanged; `/admin` route compiled and smoked. | Proven for source/login scope |
| `/app` access-code auth remains preserved | Source review found cookie name, hash helper, and session verifier unchanged. Real valid login still needs founder credentials. | Partially proven |
| Safety language remains lifestyle/routine planning only | Source/document review found safety positioning preserved. | Proven for source scope |
| Final report states audit, changes, validation, routes, QA notes, screenshots, risks, readiness | This report now includes those fields and the remaining blocker. | Proven |

## Goal Report Snapshot

1. Goal status:
   - Partially complete.
2. Summary:
   - Public, paid, admin-login, app-login, and synthetic app-shell surfaces are launch-readiness smoked. Real authenticated beta QA remains.
3. Files changed:
   - `src/components/Header.tsx`
   - `docs/goals/SHIFTPLAN_CODEX_GOAL.md`
   - `docs/handoffs/PROJECT_HANDOFF.md`
   - `docs/shiftplan-private-beta-launch-readiness-report.md`
4. Commits:
   - None.
5. Lint/build:
   - `npm run lint`: passed.
   - `npm run build`: passed.
6. Routes checked:
   - `/`, `/how-it-works`, `/beta/shiftplan`, `/intake/custom-plan`, `/intake/founding-pro`, `/intake/founding-pro-weekly`, `/app`, `/admin`, `/privacy`, `/terms`.
7. Browser/mobile QA notes:
   - Mobile and desktop route smoke passed. Synthetic `/app` shell review passed for layout only; backend-backed app actions require real credentials and configured services.
8. Screenshots:
   - Saved in `/private/tmp/shiftplan-qa/`.
9. Impact:
   - Stripe/payment changed: no.
   - Admin changed: no.
   - App changed: shared header only, no app auth/session/API behavior changed.
   - API changed: no.
   - Database/schema changed: no.
   - Auth changed: no.
   - Safety/legal changed: no.
10. What improved:
   - Mobile header is cleaner, no longer horizontally scrolls, and gives beta login a clear compact placement.
11. What was preserved:
   - Stripe links, paid routes, admin/manual fulfillment, app access-code auth, database behavior, environment names, and safety boundaries.
12. Remaining risks:
   - Real beta login, generation, checklist persistence, feedback, usage limits, calendar export, copy actions, and admin beta summary are not verified.
13. Blockers:
   - A founder-approved working beta email/access code or authenticated browser session is required for full `/app` QA.
14. Recommended next task:
   - Run the founder authenticated manual QA pass and record results using `docs/manual-qa-results-template.md`.
15. Ready for founder QA:
   - Yes, for founder-authenticated QA.
16. Ready for Emily retest:
   - No, not until real authenticated app QA passes.
17. Ready for 2-3 trusted testers:
   - No, not until authenticated app QA and one fresh generation pass are complete.

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
7. Open Create: enter a realistic short week using exact shift times, one or two responsibilities, and the safety acknowledgement.
8. Generate exactly one safe test ShiftPlan.
9. Open Plan: confirm dates, shift times, timeline readability, Today/Next Up, checklist grouping, copy buttons, feedback shortcut, and calendar export helper copy.
10. Submit or update one piece of plan feedback.
11. Open Settings: confirm saved defaults are understandable and not required for a first weekly request.
12. Open `/admin`: verify wrong password rejection, valid admin access, App Beta summary signals, App Access Codes list, and latest feedback visibility.
13. Record results in `docs/manual-qa-results-template.md` format, including screenshots for any bug.

Evidence to collect:

- Device, browser, and viewport or orientation.
- Test account label and access-code label, not raw secrets.
- Whether login, generation, checklist, calendar export, copy buttons, feedback, saved defaults, and admin summary each passed.
- Whether the plan felt realistic, what it assumed wrong, whether the tester would use ShiftPlan weekly, and whether $9/month feels fair if quality holds.
- Screenshots for confusing mobile moments or visual bugs.

## Remaining Risks

- Authenticated `/app` runtime QA is still incomplete.
- Home, Schedule, Create, Plan, and Settings need to be checked with a real private beta session.
- Fresh plan generation, checklist behavior, calendar export, copy actions, feedback, and usage-limit behavior still need manual QA.
- `agent-mode-test` should not be used unless the founder confirms the duplicate/expired access-code issue has been cleaned or replaced.
- Production Supabase/Vercel/Stripe/OpenAI settings were not changed or inspected in this pass.

## Readiness Decision

- Ready for founder QA: yes, for a founder authenticated QA pass.
- Ready for Emily retest: no, not until authenticated app QA passes.
- Ready for 2-3 trusted testers: no, not until authenticated app QA and one fresh generation pass are complete.

## Next Required Step

Run full authenticated private beta QA with a known-good beta account. Generate exactly one safe test plan, then verify Home, Schedule, Create, Plan, Settings, checklist, calendar export, copy buttons, feedback, and admin beta summary signals.
