
-- search_path on the trigger function we forgot
alter function public.recount_event_registration() set search_path = public;

-- lock down execute on security-definer helpers
revoke execute on function public.has_role(uuid, app_role) from public, anon;
revoke execute on function public.current_user_id() from public, anon;
revoke execute on function public.current_organiser_id() from public, anon;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.recount_event_registration() from public, anon, authenticated;
