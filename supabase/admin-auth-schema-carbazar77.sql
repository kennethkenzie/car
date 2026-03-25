-- Separate schema for admin login metadata.
-- Passwords are managed by Supabase Auth in auth.users.

create schema if not exists admin_auth;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'admin_role'
      and n.nspname = 'admin_auth'
  ) then
    create type admin_auth.admin_role as enum (
      'SUPER_ADMIN',
      'ADMIN',
      'EDITOR',
      'SUPPORT'
    );
  end if;
end
$$;

create table if not exists admin_auth.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role admin_auth.admin_role not null default 'ADMIN',
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admin_auth.login_audit (
  id bigint generated always as identity primary key,
  admin_user_id uuid references admin_auth.admin_users(id) on delete set null,
  email text not null,
  event text not null check (event in ('LOGIN_SUCCESS', 'LOGIN_FAILED', 'LOGOUT', 'PASSWORD_RESET')),
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create or replace function admin_auth.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_admin_users_updated_at on admin_auth.admin_users;
create trigger trg_admin_users_updated_at
before update on admin_auth.admin_users
for each row
execute function admin_auth.set_updated_at();

create or replace function admin_auth.sync_admin_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth, admin_auth
as $$
begin
  insert into admin_auth.admin_users (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', 'Admin User')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = excluded.full_name,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_admin_user_created on auth.users;
create trigger on_auth_admin_user_created
after insert on auth.users
for each row
when (
  coalesce(new.raw_user_meta_data ->> 'role', '') in ('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'SUPPORT')
)
execute function admin_auth.sync_admin_user();

alter table admin_auth.admin_users enable row level security;
alter table admin_auth.login_audit enable row level security;

drop policy if exists "service role manages admin users" on admin_auth.admin_users;
create policy "service role manages admin users"
on admin_auth.admin_users
for all
to service_role
using (true)
with check (true);

drop policy if exists "service role manages admin login audit" on admin_auth.login_audit;
create policy "service role manages admin login audit"
on admin_auth.login_audit
for all
to service_role
using (true)
with check (true);

-- Seed the current admin login metadata record.
-- The auth.users record must already exist in Supabase Auth.
insert into admin_auth.admin_users (id, email, full_name, role, is_active)
select
  id,
  email,
  coalesce(raw_user_meta_data ->> 'name', 'Admin'),
  'ADMIN'::admin_auth.admin_role,
  true
from auth.users
where email = 'carbazar77@gmail.com'
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role,
  is_active = excluded.is_active,
  updated_at = now();
