# ShiftPlan Master Schedule v0 Implementation Plan

Original planning document. Phase 3 implementation has started in a controlled private beta batch; use the status section below before assigning follow-up work.

## Implementation Status - May 22, 2026

Completed locally:

- `supabase/shiftplan_app_schedule_events.sql` migration created for `public.app_schedule_events`.
- `/api/app/schedule-events` added with session-scoped list, create, update, archive, and restore behavior.
- `/app` Settings now includes a private beta Master Schedule section.
- Master Schedule v0 UI supports add event, edit event, archive/restore, upcoming events, week filter, quick adds, and schedule notes.
- `/api/app/generate-plan` now loads active schedule events for the request week and includes them as fixed commitments in the customer-side prompt.
- Homepage copy now lightly supports the long-range planning direction.
- Admin App Access Codes now warns on duplicate access-code emails and clarifies reset steps.

Deployment gate:

- The SQL migration must be applied before deploying/pushing the runtime Master Schedule API/UI to production.
- Generation skips schedule events if the table is missing, but the new Schedule UI/API depend on the table for normal use.
- No Stripe, paid intake, public auth, Supabase Auth, calendar sync, native iOS, push notification, or email automation change was made.

Manual QA needed after SQL:

- Add/edit/archive/restore schedule events.
- Confirm upcoming events and week filter behavior.
- Confirm quick adds only fill the form.
- Confirm schedule notes append to the weekly request notes and do not parse automatically.
- Generate one weekly plan from schedule events and verify dates, shifts, workouts, deadlines, and safety boundaries.

## 1. Product Goal

Master Schedule v0 should let a private beta user save known future commitments, review the events that fall inside a selected week, and generate a weekly ShiftPlan from those events without retyping the same schedule details every week.

The first version should prove one core loop:

1. User adds known schedule events.
2. User filters to a week.
3. User reviews the week.
4. ShiftPlan generates a practical weekly plan from those events.
5. User works the generated plan through Today / Next Up, checklist, calendar export, and feedback.

This is not a full calendar product. It is the first durable input layer for the existing weekly planning product.

## 2. MVP User Flow

First-time flow:

1. User opens `/app`.
2. User sees the current simplified app structure: Home, Create, Plan, Settings.
3. User opens the Schedule section/view.
4. User adds known events such as work shifts, clinicals, classes, deadlines, appointments, errands, workouts, family responsibilities, travel, and other commitments.
5. User chooses the current week or next useful week.
6. ShiftPlan shows "This week events" grouped by date.
7. User confirms the week, adds any freeform weekly notes or priorities, and generates a weekly ShiftPlan.
8. User reviews the generated plan in Plan, then uses Today / Next Up and checklist.

Repeat flow:

1. User opens `/app`.
2. User adds new known events or edits existing future events.
3. User filters to next week.
4. User confirms the event list and adds what changed this week.
5. ShiftPlan generates the next weekly plan.

Important: v0 should keep manual review before generation. The app should not auto-generate from future events without the user confirming the selected week.

## 3. Proposed `/app` Navigation

Options:

- Top-level tab: add `Schedule` alongside Home, Create, Plan, Settings.
- Nested under Create: place Master Schedule inside Create as a source of weekly inputs.
- Separate private beta section: keep the existing tab model but introduce Schedule as a simple beta section/view before promoting it.

Recommendation:

- Implement v0 as a separate private beta Schedule section/view inside `/app`, then promote it to a top-level Schedule tab after the interaction proves useful.
- Keep Home, Create, Plan, and Settings stable for the first implementation.
- Add a lightweight Home preview only after the Schedule flow works: "Upcoming schedule" and "Generate from this week."
- Avoid making Schedule the first screen in v0. Home should still answer "what do I do next?"

Rationale:

- The current simplified `/app` is still in Phase 2 QA.
- Master Schedule adds real product weight; introducing it gently reduces the chance of confusing testers.
- The long-term direction remains a top-level Schedule tab once repeat use proves the value.

## 4. Event Categories

Use friendly labels in the UI and database for v0. Earlier planning considered enum-like stored values, but the implemented migration uses the same human-readable category labels the private beta UI shows.

| UI label / stored value | Notes |
| --- | --- |
| Work shift | Exact work shifts, call blocks, on-site work, remote work blocks. |
| Clinical | Clinical rotation, lab, field placement, preceptorship, practicum. |
| Class/school | Class, school block, lecture, lab, study group. |
| Assignment/deadline | Due date, exam, project, quiz, paperwork deadline. |
| Appointment | Appointment, meeting, service appointment, scheduled obligation. |
| Errand | Grocery run, laundry, pickup, life admin task. |
| Workout/training | Workout, training session, practice, race, movement block. |
| Family/personal | Childcare, school pickup, family commitment, personal obligation. |
| Travel | Flight, drive, travel day, hotel check-in, trip block. |
| Other | Anything that does not fit a category. |

## 5. Event Fields

Required fields:

- `title`: short event name.
- `category`: one supported category.
- `date`: local calendar date.

Optional fields:

- `start_time`: local start time stored as text in v0.
- `end_time`: local end time stored as text in v0.
- `all_day`: boolean for date-only events or deadlines.
- `notes`: optional context for weekly generation.
- `source`: source of the event, such as `manual`, `weekly_request`, `workout_builder`, or future `calendar_import`.
- `is_archived`: boolean soft archive state.
- `archived_at`: timestamp for soft archive.
- `archived_reason`: optional archive reason.
- `created_at`: timestamp set on insert.
- `updated_at`: timestamp set on update.

Validation rules:

- Require `title`, `category`, and `date`.
- If `all_day = true`, `start_time` and `end_time` can be empty.
- v0 stores times as text so overnight shifts are allowed without complex time ordering.
- Do not require a note.
- Notes helper copy should discourage sensitive medical, workplace, school, or family details.
- Use local-date semantics in v0. Avoid complex timezone behavior until calendar import/sync is approved.

## 6. Database Plan

Implemented migration file: `supabase/shiftplan_app_schedule_events.sql`.

Implemented future table: `public.app_schedule_events`.

```text
app_schedule_events
- id uuid primary key default gen_random_uuid()
- created_at timestamptz default now()
- updated_at timestamptz default now()
- app_user_id uuid not null references public.app_users(id) on delete cascade
- title text not null
- category text not null
- event_date date not null
- start_time text null
- end_time text null
- all_day boolean not null default false
- notes text not null default ''
- source text not null default 'manual'
- is_archived boolean not null default false
- archived_at timestamptz null
- archived_reason text null
```

Parked for later:

- `recurrence_rule`
- `recurrence_parent_id`
- timezone identifiers
- calendar provider IDs
- imported calendar metadata

Recommended constraints:

- Category check for the ten supported values.
- Non-empty source check.
- Non-empty `title`.

Recommended indexes:

- `(app_user_id, event_date)` for week loading.
- `(app_user_id, is_archived, event_date)` for active event lists.
- `(category)` for category filtering.
- `(created_at desc)` for recent-event support.

RLS/security notes:

- Enable RLS on the table.
- v0 private beta can continue using server-side API routes with the current `app_users` and access-code session.
- Service role remains server-side only.
- Every route must verify the `/app` session and filter by `app_user_id`.
- Public anon/client access should not read or write schedule events directly.
- When Supabase Auth exists later, add owner-based policies so users can read, create, update, archive, and restore only their own events.

Service role behavior:

- API routes use service role to access rows after verifying the app session.
- Service role should not be exposed to the browser.
- Admin visibility, if added in v0, should be read-only and should not expose unnecessary event notes by default.

## 7. API Plan

All `/api/app/schedule-events` routes must require the existing `/app` access session.

### `GET /api/app/schedule-events`

Purpose:

- Load active schedule events for the current app user.
- Support upcoming list and selected-week list.

Query options:

- `start`: optional `YYYY-MM-DD`.
- `end`: optional `YYYY-MM-DD`.
- `include_archived`: optional boolean for restore UI.

Behavior:

- Filter by current `app_user_id`.
- Default to active upcoming events only.
- If `start` and `end` are provided, return events where `event_date` is in range.
- Sort by date, all-day/time, then created_at.

### `POST /api/app/schedule-events`

Purpose:

- Create one schedule event.

Payload:

- `title`
- `category`
- `event_date`
- `start_time`
- `end_time`
- `all_day`
- `notes`
- `source`

Behavior:

- Validate fields.
- Force `app_user_id` from the session, not the client.
- Default `source` to `manual`.
- Return the created event without any sensitive internals.

### `PATCH /api/app/schedule-events`

Purpose:

- Edit one existing event.

Payload:

- `id`
- editable event fields

Behavior:

- Verify the event belongs to the current `app_user_id`.
- Update only allowed fields.
- Update `updated_at`.
- Do not allow client-controlled `app_user_id`.

### `POST /api/app/schedule-events` archive/restore action

Purpose:

- Archive or restore one event.

Payload:

- `id`
- `action`: `archive` or `restore`

Behavior:

- Verify ownership by `app_user_id`.
- If `action = archive`, set `is_archived = true` and `archived_at = now()`.
- If `action = restore`, set `is_archived = false` and clear archive fields.
- Return the updated event.

### `POST /api/app/generate-plan` using schedule events

Purpose:

- Extend existing weekly generation to include selected-week schedule events.

Options:

- Attach events to the weekly request at save time as formatted text.
- Or load events during generation based on the request week.

Recommendation:

- For v0, load events during generation by `app_user_id`, `week_start_date`, and `week_end_date`, then include them in the prompt as "Master Schedule events for this week."
- Store lightweight generation metadata in `app_saved_plans.plan_json`. The current implementation stores `schedule_events_used`; a fuller event snapshot can be added later if support/debugging requires it.

## 8. UI Plan

### Schedule Quick Add

Compact form for fast entry:

- Title.
- Category.
- Date.
- All-day toggle.
- Start and end time when not all-day.
- Notes.
- Save button.

Keep it mobile-first and short. Do not make the user navigate a full calendar grid in v0.

### Upcoming Events

Show the next 10-20 active events:

- Date.
- Time or all-day label.
- Category label.
- Title.
- Edit action.
- Archive action.

Use this to reassure users that ShiftPlan remembers future commitments.

### This Week Events

Selected-week view:

- Week start selector.
- Events grouped by day.
- Empty state: "No saved events for this week yet."
- CTA to add an event.
- CTA to generate a weekly ShiftPlan from this week.

### Week Filter

Start with a native date input and simple buttons:

- This week.
- Next week.
- Week after next.

Do not add a drag/drop calendar in v0.

### Event Edit Drawer/Modal

Preferred v0 shape:

- Use an inline expanded edit panel or modal.
- Keep fields identical to quick add.
- Include Save, Archive, Restore, and Cancel.

Important:

- Avoid nested cards inside cards.
- Keep touch targets usable on iPhone.
- Make archive reversible.

### Archive/Restore

Default event lists should hide archived events.

Provide a small "Show archived" control only inside Schedule, not globally. Restored events should return to active lists.

## 9. AI Generation Integration

Weekly generation should receive structured inputs:

- Verified date list for the selected week.
- Master Schedule events for the selected week.
- Saved preferences.
- Workout profile or workout builder summary.
- Freeform weekly notes.
- Exact shifts, whether supplied through schedule events or manually in the weekly request.

Prompt structure:

```text
Master Schedule events for this week:
Monday, June 1
- 7:00 AM-7:00 PM | Work shift | Hospital shift
- All day | Assignment/deadline | Paper due

Tuesday, June 2
- No saved events
```

Rules for model behavior:

- Do not invent events.
- Do not move fixed work, clinical, class, appointment, deadline, or travel events.
- Treat errands, flexible workouts, and some family/personal events as movable only if no exact time is provided.
- Keep exact shifts required before generation.
- Saved preferences are defaults; schedule events are dated facts.
- If there is a conflict, the current weekly request and dated schedule events win over saved preferences.
- Do not infer medical details from appointment names or notes.
- Keep all output lifestyle/routine planning only.

## 10. Calendar Export Impact

v0 should preserve the current `.ics` export model:

- No Google Calendar sync.
- No Apple Calendar sync.
- No reminders.
- No calendar import.

Master Schedule events are inputs. Generated calendar export remains an output from the saved weekly ShiftPlan.

Recommended behavior:

- Existing `.ics` export continues to represent the generated plan.
- Schedule events can improve generated plan accuracy, but should not automatically export every raw event separately in v0.
- Calendar preview should continue to tell users to review dates and times.
- Future versions can distinguish raw fixed events from generated routine blocks, but not in v0.

## 11. Checklist Impact

Schedule events should not automatically become checklist items.

Checklist items should be generated only when an event implies an action:

- Work shift -> pack meals, prep bag, set simple reset block.
- Assignment deadline -> submit assignment, review materials, protect study block.
- Appointment -> prepare paperwork or leave buffer if useful.
- Travel -> pack, check timing, protect recovery/reset after travel.
- Workout/training -> warm-up/main/cooldown items if workout detail was requested.

Keep current checklist extraction in v0 unless a separate checklist table is approved. The checklist remains an artifact of the generated weekly plan.

## 12. Admin Impact

v0 admin impact should be minimal.

Recommendation:

- Add no admin write controls for schedule events in v0.
- If admin visibility is included, make it read-only.
- Show high-level schedule-event signals only if needed for support:
  - count of upcoming events;
  - latest event date;
  - categories present.
- Do not show detailed notes by default.
- Do not allow admin to create, edit, archive, restore, or delete user schedule events.

Admin visibility can wait until user-facing Schedule behavior is validated.

## 13. Privacy And Safety

Schedule events can reveal work, school, family, travel, and appointment patterns. Treat them as sensitive personal planning data.

Do not collect:

- Diagnoses.
- Medication lists.
- Lab values.
- Insurance numbers.
- Medical record numbers.
- Dates of birth.
- Emergency details.
- Workplace safety complaints.
- Confidential employer, patient, or school records.

UI helper copy:

- "Keep notes practical. Do not add diagnoses, medication details, emergency information, protected health information, or confidential workplace details."
- "ShiftPlan uses schedule events for routine planning only. Review dates, times, and assumptions before relying on a generated plan."

Safety behavior:

- Continue to frame output as lifestyle organization and routine planning.
- Do not provide medical, treatment, medication, mental health, workplace safety, or emergency guidance.
- Emergency language should continue to direct users to 911 or emergency care.

## 14. Not In v0

Do not build:

- Google Calendar sync.
- Apple Calendar sync.
- Calendar import.
- Complex recurrence.
- Drag/drop calendar.
- Public accounts.
- Supabase Auth.
- Native iOS.
- Push notifications.
- Email automation.
- Multi-user/shared calendars.
- Billing or Stripe changes.
- Paid/free tier gating.
- Checklist database table.

## 15. Phased Implementation Order

Phase A - Docs/spec:

- Complete product and implementation planning.
- Confirm founder questions.
- Keep runtime unchanged.

Phase B - DB migration:

- Completed locally in `d8d2ccc`: add `app_schedule_events` table.
- Add constraints and indexes.
- Enable RLS.
- Grant service role access.
- Do not expose public client access.

Phase C - API:

- Completed locally in `2d55812`: add schedule event list/create/update/archive/restore route.
- Verify session on every route.
- Filter every query by `app_user_id`.
- Add validation helpers.

Phase D - Simple UI:

- Completed locally in `1798cb7`, `f20664f`, and `a10cc9a`: add Schedule section in Settings, quick add, upcoming events, week filter, schedule notes, edit, and archive/restore.

Phase E - Generation integration:

- Completed locally in `dd668e5`: load schedule events for selected week.
- Completed locally in `dd668e5`: add "Known schedule events for this week" prompt section.
- Preserve current weekly request review.
- Save fuller event snapshot in `plan_json` later if support/debugging requires it.

Phase F - Admin visibility:

- Add read-only high-level visibility only if needed.
- Keep detailed notes hidden unless support need is explicit.

Phase G - QA:

- Test with a nurse shift schedule 6 weeks out.
- Test with clinical/class schedule.
- Test with assignment deadlines.
- Test with workout profile and this-week workout events.
- Verify generated plan date accuracy.
- Verify no raw event notes leak into unsafe advice.
- Verify no Stripe, paid intake, auth, or admin write behavior changed.

## 16. Historical Codex Prompt For Phase B

Phase B was completed locally in `d8d2ccc`. Keep this prompt only as historical context; future SQL work should start from the committed migration file, not this prompt.

```text
You are working in /Users/evantaylor/Code/shiftplan.

Goal:
Implement Phase B for ShiftPlan Master Schedule v0: add the approved Supabase migration for app_schedule_events only.

Read first:
- AGENTS.md
- README.md
- docs/codex-skills/shiftplan-core-rules.md
- docs/codex-workflow.md
- docs/shiftplan-master-schedule-spec.md
- docs/shiftplan-master-schedule-v0-implementation-plan.md
- existing supabase app migrations

Constraints:
- SQL migration only.
- Do not change runtime app code.
- Do not change /app UI.
- Do not change /admin.
- Do not change Stripe.
- Do not change paid intake routes.
- Do not add Supabase Auth.
- Do not add public account creation.
- Do not build calendar sync.
- Do not expose secrets.

Build:
1. Create a migration for public.app_schedule_events.
2. Include id, created_at, updated_at, app_user_id, title, category, event_date, start_time, end_time, all_day, notes, source, is_archived, archived_at, archived_reason.
3. Add category and source checks.
4. Add non-empty title check.
5. Do not add complex time ordering yet; v0 stores time text to allow overnight shifts.
6. Enable RLS.
7. Add indexes for app_user_id/event_date and app_user_id/is_archived/event_date.
8. Grant service_role select/insert/update access.

Run:
npm run lint
npm run build

Report:
- SQL file changed
- Runtime behavior changed or not
- RLS/grants added
- Lint/build results
- Manual Supabase apply step needed
```

## 17. Open Founder Questions

- Should work shifts saved in weekly requests be copied into Master Schedule automatically, or should the user manually add them first?
- Should Schedule v0 be a hidden/private-beta section until one tester validates it, or visible to all current private beta users?
- Should event notes be included in AI prompts by default, or should users explicitly opt in per event?
- Should assignment/deadline events default to all-day, end-of-day, or a user-entered due time?
- Should travel support multi-day ranges in v0, or should users add one event per travel day?
- Should workout builder create `workout_training` schedule events in v0, or only append workout context to the weekly request?
- Should archived events appear in generation history/debug snapshots, or stay hidden entirely?
- What is the minimum Schedule UI that would feel fast enough on iPhone?
- Which tester should validate Master Schedule first: Emily, a nursing student/clinical user, or founder-only?
- What success signal proves Master Schedule should become a top-level tab?
