create extension if not exists pgcrypto;

create table if not exists public.shiftplan_paid_intakes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  intake_type text not null,
  first_name text not null,
  email text not null,
  plan_start_date date,
  plan_end_date date,
  week_start_date date,
  week_end_date date,
  job_role text,
  schedule_type text,
  typical_shift_pattern text,
  exact_work_shifts text,
  commute_time text,
  typical_commute_time text,
  main_goal text,
  monthly_goal text,
  meal_prep_preferences text,
  meal_prep_needs_this_week text,
  workout_training_goals text,
  workout_training_preferences text,
  workout_training_goals_this_week text,
  appointments text,
  appointments_this_week text,
  errands text,
  errands_this_week text,
  family_personal_responsibilities text,
  family_personal_responsibilities_this_week text,
  top_3_priorities text,
  top_3_priorities_this_week text,
  anything_to_avoid text,
  preferred_plan_style text,
  organize_focus text,
  recurring_responsibilities text,
  avoid_after_work text,
  messy_week_reason text,
  changed_from_last_week text,
  worked_from_last_plan text,
  unrealistic_from_last_plan text,
  specific_request_this_week text,
  safety_acknowledged boolean not null default false,
  constraint shiftplan_paid_intakes_type_check
    check (intake_type in (
      'custom_plan',
      'founding_pro',
      'founding_pro_weekly'
    )),
  constraint shiftplan_paid_intakes_safety_check
    check (safety_acknowledged = true)
);

alter table public.shiftplan_paid_intakes enable row level security;

grant insert on public.shiftplan_paid_intakes to anon;

drop policy if exists "Allow anonymous ShiftPlan paid intake inserts" on public.shiftplan_paid_intakes;

create policy "Allow anonymous ShiftPlan paid intake inserts"
on public.shiftplan_paid_intakes
for insert
to anon
with check (safety_acknowledged = true);
