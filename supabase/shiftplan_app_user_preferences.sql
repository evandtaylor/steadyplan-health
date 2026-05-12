create extension if not exists pgcrypto;

create table if not exists public.app_user_preferences (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  app_user_id uuid not null unique references public.app_users(id) on delete cascade,
  typical_shift_type text not null default '',
  usual_commute_time text not null default '',
  preferred_plan_style text not null default '',
  meal_prep_preferences text not null default '',
  workout_training_preferences text not null default '',
  recurring_responsibilities text not null default '',
  things_to_avoid_after_work text not null default '',
  default_week_start_day text not null default '',
  planning_notes text not null default ''
);

alter table public.app_user_preferences enable row level security;

create index if not exists app_user_preferences_user_idx
on public.app_user_preferences (app_user_id);

grant select, insert, update on public.app_user_preferences to service_role;
