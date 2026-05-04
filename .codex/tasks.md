# Codex Task Guide

Use this file as a quick menu of common SteadyPlan Health tasks.

## Build a page

- Inspect `AGENTS.md`, `README.md`, and nearby route files first.
- Use the existing Next.js App Router structure under `src/app`.
- Reuse shared components from `src/components` when possible.
- Keep copy calm, clear, practical, and safety-aware.
- Include required disclaimers where health-adjacent content appears.

## Review safety language

- Search changed pages and components for medical advice risk.
- Replace diagnosis, treatment, prescribing, cure, peptide, research chemical, dosage, and medication-change language.
- Reframe outputs as organization, education, routines, reminders, checklists, and questions to ask qualified professionals.
- Confirm emergency language tells users to call 911 or seek emergency care where appropriate.

## Improve mobile layout

- Start with narrow viewport behavior.
- Check spacing, tap targets, form controls, text wrapping, and CTA stacking.
- Keep layouts readable without crowding.
- Avoid nested card-heavy layouts.

## Add a form

- Keep fields limited to practical planning needs.
- Do not ask for unnecessary sensitive health data.
- Add client-side validation for required fields.
- Add user-friendly success and error states.
- Prevent duplicate rapid submissions from the same form state.

## Connect a form to Supabase

- Add a SQL file in `supabase/`.
- Use Row Level Security.
- Allow only the minimum needed public access.
- Use anon keys only for public form inserts.
- Do not expose service role keys to client components.
- Add a server API route for validation and insertion.

## Update README

- Keep product positioning clear for founders, developers, and investors.
- Mention safety boundaries plainly.
- Keep setup commands current.
- Document routes, environment variables, and Supabase setup.

## Run lint/build

```bash
npm run lint
npm run build
```

Fix obvious errors before summarizing.

## Summarize changed files

- State what changed.
- List changed files with paths.
- Mention checks run.
- Mention any remaining risks or follow-up steps.
