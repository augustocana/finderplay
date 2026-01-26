-- Drop the current overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Create a restrictive policy: users can only SELECT their own profile directly
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

-- Create a public view that exposes only non-sensitive profile fields for player discovery
-- This excludes sensitive PII like age, gender, exact neighborhood
CREATE OR REPLACE VIEW public.profiles_public
WITH (security_invoker=on) AS
SELECT 
  id,
  name,
  dominant_hand,
  frequency,
  city,
  skill_level,
  avatar_url,
  games_played,
  win_rate,
  average_rating,
  reliability,
  availability,
  years_playing
FROM public.profiles;