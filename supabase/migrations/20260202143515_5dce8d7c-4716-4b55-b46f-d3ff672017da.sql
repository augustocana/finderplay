-- Fix SECURITY DEFINER views by using security_invoker
-- This ensures RLS policies of the querying user are applied

-- Drop and recreate public_profiles with security_invoker
DROP VIEW IF EXISTS public_profiles;

CREATE VIEW public_profiles
WITH (security_invoker = on) AS
SELECT 
  id,
  name,
  skill_level,
  average_rating,
  games_played,
  city,
  neighborhood
FROM profiles;

-- Drop and recreate public_game_invites with security_invoker
DROP VIEW IF EXISTS public_game_invites;

CREATE VIEW public_game_invites
WITH (security_invoker = on) AS
SELECT 
  id,
  city,
  neighborhood,
  date,
  game_type,
  desired_level,
  level_range_min,
  level_range_max,
  status,
  creator_id,
  created_at
FROM game_invites
WHERE status = 'open';

-- Grant access to views
GRANT SELECT ON public_profiles TO anon, authenticated;
GRANT SELECT ON public_game_invites TO anon, authenticated;