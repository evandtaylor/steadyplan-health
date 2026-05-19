# ShiftPlan Master Codex Task Queue

This is the living product and task queue for ShiftPlan. ChatGPT can update this file before handing work to Codex, and Codex should read it before starting implementation.

## Next Recommended Task

| Priority | Type | Risk | SQL Needed | Task | Notes |
| --- | --- | --- | --- | --- | --- |
| high | manual | low | no | Create `agent-mode-test` app access and run one fresh `/app` QA pass | Test generation, saved plan timeline, Today/Next up view, checklist by day, calendar export, and feedback shortcut without creating excessive junk data. |

## Current Phase

Phase 2 — Private beta polish, app experience, tester feedback.

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
- Beta onboarding card live.
- iPhone Add to Home Screen guide live.
- Homepage app preview section live.
- Saved plan timeline layout live.

## Immediate Manual QA Tasks

| Priority | Type | Risk | SQL Needed | Task | Notes |
| --- | --- | --- | --- | --- | --- |
| high | manual | low | no | Test App Access Codes create/deactivate/reactivate | Verify admin workflow without changing schema or auth. |
| high | manual | low | no | Create `agent-mode-test` access | Use a clearly labeled test access record for repeatable QA. |
| high | manual | low | no | Test fresh generated timeline plan | Generate exactly one test plan when safe; verify timeline structure and safety boundaries. |
| high | manual | low | no | Test saved plan Today/Next up view | Confirm the quick view shows the right day when the plan includes today, and falls back cleanly for old plans. |
| high | manual | low | no | Test calendar export on iPhone | Confirm `.ics` download/import behavior in real Safari. |
| high | manual | low | no | Test checklist by day on iPhone | Confirm day groups expand/collapse and taps persist well enough for beta. |
| high | manual | low | no | Test feedback shortcut | Confirm "Was this plan useful?" scrolls to the correct saved plan feedback form on mobile. |
| high | manual | low | no | Gather Emily feedback | Ask whether Phase 2 changes reduced scrolling and made requests faster. |
| medium | manual | low | no | Invite 2-3 more beta testers | Do this only after fresh `/app` generation, checklist, and calendar QA pass. |

## Phase 2 Codex Tasks

| Priority | Type | Risk | SQL Needed | Task | Notes |
| --- | --- | --- | --- | --- | --- |
| high | Codex | medium | no | Fix any date-input friction found during live QA | Keep native date input unless QA shows a concrete issue; avoid schema changes. |
| high | Codex | low | no | Improve mobile weekly request layout | Make form sections easier to scan on iPhone; keep exact shifts required. |
| high | Codex | low | no | Refine generated timeline prompt after fresh QA | Customer-side `/app` prompt only unless shared code makes that unsafe. |
| medium | Codex | low | no | Polish saved plan Today/Next up view after QA | Display-only tweaks based on mobile QA; preserve saved plan data and checklist extraction. |
| medium | Codex | low | no | Improve quick chips based on tester wording | Chips should fill existing fields only and remain editable. |
| medium | Codex | low | no | Add compact saved-plan filters or ordering if needed | No schema change; use existing saved plan data. |
| medium | Codex | low | no | Improve beta feedback prompts | Keep short; capture usefulness, friction, and willingness to use weekly. |
| medium | Codex | low | no | Refine calendar export after iPhone QA | Preserve `.ics` export, avoid sync/reminders, and do not invent exact times. |
| medium | Codex | low | no | Improve checklist completed-state clarity | Preserve grouped checklist behavior and copy/export buttons. |
| medium | Codex | low | no | Reduce remaining copy clutter in `/app` | Keep safety language, but shorten repeated helper text where possible. |
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
