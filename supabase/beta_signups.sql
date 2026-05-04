create extension if not exists pgcrypto;

create table if not exists public.beta_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  name text not null,
  email text not null,
  product_interest text not null,
  biggest_problem text not null,
  current_tools text,
  willingness_to_pay text not null,
  optional_details text,
  constraint beta_signups_product_interest_check
    check (product_interest in ('ShiftPlan', 'KinPlan', 'SuppPlan', 'All')),
  constraint beta_signups_willingness_to_pay_check
    check (willingness_to_pay in ('Yes', 'No', 'Maybe'))
);

alter table public.beta_signups enable row level security;

grant insert on public.beta_signups to anon;

drop policy if exists "Allow anonymous beta signup inserts" on public.beta_signups;

create policy "Allow anonymous beta signup inserts"
on public.beta_signups
for insert
to anon
with check (true);
