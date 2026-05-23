
-- Themes enum
create type public.profile_theme as enum ('noir', 'bone', 'indigo_mist', 'sunset', 'forest', 'mono');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text not null default '',
  bio text not null default '',
  avatar_url text,
  theme public.profile_theme not null default 'noir',
  socials jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint username_format check (username ~ '^[a-z0-9_]{3,30}$')
);

create index profiles_username_idx on public.profiles (lower(username));

-- Links
create table public.links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  url text not null,
  featured boolean not null default false,
  position integer not null default 0,
  click_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint title_len check (char_length(title) between 1 and 120),
  constraint url_len check (char_length(url) between 1 and 2048)
);

create index links_user_position_idx on public.links (user_id, position);

-- API keys
create table public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Default',
  key_hash text not null unique,
  key_prefix text not null,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index api_keys_user_idx on public.api_keys (user_id);
create index api_keys_hash_idx on public.api_keys (key_hash);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.links enable row level security;
alter table public.api_keys enable row level security;

-- Profiles policies
create policy "Profiles are publicly viewable"
  on public.profiles for select
  using (true);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can delete own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- Links policies
create policy "Links are publicly viewable"
  on public.links for select
  using (true);

create policy "Users can insert own links"
  on public.links for insert
  with check (auth.uid() = user_id);

create policy "Users can update own links"
  on public.links for update
  using (auth.uid() = user_id);

create policy "Users can delete own links"
  on public.links for delete
  using (auth.uid() = user_id);

-- API keys policies (owner-only; no public read)
create policy "Users can view own api keys"
  on public.api_keys for select
  using (auth.uid() = user_id);

create policy "Users can insert own api keys"
  on public.api_keys for insert
  with check (auth.uid() = user_id);

create policy "Users can update own api keys"
  on public.api_keys for update
  using (auth.uid() = user_id);

create policy "Users can delete own api keys"
  on public.api_keys for delete
  using (auth.uid() = user_id);

-- updated_at trigger
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.tg_set_updated_at();

create trigger links_updated_at before update on public.links
  for each row execute function public.tg_set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_username text;
  v_base text;
  v_suffix int := 0;
begin
  v_base := lower(regexp_replace(coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)), '[^a-z0-9_]', '', 'g'));
  if v_base is null or char_length(v_base) < 3 then
    v_base := 'user' || substr(replace(new.id::text, '-', ''), 1, 8);
  end if;
  if char_length(v_base) > 30 then
    v_base := substr(v_base, 1, 30);
  end if;

  v_username := v_base;
  while exists (select 1 from public.profiles where username = v_username) loop
    v_suffix := v_suffix + 1;
    v_username := substr(v_base, 1, 28) || v_suffix::text;
  end loop;

  insert into public.profiles (id, username, display_name)
  values (new.id, v_username, coalesce(new.raw_user_meta_data->>'display_name', ''));

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
