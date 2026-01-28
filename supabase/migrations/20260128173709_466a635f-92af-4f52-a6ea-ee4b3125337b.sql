-- =====================================================
-- RECONSTRUÇÃO COMPLETA DO CONTROLE DE ACESSO
-- Modelo: Usuários anônimos com identificador persistente
-- =====================================================

-- 1. CRIAR FUNÇÃO PARA LER ANONYMOUS_USER_ID DO HEADER
CREATE OR REPLACE FUNCTION public.get_anonymous_user_id()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    current_setting('request.headers', true)::json->>'x-anonymous-user-id',
    ''
  );
$$;

-- 2. CRIAR FUNÇÃO PARA OBTER O PROFILE_ID DO ANONYMOUS_USER
CREATE OR REPLACE FUNCTION public.get_current_profile_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles 
  WHERE anonymous_user_id = public.get_anonymous_user_id()
  LIMIT 1;
$$;

-- =====================================================
-- 3. REMOVER TODAS AS POLICIES EXISTENTES
-- =====================================================

-- PROFILES
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can create profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

-- GAME_INVITES
DROP POLICY IF EXISTS "Anyone can view game invites" ON public.game_invites;
DROP POLICY IF EXISTS "Anyone can create game invites" ON public.game_invites;
DROP POLICY IF EXISTS "Anyone can update game invites" ON public.game_invites;
DROP POLICY IF EXISTS "Anyone can delete game invites" ON public.game_invites;
DROP POLICY IF EXISTS "game_invites_select_public" ON public.game_invites;
DROP POLICY IF EXISTS "game_invites_insert_own" ON public.game_invites;
DROP POLICY IF EXISTS "game_invites_update_own" ON public.game_invites;
DROP POLICY IF EXISTS "game_invites_delete_own" ON public.game_invites;

-- MATCH_REQUESTS
DROP POLICY IF EXISTS "Anyone can view match requests" ON public.match_requests;
DROP POLICY IF EXISTS "Anyone can create match requests" ON public.match_requests;
DROP POLICY IF EXISTS "Anyone can update match requests" ON public.match_requests;
DROP POLICY IF EXISTS "match_requests_select_involved" ON public.match_requests;
DROP POLICY IF EXISTS "match_requests_insert_own" ON public.match_requests;
DROP POLICY IF EXISTS "match_requests_update_involved" ON public.match_requests;

-- MESSAGES
DROP POLICY IF EXISTS "Anyone can view messages" ON public.messages;
DROP POLICY IF EXISTS "Anyone can send messages" ON public.messages;
DROP POLICY IF EXISTS "Anyone can update messages" ON public.messages;
DROP POLICY IF EXISTS "messages_select_involved" ON public.messages;
DROP POLICY IF EXISTS "messages_insert_own" ON public.messages;
DROP POLICY IF EXISTS "messages_update_receiver" ON public.messages;

-- =====================================================
-- 4. NOVAS POLICIES PARA PROFILES
-- =====================================================

-- SELECT: Público (necessário para matchmaking/descoberta)
CREATE POLICY "profiles_select_public"
ON public.profiles FOR SELECT
USING (true);

-- INSERT: Apenas se anonymous_user_id corresponde ao header
CREATE POLICY "profiles_insert_own"
ON public.profiles FOR INSERT
WITH CHECK (
  anonymous_user_id = public.get_anonymous_user_id()
  AND public.get_anonymous_user_id() != ''
);

-- UPDATE: Apenas o próprio perfil
CREATE POLICY "profiles_update_own"
ON public.profiles FOR UPDATE
USING (anonymous_user_id = public.get_anonymous_user_id())
WITH CHECK (
  anonymous_user_id = public.get_anonymous_user_id()
  AND public.get_anonymous_user_id() != ''
);

-- =====================================================
-- 5. NOVAS POLICIES PARA GAME_INVITES
-- =====================================================

-- SELECT: Público (descoberta de jogos)
CREATE POLICY "game_invites_select_public"
ON public.game_invites FOR SELECT
USING (true);

-- INSERT: Apenas se creator_id é o profile do usuário atual
CREATE POLICY "game_invites_insert_own"
ON public.game_invites FOR INSERT
WITH CHECK (
  creator_id = public.get_current_profile_id()
  AND public.get_current_profile_id() IS NOT NULL
);

-- UPDATE: Apenas o criador pode atualizar
CREATE POLICY "game_invites_update_own"
ON public.game_invites FOR UPDATE
USING (creator_id = public.get_current_profile_id())
WITH CHECK (creator_id = public.get_current_profile_id());

-- DELETE: Apenas o criador pode deletar
CREATE POLICY "game_invites_delete_own"
ON public.game_invites FOR DELETE
USING (creator_id = public.get_current_profile_id());

-- =====================================================
-- 6. NOVAS POLICIES PARA MATCH_REQUESTS
-- =====================================================

-- SELECT: Apenas requester ou dono do invite podem ver
CREATE POLICY "match_requests_select_involved"
ON public.match_requests FOR SELECT
USING (
  requester_id = public.get_current_profile_id()
  OR invite_id IN (
    SELECT id FROM public.game_invites 
    WHERE creator_id = public.get_current_profile_id()
  )
);

-- INSERT: Apenas se requester_id é o profile do usuário atual
CREATE POLICY "match_requests_insert_own"
ON public.match_requests FOR INSERT
WITH CHECK (
  requester_id = public.get_current_profile_id()
  AND public.get_current_profile_id() IS NOT NULL
);

-- UPDATE: Apenas requester ou dono do invite podem atualizar
CREATE POLICY "match_requests_update_involved"
ON public.match_requests FOR UPDATE
USING (
  requester_id = public.get_current_profile_id()
  OR invite_id IN (
    SELECT id FROM public.game_invites 
    WHERE creator_id = public.get_current_profile_id()
  )
);

-- =====================================================
-- 7. NOVAS POLICIES PARA MESSAGES
-- =====================================================

-- SELECT: Apenas sender ou receiver podem ver
CREATE POLICY "messages_select_involved"
ON public.messages FOR SELECT
USING (
  sender_id = public.get_current_profile_id()
  OR receiver_id = public.get_current_profile_id()
);

-- INSERT: Apenas se sender_id é o profile do usuário atual
CREATE POLICY "messages_insert_own"
ON public.messages FOR INSERT
WITH CHECK (
  sender_id = public.get_current_profile_id()
  AND public.get_current_profile_id() IS NOT NULL
);

-- UPDATE: Apenas receiver pode atualizar (marcar como lido)
CREATE POLICY "messages_update_receiver"
ON public.messages FOR UPDATE
USING (receiver_id = public.get_current_profile_id())
WITH CHECK (receiver_id = public.get_current_profile_id());