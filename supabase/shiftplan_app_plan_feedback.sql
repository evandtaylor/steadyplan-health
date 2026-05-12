create extension if not exists pgcrypto;

create table if not exists public.app_plan_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  app_user_id uuid not null references public.app_users(id) on delete cascade,
  app_saved_plan_id uuid not null references public.app_saved_plans(id) on delete cascade,
  usefulness_rating integer not null,
  used_this_week text not null,
  what_worked text not null default '',
  what_felt_unrealistic text not null default '',
  what_should_shiftplan_remember text not null default '',
  would_use_weekly text not null,
  would_pay_9_month text not null,
  additional_notes text not null default '',
  constraint app_plan_feedback_rating_check
    check (usefulness_rating between 1 and 5),
  constraint app_plan_feedback_used_this_week_check
    check (used_this_week in ('Yes', 'No', 'Not yet')),
  constraint app_plan_feedback_would_use_weekly_check
    check (would_use_weekly in ('Yes', 'No', 'Maybe')),
  constraint app_plan_feedback_would_pay_9_month_check
    check (would_pay_9_month in ('Yes', 'No', 'Maybe'))
);

alter table public.app_plan_feedback enable row level security;

create unique index if not exists app_plan_feedback_saved_plan_unique_idx
on public.app_plan_feedback (app_saved_plan_id);

create index if not exists app_plan_feedback_user_created_idx
on public.app_plan_feedback (app_user_id, created_at desc);

grant select, insert, update on public.app_plan_feedback to service_role;
