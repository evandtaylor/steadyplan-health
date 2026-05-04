create extension if not exists pgcrypto;

create table if not exists public.kinplan_intakes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  name text not null,
  email text not null,
  relationship_to_care_recipient text not null,
  main_care_situation text not null,
  caregiver_count text not null,
  biggest_challenge text not null,
  scattered_information text not null,
  plan_needs text not null,
  current_tools text not null,
  willingness_to_pay text not null,
  constraint kinplan_intakes_relationship_check
    check (relationship_to_care_recipient in (
      'Parent',
      'Grandparent',
      'Spouse',
      'Other family member',
      'Friend',
      'Other'
    )),
  constraint kinplan_intakes_main_care_situation_check
    check (main_care_situation in (
      'After hospital discharge',
      'Aging parent support',
      'Multiple appointments',
      'Medication organization',
      'Mobility/fall-risk concerns',
      'Memory/cognitive concerns',
      'Other'
    )),
  constraint kinplan_intakes_caregiver_count_check
    check (caregiver_count in (
      'Just me',
      '2 people',
      '3-4 people',
      '5+ people'
    )),
  constraint kinplan_intakes_willingness_to_pay_check
    check (willingness_to_pay in ('Yes', 'No', 'Maybe'))
);

alter table public.kinplan_intakes enable row level security;

grant insert on public.kinplan_intakes to anon;

drop policy if exists "Allow anonymous KinPlan intake inserts" on public.kinplan_intakes;

create policy "Allow anonymous KinPlan intake inserts"
on public.kinplan_intakes
for insert
to anon
with check (true);
