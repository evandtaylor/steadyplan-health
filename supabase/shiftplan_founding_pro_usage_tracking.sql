alter table public.shiftplan_paid_intakes
  add column if not exists founding_pro_plan_number integer,
  add column if not exists founding_pro_plan_limit integer not null default 4,
  add column if not exists billing_period_start date,
  add column if not exists billing_period_end date,
  add column if not exists subscription_status text not null default 'Unknown',
  add column if not exists usage_notes text;

alter table public.shiftplan_paid_intakes
  drop constraint if exists shiftplan_paid_intakes_subscription_status_check;

alter table public.shiftplan_paid_intakes
  add constraint shiftplan_paid_intakes_subscription_status_check
  check (subscription_status in (
    'Unknown',
    'Active',
    'Canceled',
    'Past Due',
    'Trial',
    'Not Applicable'
  ));

alter table public.shiftplan_paid_intakes
  drop constraint if exists shiftplan_paid_intakes_plan_number_check;

alter table public.shiftplan_paid_intakes
  add constraint shiftplan_paid_intakes_plan_number_check
  check (founding_pro_plan_number is null or founding_pro_plan_number >= 1);

alter table public.shiftplan_paid_intakes
  drop constraint if exists shiftplan_paid_intakes_plan_limit_check;

alter table public.shiftplan_paid_intakes
  add constraint shiftplan_paid_intakes_plan_limit_check
  check (founding_pro_plan_limit >= 1);
