-- Per-click event log, plus an atomic increment for links.click_count
-- (the redirect handler previously did a non-atomic read-then-write).

create table public.click_events (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references public.links(id) on delete cascade,
  clicked_at timestamptz not null default now(),
  referrer text,
  user_agent text
);

create index click_events_link_id_clicked_at_idx
  on public.click_events (link_id, clicked_at desc);

alter table public.click_events enable row level security;

create policy "Link owners can view their click events"
  on public.click_events for select
  using (
    exists (
      select 1 from public.links
      where links.id = click_events.link_id
        and links.user_id = auth.uid()
    )
  );

-- service_role (supabaseAdmin) bypasses RLS for inserts from the redirect handler.

create or replace function public.increment_link_click(p_link_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.links set click_count = click_count + 1 where id = p_link_id;
$$;
