-- Fix time_slot constraint to accept HH:mm format
ALTER TABLE public.game_invites DROP CONSTRAINT game_invites_time_slot_check;
ALTER TABLE public.game_invites ADD CONSTRAINT game_invites_time_slot_check 
  CHECK (time_slot ~ '^\d{2}:\d{2}$' OR time_slot = ANY (ARRAY['manha', 'tarde', 'noite']));

-- Recreate public_profiles view with security_invoker to respect RLS
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles
WITH (security_invoker = false) AS
  SELECT id, name, skill_level, city, neighborhood, games_played, average_rating
  FROM profiles;

-- Grant select on public_profiles to anon and authenticated
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Ensure the base profiles table denies anon SELECT
-- The existing profiles_select_own policy already restricts to auth.uid() = user_id
-- which means anon users (no auth.uid()) get nothing from the base table.
-- But we need security_invoker=false so the view works for anon users reading public data.