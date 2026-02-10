
-- 1. Restrict public_profiles view to only name and skill_level
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles
WITH (security_invoker = false) AS
  SELECT id, name, skill_level
  FROM profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- 2. Disable messages: deny-all policies
DROP POLICY IF EXISTS "messages_select_policy" ON public.messages;
DROP POLICY IF EXISTS "messages_insert_policy" ON public.messages;
DROP POLICY IF EXISTS "messages_update_policy" ON public.messages;

CREATE POLICY "messages_select_deny_all" ON public.messages FOR SELECT USING (false);
CREATE POLICY "messages_insert_deny_all" ON public.messages FOR INSERT WITH CHECK (false);
CREATE POLICY "messages_update_deny_all" ON public.messages FOR UPDATE USING (false);
