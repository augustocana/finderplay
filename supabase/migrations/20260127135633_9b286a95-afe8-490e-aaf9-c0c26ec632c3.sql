-- Re-enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
-- Anyone can view profiles (needed for matchmaking/discovery)
CREATE POLICY "Anyone can view profiles"
ON public.profiles FOR SELECT
USING (true);

-- Anyone can create a profile (anonymous onboarding)
CREATE POLICY "Anyone can create profile"
ON public.profiles FOR INSERT
WITH CHECK (true);

-- Anyone can update profiles (app validates via anonymous_user_id in client)
CREATE POLICY "Anyone can update profiles"
ON public.profiles FOR UPDATE
USING (true)
WITH CHECK (true);

-- GAME_INVITES policies
-- Anyone can view game invites (needed for discovery)
CREATE POLICY "Anyone can view game invites"
ON public.game_invites FOR SELECT
USING (true);

-- Anyone can create game invites
CREATE POLICY "Anyone can create game invites"
ON public.game_invites FOR INSERT
WITH CHECK (true);

-- Anyone can update game invites (app validates creator in client)
CREATE POLICY "Anyone can update game invites"
ON public.game_invites FOR UPDATE
USING (true)
WITH CHECK (true);

-- Anyone can delete their game invites
CREATE POLICY "Anyone can delete game invites"
ON public.game_invites FOR DELETE
USING (true);

-- MATCH_REQUESTS policies
-- Anyone can view match requests
CREATE POLICY "Anyone can view match requests"
ON public.match_requests FOR SELECT
USING (true);

-- Anyone can create match requests
CREATE POLICY "Anyone can create match requests"
ON public.match_requests FOR INSERT
WITH CHECK (true);

-- Anyone can update match requests
CREATE POLICY "Anyone can update match requests"
ON public.match_requests FOR UPDATE
USING (true)
WITH CHECK (true);

-- MESSAGES policies
-- Anyone can view messages
CREATE POLICY "Anyone can view messages"
ON public.messages FOR SELECT
USING (true);

-- Anyone can send messages
CREATE POLICY "Anyone can send messages"
ON public.messages FOR INSERT
WITH CHECK (true);

-- Anyone can update messages (for read status)
CREATE POLICY "Anyone can update messages"
ON public.messages FOR UPDATE
USING (true)
WITH CHECK (true);