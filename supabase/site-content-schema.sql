create table if not exists public.site_content (
  key text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.site_content (key, data)
values ('frontend', '{}'::jsonb)
on conflict (key) do nothing;
