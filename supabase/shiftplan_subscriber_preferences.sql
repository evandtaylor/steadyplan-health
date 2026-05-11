create extension if not exists pgcrypto;

create table if not exists public.shiftplan_subscriber_preferences (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  subscriber_email text not null unique,
  first_name text,
  job_role text,
  typical_shift_pattern text,
  typical_commute_time text,
  preferred_plan_style text,
  meal_prep_preferences text,
  workout_training_preferences text,
  recurring_responsibilities text,
  avoid_after_work text,
  monthly_focus text,
  plan_style_notes text,
  last_tuneup_date date,
  admin_notes text
);

alter table public.shiftplan_subscriber_preferences enable row level security;

grant select, insert, update on public.shiftplan_subscriber_preferences to service_role;

create index if not exists shiftplan_subscriber_preferences_email_idx
on public.shiftplan_subscriber_preferences (subscriber_email);
