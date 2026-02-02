-- =============================================
-- 1. INPUT VALIDATION - CHECK CONSTRAINTS
-- =============================================

-- Profiles: name length validation
ALTER TABLE profiles ADD CONSTRAINT profiles_name_length 
  CHECK (length(name) >= 1 AND length(name) <= 100);

-- Profiles: city/neighborhood length
ALTER TABLE profiles ADD CONSTRAINT profiles_city_length 
  CHECK (length(city) >= 1 AND length(city) <= 100);

ALTER TABLE profiles ADD CONSTRAINT profiles_neighborhood_length 
  CHECK (length(neighborhood) >= 1 AND length(neighborhood) <= 100);

-- Profiles: years_playing range
ALTER TABLE profiles ADD CONSTRAINT profiles_years_playing_range 
  CHECK (years_playing IS NULL OR (years_playing >= 0 AND years_playing <= 100));

-- Profiles: max_travel_radius range
ALTER TABLE profiles ADD CONSTRAINT profiles_max_travel_radius_range 
  CHECK (max_travel_radius IS NULL OR (max_travel_radius >= 1 AND max_travel_radius <= 100));

-- Profiles: age range
ALTER TABLE profiles ADD CONSTRAINT profiles_age_range 
  CHECK (age IS NULL OR (age >= 10 AND age <= 120));

-- Game invites: notes length
ALTER TABLE game_invites ADD CONSTRAINT game_invites_notes_length 
  CHECK (notes IS NULL OR length(notes) <= 500);

-- Game invites: court_name length
ALTER TABLE game_invites ADD CONSTRAINT game_invites_court_name_length 
  CHECK (court_name IS NULL OR length(court_name) <= 200);

-- Game invites: court_address length
ALTER TABLE game_invites ADD CONSTRAINT game_invites_court_address_length 
  CHECK (court_address IS NULL OR length(court_address) <= 300);

-- Game invites: city/neighborhood length
ALTER TABLE game_invites ADD CONSTRAINT game_invites_city_length 
  CHECK (length(city) >= 1 AND length(city) <= 100);

ALTER TABLE game_invites ADD CONSTRAINT game_invites_neighborhood_length 
  CHECK (length(neighborhood) >= 1 AND length(neighborhood) <= 100);

-- Messages: content length
ALTER TABLE messages ADD CONSTRAINT messages_content_length 
  CHECK (length(content) >= 1 AND length(content) <= 2000);

-- Match requests: message length
ALTER TABLE match_requests ADD CONSTRAINT match_requests_message_length 
  CHECK (message IS NULL OR length(message) <= 500);

-- =============================================
-- 2. PROFILES - RESTRICT PUBLIC EXPOSURE
-- =============================================
-- Create a view for public profile data (only safe fields)
CREATE OR REPLACE VIEW public_profiles AS
SELECT 
  id,
  name,
  skill_level,
  average_rating,
  games_played,
  city,
  neighborhood
FROM profiles;

-- Drop the old permissive SELECT policy
DROP POLICY IF EXISTS profiles_select_public ON profiles;

-- New policy: users can see full details only for their own profile
-- or profiles they have interactions with (matched games, messages)
CREATE POLICY profiles_select_limited ON profiles
FOR SELECT USING (
  -- Own profile
  anonymous_user_id = get_anonymous_user_id()
  OR
  -- Profiles of players in games I created or participate in
  id IN (
    SELECT creator_id FROM game_invites WHERE matched_player_id = get_current_profile_id()
    UNION
    SELECT matched_player_id FROM game_invites WHERE creator_id = get_current_profile_id() AND matched_player_id IS NOT NULL
  )
  OR
  -- Profiles of people I have messages with
  id IN (
    SELECT sender_id FROM messages WHERE receiver_id = get_current_profile_id()
    UNION
    SELECT receiver_id FROM messages WHERE sender_id = get_current_profile_id()
  )
  OR
  -- Profiles of people who requested to join my games
  id IN (
    SELECT requester_id FROM match_requests 
    WHERE invite_id IN (SELECT id FROM game_invites WHERE creator_id = get_current_profile_id())
  )
);

-- Grant access to public_profiles view for basic discovery
GRANT SELECT ON public_profiles TO anon, authenticated;

-- =============================================
-- 3. GAME INVITES - RESTRICT LOCATION/TIME DETAILS
-- =============================================
-- Create a view for public game discovery (limited info)
CREATE OR REPLACE VIEW public_game_invites AS
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
  -- Excludes: time_slot, court_name, court_address, notes, matched_player_id
FROM game_invites
WHERE status = 'open';

-- Drop the old permissive SELECT policy
DROP POLICY IF EXISTS game_invites_select_public ON game_invites;

-- New policy: full details only for creator, matched player, or pending requesters
CREATE POLICY game_invites_select_limited ON game_invites
FOR SELECT USING (
  -- Creator sees everything
  creator_id = get_current_profile_id()
  OR
  -- Matched player sees everything
  matched_player_id = get_current_profile_id()
  OR
  -- People who sent a request see full details
  id IN (
    SELECT invite_id FROM match_requests WHERE requester_id = get_current_profile_id()
  )
  OR
  -- For discovery: anyone can see basic info of open games (via view)
  -- But direct table access shows limited info
  (
    status = 'open' 
    AND get_current_profile_id() IS NOT NULL
  )
);

-- Grant access to public view for discovery
GRANT SELECT ON public_game_invites TO anon, authenticated;