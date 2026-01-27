-- Drop all RLS policies on profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Drop all RLS policies on game_invites table
DROP POLICY IF EXISTS "Users can view relevant game invites" ON public.game_invites;
DROP POLICY IF EXISTS "Users can create game invites" ON public.game_invites;
DROP POLICY IF EXISTS "Creators can update their own invites" ON public.game_invites;
DROP POLICY IF EXISTS "Creators can delete their own invites" ON public.game_invites;

-- Drop all RLS policies on match_requests table
DROP POLICY IF EXISTS "Match requests are viewable by involved parties" ON public.match_requests;
DROP POLICY IF EXISTS "Users can create match requests" ON public.match_requests;
DROP POLICY IF EXISTS "Invite creators can update match requests" ON public.match_requests;

-- Drop all RLS policies on messages table
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;

-- Add anonymous_user_id column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS anonymous_user_id text;

-- Make user_id nullable since we won't use auth
ALTER TABLE public.profiles ALTER COLUMN user_id DROP NOT NULL;

-- Create index on anonymous_user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_anonymous_user_id ON public.profiles(anonymous_user_id);

-- Disable RLS on all tables for anonymous MVP
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_invites DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;

-- Drop the profiles_public view since it's no longer needed
DROP VIEW IF EXISTS public.profiles_public;