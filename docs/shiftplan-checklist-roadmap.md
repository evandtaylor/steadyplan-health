# ShiftPlan Checklist Roadmap

ShiftPlan currently includes an interactive checklist prototype inside `/app`. It parses checkbox-style lines from a saved generated plan and stores checked state in the user's browser with `localStorage`.

## Current Prototype

- Checklist items are parsed from saved plan text.
- Supported item formats include markdown checkboxes and square-box lines, such as `- [ ] Pack meals` or `☐ Pack meals`.
- Checked and unchecked state is saved in `localStorage` by saved plan id.
- The original saved plan body remains visible.
- No Supabase checklist table exists yet.

## Why LocalStorage Works for the Prototype

`localStorage` is useful for the current private beta because it is simple, fast, and does not require a schema change. It lets testers try the behavior and helps confirm whether checklist interaction matters before building a more permanent task system.

## Why LocalStorage Is Not Long-Term

`localStorage` is tied to one browser and device. It does not sync between phone and desktop, cannot power a future Today view, and cannot support reminders, analytics, or native app state. If a tester clears browser data, checklist progress is lost.

## Future Table Proposal

When checklist behavior is validated, add a Supabase-backed table:

```text
app_plan_checklist_items
- id
- created_at
- updated_at
- app_user_id
- app_saved_plan_id
- item_text
- item_group
- item_date
- sort_order
- is_completed
- completed_at
```

Recommended notes:

- `app_user_id` should reference the current app user.
- `app_saved_plan_id` should link each item to the generated plan it came from.
- `item_group` can store sections such as Meal Prep, Workdays, Errands, or Reset.
- `item_date` can support a future Today view.
- `sort_order` should preserve plan order.
- `is_completed` and `completed_at` should power progress and follow-up behavior.

## Future API Routes

```text
GET /api/app/checklist
POST /api/app/checklist/toggle
```

Expected behavior:

- `GET /api/app/checklist` returns checklist items for the signed-in app user and selected saved plan or week.
- `POST /api/app/checklist/toggle` updates one item for the signed-in app user.
- Both routes must require the existing `/app` access session.
- Users must only read or update their own checklist items.
- Supabase service role stays server-side only.

## Migration Path

1. Keep the current `localStorage` prototype while private beta users test the workflow.
2. Add `app_plan_checklist_items` once checklist interaction is clearly useful.
3. Backfill checklist items from saved plan bodies when users first open a saved plan.
4. Add a Today view that groups incomplete items by date.
5. Add reminders or calendar export later only after the database-backed checklist is stable.

## Open Questions

- Should checklist items be generated as structured JSON instead of parsed from plan text?
- Should users be able to add custom checklist items?
- Should completed items affect weekly feedback or future plan generation?
- Should checklist state sync to native iOS before push notifications are considered?
