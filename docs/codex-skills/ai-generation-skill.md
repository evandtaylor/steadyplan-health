# ShiftPlan AI Generation Skill

## Purpose

Use this skill when editing ShiftPlan AI prompts, generation routes, generated plan structure, safety framing, or plan display assumptions.

## When To Use

- Customer-side `/app` plan generation prompt updates.
- Admin/manual fulfillment prompt updates.
- Timeline structure, checklist parsing, or output cleanup.
- Safety boundary reinforcement.

## Must-Read Context

- `docs/codex-skills/shiftplan-core-rules.md`
- `src/app/api/app/generate-plan/route.ts`
- `src/app/admin/AdminDashboard.tsx` if admin prompts are involved.
- `src/components/ShiftPlanAppAccess.tsx` for saved plan rendering/checklist extraction.

## Rules

- Keep ShiftPlan lifestyle/routine planning only.
- No medical advice, diagnosis, treatment, fatigue treatment, burnout treatment, sleep disorder guidance, medication guidance, healthcare guidance, mental health guidance, workplace safety guidance, or emergency support.
- Keep exact submitted shifts and appointments locked to submitted dates.
- Do not invent unsubmitted responsibilities.
- Do not change admin generation unless explicitly requested or shared code makes it necessary.
- Do not change API keys, env vars, or provider settings.
- Do not generate excessive junk test data.

## Required Checks

- Run `npm run lint`.
- Run `npm run build`.
- Confirm `/api/app/generate-plan` compiles if touched.
- Confirm safety language remains present.
- If a real generation test is safe and requested, create at most one test plan.

## Report Format

- Prompt/generation area changed:
- Files changed:
- Output behavior expected:
- Safety boundaries preserved:
- Lint/build:
- Test generation run or skipped:
- Manual QA needed:

## Common Mistakes To Avoid

- Making output sound clinical, therapeutic, or safety-certified.
- Asking the model to include visible prompt labels like "short human summary."
- Overusing markdown checkboxes in the main body when the interactive checklist handles them.
- Letting plan generation override exact user-submitted dates.
