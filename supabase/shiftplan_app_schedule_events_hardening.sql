-- Harden Master Schedule event table grants for private beta.
-- The app uses server-side service-role API routes plus the existing app access
-- session to scope schedule events by app_user_id.
-- Direct anon/authenticated table access is intentionally disabled for v0.
-- Public Supabase Auth owner policies may be added in a later auth phase.

revoke all privileges on table public.app_schedule_events from anon;
revoke all privileges on table public.app_schedule_events from authenticated;

alter table public.app_schedule_events enable row level security;

grant select, insert, update on table public.app_schedule_events to service_role;
