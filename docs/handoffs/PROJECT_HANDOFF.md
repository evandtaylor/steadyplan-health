# PROJECT_HANDOFF.md

Generated from local repo inspection on 2026-05-22.

## 0. Current Status Addendum

Updated on 2026-05-25 after the ShiftPlan private-beta readiness work:

- Current branch: `main`.
- Latest pushed commit: `fbb6c36 docs: add Emily retest runbook`.
- Working tree was clean after that push.
- Founder authenticated QA passed on production.
- The previous `/app` Schedule access blocker is resolved.
- Lightweight Schedule Week view is live in `e8ff954` and was smoke-tested with the founder session.
- Launch-readiness docs and QA templates now point to `docs/shiftplan-emily-retest-runbook.md` as the next manual gate.
- Ready for Emily retest: yes.
- Ready for 2-3 trusted testers: wait until Emily retest passes.
- Do not use `agent-mode-test` unless the founder confirms the duplicate/expired access-code issue has been cleaned or replaced.

## 1. Project Overview

- Project name: ShiftPlan (`steadyplan-health` package)
- One-sentence summary: ShiftPlan is a Next.js web app that helps shift workers turn irregular schedules and real-life responsibilities into realistic weekly routine plans.
- Current product goal: Preserve the paid/manual MVP while validating the private beta `/app` experience: Home -> Schedule -> Create -> Plan -> Settings, with Master Schedule v0 feeding weekly ShiftPlans.
- Intended user/customer: Nurses, healthcare shift workers, students in clinical/class schedules, first responders, and other shift workers whose schedules do not fit normal planning apps.

## 2. Repo Status

- Current branch before this handoff: `main`
- Git status before this handoff: clean (`git status --short` returned no files)
- Commits ahead of `origin/main` before this handoff: none
- Latest commit before this handoff: `a27351a164ca9b4a8c1d643a8a9e5b3136e482ea Add ShiftPlan how it works page`
- Remote: `https://github.com/evandtaylor/steadyplan-health.git`
- Any uncommitted changes before this work: none detected
- Any uncommitted changes after this work: this documentation handoff file and `docs/handoffs/` directory

## 3. Tech Stack

- Framework: Next.js App Router
- Language: TypeScript, React
- Styling system: Tailwind CSS via `src/app/globals.css` and PostCSS; premium dark theme with teal/blue accents
- Database: Supabase Postgres accessed through Supabase REST endpoints from Next.js API routes
- Auth: No Supabase Auth yet. `/app` uses email + access-code private beta login and a signed HTTP-only cookie. `/admin` uses a simple `ADMIN_PASSWORD` gate.
- Payments: Stripe Payment Links on the public homepage; Stripe webhook route verifies `checkout.session.completed` and sends internal purchase notification email through Resend.
- Storage: No Supabase Storage buckets or file-upload storage found. Browser `localStorage` is used for weekly request drafts and checklist completion state.
- AI/API integrations: OpenAI Responses API for admin draft generation and `/app` customer plan generation. Coded fallback model is `gpt-5.2` when `OPENAI_MODEL` is blank.
- Deployment platform: Vercel-compatible Next.js app. Repo uses `@vercel/analytics`; docs and live operations reference `https://www.shiftplan.ai`.
- Testing/lint/build tools: `npm run lint` runs ESLint; `npm run build` runs `next build`; TypeScript strict mode is enabled.

## 4. App Structure

Important root files:

- `package.json` - scripts and dependencies
- `package-lock.json` - npm lockfile
- `next.config.ts` - currently empty Next.js config object
- `eslint.config.mjs` - Next core web vitals and TypeScript ESLint config
- `tsconfig.json` - strict TypeScript config with `@/*` path alias to `src/*`
- `.env.example` - expected environment variable names with empty values
- `README.md` - product overview, local dev, Vercel, environment, Stripe, and Supabase notes
- `AGENTS.md` - agent/project instructions if present for future Codex work

Main app routes/pages under `src/app`:

- `/` -> `src/app/page.tsx` public ShiftPlan landing page with Stripe Payment Links
- `/how-it-works` -> `src/app/how-it-works/page.tsx` public walkthrough page
- `/shiftplan` -> `src/app/shiftplan/page.tsx`
- `/kinplan` -> `src/app/kinplan/page.tsx` parked future concept
- `/suppplan` -> `src/app/suppplan/page.tsx` parked future concept
- `/beta` -> `src/app/beta/page.tsx`
- `/beta/shiftplan` -> `src/app/beta/shiftplan/page.tsx`
- `/beta/kinplan` -> `src/app/beta/kinplan/page.tsx` parked intake route
- `/beta/suppplan` -> `src/app/beta/suppplan/page.tsx` parked intake route
- `/intake/custom-plan` -> `src/app/intake/custom-plan/page.tsx`
- `/intake/founding-pro` -> `src/app/intake/founding-pro/page.tsx`
- `/intake/founding-pro-weekly` -> `src/app/intake/founding-pro-weekly/page.tsx`
- `/app` -> `src/app/app/page.tsx`, backed by `src/components/ShiftPlanAppAccess.tsx`
- `/admin` -> `src/app/admin/page.tsx`, backed by `src/app/admin/AdminDashboard.tsx`
- `/templates` -> `src/app/templates/page.tsx`, internal manual beta templates
- `/privacy` -> `src/app/privacy/page.tsx`
- `/terms` -> `src/app/terms/page.tsx`

API routes under `src/app/api`:

- Public/form APIs:
  - `/api/beta-signups`
  - `/api/shiftplan-intakes`
  - `/api/kinplan-intakes`
  - `/api/suppplan-intakes`
  - `/api/shiftplan-paid-intakes`
- App/private beta APIs:
  - `/api/app/access`
  - `/api/app/weekly-requests`
  - `/api/app/generate-plan`
  - `/api/app/preferences`
  - `/api/app/plan-feedback`
  - `/api/app/schedule-events`
- Admin APIs:
  - `/api/admin/beta-signups`
  - `/api/admin/app-beta`
  - `/api/admin/app-access-codes`
  - `/api/admin/generate-draft-plan`
  - `/api/admin/delivered-plans`
  - `/api/admin/subscriber-preferences`
  - `/api/admin/paid-intake-status`
  - `/api/admin/archive-paid-intake`
  - `/api/admin/founding-pro-usage`
- Payments:
  - `/api/stripe/webhook`

Components:

- Public layout/content: `Header`, `Footer`, `CTASection`, `AppPreviewSection`, `ProductPage`, `ProductCard`, `FeatureCard`, `DisclaimerBox`, `ShiftPlanLogo`, `TrackedLink`
- Forms: `BetaForm`, `ShiftPlanIntakeForm`, `ShiftPlanPaidIntakeForm`, `KinPlanIntakeForm`, `SuppPlanIntakeForm`
- Private beta app: `ShiftPlanAppAccess.tsx` contains login UI, Home/Schedule/Create/Plan/Settings views, Master Schedule UI, Workout Builder, checklist parsing/rendering, calendar `.ics` export, and feedback UI.
- Admin: `AdminDashboard.tsx` contains free/paid intake review, app beta summary, app access-code management, duplicate warnings, manual fulfillment tools, and admin draft prompt helpers.

Libraries/utilities:

- `src/lib/app-access.ts` - app email/code normalization, access-code hashing, signed app session cookie helpers
- `src/lib/supabase-url.ts` - normalizes `NEXT_PUBLIC_SUPABASE_URL` for REST API calls
- `src/lib/content.ts` - shared public nav, product copy, disclaimers

Database/migration files:

- `supabase/beta_signups.sql`
- `supabase/shiftplan_intakes.sql`
- `supabase/kinplan_intakes.sql`
- `supabase/suppplan_intakes.sql`
- `supabase/shiftplan_paid_intakes.sql`
- `supabase/shiftplan_paid_intakes_archive.sql`
- `supabase/shiftplan_paid_intakes_fulfillment_status.sql`
- `supabase/shiftplan_founding_pro_usage_tracking.sql`
- `supabase/shiftplan_subscriber_preferences.sql`
- `supabase/shiftplan_delivered_plans.sql`
- `supabase/shiftplan_app_access_foundation.sql`
- `supabase/shiftplan_app_users_auth_linking.sql`
- `supabase/shiftplan_app_plan_requests.sql`
- `supabase/shiftplan_app_saved_plans.sql`
- `supabase/shiftplan_app_plan_feedback.sql`
- `supabase/shiftplan_app_user_preferences.sql`
- `supabase/shiftplan_app_schedule_events.sql`
- `supabase/shiftplan_app_schedule_events_hardening.sql`

Docs:

- Workflow/source of truth: `docs/codex-task-queue.md`, `docs/codex-workflow.md`, `docs/codex-report-template.md`
- Agent rules/skills: `docs/codex-skills/*`
- QA/product docs: `docs/shiftplan-phase-2-manual-qa.md`, `docs/manual-qa-results-template.md`, `docs/phase-2-authenticated-qa-report.md`, `docs/shiftplan-product-audit-report.md`
- Master Schedule docs: `docs/shiftplan-master-schedule-spec.md`, `docs/shiftplan-master-schedule-v0-implementation-plan.md`
- Beta/content/ops docs: multiple `docs/shiftplan-*` and private beta docs

## 5. Current Features

Built and present in repo:

- Public ShiftPlan homepage with pricing/paid options and preserved Stripe Payment Links.
- Public How It Works page at `/how-it-works`.
- Public beta intake for ShiftPlan and preserved general beta route.
- Paid intake routes for Custom 7-Day ShiftPlan and Founding Pro.
- Internal `/admin` dashboard protected by `ADMIN_PASSWORD`.
- Admin AI draft generation for manual fulfillment.
- Stripe webhook for internal purchase notifications through Resend.
- `/app` private beta login using email + access code.
- Simplified `/app` views: Home, Schedule, Create, Plan, Settings.
- Weekly request creation, saved requests, request reuse, saved plans, and usage limits.
- Customer-side OpenAI weekly plan generation.
- Saved preferences/defaults.
- Workout Builder with reusable Training Profile and current-week workout plan input.
- Master Schedule v0: event CRUD, soft archive/restore, category list, upcoming events, week filter, bulk quick add, schedule notes, overload hints.
- Master Schedule generation context in `/api/app/generate-plan`.
- Home schedule preview and Create view schedule context.
- Interactive checklist parsed from generated plan text and persisted in browser `localStorage`.
- Calendar `.ics` export with schedule context in descriptions.
- Plan feedback form with workout placement/future feature chips.
- Admin App Beta read-only summary including schedule event counts/latest date.
- App Access Codes admin management, reset UX, and duplicate warning.
- Privacy and terms pages.
- Parked KinPlan and SuppPlan pages/routes.

Partially built:

- Master Schedule is v0 only. It stores individual event rows; no recurrence rules, calendar grid, drag/drop, or calendar sync.
- Checklist state is local to one browser/device via `localStorage`; there is no server-side checklist table yet.
- Admin authentication is a single shared password, not user-based auth.
- `/app` account model is private beta access-code based, not public account creation.
- AI plans are stored mostly as generated text plus optional JSON/metadata; structured plan objects are not yet the main rendering source.
- Paid/manual fulfillment exists, but customer billing portal, subscription gating, and in-app paid tiers are not implemented.
- README route/Supabase setup sections are useful but not fully current with all Phase 2/3 additions.

Planned or referenced but not yet built:

- Supabase Auth and public account creation.
- Public paid/free app tier gating.
- Customer billing portal.
- Native iOS app.
- Push notifications.
- Customer lifecycle email automation.
- Google/Apple Calendar sync.
- Complex recurrence for Master Schedule.
- Server-side checklist table/sync.
- Structured plan object rendering as primary app data.
- Privacy-conscious analytics beyond current Vercel analytics usage.

Deprecated or should not be used casually:

- KinPlan and SuppPlan are parked future concepts; do not promote them as active shipped products.
- `/templates` is an internal manual fulfillment route, not a public product surface.
- `/beta/kinplan` and `/beta/suppplan` are parked intake routes.
- Do not treat generated AI output as medical, treatment, workplace safety, or emergency guidance.

## 6. Current User Flow

1. User lands on `/` and sees ShiftPlan positioning, beta/paywall options, safety boundaries, and CTAs.
2. Confused or new users can open `/how-it-works` for the 5-step explanation.
3. Free/beta users go to `/beta/shiftplan`; paid users use Stripe Payment Links and then intake routes.
4. Private beta users open `/app`, enter email + access code, and receive a signed app session cookie.
5. In `/app`, Home shows the next best action, current plan/checklist status, and this-week schedule preview.
6. Schedule lets users add known commitments ahead of time.
7. Create lets users tell ShiftPlan the week, optionally use current-week schedule events and Workout Builder details, then save/generate.
8. Plan shows saved generated plans, Today / Next Up, interactive checklist, copy actions, calendar export, plan-next-week action, and feedback.
9. Settings holds reusable defaults, Workout Builder, beta/safety notes, iPhone home-screen guidance, and a How It Works helper link.
10. Admin/founder uses `/admin` to review beta/paid submissions, manage access codes, view app beta summary signals, and support manual fulfillment.

## 7. Auth / Access Control

Login method:

- `/app` uses `POST /api/app/access` with normalized email and trimmed access code.
- Access codes are hashed in `src/lib/app-access.ts` with SHA-256 over the versioned prefix, normalized email, and trimmed code.
- On success, the route upserts an `app_users` row, records an app usage event, and sets a signed HTTP-only cookie named `shiftplan_app_access`.

Protected routes:

- `src/app/app/page.tsx` reads the app session cookie and passes initial access state into the client app.
- App APIs (`weekly-requests`, `generate-plan`, `preferences`, `plan-feedback`, `schedule-events`) call `verifyAppAccessSession` and scope Supabase REST queries to the current `appUserId`.
- Admin APIs require the submitted password to match `ADMIN_PASSWORD`.

Cookies/session strategy:

- App session cookie: `shiftplan_app_access`
- TTL: 14 days
- Cookie flags: HTTP-only, `sameSite: "lax"`, `path: "/"`, `secure` in production
- Signing secret: `APP_ACCESS_SESSION_SECRET` if configured; otherwise falls back to `SUPABASE_SERVICE_ROLE_KEY`

Founder/admin logic:

- `/admin` is a client dashboard that asks for the admin password and passes it to admin API routes.
- Admin routes use `SUPABASE_SERVICE_ROLE_KEY` for server-side Supabase REST access.
- Admin can manage app access codes, paid intake status, delivered plans, subscriber preferences, and app beta summaries.

Known risks/TODOs:

- This is not real multi-user admin auth; `ADMIN_PASSWORD` is a simple MVP gate.
- No Supabase Auth or role-based authorization exists yet.
- Access-code duplicates can confuse login; admin UI warns about duplicates, but database uniqueness for "one active unexpired code per email" is not enforced.
- App session signing falls back to the service role key if `APP_ACCESS_SESSION_SECRET` is absent; a dedicated secret is safer.
- Do not print or log access codes, admin password, service role key, OpenAI key, Stripe secrets, or Resend key.

## 8. Database / Supabase / Storage Status

Supabase is present.

Tables/migrations found:

- Public intake tables: `beta_signups`, `shiftplan_intakes`, `kinplan_intakes`, `suppplan_intakes`, `shiftplan_paid_intakes`
- Paid/manual fulfillment tables/columns: archive/status/usage migrations, `shiftplan_delivered_plans`, `shiftplan_subscriber_preferences`
- App beta tables: `app_access_codes`, `app_users`, `app_usage_events`, `app_plan_requests`, `app_saved_plans`, `app_plan_feedback`, `app_user_preferences`, `app_schedule_events`
- Auth-linking prep: `app_users.auth_user_id` migration for future Supabase Auth linking

RLS/grants:

- Migrations enable RLS on the tables they create.
- Public intake tables grant anonymous insert with explicit insert policies.
- App/admin tables generally grant service-role select/insert/update and rely on server-side API routes.
- `app_schedule_events_hardening.sql` revokes direct `anon` and `authenticated` table privileges and re-grants service-role select/insert/update.

Storage buckets:

- No Supabase Storage bucket SQL, upload code, or file storage integration was found.
- Browser `localStorage` is used for weekly request drafts and checklist state only.

Required migrations:

- For a fresh environment, run all SQL files in `supabase/` in an order that respects dependencies. The app beta tables depend on `app_users` and related foundation tables.
- Recent production work reportedly applied `shiftplan_app_schedule_events.sql` and `shiftplan_app_schedule_events_hardening.sql`, but future agents should verify in the target Supabase project before relying on runtime Master Schedule code.

Data flow:

- Public forms insert rows through anon-safe Supabase REST requests.
- Admin reads and app private beta writes use server-side service role Supabase REST calls.
- `/app/generate-plan` reads the weekly request, saved preferences, usage limits, and schedule events; calls OpenAI; saves the generated plan and usage metadata.

Known schema risks:

- SQL files are manual migrations, not managed by a migration runner in this repo.
- Some SQL files alter existing tables; re-run safety varies by file even when many statements use `if not exists`.
- Master Schedule v0 stores `start_time` and `end_time` as text to avoid complex overnight-shift handling.
- Checklist state is not in Supabase yet.
- There is no direct database-enforced uniqueness for active, unexpired access codes per email.

## 9. Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` — public Supabase project URL used by client-safe/server Supabase REST calls — required for Supabase-backed routes
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public anon key used for public intake form inserts — required for public forms
- `SUPABASE_SERVICE_ROLE_KEY` — server-only Supabase service role key for admin/app private beta APIs — required for admin and `/app`
- `ADMIN_PASSWORD` — simple admin dashboard/API gate — required for `/admin`
- `OPENAI_API_KEY` — server-only OpenAI key for admin draft generation and `/app` plan generation — required for generation
- `OPENAI_MODEL` — optional model override for generation; fallback is coded in source — optional
- `STRIPE_SECRET_KEY` — server-only Stripe key for webhook Checkout Session verification — required for webhook
- `STRIPE_WEBHOOK_SECRET` — server-only Stripe webhook signature secret — required for webhook
- `RESEND_API_KEY` — server-only Resend key for internal purchase notification email — required for webhook notification email
- `APP_ACCESS_SESSION_SECRET` — optional dedicated server-only HMAC secret for `/app` session cookies; falls back to service role key if absent — optional but recommended

Do not commit `.env.local`, secret values, raw access codes, admin passwords, service role keys, Stripe secrets, OpenAI keys, or Resend keys.

## 10. Deployment Status

- Deployment platform: Vercel is the intended platform; repo includes `@vercel/analytics` and README deployment notes.
- Build command: `npm run build`
- Development command: `npm run dev`
- Start command: `npm run start`
- Lint command: `npm run lint`
- Known production URL: `https://www.shiftplan.ai`
- Vercel config file: no `vercel.json` found.
- Deployment risks:
  - Production APIs require all listed env vars.
  - Supabase SQL must be applied before runtime features that depend on those tables.
  - Stripe webhook requires correct Stripe endpoint configuration and webhook secret.
  - Do not deploy runtime code that depends on unapplied SQL.
  - Keep Stripe Payment Links unchanged unless the founder explicitly approves.

## 11. Recent Work Detected

Recent git history indicates:

- `a27351a` added the public How It Works page and helper links.
- `55950f9` updated product audit docs.
- `4a99ea4` tightened the app AI output prompt.
- `3d10d73` polished the Plan view.
- `c562115` clarified Home next-action logic.
- `e5c3f43` simplified the app login screen.
- `2d9d429` simplified public site messaging.
- `b2a51d0` updated docs after Master Schedule build.
- `a0296c6` refined long-range planning homepage copy.
- `eed015f` added Master Schedule admin summary.
- `27d68e2` included schedule context in calendar export.
- Earlier Phase 3 commits added Master Schedule SQL, APIs, UI, generation integration, quick adds, schedule notes, and access-code duplicate/reset UX.

## 12. Known Issues / Risks

- Build risks:
  - Large client component `src/components/ShiftPlanAppAccess.tsx` carries much of the app behavior; edits can have broad side effects.
  - Admin dashboard is also large and dense; keep admin changes narrow.
- Auth risks:
  - `/admin` is protected by a shared password, not user auth.
  - `/app` uses access-code sessions, not Supabase Auth.
  - Duplicate active access-code rows can cause login confusion.
- Migration risks:
  - SQL files are manually run. There is no migration tracking table or CLI workflow in repo.
  - README Supabase setup section is stale relative to the full migration list.
  - New runtime features should not be pushed until required SQL is applied.
- Missing env var risks:
  - Missing Supabase vars break form/admin/app data flows.
  - Missing OpenAI vars block generation.
  - Missing Stripe/Resend vars block webhook notification behavior.
- Incomplete features:
  - Master Schedule recurrence, calendar sync, drag/drop calendar, and native calendar import are not built.
  - Checklist progress is local-only and device-specific.
  - Structured plan rendering is still derived from generated text.
  - Native iOS, push notifications, lifecycle email automation, billing portal, and public accounts are not built.
- Hardcoded values:
  - Stripe Payment Links live in `src/app/page.tsx`.
  - Public production URLs live in `src/app/api/stripe/webhook/route.ts` and admin helper copy.
  - OpenAI fallback model is coded in generation routes.
- UX gaps:
  - Master Schedule is early private-beta UI and needs real tester QA.
  - Authenticated `/app` QA should be repeated after each product polish batch.
  - Mobile visual QA is especially important because the app is mobile-first.
- Safety risks:
  - Copy and prompts must stay lifestyle/routine planning only.
  - Avoid medical, diagnosis, treatment, fatigue treatment, burnout treatment, sleep disorder, medication, workplace safety, or emergency guidance.

## 13. What Not To Change

Do not modify casually:

- Stripe Payment Links in `src/app/page.tsx`.
- Stripe webhook behavior in `src/app/api/stripe/webhook/route.ts`.
- Paid intake routes and API payloads.
- `/admin` password checks and manual fulfillment logic.
- `/app` access-code hash algorithm, cookie name, and session verification logic.
- Existing Supabase SQL migrations unless explicitly asked.
- Service-role server-only Supabase access patterns.
- Master Schedule RLS/grant hardening.
- Safety disclaimers and AI prompt safety boundaries.
- Public route paths used in docs, emails, Stripe webhook notifications, and QA scripts.
- Parked KinPlan/SuppPlan status.
- Environment variable names or secret handling patterns.

## 14. Recommended Next Tasks

1. Task name: Full authenticated `/app` manual QA
   - Why it matters: This is the highest-confidence way to validate that Home, Schedule, Create, generation, Plan, checklist, calendar export, feedback, and Settings work together after the recent Master Schedule and How It Works changes.
   - Files likely involved: QA docs only unless a confirmed bug is found; possible app fixes in `src/components/ShiftPlanAppAccess.tsx` or app API routes.
   - Risk level: Low for QA; medium if code changes are needed.
   - Suggested validation: Use a single approved test account, generate exactly one plan, verify console/errors, run `npm run lint` and `npm run build` before any commit.

2. Task name: Update README current routes and Supabase setup
   - Why it matters: README still under-represents Phase 2/3 app routes and migrations.
   - Files likely involved: `README.md`
   - Risk level: Low
   - Suggested validation: Documentation review plus `npm run lint` and `npm run build` if desired.

3. Task name: App access-code data integrity plan
   - Why it matters: Duplicate active access codes have already caused tester login confusion.
   - Files likely involved: `docs/*`, possibly future SQL under `supabase/`, `src/app/api/admin/app-access-codes/route.ts`, `src/app/admin/AdminDashboard.tsx`
   - Risk level: Medium if enforcing at DB level
   - Suggested validation: Inspect safe columns only, avoid raw codes/hashes, test login/reset behavior with a safe account.

4. Task name: Master Schedule private beta QA pass
   - Why it matters: Schedule tab, quick adds, bulk adds, archive/restore, Create context, and generation integration are new and need founder/tester validation.
   - Files likely involved: QA docs; possible fixes in `src/components/ShiftPlanAppAccess.tsx` and `src/app/api/app/schedule-events/route.ts`
   - Risk level: Medium
   - Suggested validation: Add/edit/archive/restore a small number of harmless events, generate one plan, verify events remain scoped to the current user.

5. Task name: Server-side checklist persistence spec
   - Why it matters: Current checklist state is browser-local and will not sync across devices.
   - Files likely involved: `docs/shiftplan-checklist-roadmap.md`, possible future `supabase/*`, app API and UI files later
   - Risk level: Medium to high once implemented
   - Suggested validation: Start with docs/spec only; do not add SQL/runtime until approved.

6. Task name: Admin security upgrade plan
   - Why it matters: Shared-password admin access is acceptable for MVP but not a durable security model.
   - Files likely involved: docs first; future auth/admin API changes
   - Risk level: High
   - Suggested validation: Plan before implementation; do not add Supabase Auth/public accounts without explicit approval.

7. Task name: Lightweight route smoke script
   - Why it matters: Repeated production/local route checks are now common and could be standardized.
   - Files likely involved: `docs/`, possibly `package.json` only if a script is explicitly approved
   - Risk level: Low to medium
   - Suggested validation: Confirm no secrets, no write operations, and route status output only.

## 15. Suggested Next Codex Prompt

Use this for the highest-priority next task:

```text
You are working in /Users/evantaylor/Code/shiftplan.

Read first:
- docs/handoffs/PROJECT_HANDOFF.md
- docs/codex-task-queue.md
- docs/codex-skills/shiftplan-core-rules.md
- docs/codex-report-template.md
- docs/codex-workflow.md
- docs/shiftplan-phase-2-manual-qa.md
- docs/manual-qa-results-template.md
- docs/shiftplan-master-schedule-spec.md
- docs/shiftplan-master-schedule-v0-implementation-plan.md

Goal:
Run a full authenticated ShiftPlan /app manual QA pass after the How It Works and Master Schedule updates.

Important:
Audit first. Do not modify code unless a real authenticated friction issue or bug is found. Do not expose secrets, print env values, change Stripe, change paid intake routes, change /admin security, add Supabase Auth, add public account creation, add SQL, build calendar sync, build native iOS, or create excessive test data.

Tasks:
1. Confirm repo status, branch, latest commit, npm scripts, lint, and build.
2. Verify public routes return 200, including /how-it-works.
3. Log in to /app only with the founder-approved test account provided in the task prompt.
4. Verify Home, Schedule, Create, Plan, Settings.
5. Test one small Master Schedule event flow: add, list, edit, archive/restore if safe.
6. Test Create flow with safe weekly data and use schedule context.
7. Generate exactly one test plan.
8. Verify plan quality, date accuracy, schedule event use, checklist, calendar export, feedback, and Settings helper links.
9. Record findings in a QA report doc.
10. If a small confirmed blocker is found, fix it in one focused commit after running npm run lint and npm run build.

Final report:
- Login result
- Route status
- Schedule result
- Create/generation result
- Plan/checklist/calendar/feedback result
- Bugs found
- Fixes made and commits, if any
- Lint/build result
- Whether ready for founder/private beta QA
```

## 16. Validation Checklist

For future agents/developers:

- [ ] Confirm working directory is `/Users/evantaylor/Code/shiftplan`.
- [ ] Run `git branch --show-current`.
- [ ] Run `git status --short`.
- [ ] Run `git log --oneline -5`.
- [ ] Run `npm ci` only if dependencies are missing or `node_modules` is not usable.
- [ ] Review `package.json` scripts before running commands.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] If public site files changed, confirm both Stripe Payment Links are unchanged.
- [ ] Route check locally or live as appropriate: `/`, `/how-it-works`, `/beta/shiftplan`, `/intake/custom-plan`, `/intake/founding-pro`, `/intake/founding-pro-weekly`, `/app`, `/admin`, `/privacy`, `/terms`.
- [ ] For `/app` work, verify access-code login with an approved test account only.
- [ ] For `/app` work, verify Home, Schedule, Create, Plan, Settings.
- [ ] For generation work, generate only necessary safe test plans and verify date/shift accuracy.
- [ ] For Master Schedule work, confirm `app_schedule_events` exists and RLS/grants are correct in the target Supabase project before deploying dependent runtime code.
- [ ] For admin work, confirm wrong admin password still returns 401 and no raw codes or code hashes are exposed.
- [ ] For database work, inspect SQL before applying, avoid destructive operations, and report whether SQL must run before deploy.
- [ ] For mobile UI work, verify iPhone/mobile viewport layout for the changed surfaces.
- [ ] For production deploy verification, confirm Vercel deployment is `READY`, latest commit is deployed, routes return 200, and browser console has no obvious runtime errors.
