# ShiftPlan Master Schedule Spec

Phase 3 planning document for long-range schedule capture and weekly ShiftPlan generation.

Founder decisions recorded on May 21, 2026:

- Master Schedule should become a top-level Schedule tab.
- In the private beta pass, preserve the simple weekly flow while introducing Schedule as its own product surface.
- Schedule events should use soft archive and restore, not hard delete.
- Admin visibility should be read-only at first.
- Private beta Master Schedule can use the current `app_users` and access-code system.
- Public Master Schedule should wait for real auth/Supabase Auth.
- Google Calendar sync and Apple Calendar sync are out of scope for v0.
- Complex recurrence is out of scope for v0.
- Master Schedule v0 should support add event, edit event, archive/restore event, upcoming events list, week filter, and generate weekly ShiftPlan from events.
- Runtime code and SQL should be implemented only through separate approved implementation tasks.

Implementation update on May 22, 2026:

- The base `app_schedule_events` SQL migration has been created and was reported applied in Supabase.
- A follow-up hardening migration, `supabase/shiftplan_app_schedule_events_hardening.sql`, revokes direct anon/authenticated grants and keeps service-role access.
- `/app` now has a top-level Schedule view.
- Home shows a compact "This week from your schedule" preview.
- Create can append selected-week schedule context into the weekly request.
- Schedule supports event CRUD, soft archive/restore, single-event quick adds, limited bulk quick adds, schedule notes, and lightweight busy-day hints.
- Weekly generation uses selected-week schedule events as fixed commitments.
- Calendar export can include schedule context in the generated plan summary description.
- Admin visibility is read-only and limited to aggregate schedule counts/latest date.

## 1. Product Concept

ShiftPlan Master Schedule is a future planning layer that lets a user enter known commitments weeks or months ahead, then generate a weekly ShiftPlan from those saved schedule events instead of rebuilding the same context every week.

The Master Schedule should become the source of truth for dated obligations:

- Work shifts.
- Clinical rotations.
- Class and school blocks.
- Assignment deadlines.
- Appointments.
- Errands.
- Workouts and training blocks.
- Family or personal responsibilities.
- Travel.
- Other known commitments.

The weekly ShiftPlan remains the main output. The Master Schedule does not replace the weekly plan. It gives the weekly plan better inputs.

Founder direction: Master Schedule should become a top-level Schedule tab and the primary long-range input layer for recurring ShiftPlan use. The initial private beta should still preserve the simplified weekly flow while validating event entry and weekly generation from events.

## 2. Why This Matters

ShiftPlan is strongest when it understands the real shape of a user's week. The current weekly request flow asks users to re-enter shifts, appointments, errands, workouts, and responsibilities every time they want a plan. That works for private beta, but it creates friction for repeat use.

Long-range schedule capture matters because:

- Shift workers often know work blocks, class days, clinical rotations, travel, and deadlines ahead of time.
- Re-entering the same details every week makes the product feel more like a form than a planning workspace.
- Saved schedule events can make weekly generation faster, more accurate, and more habit-forming.
- A durable schedule layer can later support richer checklist, calendar export, and account features without starting over.

## 3. Core User Problem

The user problem is not just "make me a plan." It is:

> I already know a lot of what is coming, but my schedule is scattered across work apps, school notes, text messages, memory, and calendar entries. I need ShiftPlan to remember the important parts and turn each upcoming week into a practical routine.

For the MVP, ShiftPlan should solve this by letting users manually save known events in one place, then generate one focused weekly plan from the events that fall inside the selected week.

## 4. How This Extends The Current Weekly Request Flow

Current flow:

1. User opens `/app`.
2. User creates a weekly request.
3. User enters exact work schedule and other current-week details.
4. ShiftPlan generates and saves a weekly plan.
5. User works through the saved plan, checklist, calendar export, and feedback.

Future Master Schedule flow:

1. User opens `/app`.
2. User adds or reviews upcoming schedule events.
3. User starts a weekly request for a date range.
4. ShiftPlan preloads events from the Master Schedule for that week.
5. User reviews the preloaded week, adds a short weekly goal or any exceptions, and confirms.
6. ShiftPlan generates and saves a weekly plan from schedule events, saved preferences, and optional workout details.
7. User works through the saved plan, checklist, calendar export, and feedback.

The weekly request should continue to exist. The Master Schedule should reduce repeated typing, not remove the user's final review step.

## 5. Master Schedule -> Weekly ShiftPlan -> Daily Checklist Architecture

Recommended architecture:

- Master Schedule: durable user-owned event records across many weeks.
- Weekly Request: a reviewed snapshot for one 7-day date range.
- Weekly ShiftPlan: generated output saved from the weekly request.
- Daily Checklist: task-like actions parsed or generated from the saved weekly plan.

Data flow:

1. User creates schedule events.
2. User chooses a week start date.
3. Server loads schedule events where `event_date` falls between `week_start_date` and `week_end_date`.
4. Server formats those events into a structured schedule summary grouped by day and category.
5. User can review/edit the weekly request before generation.
6. AI prompt receives:
   - selected week dates;
   - exact work shifts from schedule events and/or weekly request;
   - appointments, errands, deadlines, responsibilities, workouts, and travel for the week;
   - saved user preferences;
   - this-week workout builder details if supplied;
   - safety and output rules.
7. Generated weekly plan is saved in `app_saved_plans`.
8. Checklist remains derived from the saved plan until a future checklist table exists.

Important rule: the generated weekly plan should treat Master Schedule events as user facts. It should not move fixed-time events unless the user explicitly asks to reschedule flexible items.

## 6. Event Categories

Supported Master Schedule categories:

- `work_shift`: work shift.
- `clinical`: clinical rotation, clinical lab, field placement, or similar.
- `class_school`: class, school, lab, study group, or education block.
- `assignment_deadline`: assignment, exam, project, deadline, or due date.
- `appointment`: appointment, meeting, service appointment, or scheduled obligation.
- `errand`: errand or life admin task.
- `workout_training`: workout, training session, practice, race, or planned movement block.
- `family_personal`: childcare, family responsibility, personal commitment, or recurring responsibility.
- `travel`: travel day, flight, drive, hotel check-in, or trip block.
- `other`: anything that does not fit another category.

Display labels can be friendlier than stored values. For example, the UI can show "Class/school" while storing `class_school`.

## 7. Event Fields

MVP event fields:

- `title`: short human-readable event name.
- `category`: one category from the supported list.
- `date`: calendar date for the event.
- `start_time`: optional local start time.
- `end_time`: optional local end time.
- `all_day`: boolean flag for all-day items or date-only deadlines.
- `notes`: optional context the weekly plan can use.
- `repeats/recurrence later`: intentionally parked for MVP; do not build recurrence until single events are validated.
- `source`: where the event came from, such as `manual`, `weekly_request`, `workout_builder`, `admin_seeded`, or future `calendar_import`.

Validation notes:

- `title`, `category`, and `date` should be required.
- Date-only deadlines can use `all_day = true` with no start or end time.
- Fixed-time events should usually provide both start and end time.
- MVP should avoid timezone-heavy behavior by treating dates and times as the user's local schedule entries.
- Notes should be optional and should discourage sensitive medical, workplace safety, or confidential workplace details.

## 8. MVP Scope

MVP scope for first implementation:

- Add a Master Schedule area inside the existing private beta `/app` as a top-level Schedule view.
- Let beta users add, edit, archive, and restore manual schedule events.
- Support the ten event categories listed above.
- Support date, optional start/end time, all-day, notes, and source.
- Show a simple upcoming-events list.
- Add a week filter so users can review events for the week they want to generate.
- Add limited bulk quick add for work, clinical, class, and deadline patterns without storing recurrence rules.
- Add lightweight informational hints for packed days, long days, and events missing times.
- Add Home and Create touchpoints that make schedule events useful without auto-generating.
- Let the weekly request/generation flow pull schedule events for the selected week.
- Generate a weekly ShiftPlan from reviewed Master Schedule events.
- Keep exact work shifts required before generation.
- Preserve manual review before AI generation.
- Save generated plans using the existing `app_saved_plans` flow.
- Keep checklist behavior unchanged at first.
- Keep `.ics` export as download only.
- Keep existing access-code app session model until a separate auth phase.

Explicit v0 capabilities:

- Add event.
- Edit event.
- Archive event.
- Restore archived event.
- Upcoming events list.
- Week filter.
- Limited bulk quick add.
- Schedule notes append flow.
- Home schedule preview.
- Create selected-week schedule context.
- Calendar export schedule context.
- Read-only admin schedule summary.
- Generate weekly ShiftPlan from events.

## 9. What Not To Build Yet

Do not build these in the Master Schedule MVP:

- Supabase Auth.
- Public account creation.
- Public Master Schedule before real auth/Supabase Auth.
- Stripe changes, paid/free tiers, subscription gating, or billing portal.
- Changes to paid/manual/admin fulfillment.
- Google Calendar sync.
- Apple Calendar sync.
- Calendar import.
- Native iOS app.
- Push notifications or reminders.
- Recurring event engine or complex recurrence.
- Drag-and-drop calendar UI.
- Multi-user family/team calendars.
- Shared schedules.
- Medical records, diagnosis capture, medication lists, lab values, or PHI workflows.
- Workplace safety advice or staffing guidance.
- Automatic rescheduling without explicit user review.

## 10. Database Table: `app_schedule_events`

Implemented SQL exists in `supabase/shiftplan_app_schedule_events.sql`. The production table was reported applied. The implemented table is:

```text
app_schedule_events
- id uuid primary key
- created_at timestamptz
- updated_at timestamptz
- app_user_id uuid references app_users(id) on delete cascade
- title text
- category text
- event_date date
- start_time time nullable
- end_time time nullable
- all_day boolean default false
- notes text
- source text default 'manual'
- is_archived boolean default false
- archived_at timestamptz nullable
- archived_reason text nullable
```

Recommended checks and indexes:

- Check `category` against the supported event category values.
- Check `source` against known source values.
- Require a non-empty `title`.
- Require `event_date`.
- Add index on `(app_user_id, event_date)`.
- Add index on `(app_user_id, is_archived, event_date)` for active and archived lists.
- Keep `start_time` and `end_time` as text in v0 so overnight shifts do not require complex time ordering.

Founder decision: v0 should use soft archive and restore rather than hard delete. Soft archive is safer for beta because it reduces accidental data loss during product learning and gives support a recovery path if a tester archives the wrong event.

## 11. RLS And Security Considerations

The current app uses private beta access-code sessions and server-side Supabase REST calls with service role credentials. That means:

- Private beta Master Schedule can use the current `app_users` and access-code system.
- Public Master Schedule should wait for real auth/Supabase Auth.
- Supabase service role keys must remain server-side only.
- Client code must never receive service role credentials.
- API routes must verify the existing `/app` access session before reading or writing schedule events.
- Every schedule event query must filter by the current `app_user_id`.
- Admin visibility should be read-only at first.
- Admin routes should not create, edit, archive, or restore user schedule events in v0.
- Admin routes should not expose detailed Master Schedule events unless a founder-facing support or QA need is explicitly defined.
- RLS should be enabled on the future table even if MVP access is through service-role API routes.
- Grants should stay narrow, matching existing app tables: service role can select/insert/update, while public anon access should not read events directly.
- The hardening migration should revoke direct table privileges from `anon` and `authenticated`; current private beta access remains through server-side service-role routes.

When Supabase Auth exists later, add owner-based policies such as:

- Users can select their own events.
- Users can insert events for their own user id.
- Users can update or archive their own events.
- Users cannot read, modify, or infer another user's events.

Privacy note: schedule events can reveal employment, school, family, travel, and appointment patterns. Treat them as sensitive personal planning data even when they are not medical data.

## 12. How Weekly AI Generation Should Use Schedule Events

Weekly generation should use events as structured inputs, not vague context.

Prompt input should include:

- The verified 7-day date list.
- Schedule events grouped by date.
- Each event's title, category, time/all-day status, and notes.
- Saved preferences.
- Workout builder details if the user adds or saves them.
- The user's weekly goal, top priorities, and anything to avoid.

AI behavior rules:

- Keep fixed events on their submitted dates and times.
- Treat work shifts, clinicals, classes, appointments, travel, and dated deadlines as fixed unless the user says otherwise.
- Treat errands, some workouts, and some family/personal items as flexible only if the event itself does not specify a fixed time.
- Do not invent appointments, errands, classes, deadlines, work shifts, or family obligations.
- Do not infer medical details from appointment titles or notes.
- Do not provide medical, treatment, workplace safety, emergency, medication, or diagnosis guidance.
- Use schedule events to place meal prep, reset blocks, workout placement, and checklist items around the user's actual week.
- Include review language reminding users to check dates, times, and assumptions before relying on the plan.

The prompt should include a compact "Master Schedule events for this week" section separate from saved preferences so the model can distinguish fixed dated facts from general defaults.

## 13. How This Affects `/app` Navigation

The simplified Command Center should stay simple. Recommended navigation:

- Home: show next useful action and a small "Upcoming schedule" preview.
- Create: keep weekly request generation, with an option to use events from Master Schedule.
- Schedule: new Master Schedule view for adding and reviewing long-range events.
- Plan: keep saved weekly plans, Today/Next Up, checklist, calendar export, and feedback.
- Settings: keep saved preferences and workout defaults.

Founder decision: Schedule should become a top-level tab. The first private beta implementation now uses Home, Schedule, Create, Plan, and Settings while preserving Home as the command center. Avoid making Schedule the first screen until repeat use proves it is more important than weekly generation. For Phase 3 MVP, Home should still answer "what do I do next?"

## 14. How This Affects Saved Preferences And Workout Builder

Saved preferences should remain defaults, not dated events.

Use saved preferences for:

- Typical shift type.
- Usual commute.
- Preferred plan style.
- Meal prep preferences.
- Workout/training preferences.
- Recurring responsibilities without specific dates.
- Things to avoid after work.
- Planning notes.

Use Master Schedule events for:

- Specific dated shifts.
- Specific clinical/class blocks.
- Specific appointments.
- Specific deadlines.
- Specific travel.
- Specific workouts or training sessions.
- Specific family/personal commitments.

Workout builder should eventually support two outputs:

- Saved workout preference: default training style and placement rules.
- This-week workout events: dated workout/training items that can be added to the Master Schedule.

For MVP, do not force workout builder into the schedule table. Keep it compatible by allowing `workout_training` events and later deciding whether workout builder can create them.

## 15. How This Affects Checklist And Calendar Export

Checklist:

- First implementation should keep the current checklist extraction behavior from saved plan text.
- Schedule events can improve checklist quality because the generated plan knows the real week.
- Do not create `app_plan_checklist_items` as part of the Master Schedule MVP unless the checklist table is explicitly approved.
- Future checklist items should be traceable to the weekly plan, not directly to the Master Schedule, because checklist actions are generated plan outputs.

Calendar export:

- Keep `.ics` download only.
- Do not add calendar sync or reminders.
- Master Schedule events can appear as reference context in generated plan `.ics` descriptions when available.
- Do not export every raw schedule event as a separate calendar event in v0.
- Export should still warn users to review dates and times before relying on the file.

Important distinction:

- Master Schedule events are input facts.
- Generated checklist and calendar items are output artifacts from a weekly plan.

## 16. Privacy And Safety Considerations

Master Schedule data is sensitive even when it is not formally health data.

Privacy and safety rules:

- Do not ask users to enter diagnoses, medication lists, lab values, insurance numbers, medical record numbers, or emergency details.
- Appointment titles should be generic by default. Example: "Appointment" is safer than collecting a specialist, diagnosis, or reason.
- Notes should have helper copy that says not to include sensitive medical, workplace, school, or family details unless necessary.
- Travel and home/family events can reveal location and vulnerability patterns; keep access scoped to the user.
- Generated plans must remain lifestyle organization only.
- Do not provide workplace safety, staffing, clinical performance, medical, diagnosis, treatment, mental health, medication, or emergency guidance.
- Emergency language should continue to point users to 911 or emergency care for emergencies.

Founder/admin tooling should avoid exposing detailed long-range schedules unless there is a clear support reason and privacy review.

## 17. Risks And Complexity

Product risks:

- Adding a calendar-like feature can make the app feel heavier than the current weekly workflow.
- Users may expect full calendar sync once they see a schedule screen.
- Long-range event entry could be too much manual work if the UI is not fast.
- Users may add vague events and expect exact plans from incomplete data.
- Users may enter sensitive appointment or workplace details.

Technical risks:

- Date/time handling can get complicated across local time, all-day events, and future calendar import.
- Recurrence can become a large feature on its own.
- Duplicates can appear if users copy events from weekly requests into Master Schedule.
- AI prompts can become noisy if too many events are included.
- Future Supabase Auth migration must preserve ownership of schedule events.

Risk controls:

- Start with simple manual single events.
- Keep review-before-generation.
- Keep complex recurrence, calendar sync, reminders, and import parked.
- Keep prompt formatting structured and limited to the selected week.
- Add privacy helper copy near notes fields.

## 18. Phased Implementation Roadmap

Phase 3A - Spec and design:

- Founder decisions recorded in this spec.
- Treat Schedule as a top-level tab while keeping Home as the command center.
- Confirm event category labels.
- Use soft archive and restore instead of hard delete.
- Keep admin visibility read-only at first.

Phase 3B - Data model:

- Add `app_schedule_events` migration only after approval.
- Add follow-up hardening migration to revoke direct anon/authenticated table grants.
- Add server helpers or API routes for event list/create/update/archive.
- Use the current `app_users` and access-code session model for private beta.
- Wait for Supabase Auth before public Master Schedule.
- Keep service role server-side.

Phase 3C - Basic Master Schedule UI:

- Add simple top-level Schedule view inside `/app`.
- Add event form, edit flow, archive/restore actions, and upcoming-events list.
- Add selected-week filter and event preview.
- Add limited bulk quick add, schedule notes append flow, and informational overload hints.
- Keep the UI compact and mobile-first.

Phase 3D - Weekly request integration:

- Let selected-week events prefill or attach to a weekly request.
- Keep the weekly request review step.
- Add prompt section for "Master Schedule events for this week."
- Include schedule context in calendar export descriptions without sync, reminders, or duplicate raw event exports.
- Save generated plans through the current generation path.
- Keep Google/Apple Calendar sync and complex recurrence out of v0.

Phase 3E - Admin and QA visibility:

- Show read-only schedule event counts and latest date in App Beta admin.
- Do not expose event notes by default.
- Do not add admin write controls for schedule events.
- Apply the hardening migration to revoke direct anon/authenticated table grants.

Phase 3F - QA and beta learning:

- Test with one beta user who has known shifts several weeks ahead.
- Test with a student or clinical schedule.
- Test with mixed shifts plus family/personal commitments.
- Verify generation accuracy for dates, days, fixed times, and all-day deadlines.
- Verify no changes to paid/manual/admin fulfillment.

Phase 3G - Later enhancements:

- Recurring events.
- Better weekly calendar view.
- Event duplication helpers.
- Workout builder to schedule-event creation.
- Checklist table.
- Calendar import/export improvements.
- Auth migration and public accounts.

## 19. First Implementation Prompt When Ready

Use this prompt only after founder decisions are made and SQL is approved:

```text
Implement Phase 3A/3B for ShiftPlan Master Schedule.

Repo: /Users/evantaylor/Code/shiftplan

Goal:
Add the first backend and UI foundation for Master Schedule events inside the existing private beta app.

Read first:
- AGENTS.md
- README.md
- docs/codex-skills/shiftplan-core-rules.md
- docs/codex-skills/app-feature-skill.md
- docs/shiftplan-master-schedule-spec.md
- src/components/ShiftPlanAppAccess.tsx
- src/app/api/app/weekly-requests/route.ts
- src/app/api/app/generate-plan/route.ts
- existing supabase app table migrations

Constraints:
- Preserve /app behavior.
- Preserve /admin behavior.
- Preserve paid/manual fulfillment and Stripe.
- Do not add Supabase Auth.
- Do not add public account creation.
- Do not add calendar sync, reminders, push notifications, native iOS, or complex recurrence.
- Keep service role server-side only.
- Keep exact work shifts required for generation.
- Keep generation review-before-submit.
- Use soft archive and restore instead of hard delete.
- Keep admin visibility read-only if schedule events are exposed in admin at all.

Build:
1. Add an approved Supabase migration for app_schedule_events.
2. Add private-beta app API routes for list/create/update/archive/restore schedule events, scoped to the current app_user_id.
3. Add a compact Schedule section/view inside /app for manual event entry, editing, archive/restore, upcoming events, and week filtering.
4. Add selected-week event loading to the weekly request flow without removing manual fields.
5. Update generation prompt to include Master Schedule events for the selected week.
6. Keep checklist and calendar export behavior unchanged.

Run:
npm run lint
npm run build

Report files changed, runtime behavior, SQL added, lint/build result, and manual QA needed.
```

## 20. Manual Questions For Founder Before Implementation

Answered founder decisions:

- Master Schedule should become a top-level Schedule tab.
- Initial private beta should preserve the current simplified weekly flow while introducing Schedule as a real product surface.
- Users should be able to add, edit, archive, and restore events in v0.
- Events should be soft-archived for beta recovery instead of hard-deleted.
- Admin visibility should be read-only at first.
- Private beta can use the current `app_users` and access-code system.
- Public Master Schedule should wait for real auth/Supabase Auth.
- Google/Apple Calendar sync should not be built in v0.
- Complex recurrence should not be built in v0.

Remaining questions:

- Should work shifts created in weekly requests be copied back into Master Schedule, or should copying be manual only at first?
- Should the app require a title for every event, or auto-title events by category?
- Should date-only assignment deadlines appear at the start of the day, end of day, or simply as all-day due dates?
- Should workouts entered through the workout builder create `workout_training` events now, later, or never?
- Should travel be modeled as single-day events first, or should multi-day travel be supported in the MVP?
- What is the minimum event-entry UI that would feel fast enough on iPhone?
- What beta user should test this first: Emily, another nurse, a student/clinical user, or founder-only?
- What privacy copy should appear near appointment and notes fields?
- What success signal proves this is worth building beyond the MVP?
