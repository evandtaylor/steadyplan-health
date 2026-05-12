alter table public.app_users
  add column if not exists auth_user_id uuid references auth.users(id) on delete set null,
  add column if not exists account_created_at timestamp with time zone,
  add column if not exists last_auth_at timestamp with time zone,
  add column if not exists auth_migration_status text not null default 'not_started';

create unique index if not exists app_users_auth_user_id_idx
on public.app_users (auth_user_id);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'app_users_auth_migration_status_check'
      and conrelid = 'public.app_users'::regclass
  ) then
    alter table public.app_users
      add constraint app_users_auth_migration_status_check
        check (auth_migration_status in ('not_started', 'linked', 'needs_review', 'blocked'));
  end if;
end $$;

comment on column public.app_users.auth_user_id is
  'Future Supabase Auth user link. Access-code beta users may have null auth_user_id.';

comment on column public.app_users.account_created_at is
  'Future account creation timestamp for Supabase Auth-linked app users.';

comment on column public.app_users.last_auth_at is
  'Future last-authenticated timestamp for Supabase Auth-linked app users.';

comment on column public.app_users.auth_migration_status is
  'Future account migration state for private access-code beta users.';
