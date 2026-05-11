alter table public.shiftplan_paid_intakes
  add column if not exists is_archived boolean not null default false,
  add column if not exists archived_at timestamp with time zone,
  add column if not exists archive_reason text;

create index if not exists shiftplan_paid_intakes_is_archived_idx
  on public.shiftplan_paid_intakes (is_archived, created_at desc);
