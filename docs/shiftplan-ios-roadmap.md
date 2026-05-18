# ShiftPlan iOS Roadmap

ShiftPlan is currently a private web app beta. The goal is to learn from real weekly planning behavior before committing to native iOS complexity.

## Phase 1: Private Web App Beta

- Keep the current access-code beta running.
- Improve weekly request creation, saved preferences, saved plans, feedback, and usage limits.
- Use the web app to learn what nurses and shift workers actually repeat week to week.

## Phase 2: Mobile-First PWA Polish

- Make `/app` feel fast and comfortable on iPhone Safari.
- Improve saved plan readability, interactive checklist behavior, empty states, and home-screen metadata.
- Encourage testers to add ShiftPlan to the iPhone Home Screen while native iOS remains future roadmap.

## Phase 3: Supabase Auth

- Add real customer accounts after the beta flow proves useful.
- Link future `auth.users.id` records to existing `app_users.auth_user_id`.
- Keep existing app data tied to `app_users.id` so beta testers do not lose saved plans, requests, preferences, feedback, or usage history.

## Phase 4: Native iOS Prototype

- Prototype native iOS only after the core weekly planning loop is validated.
- Reuse the same Supabase-backed account and plan history model.
- Focus first on the weekly request, generated plan, saved preferences, and checklist experience.

## Phase 5: Apple Sign In

- Add Apple Sign In once native iOS or a public account flow needs it.
- Keep account linking deliberate so existing beta users can migrate cleanly.

## Phase 6: Push Notifications and Widgets

- Consider reminders, push notifications, widgets, and lock-screen glanceables after the plan loop is proven.
- Avoid reminder overload; ShiftPlan should stay useful and calm, not noisy.

## Why Native iOS Is Later

Native iOS should not be the first major investment because the product still needs evidence about the most valuable weekly behaviors. The web app can validate the planning loop, AI output quality, saved preferences, usage limits, and feedback patterns faster. Once those are steady, a native iPhone app can be built around a clearer, proven experience.
