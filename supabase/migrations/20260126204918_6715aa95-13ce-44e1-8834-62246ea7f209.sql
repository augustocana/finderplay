-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Game invites are viewable by everyone" ON public.game_invites;

-- Create a more secure policy that requires authentication
CREATE POLICY "Users can view relevant game invites"
ON public.game_invites FOR SELECT
USING (
  auth.uid() IS NOT NULL -- Must be authenticated
  AND (
    -- User is the creator
    creator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR
    -- User has requested this invite
    id IN (SELECT invite_id FROM public.match_requests WHERE requester_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
    OR
    -- Open invites within next 30 days (for discovery)
    (status = 'open' AND date >= CURRENT_DATE AND date <= CURRENT_DATE + INTERVAL '30 days')
  )
);