create extension if not exists pgcrypto;

create table if not exists public.shiftplan_delivered_plans (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  paid_intake_id uuid references public.shiftplan_paid_intakes(id) on delete set null,
  customer_email text not null,
  customer_name text,
  plan_type text not null,
  plan_title text,
  plan_start_date date,
  plan_end_date date,
  plan_body text not null,
  delivery_status text not null default 'Draft',
  delivered_at timestamp with time zone,
  admin_notes text,
  constraint shiftplan_delivered_plans_delivery_status_check
    check (delivery_status in (
      'Draft',
      'Reviewed',
      'Delivered',
      'Needs Revision',
      'Archived'
    )),
  constraint shiftplan_delivered_plans_plan_body_check
    check (length(trim(plan_body)) > 0)
);

alter table public.shiftplan_delivered_plans enable row level security;

grant select, insert, update on public.shiftplan_delivered_plans to service_role;

create index if not exists shiftplan_delivered_plans_customer_email_idx
on public.shiftplan_delivered_plans (customer_email);

create index if not exists shiftplan_delivered_plans_paid_intake_idx
on public.shiftplan_delivered_plans (paid_intake_id);

create unique index if not exists shiftplan_delivered_plans_paid_intake_unique_idx
on public.shiftplan_delivered_plans (paid_intake_id)
where paid_intake_id is not null;
