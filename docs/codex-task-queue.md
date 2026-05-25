# ShiftPlan Master Codex Task Queue

This is the living product and task queue for ShiftPlan. ChatGPT can update this file before handing work to Codex, and Codex should read it before starting implementation.

## Next Recommended Task

| Priority | Type | Risk | SQL Needed | Task | Notes |
| --- | --- | --- | --- | --- | --- |
| high | manual | low | no | Run Emily retest on deployed Schedule Week view | Use `docs/shiftplan-emily-retest-runbook.md`; confirm List remains familiar, Week shows Monday-Sunday, real schedule events appear on the right days, and mobile has no horizontal overflow. |
| high | manual | medium | no | Record Emily retest results | Use `docs/manual-qa-results-template.md`; do not include raw access codes, hashes, secrets, or private tester details. |
| medium | manual | low | no | Prepare 2-3 trusted tester invites after Emily passes | Use `docs/private-beta-ops-checklist.md`, `docs/tester-app-walkthrough.md`, and `docs/private-beta-tester-tracker-template.md`; wait if Emily finds a critical blocker. |

## Current Phase

Phase 3 — Master Schedule v0 private beta expansion plus product-quality polish, gated by manual QA.

## Current Live Product Status

- Public site live.
- Paid/manual MVP live.
- Admin AI fulfillment live.
- `/app` private beta live.
- Customer-side AI generation live.
- Saved preferences live.
- Checklist by day live.
- Calendar export live.
- Feedback live.
- Usage limits live.
- App Beta admin view live.
- App Access Codes admin management live.
- Lightweight Schedule Week view live in `e8ff954`.
- Beta onboarding card live.
- iPhone Add to Home Screen guide live.
- Homepage app preview section live.
- Saved plan timeline layout live.
- Week start quick buttons live.
- Shift schedule templates live.
- Weekly request draft autosave live.
- Checklist controls live.
- Calendar export preview live.
- Next-week-from-plan action live.
- Feedback feature chips live.
- First-run app flow live.
- Start here card completed locally.
- Request saved next-step card completed locally.
- Generated plan review checklist completed locally.
- Calendar export detail polish completed locally.
- Plan feedback reminder completed locally.
- Compact beta limitations note completed locally.
- Command Center simplification completed locally.
- Simplified Create flow completed locally.
- Simplified saved Plan view completed locally.
- Simplified customer-side AI output format completed locally.
- Simple mode labels completed locally.
- Redundant app UI cleanup completed locally.
- App Access Codes duplicate warning completed locally in `680affd`.
- App Access Codes reset helper checklist completed locally in `93c9b7c`.
- Master Schedule SQL migration completed locally in `d8d2ccc`.
- Master Schedule app API completed locally in `2d55812`.
- Master Schedule Settings UI completed locally in `1798cb7`.
- Master Schedule generation integration completed locally in `dd668e5`.
- Master Schedule quick adds completed locally in `f20664f`.
- Master Schedule schedule-notes input completed locally in `a10cc9a`.
- Homepage long-range planning copy completed locally in `5226b33`.
- Master Schedule grant hardening migration completed locally in `b01aa88`.
- Master Schedule top-level Schedule view completed locally in `c9e5972`.
- Master Schedule Home preview completed locally in `e626618`.
- Master Schedule Create flow context panel completed locally in `6068da9`.
- Master Schedule bulk quick add completed locally in `bc61b3a`.
- Master Schedule overload hints completed locally in `d1ae3d1`.
- Master Schedule archive confirmation polish completed locally in `7647391`.
- Master Schedule notes flow clarified locally in `e67eb6a`.
- Master Schedule context added to calendar export locally in `27d68e2`.
- Master Schedule read-only admin summary completed locally in `eed015f`.
- Long-range homepage copy refined locally in `a0296c6`.
- Product-quality public site messaging polish completed locally in `2d9d429`.
- Product-quality app login copy polish completed locally in `e5c3f43`.
- Home schedule CTA clarity completed locally in `c562115`.
- Plan feedback future-feature chips updated locally in `3d10d73`.
- App AI output safety note tightened locally in `4a99ea4`.
- Product audit report completed locally in this pass.

## Phase 3 Master Schedule Status

- Migration file created: `supabase/shiftplan_app_schedule_events.sql`.
- Production SQL for the base `app_schedule_events` table was reported applied.
- Hardening migration created and reported applied: `supabase/shiftplan_app_schedule_events_hardening.sql`.
- Runtime API created: `GET`, `POST`, and `PATCH /api/app/schedule-events`; archive/restore uses `POST /api/app/schedule-events` with an action payload.
- UI now has a top-level `/app` Schedule view; Settings links to Schedule instead of rendering the full Schedule UI.
- UI supports add event, edit event, archive/restore event, upcoming events list, show archived, week filter, single-event quick adds, limited bulk quick adds, schedule notes, and client-side busy-day hints.
- UI supports a lightweight Schedule `List` / `Week` toggle; Week view groups active events Monday-Sunday for the selected week and stays read-only.
- Home includes a compact "This week from your schedule" preview with Open Schedule and Use this week in Create actions.
- Create includes a compact "Known this week" panel that appends a schedule summary to the weekly request without overwriting user text.
- App generation now loads active schedule events for the weekly request date range and includes them as fixed commitments.
- Calendar export includes selected-week schedule context in the plan summary description when events are available.
- App Beta admin includes read-only schedule event counts and latest event date; it does not expose event notes or write controls.
- If the schedule table is missing, generation skips schedule events instead of breaking, but the UI/API require the migration for normal use.
- No Google/Apple calendar sync, recurrence, public accounts, Supabase Auth, native iOS, Stripe change, or paid intake change was added.

## Immediate Manual QA Tasks

| Priority | Type | Risk | SQL Needed | Task | Notes |
| --- | --- | --- | --- | --- | --- |
| high | manual | medium | no | Test top-level Schedule view | Confirm Schedule appears in `/app` nav, Settings links to it, and Home/Create/Plan/Settings remain usable. |
| high | manual | medium | no | Test Master Schedule event CRUD | Use a private beta account; verify add, edit, archive, restore, show archived, upcoming list, and week filter. |
| high | manual | low | no | Test Schedule Week view | Confirm List is default, Week renders Monday-Sunday, active events land on the correct date cards, empty days say "Nothing planned yet.", and iPhone layout has no horizontal overflow. |
| high | manual | medium | no | Test Home/Create schedule connection | Confirm Home preview shows this-week events and Create can append the selected-week schedule summary without overwriting text. |
| high | manual | low | no | Test product-quality polish | Confirm homepage private-beta/current-feature copy, `/app` login safety copy, Home schedule CTA, and feedback feature chips read correctly. |
| high | manual | medium | no | Test weekly generation from schedule events | Add work shifts, clinical/class/deadline, and workout events inside one week; generate one plan and verify event dates/times stay fixed. |
| high | manual | medium | no | Test schedule bulk quick adds and notes on iPhone | Confirm limited repeated work/clinical/class/deadline helpers preview before creating; notes append to weekly context and no parsing/sync is implied. |
| medium | manual | low | no | Test schedule overload hints | Confirm packed/long-day/no-time hints are informational and do not provide medical or workplace safety guidance. |
| medium | manual | low | no | Test calendar export schedule context | Confirm `.ics` plan summary can mention known schedule context without creating duplicate raw events, alarms, or sync. |
| medium | manual | low | no | Test read-only admin schedule summary | Confirm App Beta admin shows schedule counts/latest date only and no event notes or write actions. |
| high | manual | low | no | Test App Access Codes create/deactivate/reactivate | Verify admin workflow without changing schema or auth. |
| high | manual | low | no | Prepare repeatable QA access if needed | Use a clearly labeled test access record, but do not use `agent-mode-test` unless the founder confirms the duplicate/expired record has been cleaned or replaced. |
| high | manual | low | no | Test fresh generated timeline plan | Generate exactly one test plan when safe; verify timeline structure and safety boundaries. |
| high | manual | low | no | Test saved plan Today/Next up view | Confirm the quick view shows the right day when the plan includes today, and falls back cleanly for old plans. |
| high | manual | low | no | Test calendar export on iPhone | Confirm `.ics` download/import behavior in real Safari. |
| high | manual | low | no | Test checklist by day on iPhone | Confirm day groups expand/collapse and taps persist well enough for beta. |
| high | manual | low | no | Test checklist controls on iPhone | Confirm expand all, collapse all, hide completed, and show completed work with grouped checklist progress. |
| high | manual | low | no | Test feedback shortcut | Confirm "Was this plan useful?" scrolls to the correct saved plan feedback form on mobile. |
| high | manual | low | no | Test copy buttons on saved plans | Confirm Copy Summary, Copy Plan, and Copy Checklist still work where clipboard access is available. |
| high | manual | low | no | Test new weekly request helpers | Confirm week-start buttons, shift templates, draft autosave, clear draft, and next-week-from-plan behave as expected. |
| high | manual | low | no | Test beta readiness polish | Confirm Start here, request saved next step, generated plan review checklist, feedback reminder, and beta limitations note are clear on mobile. |
| high | manual | low | no | Test simplified Command Center flow | Confirm Home has one clear next action, Create is short above the fold, Plan leads with Today/checklist/timeline, and Settings holds optional defaults/workouts. |
| high | manual | low | no | Gather Emily feedback | Ask whether Phase 2 changes reduced scrolling and made requests faster. |
| medium | manual | low | no | Invite 2-3 more beta testers | Do this only after fresh `/app` generation, checklist, and calendar QA pass. |

## Phase 2 App Usability Work

| Priority | Type | Risk | SQL Needed | Task | Notes |
| --- | --- | --- | --- | --- | --- |
| high | Codex | low | no | Week start quick buttons | Completed locally in `7f63b7e`; manual QA pending. |
| high | Codex | low | no | Shift schedule templates | Completed locally in `d063ff8`; templates fill the existing work schedule textarea only. |
| high | Codex | low | no | Weekly request draft autosave | Completed locally in `fc33903`; localStorage only, safety acknowledgment not persisted as checked. |
| medium | Codex | low | no | Checklist controls | Completed locally in `996281b`; grouped checklist and local checked state preserved. |
| medium | Codex | low | no | Calendar export preview | Completed locally in `e4b1045`; `.ics` generation remains all-day events without reminders. |
| medium | Codex | low | no | Plan next week from this | Completed locally in `6adf8d4`; prefill/scroll only, no auto-submit or database change. |
| medium | Codex | low | no | Feedback feature chips | Completed locally in `3671220`; chips sync into existing additional notes field. |
| high | Codex | low | no | First-run flow | Completed locally in `edf4fd5`; visible only when no requests or saved plans exist. |
| high | Codex | low | no | Start here card | Completed locally in `cf9e502`; compact three-step beta path with saved plans jump. |
| high | Codex | low | no | Request saved next step | Completed locally in `c24414a`; points users to the saved request Generate button. |
| medium | Codex | low | no | Generated plan review checklist | Completed locally in `309e96d`; informational only, no saved plan data changes. |
| medium | Codex | low | no | Calendar export detail polish | Completed locally in `4645bd4`; clearer filename and event descriptions, no sync or reminders. |
| medium | Codex | low | no | Plan feedback reminder | Completed locally in `ed38c67`; adds helper copy and feedback jump action. |
| medium | Codex | low | no | Beta limitations note | Completed locally in `23f30bf`; compact private beta expectation copy. |

## Phase 2 Beta Readiness Documentation

| Priority | Type | Risk | SQL Needed | Task | Notes |
| --- | --- | --- | --- | --- | --- |
| high | Codex | low | no | Tester-facing known limitations | Completed locally in `d3bc8c5`; documents AI draft, `.ics`, local checklist, access, and not-now items. |
| high | Codex | low | no | Manual QA results template | Completed locally in `fa937b7`; structured report template for phone/computer QA. |
| high | Codex | low | no | Phase 2 exit criteria | Completed locally in `fa297f1`; defines when to move into Phase 3 planning. |

## Phase 2 Simplification Work

| Priority | Type | Risk | SQL Needed | Task | Notes |
| --- | --- | --- | --- | --- | --- |
| high | Codex | low | no | Simplify `/app` copy globally | Completed locally in `835b6cd`; shorter app copy with safety boundaries preserved. |
| high | Codex | low | no | Clarify Home next action | Completed locally in `ef2ea55`; one state-driven primary CTA and compact current-week status. |
| high | Codex | low | no | Simplify Create flow | Completed locally in `64387fb`; top flow emphasizes summary, week start, exact schedule, safety, and save/generate. |
| high | Codex | low | no | Make Generate step obvious | Completed locally in `29d377b`; post-save card points directly to Generate. |
| medium | Codex | low | no | Simplify Workout placement | Completed locally in `828c0e2`; workout builder is optional with quick/detailed/skip paths. |
| high | Codex | low | no | Simplify Plan view | Completed locally in `74d5f46`; Today/checklist/timeline lead and secondary actions are grouped. |
| high | Codex | low | no | Simplify app AI output format | Completed locally in `1d62441`; customer-side prompt now requests a shorter app-ready timeline/checklist format. |
| medium | Codex | low | no | Add simple mode labels | Completed locally in `0cf0f85`; Required, Optional, Advanced, and Saved default labels added sparingly. |
| medium | Codex | low | no | Clean up redundant app UI | Completed locally in `0c97c3f`; duplicate first-run, feedback, iPhone, and helper clutter reduced. |

## Phase 2 Codex Tasks

| Priority | Type | Risk | SQL Needed | Task | Notes |
| --- | --- | --- | --- | --- | --- |
| high | Codex | medium | no | Fix any date-input friction found during live QA | Keep native date input unless QA shows a concrete issue; avoid schema changes. |
| high | Codex | low | no | Improve mobile weekly request layout | Make form sections easier to scan on iPhone; keep exact shifts required. |
| high | Codex | low | no | Refine generated timeline prompt after fresh QA | Current simplification completed locally in `1d62441`; use one fresh generated plan before another prompt pass. |
| medium | Codex | low | no | Polish saved plan Today/Next up view after QA | Display-only tweaks based on mobile QA; preserve saved plan data and checklist extraction. |
| medium | Codex | low | no | Improve quick chips based on tester wording | Chips should fill existing fields only and remain editable. |
| medium | Codex | low | no | Add compact saved-plan filters or ordering if needed | No schema change; use existing saved plan data. |
| medium | Codex | low | no | Improve beta feedback prompts | Keep short; capture usefulness, friction, and willingness to use weekly. |
| medium | Codex | low | no | Refine calendar export after iPhone QA | Preserve `.ics` export, avoid sync/reminders, and do not invent exact times. |
| medium | Codex | low | no | Improve checklist completed-state clarity | Preserve grouped checklist behavior and copy/export buttons. |
| medium | Codex | low | no | Fix top friction issue from Emily retest | Wait for updated tester feedback; keep the next pass small and evidence-based. |
| low | Codex | low | no | Add small mobile QA notes after tester sessions | Documentation-only updates to the mobile QA checklist. |

## Phase 2 Website Tasks

| Priority | Type | Risk | SQL Needed | Task | Notes |
| --- | --- | --- | --- | --- | --- |
| high | Codex | low | no | Continue app-first homepage improvements | Keep paid offers and private beta CTAs intact. |
| high | Codex | low | no | Make waitlist/beta section clearer | Reduce reading before the user understands the app path. |
| medium | Codex | low | no | Add sample plan preview | Use safe lifestyle/routine content only; avoid implying medical outcomes. |
| medium | Codex | low | no | Add CTA analytics review notes | Documentation or existing analytics only unless implementation is requested. |
| medium | Codex | low | no | Clean up abstract homepage copy | Keep the tone human and practical. |
| low | Codex | low | no | Reduce website clutter after more tester feedback | Preserve legal and safety language. |

## Phase 2 Marketing/Content Tasks

| Priority | Type | Risk | SQL Needed | Task | Notes |
| --- | --- | --- | --- | --- | --- |
| high | manual | low | no | Turn content bank into first 5 swipe videos | Use `docs/shiftplan-content-bank.md`; keep claims lifestyle/routine only. |
| high | manual | low | no | Publish one 7a-7p comment-your-schedule test | Use beta CTA copy and invite real schedule comments. |
| high | manual | low | no | Publish one 7p-7a comment-your-schedule test | Avoid sleep disorder or fatigue treatment framing. |
| medium | manual | low | no | Publish one 3x12/off-day planning post | Keep tips as lifestyle organization and planning ideas. |
| medium | manual | low | no | Test social bio and link-in-bio copy | Use `docs/shiftplan-social-profile-copy.md`; keep private beta positioning. |
| low | manual | low | no | Collect tester quotes and objections | Use only with permission; avoid sensitive health/workplace details. |

## Later Phase 3 Tasks

| Priority | Type | Risk | SQL Needed | Task | Notes |
| --- | --- | --- | --- | --- | --- |
| medium | later | high | yes | Supabase Auth | Requires migration plan, privacy review, and account-linking design. |
| medium | later | high | yes | Public account creation | Do not start until beta feedback supports it. |
| medium | later | high | yes | Paid/free app tiers | Requires product, billing, usage-limit, and entitlement decisions. |
| medium | later | high | yes | Stripe subscription gating | Requires Stripe subscription design, customer state, and webhook hardening. |
| medium | later | medium | unknown | Customer portal | Likely Stripe-hosted portal; coordinate with subscription gating. |
| medium | later | medium | unknown | Bigger beta | Wait until manual QA and tester feedback support it. |
| low | later | medium | unknown | iOS prototype planning | Planning only before native development. |

## Parked/Not Now

| Priority | Type | Risk | SQL Needed | Task | Notes |
| --- | --- | --- | --- | --- | --- |
| low | later | high | unknown | Native iOS app | Parked until web beta proves retention and core workflows. |
| low | later | medium | unknown | Push notifications | Parked; do not add reminders in Phase 2. |
| low | later | high | unknown | Google/Apple Calendar sync | Parked; `.ics` export only for now. |
| low | later | high | unknown | Wearables | Parked; avoid health-data scope. |
| low | later | high | unknown | Apple Health | Parked; avoid health-data scope. |
| low | later | medium | unknown | Community | Parked until product loop is clearer. |
| low | later | medium | unknown | AI chat | Parked; current app should generate structured weekly plans, not open-ended chat. |
| low | later | high | yes | Public account creation until beta feedback supports it | Explicitly not now. |

## Completed Recent Commits

| Commit | Summary | Notes |
| --- | --- | --- |
| `fbb6c36` | Add Emily retest runbook | Creates the standalone manual retest path and links it from launch-readiness docs. |
| `06b76c3` | Clarify current ShiftPlan QA status | Marks the failed `agent-mode-test` pass as historical and records current founder-QA status. |
| `351d31c` | Update ShiftPlan Week view QA readiness | Documents production Week view status and manual QA expectations. |
| `e8ff954` | Add lightweight Schedule Week view | Adds List/Week toggle and read-only Monday-Sunday visual calendar for selected week. |
| `9db7df4` | Record successful founder app QA | Documents founder-authenticated QA pass and readiness for Emily retest. |
| `bca45d0` | Align schedule access state with app session | Fixes production Schedule blocker by matching client state to verified app session. |
| `0c97c3f` | Clean up ShiftPlan app redundant UI | Removes duplicate helper cards/prompts and collapses low-priority guidance. |
| `0cf0f85` | Add ShiftPlan simple mode labels | Adds Required, Optional, Advanced, and Saved default labels where helpful. |
| `1d62441` | Simplify ShiftPlan app AI output format | Shorter app-ready customer-side prompt structure. |
| `74d5f46` | Simplify ShiftPlan plan view | Prioritizes Today, checklist progress, timeline, and grouped actions. |
| `828c0e2` | Simplify ShiftPlan workout placement | Makes workouts optional with quick/detailed/skip paths. |
| `29d377b` | Make ShiftPlan generate step obvious | Post-save UI makes Generate the dominant next step. |
| `64387fb` | Simplify ShiftPlan create flow | Moves quick chips/details lower and clarifies exact schedule example. |
| `ef2ea55` | Clarify ShiftPlan app home next action | Home uses one clear state-driven primary CTA. |
| `835b6cd` | Simplify ShiftPlan app copy | Shorter, more direct `/app` copy. |
| `fa297f1` | Add ShiftPlan Phase 2 exit criteria | Defines private beta exit metrics and Phase 3 triggers. |
| `fa937b7` | Add ShiftPlan manual QA results template | Structured template for manual QA findings. |
| `d3bc8c5` | Add ShiftPlan beta known limitations | Tester-facing limitations and issue reporting guidance. |
| `23f30bf` | Clarify ShiftPlan app beta limitations | Compact in-app beta limitations note. |
| `ed38c67` | Add ShiftPlan plan feedback reminder | Saved plan feedback reminder and jump action. |
| `4645bd4` | Polish ShiftPlan calendar export details | Clearer `.ics` filename and event descriptions. |
| `309e96d` | Add ShiftPlan generated plan review checklist | Informational review checklist near saved plans. |
| `c24414a` | Add ShiftPlan request saved next step | Post-save card points to the recent request Generate action. |
| `cf9e502` | Add ShiftPlan app start here card | Compact beta tester path near top of `/app`. |
| `edf4fd5` | Improve ShiftPlan first run app flow | First-run path for brand-new beta users with Start with this week CTA. |
| `3671220` | Add ShiftPlan feedback feature chips | Feature-ranking chips sync into existing feedback notes. |
| `6adf8d4` | Add ShiftPlan next week from plan action | Saved plan action scrolls and prefills from associated request data. |
| `e4b1045` | Add ShiftPlan calendar export preview | Read-only preview of all-day `.ics` event titles and dates. |
| `996281b` | Add ShiftPlan checklist controls | Expand/collapse and completed-item visibility controls. |
| `fc33903` | Add ShiftPlan weekly request draft autosave | Device-only localStorage draft restore and clear draft action. |
| `d063ff8` | Add ShiftPlan shift schedule templates | Editable common work-schedule quick-fill buttons. |
| `7f63b7e` | Add ShiftPlan week start quick buttons | Quick buttons for Today, Next Monday, Next Sunday, and Next week. |
| `4c9d6fe` | Add ShiftPlan tester app walkthrough | Tester-facing walkthrough and QA checklist. |
| `568077d` | Add ShiftPlan social profile copy | Bios, link-in-bio CTAs, pinned post copy, and beta CTAs. |
| `e890634` | Add ShiftPlan faceless content bank | 20 lifestyle/routine swipe-video concepts. |
| `5c5a3fa` | Add ShiftPlan private beta follow-up messages | Copy/paste follow-up messages for testers. |
| `924fb48` | Improve ShiftPlan app beta admin readability | Read-only App Beta admin signal cards. |
| `51636f6` | Add ShiftPlan plan feedback shortcut | Saved-plan CTA scrolls to existing feedback form. |
| `69d48df` | Clarify ShiftPlan calendar export | Clearer `.ics`, review-times, and no-reminder copy. |
| `7cd071a` | Add ShiftPlan saved plan today view | Saved plan Today/Next up quick view. |
| `e62e491` | Improve ShiftPlan saved plan timeline layout | More mobile-app-like saved plan display. |
| `11275f5` | Integrate v0 ShiftPlan homepage app preview section | Homepage app preview section; no preview routes. |
| `1552f89` | Clean ShiftPlan plan divider rendering | Older saved plan divider cleanup. |
| `be5773a` | Update ShiftPlan master Codex task queue | Master product/task queue. |
| `c36dd29` | Add ShiftPlan Codex workflow docs | Docs-only workflow system. |
| `c068c89` | Improve ShiftPlan app beta flow clarity | Compact beta flow and clearer saved defaults/request split. |
| `641faf4` | Add ShiftPlan mobile QA checklist | Manual mobile QA checklist. |
| `fc3acf8` | Reduce ShiftPlan duplicate checklist display | Interactive checklist prioritized. |
| `6ed03c9` | Clean ShiftPlan saved plan rendering | Display-only markdown cleanup. |
| `96fd55c` | Make ShiftPlan app plans timeline based | Customer-side `/app` prompt update. |
| `e3b3214` | Add ShiftPlan weekly request quick chips | More field-filling chips. |
| `1c57614` | Add ShiftPlan weekly freeform input | Text-only weekly summary path. |
| `99ea86b` | Clarify ShiftPlan saved preference fields | Better helper examples. |
| `d2be851` | Reduce ShiftPlan app dashboard scrolling | More compact dashboard flow. |
| `6252f07` | Humanize ShiftPlan homepage copy | Homepage copy polish. |
| `ae11aab` | Add ShiftPlan calendar export | `.ics` export for saved plans. |
| `2a88ec6` | Group ShiftPlan checklist by day | Interactive checklist grouped by day. |

## Report Format

Use [codex-report-template.md](./codex-report-template.md) for final reports.

At minimum, report:

- Task completed
- Files changed
- Commits
- Lint/build results
- SQL needed or not
- Stripe/admin/app impact
- Routes checked
- Errors
- Safe to push
- Manual QA needed
- Recommended next task
