create extension if not exists pgcrypto;

create table if not exists public.app_schedule_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  app_user_id uuid not null references public.app_users(id) on delete cascade,
  title text not null,
  category text not null,
  event_date date not null,
  start_time text,
  end_time text,
  all_day boolean not null default false,
  notes text not null default '',
  source text not null default 'manual',
  is_archived boolean not null default false,
  archived_at timestamptz,
  archived_reason text,
  constraint app_schedule_events_category_check
    check (category in (
      'Work shift',
      'Clinical',
      'Class/school',
      'Assignment/deadline',
      'Appointment',
      'Errand',
      'Workout/training',
      'Family/personal',
      'Travel',
      'Other'
    )),
  constraint app_schedule_events_title_check
    check (length(trim(title)) > 0),
  constraint app_schedule_events_source_check
    check (length(trim(source)) > 0)
);

alter table public.app_schedule_events enable row level security;

create index if not exists app_schedule_events_user_date_idx
on public.app_schedule_events (app_user_id, event_date);

create index if not exists app_schedule_events_user_archived_date_idx
on public.app_schedule_events (app_user_id, is_archived, event_date);

create index if not exists app_schedule_events_category_idx
on public.app_schedule_events (category);

create index if not exists app_schedule_events_created_idx
on public.app_schedule_events (created_at desc);

grant select, insert, update on public.app_schedule_events to service_role;

-- Master Schedule v0 remains private beta infrastructure.
-- Server-side app APIs use the service role and the existing app access session
-- to scope rows by app_user_id. No anon policies are intentionally added here.
-- Public-account Supabase Auth policies are future work.
