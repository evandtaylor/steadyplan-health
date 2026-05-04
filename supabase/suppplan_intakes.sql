create extension if not exists pgcrypto;

create table if not exists public.suppplan_intakes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  name text not null,
  email text not null,
  main_goal text not null,
  routine_complexity text not null,
  biggest_organization_problem text not null,
  current_tools text not null,
  useful_planner_details text not null,
  wants_inventory_reminders text not null,
  willingness_to_pay text not null,
  constraint suppplan_intakes_main_goal_check
    check (main_goal in (
      'Remembering supplements',
      'Organizing timing',
      'Avoiding duplicate ingredients',
      'Inventory tracking',
      'Questions to ask a provider',
      'General supplement education',
      'Other'
    )),
  constraint suppplan_intakes_routine_complexity_check
    check (routine_complexity in (
      '1-2 products',
      '3-5 products',
      '6-10 products',
      '10+ products'
    )),
  constraint suppplan_intakes_inventory_reminders_check
    check (wants_inventory_reminders in ('Yes', 'No', 'Maybe')),
  constraint suppplan_intakes_willingness_to_pay_check
    check (willingness_to_pay in ('Yes', 'No', 'Maybe'))
);

alter table public.suppplan_intakes enable row level security;

grant insert on public.suppplan_intakes to anon;

drop policy if exists "Allow anonymous SuppPlan intake inserts" on public.suppplan_intakes;

create policy "Allow anonymous SuppPlan intake inserts"
on public.suppplan_intakes
for insert
to anon
with check (true);
