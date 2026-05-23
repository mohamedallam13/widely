-- Add new theme values to the enum
alter type public.profile_theme add value if not exists 'neon';
alter type public.profile_theme add value if not exists 'midnight';

-- Add visible and image_url columns to links if not already present
alter table public.links add column if not exists visible boolean not null default true;
alter table public.links add column if not exists image_url text;

-- Create api_keys table if not already created
create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Default',
  key_hash text not null unique,
  key_prefix text not null,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists api_keys_user_idx on public.api_keys (user_id);
create index if not exists api_keys_hash_idx on public.api_keys (key_hash);

alter table public.api_keys enable row level security;

-- RLS policies for api_keys (idempotent)
do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'api_keys' and policyname = 'Users can view own api keys'
  ) then
    create policy "Users can view own api keys" on public.api_keys for select using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'api_keys' and policyname = 'Users can insert own api keys'
  ) then
    create policy "Users can insert own api keys" on public.api_keys for insert with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'api_keys' and policyname = 'Users can update own api keys'
  ) then
    create policy "Users can update own api keys" on public.api_keys for update using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'api_keys' and policyname = 'Users can delete own api keys'
  ) then
    create policy "Users can delete own api keys" on public.api_keys for delete using (auth.uid() = user_id);
  end if;
end $$;
