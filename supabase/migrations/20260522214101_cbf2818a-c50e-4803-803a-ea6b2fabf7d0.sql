
-- Fix tg_set_updated_at search_path
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Restrict SECURITY DEFINER fn so only the trigger runs it
revoke execute on function public.handle_new_user() from public, anon, authenticated;
