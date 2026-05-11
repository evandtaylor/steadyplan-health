alter table public.shiftplan_paid_intakes
  add column if not exists fulfillment_status text not null default 'New',
  add column if not exists admin_notes text,
  add column if not exists delivered_at timestamp with time zone,
  add column if not exists updated_at timestamp with time zone default now();

alter table public.shiftplan_paid_intakes
  drop constraint if exists shiftplan_paid_intakes_fulfillment_status_check;

alter table public.shiftplan_paid_intakes
  add constraint shiftplan_paid_intakes_fulfillment_status_check
  check (fulfillment_status in (
    'New',
    'In Progress',
    'Prompt Copied',
    'Generated',
    'Reviewed',
    'Delivered',
    'Needs Info',
    'Canceled',
    'Refunded'
  ));
