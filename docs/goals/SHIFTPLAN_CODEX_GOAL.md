# SHIFTPLAN_CODEX_GOAL.md

## Goal Name

**ShiftPlan Private Beta Launch-Ready Polish Goal**

## One-Line Codex `/goal` Command

Paste this into Codex after this file exists in the repo:

```text
/goal Read `docs/goals/SHIFTPLAN_CODEX_GOAL.md` and execute it as the active ShiftPlan private-beta launch-readiness goal.
```

---

## 1. Mission

Make ShiftPlan feel like a premium, simple, private-beta-ready app and website for shift workers.

This goal is not to build every future feature. This goal is to take the current ShiftPlan product and make it feel more polished, more intentional, more trustworthy, more mobile-first, and easier to use before founder QA, Emily retest, and 2–3 trusted testers.

ShiftPlan should feel like something users could eventually rely on weekly.

The product should feel:
- modern
- slick
- calm
- premium
- expensive
- simple
- focused
- mobile-first
- app-like
- trustworthy
- high-quality enough to be worth paying for

The product should not feel:
- cluttered
- generic
- cheap
- like a hospital portal
- like a medical app
- like a generic productivity dashboard
- like a long intake form
- like an AI demo
- like a half-finished landing page

---

## 2. Repo

You are working in:

```text
/Users/evantaylor/Code/shiftplan
```

---

## 3. Required Reading Before Work

Read these first if present:

```text
PROJECT_HANDOFF.md
docs/handoffs/PROJECT_HANDOFF.md
docs/codex-task-queue.md
docs/codex-skills/shiftplan-core-rules.md
docs/codex-report-template.md
docs/codex-workflow.md
docs/manual-qa-results-template.md
docs/shiftplan-phase-2-manual-qa.md
docs/shiftplan-master-schedule-spec.md
docs/shiftplan-master-schedule-v0-implementation-plan.md
README.md
AGENTS.md
```

If any file is missing, continue with the available files and report what was missing.

---

## 4. Product Source of Truth

ShiftPlan helps nurses, healthcare shift workers, students with clinical/class schedules, first responders, and other shift workers turn irregular schedules and real-life responsibilities into realistic weekly life plans.

The core product promise:

```text
Tell ShiftPlan your week. It builds a realistic plan around your shifts, sleep windows, workouts, meals, errands, appointments, and real life.
```

Core user flow:

```text
Home → Tell ShiftPlan your week → Generate plan → Follow Today / Checklist → Leave feedback
```

The long-term architecture is:

```text
Master Schedule → Weekly ShiftPlan → Daily Checklist
```

Current `/app` views are:

```text
Home
Schedule
Create
Plan
Settings
```

ShiftPlan is lifestyle/routine planning only. It must not provide medical advice, diagnosis, treatment, rehab guidance, medication guidance, sleep disorder guidance, fatigue treatment, burnout treatment, workplace safety guidance, or emergency guidance.

---

## 5. Design Direction

Make ShiftPlan look and feel premium.

Broad inspiration:
- Tesla-style simplicity
- Apple-level restraint
- premium SaaS
- modern mobile command center
- calm productivity
- high-trust consumer app

Do not copy Tesla, Apple, or any other brand.

Visual qualities to pursue:
- dark premium base
- clean typography
- clear hierarchy
- strong spacing
- restrained cards
- subtle depth
- simple CTAs
- obvious primary action
- mobile-first layout
- polished empty states
- reduced clutter
- fewer equal-weight sections
- less text where possible
- more confidence and clarity

Avoid:
- hospital portal design
- cheap wellness graphics
- cheesy AI visuals
- generic dashboard clutter
- excessive gradients
- too many cards
- too many CTAs
- over-explaining
- long walls of text
- equal-weight buttons everywhere
- medical/wellness treatment tone
- generic productivity app language

The app should feel like a private beta product with taste, not a hacked-together form.

---

## 6. Business Context

Current offer stack must be preserved:

1. Free 3x12 Shift Worker Reset Plan
2. $9 one-time Custom 7-Day ShiftPlan
3. $9/month ShiftPlan Founding Pro
4. Private beta `/app`

Do not change Stripe links.

Do not change paid intake routes.

Do not change manual/admin fulfillment.

The public website is for acquisition, trust, pricing, legal, and beta/paid routing.

The `/app` is the retention product.

The current phase is private beta polish and QA, not hard launch.

---

## 7. Primary Completion Criteria

This goal is complete only when:

1. `npm run lint` passes.
2. `npm run build` passes.
3. Public routes compile and are visually smoke-tested:
   - `/`
   - `/how-it-works`
   - `/beta/shiftplan`
   - `/intake/custom-plan`
   - `/intake/founding-pro`
   - `/intake/founding-pro-weekly`
   - `/privacy`
   - `/terms`
4. `/app` compiles.
5. `/app` is reviewed at mobile and desktop widths.
6. These `/app` screens are checked for clarity:
   - login
   - Home
   - Schedule
   - Create
   - Plan
   - Settings
7. The app has one obvious path:
   - Home
   - Tell ShiftPlan your week
   - Generate plan
   - Follow Today / Checklist
   - Leave feedback
8. The UI is cleaner, simpler, more premium, and less cluttered than before.
9. Mobile layout feels intentional.
10. No critical existing behavior regresses.
11. Stripe links remain unchanged.
12. Paid intake routes remain unchanged.
13. Admin/manual fulfillment remains preserved.
14. `/app` access-code auth remains preserved.
15. Safety language remains lifestyle/routine planning only.
16. Final report clearly states:
   - what was audited
   - what changed
   - what did not change
   - lint/build result
   - routes checked
   - browser/mobile QA notes
   - screenshots or screenshot locations if available
   - remaining risks
   - whether ready for founder QA
   - whether ready for Emily retest
   - whether ready for 2–3 trusted testers

---

## 8. Hard Boundaries

Do not change:

- Stripe Payment Links
- Stripe webhook behavior
- paid intake routes
- paid intake API payloads
- `/admin` auth behavior
- `/admin` password checks
- admin/manual fulfillment logic
- `/app` access-code hash algorithm
- `/app` cookie name
- `/app` session verification logic
- environment variable names
- Supabase service-role access patterns
- existing SQL/RLS behavior
- safety boundaries
- ShiftPlan product focus
- parked status of KinPlan, SuppPlan, and SteadyPlan

Do not add:

- Supabase Auth
- public signup
- native iOS
- push notifications
- calendar sync
- new SQL/migrations
- database schema changes
- major architecture changes
- billing portal
- public paid/free app tiers
- wearable integrations
- Apple Health integrations
- community/social features
- full fitness coaching
- medical/rehab/treatment features
- new paid tools without founder approval

Do not:

- expose secrets
- print environment variable values
- commit `.env.local`
- store raw access codes
- expose access-code hashes
- weaken security
- hard-delete schedule events
- overbuild
- turn ShiftPlan into a generic productivity app
- promote KinPlan, SuppPlan, or SteadyPlan as active products

---

## 9. Allowed Work

Allowed work includes small, safe, high-leverage improvements:

- UX clarity improvements
- copy cleanup
- visual polish
- mobile responsiveness fixes
- layout simplification
- better empty states
- clearer CTAs
- better helper text
- premium microcopy
- spacing improvements
- contrast improvements
- readability improvements
- button hierarchy improvements
- card simplification
- app flow clarity improvements
- browser QA
- screenshot QA
- docs/report updates
- small confirmed bug fixes found during QA

Prefer fixing friction through clarity before adding new UI.

Prefer simplifying existing surfaces before building anything new.

---

## 10. Work Method

1. Start with an audit.
2. Do not modify code immediately.
3. Confirm repo state.
4. Read the required docs.
5. Inspect the current UI, routes, and app flow.
6. Run initial lint/build unless there is a clear reason not to.
7. Use browser/mobile verification for visual review.
8. Identify the top 5 friction or polish issues.
9. Pick the safest high-impact batch.
10. Implement one focused checkpoint at a time.
11. Keep changes narrow.
12. Run checks after changes.
13. Use screenshots or browser notes to verify visual improvements.
14. Continue only while changes clearly improve private-beta readiness.
15. Stop if the next meaningful step requires founder approval.

After each checkpoint, ask internally:

- Did this make ShiftPlan simpler?
- Did this make ShiftPlan feel more premium?
- Did this preserve current product direction?
- Did this preserve Stripe/auth/admin/payment behavior?
- Did lint/build still pass?
- Did any critical route regress?
- Is the next step still safe and high-impact?

If no, revert or stop and report.

---

## 11. Tool Use

Use reasonable tools to improve quality and verification.

Allowed/recommended:
- Codex browser
- Playwright if available
- mobile viewport checks
- screenshots
- Chrome extension when logged-in state is needed
- Figma MCP or Figma tooling if useful
- design/system skills if available
- Appshots or Computer Use if available
- Vercel checks if available
- Supabase checks only if read-only and needed
- Stripe checks only if read-only and needed
- OpenAI dashboard checks only if needed and read-only

Chrome extension rule:

Use the Codex Chrome extension only when logged-in browser state is needed, such as:
- `/app` authenticated QA
- Vercel
- Supabase
- Stripe
- OpenAI dashboard
- Figma
- other signed-in tools

If Chrome is needed, stop and tell the founder exactly:
- which site to open
- what account/session needs to be logged in
- what needs to be verified
- whether read-only access is enough
- whether any approval is needed before acting

Do not install apps, connect accounts, purchase tools, or change production settings without founder approval.

If a tool would help, recommend it clearly.

---

## 12. Product Quality Bar

ShiftPlan should pass this founder-readiness bar:

| Area | Standard |
|---|---|
| Homepage | Explains product quickly and feels premium |
| How It Works | Clarifies the product without overwhelming |
| Beta route | Clear enough for lead capture |
| Paid routes | Preserved and not broken |
| Login | Simple, trustworthy, not scary |
| Home | One obvious next action |
| Schedule | Useful, not overwhelming |
| Create | User knows what to enter |
| Generate | Produces realistic weekly plan |
| Plan | Timeline/checklist usable on phone |
| Settings | Useful but not cluttered |
| Safety | Lifestyle-only, no medical claims |
| Feedback | Easy to submit |
| Admin | Preserved and secure enough for MVP |
| Mobile | Feels app-like and intentional |

---

## 13. Specific UX Priorities

Prioritize these areas:

1. Home clarity
   - One obvious next action.
   - Less noise.
   - Clear connection to current plan or next plan.

2. Create flow
   - Make “Tell ShiftPlan your week” feel easy.
   - Required fields should be obvious.
   - Optional details should feel optional.
   - Schedule context should be understandable.

3. Plan view
   - Today / Next Up should be useful.
   - Checklist should be clear.
   - Copy/export/feedback actions should be easy but not cluttered.

4. Schedule / Master Schedule
   - Should feel useful but secondary.
   - Do not let it dominate the app.
   - Make schedule events feel like “add what you know ahead of time.”

5. Mobile polish
   - Spacing.
   - CTAs.
   - Cards.
   - Readability.
   - Less giant-scroll feeling.

6. Premium feel
   - Stronger hierarchy.
   - Fewer competing elements.
   - Better microcopy.
   - More confidence.
   - Less beta clutter.

---

## 14. Known Risks To Watch

Watch for:

- App still feels too complex.
- Master Schedule reintroduces clutter.
- Generated AI output feels report-like.
- Checklist is localStorage only.
- Calendar export is `.ics` only.
- App Access Code admin needs manual QA.
- `agent-mode-test` is unreliable due duplicate/expired records.
- Need to verify hardening SQL in production before relying on schedule events broadly.
- Need to verify actual Vercel `OPENAI_MODEL`.
- Large app component changes can create broad side effects.
- Admin dashboard is dense; keep admin changes narrow.

Do not solve all of these in this goal. Report remaining risks clearly.

---

## 15. Stop Conditions

Stop and report instead of guessing if:

- required env vars are missing
- login requires a code/account you do not have
- Chrome login state is needed
- Supabase/Vercel/Stripe/OpenAI dashboard access is needed
- a production secret is needed
- the next step requires SQL
- the next step requires auth changes
- the next step requires payment changes
- the next step requires new accounts/public signup
- the next step requires native app work
- the next step requires calendar sync
- a third-party install/account connection is required
- the safest next step is a founder product decision

---

## 16. Validation Commands

Run when appropriate:

```bash
npm run lint
npm run build
```

Check routes locally or via build/browser as appropriate:

```text
/
/how-it-works
/beta/shiftplan
/intake/custom-plan
/intake/founding-pro
/intake/founding-pro-weekly
/app
/admin
/privacy
/terms
```

For `/app`, use authenticated QA only with a founder-approved known-working account.

Do not use `agent-mode-test@shiftplan.ai` unless the founder confirms it has been cleaned/replaced.

---

## 17. Final Report Format

Use this final report:

```text
SHIFTPLAN GOAL REPORT

1. Goal status:
- complete / partially complete / blocked

2. Summary:
-

3. Files changed:
-

4. Commits:
-

5. Lint/build:
- npm run lint:
- npm run build:

6. Routes checked:
-

7. Browser/mobile QA notes:
-

8. Screenshots:
-

9. Impact:
- Stripe/payment changed: yes/no
- Admin changed: yes/no
- App changed: yes/no
- API changed: yes/no
- Database/schema changed: yes/no
- Auth changed: yes/no
- Safety/legal changed: yes/no

10. What improved:
-

11. What was preserved:
-

12. Remaining risks:
-

13. Blockers:
-

14. Recommended next task:
-

15. Ready for founder QA:
- yes/no

16. Ready for Emily retest:
- yes/no

17. Ready for 2–3 trusted testers:
- yes/no
```

---

## 18. Ideal Outcome

The ideal outcome is not a giant feature release.

The ideal outcome is:

- ShiftPlan feels cleaner.
- ShiftPlan feels more premium.
- The app feels simpler.
- Mobile feels more intentional.
- The core path is obvious.
- Existing business flows still work.
- No risky systems were touched.
- The founder can manually QA with confidence.
- Emily can retest without needing a long explanation.
- 2–3 trusted testers can be invited soon after.

If the product still needs work, report the top friction points and recommend the next single focused task.
