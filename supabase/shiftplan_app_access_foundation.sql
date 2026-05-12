create extension if not exists pgcrypto;

create table if not exists public.app_access_codes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  email text not null,
  code_hash text not null,
  code_label text,
  is_active boolean not null default true,
  expires_at timestamp with time zone,
  max_generations_per_month integer not null default 4,
  max_generations_per_day integer not null default 1,
  notes text,
  constraint app_access_codes_email_check
    check (position('@' in email) > 1),
  constraint app_access_codes_code_hash_check
    check (length(trim(code_hash)) = 64),
  constraint app_access_codes_monthly_limit_check
    check (max_generations_per_month >= 0),
  constraint app_access_codes_daily_limit_check
    check (max_generations_per_day >= 0)
);

alter table public.app_access_codes enable row level security;

create unique index if not exists app_access_codes_email_hash_unique_idx
on public.app_access_codes (lower(email), code_hash);

create index if not exists app_access_codes_active_email_idx
on public.app_access_codes (lower(email), is_active);

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  email text not null unique,
  first_name text,
  access_code_id uuid references public.app_access_codes(id) on delete set null,
  last_seen_at timestamp with time zone,
  status text not null default 'Active',
  constraint app_users_status_check
    check (status in ('Active', 'Paused', 'Canceled', 'Blocked'))
);

alter table public.app_users enable row level security;

create index if not exists app_users_access_code_idx
on public.app_users (access_code_id);

create table if not exists public.app_usage_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  app_user_id uuid references public.app_users(id) on delete cascade,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  constraint app_usage_events_event_type_check
    check (length(trim(event_type)) > 0)
);

alter table public.app_usage_events enable row level security;

create index if not exists app_usage_events_user_created_idx
on public.app_usage_events (app_user_id, created_at desc);

create index if not exists app_usage_events_type_idx
on public.app_usage_events (event_type);

grant select, insert, update on public.app_access_codes to service_role;
grant select, insert, update on public.app_users to service_role;
grant select, insert on public.app_usage_events to service_role;

-- Access codes are stored as SHA-256 hashes, not raw codes.
-- Hash format used by the app:
-- sha256("shiftplan_app_access:v1:" + lower(trim(email)) + ":" + trim(code))
--
-- Example local hash helper:
-- node -e "const crypto=require('crypto'); const email='customer@example.com'.trim().toLowerCase(); const code='CHANGE-ME'.trim(); console.log(crypto.createHash('sha256').update(`shiftplan_app_access:v1:${email}:${code}`).digest('hex'))"
