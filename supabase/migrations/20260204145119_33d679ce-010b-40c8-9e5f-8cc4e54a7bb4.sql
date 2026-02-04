-- =============================================
-- CORREÇÃO DE SECURITY DEFINER NAS VIEWS
-- =============================================

-- Recriar views com security_invoker = on
DROP VIEW IF EXISTS public_game_invites;
DROP VIEW IF EXISTS public_profiles;

-- View de jogos públicos COM security_invoker
CREATE VIEW public_game_invites
WITH (security_invoker = on) AS
SELECT 
  id,
  creator_id,
  title,
  date,
  time_slot,
  city,
  neighborhood,
  desired_level,
  level_range_min,
  level_range_max,
  game_type,
  status,
  created_at
FROM game_invites
WHERE status = 'open';

-- View de perfis COM security_invoker
CREATE VIEW public_profiles
WITH (security_invoker = on) AS
SELECT 
  id,
  name,
  skill_level,
  city,
  neighborhood,
  games_played,
  average_rating
FROM profiles;

-- Manter grants
GRANT SELECT ON public_game_invites TO anon, authenticated;
GRANT SELECT ON public_profiles TO authenticated;