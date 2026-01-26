-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT CHECK (gender IN ('masculino', 'feminino', 'outro')),
  dominant_hand TEXT NOT NULL DEFAULT 'direita' CHECK (dominant_hand IN ('direita', 'esquerda', 'ambas')),
  frequency TEXT NOT NULL DEFAULT 'casual' CHECK (frequency IN ('iniciante', 'casual', 'regular', 'competitivo')),
  years_playing INTEGER,
  has_taken_lessons BOOLEAN DEFAULT false,
  tournaments INTEGER DEFAULT 0,
  city TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  max_travel_radius INTEGER DEFAULT 10,
  availability JSONB DEFAULT '[]'::jsonb,
  skill_level INTEGER NOT NULL DEFAULT 3 CHECK (skill_level >= 1 AND skill_level <= 5),
  avatar_url TEXT,
  games_played INTEGER DEFAULT 0,
  win_rate INTEGER DEFAULT 0,
  average_rating NUMERIC(2,1) DEFAULT 0,
  reliability INTEGER DEFAULT 100 CHECK (reliability >= 0 AND reliability <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create game_invites table
CREATE TABLE public.game_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  game_type TEXT NOT NULL DEFAULT 'simples' CHECK (game_type IN ('simples', 'duplas')),
  date DATE NOT NULL,
  time_slot TEXT NOT NULL CHECK (time_slot IN ('manha', 'tarde', 'noite')),
  desired_level INTEGER NOT NULL CHECK (desired_level >= 1 AND desired_level <= 5),
  level_range_min INTEGER CHECK (level_range_min >= 1 AND level_range_min <= 5),
  level_range_max INTEGER CHECK (level_range_max >= 1 AND level_range_max <= 5),
  city TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  max_radius INTEGER DEFAULT 10,
  court_name TEXT,
  court_address TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'matched', 'completed', 'cancelled')),
  matched_player_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create match_requests table (for interested players)
CREATE TABLE public.match_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_id UUID REFERENCES public.game_invites(id) ON DELETE CASCADE NOT NULL,
  requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(invite_id, requester_id)
);

-- Create messages table for chat
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  invite_id UUID REFERENCES public.game_invites(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Game invites policies
CREATE POLICY "Game invites are viewable by everyone" 
ON public.game_invites FOR SELECT 
USING (true);

CREATE POLICY "Users can create game invites" 
ON public.game_invites FOR INSERT 
WITH CHECK (creator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Creators can update their own invites" 
ON public.game_invites FOR UPDATE 
USING (creator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Creators can delete their own invites" 
ON public.game_invites FOR DELETE 
USING (creator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Match requests policies
CREATE POLICY "Match requests are viewable by involved parties" 
ON public.match_requests FOR SELECT 
USING (
  requester_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR invite_id IN (SELECT id FROM public.game_invites WHERE creator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
);

CREATE POLICY "Users can create match requests" 
ON public.match_requests FOR INSERT 
WITH CHECK (requester_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Invite creators can update match requests" 
ON public.match_requests FOR UPDATE 
USING (invite_id IN (SELECT id FROM public.game_invites WHERE creator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())));

-- Messages policies
CREATE POLICY "Users can view their own messages" 
ON public.messages FOR SELECT 
USING (
  sender_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR receiver_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can send messages" 
ON public.messages FOR INSERT 
WITH CHECK (sender_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own messages" 
ON public.messages FOR UPDATE 
USING (sender_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_game_invites_updated_at
BEFORE UPDATE ON public.game_invites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();