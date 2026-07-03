-- Grants admins read access to email_logs (the admin "Logs" tab), which was
-- reported inaccessible. Its RLS state predates any tracked migration in
-- this repo (set up in Studio), so this is additive-only and wrapped in an
-- existence check the same way as the spiritual_habits/etc. policies in
-- 20260703000000_disciple_accounts_and_admin_role.sql.
do $$
begin
  if to_regclass('public.email_logs') is not null then
    execute 'drop policy if exists "email_logs_admin_select" on public.email_logs';
    execute 'create policy "email_logs_admin_select" on public.email_logs for select using ( public.is_admin() )';
  else
    raise notice 'Skipping admin-read policy for public.email_logs: table not found.';
  end if;
end $$;
