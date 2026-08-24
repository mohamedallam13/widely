-- increment_link_click is SECURITY DEFINER and was left publicly executable
-- via PostgREST (anyone could POST any link_id to inflate click counts).
-- The only legitimate caller is the redirect handler via supabaseAdmin
-- (service_role), so lock it down to that.
revoke execute on function public.increment_link_click(uuid) from public, anon, authenticated;
