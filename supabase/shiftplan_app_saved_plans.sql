create extension if not exists pgcrypto;

create table if not exists public.app_saved_plans (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  app_user_id uuid not null references public.app_users(id) on delete cascade,
  plan_request_id uuid not null references public.app_plan_requests(id) on delete cascade,
  week_start_date date not null,
  week_end_date date not null,
  plan_title text,
  plan_body text not null,
  plan_json jsonb not null default '{}'::jsonb,
  generation_source text not null default 'openai',
  usage_month integer not null,
  usage_year integer not null,
  generation_number_for_month integer not null,
  constraint app_saved_plans_week_length_check
    check (week_end_date = week_start_date + 6),
  constraint app_saved_plans_body_check
    check (length(trim(plan_body)) > 0),
  constraint app_saved_plans_generation_source_check
    check (generation_source in ('openai')),
  constraint app_saved_plans_usage_month_check
    check (usage_month between 1 and 12),
  constraint app_saved_plans_usage_year_check
    check (usage_year between 2024 and 2100),
  constraint app_saved_plans_generation_number_check
    check (generation_number_for_month >= 1)
);

alter table public.app_saved_plans enable row level security;

create unique index if not exists app_saved_plans_request_unique_idx
on public.app_saved_plans (plan_request_id);

create index if not exists app_saved_plans_user_created_idx
on public.app_saved_plans (app_user_id, created_at desc);

create index if not exists app_saved_plans_user_usage_idx
on public.app_saved_plans (app_user_id, usage_year, usage_month);

grant select, insert, update on public.app_saved_plans to service_role;
