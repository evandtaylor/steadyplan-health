# ShiftPlan

ShiftPlan is the first deployable product from SteadyPlan Health. It is a routine and life planning product for shift workers, with an initial focus on nurses and healthcare shift workers.

ShiftPlan helps users organize sleep, meals, workouts, recovery blocks, errands, appointments, family responsibilities, training schedules, and personal tasks around irregular, long, or demanding work schedules.

ShiftPlan is not a medical product, sleep disorder product, fatigue treatment product, or healthcare advice tool. It is a lifestyle organization and routine planning tool. It does not provide medical advice, diagnosis, or treatment.

Main launch message:

> Turn your shift schedule into a simple weekly life plan.

## What the product does

ShiftPlan helps nurses and shift workers:

- Turn irregular shift schedules into practical weekly routines.
- Organize sleep windows, meals, workouts, errands, appointments, recovery blocks, family responsibilities, training schedules, and personal tasks.
- Request the Free 3x12 Shift Worker Reset Plan.
- Express interest in the planned `$9 Custom 7-Day ShiftPlan` beta offer.
- Submit structured intake details for manual founder review.

The product frames output as organization, routine planning, reminders, checklists, and realistic weekly planning. It should not drift into healthcare guidance.

## What the product does not do

ShiftPlan does not:

- Diagnose disease or medical conditions.
- Treat fatigue, burnout, sleep disorders, anxiety, or any medical condition.
- Prescribe medications, supplements, peptides, research chemicals, diets, or dosages.
- Recommend starting, stopping, or changing medications.
- Recommend peptides or research chemicals for human use.
- Make disease cure claims.
- Claim to detect drug, supplement, or ingredient interactions.
- Provide disease-specific medical nutrition therapy.
- Replace a physician, nurse practitioner, dietitian, pharmacist, therapist, or any licensed professional.
- Ask for unnecessary sensitive health data in the MVP.

Required ShiftPlan disclaimer:

> ShiftPlan is a lifestyle organization and routine planning tool. It does not provide medical advice, diagnosis, or treatment. It does not treat fatigue, burnout, sleep disorders, anxiety, or any medical condition.

## Product focus

### ShiftPlan

ShiftPlan is the active launch product for nurses, healthcare workers, first responders, students, and other shift workers.

It helps users organize around:

- 12-hour shifts, night shifts, rotating schedules, call schedules, and mixed schedules.
- Sleep and recovery routines.
- Meal timing, hydration, caffeine timing, and workout planning.
- Shift preparation checklists.
- Questions to ask qualified professionals when needed.

ShiftPlan should feel practical, direct, and built for real shift workers.

### KinPlan

KinPlan is parked as a future SteadyPlan Health concept. It is not promoted in public navigation for the first launch.

Future KinPlan work may help users organize:

- Appointments and follow-up tasks.
- Discharge instructions and provider notes.
- Medication list organization without medication advice.
- Caregiver responsibilities and family updates.
- Questions for the care team.
- Red-flag education that points users back to professional guidance and emergency care when appropriate.

KinPlan should feel warm, calm, family-friendly, and trustworthy.

### SuppPlan

SuppPlan is parked as a future SteadyPlan Health concept. It is not promoted in public navigation for the first launch.

Future SuppPlan work may help users organize:

- Supplement routines and timing.
- Inventory and reorder reminders.
- Duplicate ingredient review placeholders.
- Daily consistency.
- General education and questions to ask a qualified professional.

SuppPlan must not recommend supplements, peptides, research chemicals, medications, or dosages for human use. It may help users organize what they already use and prepare safer questions for a qualified professional.

## MVP status

Current MVP includes:

- ShiftPlan-first public homepage at `/`.
- Free 3x12 Shift Worker Reset Plan intake at `/beta/shiftplan`.
- Planned `$9 Custom 7-Day ShiftPlan` interest captured through the existing ShiftPlan intake question.
- Parked future-concept pages for KinPlan and SuppPlan.
- Parked future-concept pages for inactive KinPlan and SuppPlan intake routes.
- General beta signup form preserved at `/beta`.
- Supabase-backed form submission routes.
- Internal founder/admin beta dashboard at `/admin`.
- Internal manual beta plan templates at `/templates`, not linked from public navigation.
- Plain-English privacy and terms pages.
- ShiftPlan safety disclaimer.

Not included yet:

- Full authentication.
- Payments.
- Email automation.
- AI-generated plans.
- Food logging.
- Production-grade admin permissions.
- Secure PHI workflows.

## Tech stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- ESLint
- Supabase REST API for MVP database writes and admin reads
- Vercel-compatible project structure

Planned later:

- Supabase authentication
- Stripe payments
- Resend emails
- OpenAI API for drafted plans after safety and data boundaries are designed

## Safety and compliance positioning

ShiftPlan is positioned as lifestyle organization and routine planning support, not healthcare delivery.

Core safety rules:

- Use organization, routines, checklists, reminders, and practical weekly planning language.
- Include clear disclaimers.
- For emergency symptoms, tell users to call 911 or seek emergency care.
- Avoid collecting diagnoses, prescription medication lists, lab values, uploaded medical documents, insurance numbers, medical record numbers, dates of birth, or other protected health information in the MVP.
- Do not make clinical validation claims unless there is real evidence and review.
- Do not claim to treat fatigue, burnout, sleep disorders, anxiety, or any medical condition.
- Do not use hype language such as "biohack your body," "doctor in your pocket," or "AI medical provider."

This repository should be treated as an early MVP, not a production healthcare compliance system.

## Local development

Install dependencies:

```bash
npm ci
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Run lint:

```bash
npm run lint
```

Run a production build:

```bash
npm run build
```

## Vercel deployment

This app is designed for Vercel, but do not deploy until environment variables and Supabase tables are ready.

Recommended Vercel settings:

- Framework preset: Next.js
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: leave default
- Node version: Vercel default is acceptable for this MVP

Before deployment:

1. Run `npm run lint`.
2. Run `npm run build`.
3. Confirm all Supabase SQL files have been run in the target Supabase project.
4. Add all required environment variables in Vercel Project Settings.
5. Confirm `/privacy` and `/terms` have been reviewed for the intended public audience.
6. Confirm the admin password is private and not reused from local development.

After deployment:

1. Open the production URL.
2. Submit one safe ShiftPlan intake from `/beta/shiftplan`.
3. Optionally submit one safe general beta signup from `/beta` if that route remains available.
4. Confirm rows appear in Supabase.
5. Test `/admin` with the Vercel `ADMIN_PASSWORD`.
6. Confirm the footer disclaimer, privacy page, and terms page are visible.

## Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Required values:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
OPENAI_API_KEY=
OPENAI_MODEL=
```

Notes:

- `NEXT_PUBLIC_SUPABASE_URL` is the Supabase project URL, usually `https://your-project-ref.supabase.co`. The API routes also tolerate a value ending in `/rest/v1`.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the public anon key used for client-safe and server route inserts.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and used by the admin read route. Never prefix it with `NEXT_PUBLIC_`, never put it in client components, and never commit `.env.local`.
- `ADMIN_PASSWORD` protects the simple internal admin page. This is not full authentication.
- `OPENAI_API_KEY` is server-only and used only by the admin draft generation route. Never prefix it with `NEXT_PUBLIC_`.
- `OPENAI_MODEL` is optional. If blank, admin draft generation uses the app default model.

Restart the dev server after changing environment variables.

For Vercel, add the same variables under Project Settings, Environment Variables. Set them for Production, Preview, and Development as needed:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_PASSWORD
OPENAI_API_KEY
OPENAI_MODEL
```

Secret handling rules:

- Do not commit `.env.local`.
- Do not commit service role keys.
- Do not commit OpenAI API keys.
- Do not paste service role keys into client components.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` with a `NEXT_PUBLIC_` prefix.
- Do not expose `OPENAI_API_KEY` with a `NEXT_PUBLIC_` prefix.
- Rotate keys immediately if a secret is accidentally shared.

## Supabase setup

Create a Supabase project, then run the SQL files in the Supabase SQL Editor:

- `supabase/beta_signups.sql`
- `supabase/shiftplan_intakes.sql`
- `supabase/kinplan_intakes.sql`
- `supabase/suppplan_intakes.sql`

Tables:

- `beta_signups`: general beta interest form.
- `shiftplan_intakes`: product-specific ShiftPlan beta intake.
- `kinplan_intakes`: preserved for parked future KinPlan intake work.
- `suppplan_intakes`: preserved for parked future SuppPlan intake work.

Current RLS approach:

- Anonymous inserts are allowed for public beta intake forms.
- Admin reads use the server-only Supabase service role key through a Next.js API route.

This is acceptable for an internal MVP but should be replaced with proper authentication, authorization, audit logging, and a privacy review before production use.

## Current routes

Public pages:

- `/`: ShiftPlan-first landing page.
- `/shiftplan`: ShiftPlan product page preserved for direct visits.
- `/beta/shiftplan`: Free 3x12 Shift Worker Reset Plan intake.
- `/beta`: General beta signup, preserved but not promoted for the first launch.
- `/kinplan`: Parked future-concept page.
- `/suppplan`: Parked future-concept page.
- `/beta/kinplan`: Parked future-concept intake route.
- `/beta/suppplan`: Parked future-concept intake route.
- `/privacy`: Plain-English privacy page.
- `/terms`: Plain-English terms page.

Internal MVP pages:

- `/admin`: Simple founder/admin beta dashboard protected by `ADMIN_PASSWORD`.
- `/templates`: Internal manual beta plan templates for founder-created plans, not linked from public navigation.

API routes:

- `/api/beta-signups`
- `/api/shiftplan-intakes`
- `/api/kinplan-intakes`
- `/api/suppplan-intakes`
- `/api/admin/beta-signups`

## Future roadmap

Near-term:

- Keep ShiftPlan as the first deployable product.
- Add proper admin authentication.
- Add safer dashboard views for product-specific intakes.
- Add export tools for manual ShiftPlan beta plan creation.
- Improve print/PDF workflow for manual templates.
- Add beta confirmation emails with Resend.

Mid-term:

- Add Supabase authentication and role-based access.
- Add Stripe for paid beta or founder subscriptions.
- Build structured plan objects for ShiftPlan.
- Add privacy-conscious analytics.
- Add clearer consent and data deletion workflows.

Later:

- Add AI-assisted ShiftPlan drafts only after safety guardrails and data handling rules are designed.
- Add meal and macro guidance as a ShiftPlan feature only after safe boundaries are designed.
- Consider secure handling for more sensitive data only if the product, infrastructure, legal review, and compliance posture support it.

## Founder notes

ShiftPlan should feel calm, useful, practical, and human. It should not feel like a hospital EMR, supplement hype site, crypto/startup landing page, or fake AI clinician.

When adding features, protect the positioning:

- The user should leave with a clearer plan, not medical advice.
- The product should reduce schedule overwhelm without pretending to be a licensed professional or healthcare tool.
- The MVP should avoid unnecessary sensitive health data.
- Product copy should favor "organize," "simplify," "daily routine," "clear plan," "questions to ask your provider," and "built for real life."

Best next technical step: manually QA the ShiftPlan-first flow, then decide whether to add the paid-plan request path or proper admin authentication next.
