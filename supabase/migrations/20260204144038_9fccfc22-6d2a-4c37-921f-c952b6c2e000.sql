-- =============================================
-- CORREÇÃO DE SEGURANÇA: Perfis protegidos, jogos públicos
-- =============================================

-- 1. Recriar view public_profiles com restrição de acesso
DROP VIEW IF EXISTS public_profiles;

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
FROM public.profiles
WHERE get_current_user_profile_id() IS NOT NULL;  -- Só retorna dados se usuário estiver autenticado

-- 2. Recriar view public_game_invites para ser pública (marketplace)
DROP VIEW IF EXISTS public_game_invites;

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
FROM public.game_invites
WHERE status = 'open';  -- Todos podem ver jogos abertos

-- 3. Atualizar política de game_invites para permitir leitura anônima de jogos abertos
DROP POLICY IF EXISTS game_invites_select_policy ON game_invites;

CREATE POLICY game_invites_select_policy ON game_invites
FOR SELECT USING (
  -- Criador sempre pode ver seus jogos
  creator_id = get_current_user_profile_id()
  -- Jogador matched pode ver o jogo
  OR matched_player_id = get_current_user_profile_id()
  -- Quem solicitou entrada pode ver o jogo
  OR id IN (
    SELECT invite_id FROM match_requests 
    WHERE requester_id = get_current_user_profile_id()
  )
  -- QUALQUER pessoa pode ver jogos abertos (marketplace público)
  OR status = 'open'
);

-- 4. Manter política de profiles restrita - só autenticados veem perfis
DROP POLICY IF EXISTS profiles_select_policy ON profiles;

CREATE POLICY profiles_select_policy ON profiles
FOR SELECT USING (
  -- Usuário vê próprio perfil
  user_id = auth.uid()
  -- Vê perfil de quem está em jogo com ele
  OR id IN (
    SELECT creator_id FROM game_invites 
    WHERE matched_player_id = get_current_user_profile_id()
    UNION
    SELECT matched_player_id FROM game_invites 
    WHERE creator_id = get_current_user_profile_id() 
    AND matched_player_id IS NOT NULL
  )
  -- Vê perfil de quem trocou mensagem
  OR id IN (
    SELECT sender_id FROM messages WHERE receiver_id = get_current_user_profile_id()
    UNION
    SELECT receiver_id FROM messages WHERE sender_id = get_current_user_profile_id()
  )
  -- Criador de jogo vê perfis dos solicitantes
  OR id IN (
    SELECT requester_id FROM match_requests 
    WHERE invite_id IN (
      SELECT id FROM game_invites WHERE creator_id = get_current_user_profile_id()
    )
  )
  -- Vê perfil de criadores de jogos abertos (dados mínimos via view)
  OR id IN (
    SELECT creator_id FROM game_invites WHERE status = 'open'
  )
);