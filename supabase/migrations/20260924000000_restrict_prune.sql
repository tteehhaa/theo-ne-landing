-- Restricts theone_prune_analytics() to the service_role key.
--
-- Functions are executable by PUBLIC by default, and this one is security
-- definer: without the revoke, anyone holding the project's public anon key
-- could call it through /rest/v1/rpc with retain_days = 0 and empty
-- theone_page_views. api/collect.js calls it with the service_role key, which
-- keeps working.
--
-- Applied to pp_a on 2026-09-24. Idempotent.
revoke execute on function public.theone_prune_analytics(integer) from public, anon, authenticated;
grant execute on function public.theone_prune_analytics(integer) to service_role;
