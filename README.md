# SteadyPlan Health

SteadyPlan Health is an organizational and educational planning platform for complicated health-life seasons. It helps users turn messy schedules, routines, responsibilities, and wellness details into clear daily plans.

SteadyPlan Health is not a medical device, not a telehealth platform, and not a replacement for medical advice. It does not diagnose, treat, prescribe, recommend medications, or replace licensed professionals.

Tagline: Simple plans for complicated health-life seasons.

## What the product does

SteadyPlan Health helps users organize practical life details around health-adjacent situations:

- Build simple daily routines and checklists.
- Organize shift schedules, sleep windows, meals, hydration, caffeine timing, workouts, and recovery.
- Organize family care tasks, appointments, discharge instructions, provider notes, medication lists, family updates, and questions for the care team.
- Organize supplement timing, inventory, duplicate ingredient review placeholders, consistency routines, and questions to ask a qualified professional.
- Collect beta intake information so early plans can be created manually.
- Provide internal templates for founder-created beta plans.

The product frames output as organization, planning, education, reminders, checklists, and questions to ask qualified professionals.

## What the product does not do

SteadyPlan Health does not:

- Diagnose disease or medical conditions.
- Treat disease.
- Prescribe medications, supplements, peptides, research chemicals, diets, or dosages.
- Recommend starting, stopping, or changing medications.
- Recommend peptides or research chemicals for human use.
- Make disease cure claims.
- Claim to detect drug, supplement, or ingredient interactions.
- Provide disease-specific medical nutrition therapy.
- Replace a physician, nurse practitioner, dietitian, pharmacist, therapist, or any licensed professional.
- Ask for unnecessary sensitive health data in the MVP.

Required sitewide disclaimer:

> SteadyPlan Health provides organizational and educational support only. It does not diagnose, treat, prescribe, or replace medical advice from a licensed healthcare professional. Always follow instructions from your healthcare team. For emergency symptoms, call 911 or seek emergency care.

## Product lines

### ShiftPlan

ShiftPlan is for nurses, healthcare workers, first responders, students, and other shift workers.

It helps users organize around:

- 12-hour shifts, night shifts, rotating schedules, call schedules, and mixed schedules.
- Sleep and recovery routines.
- Meal timing, hydration, caffeine timing, and workout planning.
- Shift preparation checklists.
- Questions to ask qualified professionals when needed.

ShiftPlan should feel practical, direct, and built for real shift workers.

### KinPlan

KinPlan is for family caregivers managing aging parents, sick loved ones, or complicated family care situations.

It helps users organize:

- Appointments and follow-up tasks.
- Discharge instructions and provider notes.
- Medication list organization without medication advice.
- Caregiver responsibilities and family updates.
- Questions for the care team.
- Red-flag education that points users back to professional guidance and emergency care when appropriate.

KinPlan should feel warm, calm, family-friendly, and trustworthy.

### SuppPlan

SuppPlan is for supplement organization and education.

It helps users organize:

- Supplement routines and timing.
- Inventory and reorder reminders.
- Duplicate ingredient review placeholders.
- Daily consistency.
- General education and questions to ask a qualified professional.

SuppPlan must not recommend supplements, peptides, research chemicals, medications, or dosages for human use. It may help users organize what they already use and prepare safer questions for a qualified professional.

## MVP status

Current MVP includes:

- Public landing page for SteadyPlan Health.
- Product pages for ShiftPlan, KinPlan, and SuppPlan.
- General beta signup form.
- Product-specific beta intake forms for ShiftPlan, KinPlan, and SuppPlan.
- Supabase-backed form submission routes.
- Internal founder/admin beta dashboard at `/admin`.
- Internal manual beta plan templates at `/templates`.
- Plain-English privacy and terms placeholders.
- Sitewide safety disclaimer.

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

SteadyPlan Health is positioned as health-adjacent planning support, not healthcare delivery.

Core safety rules:

- Use organization, education, routines, checklists, reminders, and provider-question language.
- Include clear disclaimers.
- For emergency symptoms, tell users to call 911 or seek emergency care.
- Avoid collecting diagnoses, prescription medication lists, lab values, uploaded medical documents, insurance numbers, medical record numbers, dates of birth, or other protected health information in the MVP.
- Do not make clinical validation claims unless there is real evidence and review.
- Do not use hype language such as "biohack your body," "doctor in your pocket," or "AI medical provider."

This repository should be treated as an early MVP, not a production healthcare compliance system.

## Local development

Install dependencies:

```bash
npm install
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
- Install command: `npm install`
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
2. Submit one safe test beta signup from `/beta`.
3. Submit one safe product-specific test intake if those forms will be public.
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
```

Notes:

- `NEXT_PUBLIC_SUPABASE_URL` is the Supabase project URL, usually `https://your-project-ref.supabase.co`. The API routes also tolerate a value ending in `/rest/v1`.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the public anon key used for client-safe and server route inserts.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and used by the admin read route. Never prefix it with `NEXT_PUBLIC_`, never put it in client components, and never commit `.env.local`.
- `ADMIN_PASSWORD` protects the simple internal admin page. This is not full authentication.

Restart the dev server after changing environment variables.

For Vercel, add the same variables under Project Settings, Environment Variables. Set them for Production, Preview, and Development as needed:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_PASSWORD
```

Secret handling rules:

- Do not commit `.env.local`.
- Do not commit service role keys.
- Do not paste service role keys into client components.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` with a `NEXT_PUBLIC_` prefix.
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
- `kinplan_intakes`: product-specific KinPlan beta intake.
- `suppplan_intakes`: product-specific SuppPlan beta intake.

Current RLS approach:

- Anonymous inserts are allowed for public beta intake forms.
- Admin reads use the server-only Supabase service role key through a Next.js API route.

This is acceptable for an internal MVP but should be replaced with proper authentication, authorization, audit logging, and a privacy review before production use.

## Current routes

Public pages:

- `/`: SteadyPlan Health landing page.
- `/shiftplan`: ShiftPlan product page.
- `/kinplan`: KinPlan product page.
- `/suppplan`: SuppPlan product page.
- `/beta`: General beta signup.
- `/beta/shiftplan`: ShiftPlan product-specific intake.
- `/beta/kinplan`: KinPlan product-specific intake.
- `/beta/suppplan`: SuppPlan product-specific intake.
- `/privacy`: Plain-English privacy placeholder.
- `/terms`: Plain-English terms placeholder.

Internal MVP pages:

- `/admin`: Simple founder/admin beta dashboard protected by `ADMIN_PASSWORD`.
- `/templates`: Manual beta plan templates for founder-created plans.

API routes:

- `/api/beta-signups`
- `/api/shiftplan-intakes`
- `/api/kinplan-intakes`
- `/api/suppplan-intakes`
- `/api/admin/beta-signups`

## Future roadmap

Near-term:

- Repair and standardize the local development setup.
- Add proper admin authentication.
- Add safer dashboard views for product-specific intakes.
- Add export tools for manual beta plan creation.
- Improve print/PDF workflow for manual templates.
- Add beta confirmation emails with Resend.

Mid-term:

- Add Supabase authentication and role-based access.
- Add Stripe for paid beta or founder subscriptions.
- Build structured plan objects for ShiftPlan, KinPlan, and SuppPlan.
- Add privacy-conscious analytics.
- Add clearer consent and data deletion workflows.

Later:

- Add AI-assisted plan drafts only after safety guardrails and data handling rules are designed.
- Add meal and macro guidance as a feature inside ShiftPlan and SuppPlan, not as a separate brand.
- Consider secure handling for more sensitive data only if the product, infrastructure, legal review, and compliance posture support it.

## Founder notes

SteadyPlan Health should feel calm, useful, practical, and human. It should not feel like a hospital EMR, supplement hype site, crypto/startup landing page, or fake AI clinician.

When adding features, protect the positioning:

- The user should leave with a clearer plan, not medical advice.
- The product should reduce overwhelm without pretending to be a licensed professional.
- The MVP should avoid unnecessary sensitive health data.
- Product copy should favor "organize," "simplify," "daily routine," "clear plan," "questions to ask your provider," and "built for real life."

Best next technical step: add proper admin authentication and extend the admin dashboard to review ShiftPlan, KinPlan, and SuppPlan intake tables separately.
