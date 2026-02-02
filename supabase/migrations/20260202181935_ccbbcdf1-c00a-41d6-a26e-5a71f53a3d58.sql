-- =============================================
-- MIGRATION: Drop all policies first, then rebuild
-- =============================================

-- 1. Drop ALL policies from all tables first
DROP POLICY IF EXISTS "profiles_select_limited" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;

DROP POLICY IF EXISTS "game_invites_select_limited" ON public.game_invites;
DROP POLICY IF EXISTS "game_invites_insert_own" ON public.game_invites;
DROP POLICY IF EXISTS "game_invites_update_own" ON public.game_invites;
DROP POLICY IF EXISTS "game_invites_delete_own" ON public.game_invites;
DROP POLICY IF EXISTS "game_invites_select_policy" ON public.game_invites;
DROP POLICY IF EXISTS "game_invites_insert_policy" ON public.game_invites;
DROP POLICY IF EXISTS "game_invites_update_policy" ON public.game_invites;
DROP POLICY IF EXISTS "game_invites_delete_policy" ON public.game_invites;

DROP POLICY IF EXISTS "match_requests_select_involved" ON public.match_requests;
DROP POLICY IF EXISTS "match_requests_insert_own" ON public.match_requests;
DROP POLICY IF EXISTS "match_requests_update_involved" ON public.match_requests;
DROP POLICY IF EXISTS "match_requests_select_policy" ON public.match_requests;
DROP POLICY IF EXISTS "match_requests_insert_policy" ON public.match_requests;
DROP POLICY IF EXISTS "match_requests_update_policy" ON public.match_requests;
DROP POLICY IF EXISTS "match_requests_delete_policy" ON public.match_requests;

DROP POLICY IF EXISTS "messages_select_involved" ON public.messages;
DROP POLICY IF EXISTS "messages_insert_own" ON public.messages;
DROP POLICY IF EXISTS "messages_update_receiver" ON public.messages;
DROP POLICY IF EXISTS "messages_select_policy" ON public.messages;
DROP POLICY IF EXISTS "messages_insert_policy" ON public.messages;
DROP POLICY IF EXISTS "messages_update_policy" ON public.messages;

-- 2. Drop views
DROP VIEW IF EXISTS public.public_profiles;
DROP VIEW IF EXISTS public.public_game_invites;

-- 3. Now safely drop functions
DROP FUNCTION IF EXISTS public.get_anonymous_user_id();
DROP FUNCTION IF EXISTS public.get_current_profile_id();

-- 4. Clean up data
TRUNCATE TABLE public.messages CASCADE;
TRUNCATE TABLE public.match_requests CASCADE;
TRUNCATE TABLE public.game_invites CASCADE;
TRUNCATE TABLE public.profiles CASCADE;

-- 5. Update profiles table structure
ALTER TABLE public.profiles 
  DROP COLUMN IF EXISTS anonymous_user_id;

ALTER TABLE public.profiles 
  ALTER COLUMN user_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_user_id_unique'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- 6. Add title column to game_invites
ALTER TABLE public.game_invites
  ADD COLUMN IF NOT EXISTS title text;

-- 7. Create new auth-based helper function
CREATE OR REPLACE FUNCTION public.get_current_user_profile_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles 
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

-- 8. Create RLS policies for profiles
CREATE POLICY "profiles_select_policy" ON public.profiles
FOR SELECT USING (
  user_id = auth.uid() OR
  id IN (
    SELECT creator_id FROM game_invites WHERE matched_player_id = get_current_user_profile_id()
    UNION
    SELECT matched_player_id FROM game_invites WHERE creator_id = get_current_user_profile_id() AND matched_player_id IS NOT NULL
  ) OR
  id IN (
    SELECT sender_id FROM messages WHERE receiver_id = get_current_user_profile_id()
    UNION
    SELECT receiver_id FROM messages WHERE sender_id = get_current_user_profile_id()
  ) OR
  id IN (
    SELECT requester_id FROM match_requests WHERE invite_id IN (
      SELECT id FROM game_invites WHERE creator_id = get_current_user_profile_id()
    )
  )
);

CREATE POLICY "profiles_insert_policy" ON public.profiles
FOR INSERT WITH CHECK (
  user_id = auth.uid() AND
  auth.uid() IS NOT NULL AND
  NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid())
);

CREATE POLICY "profiles_update_policy" ON public.profiles
FOR UPDATE USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 9. Create RLS policies for game_invites
CREATE POLICY "game_invites_select_policy" ON public.game_invites
FOR SELECT USING (
  creator_id = get_current_user_profile_id() OR
  matched_player_id = get_current_user_profile_id() OR
  id IN (SELECT invite_id FROM match_requests WHERE requester_id = get_current_user_profile_id()) OR
  (status = 'open' AND get_current_user_profile_id() IS NOT NULL)
);

CREATE POLICY "game_invites_insert_policy" ON public.game_invites
FOR INSERT WITH CHECK (
  creator_id = get_current_user_profile_id() AND
  get_current_user_profile_id() IS NOT NULL
);

CREATE POLICY "game_invites_update_policy" ON public.game_invites
FOR UPDATE USING (creator_id = get_current_user_profile_id())
WITH CHECK (creator_id = get_current_user_profile_id());

CREATE POLICY "game_invites_delete_policy" ON public.game_invites
FOR DELETE USING (creator_id = get_current_user_profile_id());

-- 10. Create RLS policies for match_requests
CREATE POLICY "match_requests_select_policy" ON public.match_requests
FOR SELECT USING (
  requester_id = get_current_user_profile_id() OR
  invite_id IN (SELECT id FROM game_invites WHERE creator_id = get_current_user_profile_id())
);

CREATE POLICY "match_requests_insert_policy" ON public.match_requests
FOR INSERT WITH CHECK (
  requester_id = get_current_user_profile_id() AND
  get_current_user_profile_id() IS NOT NULL
);

CREATE POLICY "match_requests_update_policy" ON public.match_requests
FOR UPDATE USING (
  requester_id = get_current_user_profile_id() OR
  invite_id IN (SELECT id FROM game_invites WHERE creator_id = get_current_user_profile_id())
);

CREATE POLICY "match_requests_delete_policy" ON public.match_requests
FOR DELETE USING (requester_id = get_current_user_profile_id());

-- 11. Create RLS policies for messages
CREATE POLICY "messages_select_policy" ON public.messages
FOR SELECT USING (
  sender_id = get_current_user_profile_id() OR
  receiver_id = get_current_user_profile_id()
);

CREATE POLICY "messages_insert_policy" ON public.messages
FOR INSERT WITH CHECK (
  sender_id = get_current_user_profile_id() AND
  get_current_user_profile_id() IS NOT NULL
);

CREATE POLICY "messages_update_policy" ON public.messages
FOR UPDATE USING (receiver_id = get_current_user_profile_id())
WITH CHECK (receiver_id = get_current_user_profile_id());

-- 12. Recreate public views
CREATE VIEW public.public_profiles
WITH (security_invoker = on) AS
SELECT 
  id,
  name,
  skill_level,
  city,
  neighborhood,
  games_played,
  average_rating
FROM public.profiles;

CREATE VIEW public.public_game_invites
WITH (security_invoker = on) AS
SELECT 
  id,
  creator_id,
  game_type,
  title,
  date,
  time_slot,
  desired_level,
  level_range_min,
  level_range_max,
  city,
  neighborhood,
  status,
  created_at
FROM public.game_invites
WHERE status = 'open';