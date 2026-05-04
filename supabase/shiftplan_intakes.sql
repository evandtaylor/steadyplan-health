create extension if not exists pgcrypto;

create table if not exists public.shiftplan_intakes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  name text not null,
  email text not null,
  role text not null,
  typical_shift_type text not null,
  shift_length text not null,
  workdays_this_week text not null,
  commute_time text not null,
  sleep_goal text not null,
  workout_goal text not null,
  nutrition_goal text not null,
  biggest_shift_work_struggle text not null,
  useful_plan_details text not null,
  willingness_to_pay text not null,
  constraint shiftplan_intakes_role_check
    check (role in (
      'Nurse',
      'First responder',
      'Healthcare worker',
      'Student',
      'Other shift worker'
    )),
  constraint shiftplan_intakes_typical_shift_type_check
    check (typical_shift_type in (
      'Day shift',
      'Night shift',
      'Rotating shifts',
      'Call schedule',
      'Mixed/varies'
    )),
  constraint shiftplan_intakes_shift_length_check
    check (shift_length in (
      '8 hours',
      '10 hours',
      '12 hours',
      '16+ hours',
      'Varies'
    )),
  constraint shiftplan_intakes_willingness_to_pay_check
    check (willingness_to_pay in ('Yes', 'No', 'Maybe'))
);

alter table public.shiftplan_intakes enable row level security;

grant insert on public.shiftplan_intakes to anon;

drop policy if exists "Allow anonymous ShiftPlan intake inserts" on public.shiftplan_intakes;

create policy "Allow anonymous ShiftPlan intake inserts"
on public.shiftplan_intakes
for insert
to anon
with check (true);
