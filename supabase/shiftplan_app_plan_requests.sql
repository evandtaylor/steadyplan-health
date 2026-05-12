create extension if not exists pgcrypto;

create table if not exists public.app_plan_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  app_user_id uuid not null references public.app_users(id) on delete cascade,
  email text not null,
  week_start_date date not null,
  week_end_date date not null,
  schedule_type text not null,
  work_schedule text not null,
  commute_time text,
  main_goal text not null,
  meal_prep_needs text,
  workout_training_goals text,
  appointments text,
  errands text,
  family_personal_responsibilities text,
  top_priorities text,
  anything_to_avoid text,
  preferred_plan_style text not null,
  safety_acknowledged boolean not null default false,
  status text not null default 'submitted',
  constraint app_plan_requests_week_length_check
    check (week_end_date = week_start_date + 6),
  constraint app_plan_requests_schedule_type_check
    check (schedule_type in (
      '3x12 days',
      '3x12 nights',
      'Rotating shifts',
      '4x10s',
      '5x8s',
      'Mixed/irregular',
      'Other'
    )),
  constraint app_plan_requests_plan_style_check
    check (preferred_plan_style in (
      'Simple',
      'Detailed',
      'Checklist-heavy',
      'Calendar-style'
    )),
  constraint app_plan_requests_status_check
    check (status in (
      'submitted',
      'generated',
      'failed',
      'blocked_safety'
    )),
  constraint app_plan_requests_safety_check
    check (safety_acknowledged = true),
  constraint app_plan_requests_work_schedule_check
    check (length(trim(work_schedule)) > 0),
  constraint app_plan_requests_main_goal_check
    check (length(trim(main_goal)) > 0)
);

alter table public.app_plan_requests enable row level security;

create index if not exists app_plan_requests_user_created_idx
on public.app_plan_requests (app_user_id, created_at desc);

create index if not exists app_plan_requests_email_created_idx
on public.app_plan_requests (email, created_at desc);

create index if not exists app_plan_requests_status_idx
on public.app_plan_requests (status);

grant select, insert, update on public.app_plan_requests to service_role;
