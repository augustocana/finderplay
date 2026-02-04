-- =============================================
-- CORREÇÃO DE RECURSÃO INFINITA NAS POLÍTICAS RLS
-- =============================================

-- 1. Dropar todas as políticas problemáticas
DROP POLICY IF EXISTS profiles_select_policy ON profiles;
DROP POLICY IF EXISTS game_invites_select_policy ON game_invites;
DROP POLICY IF EXISTS match_requests_select_policy ON match_requests;

-- 2. Dropar views que podem causar problemas
DROP VIEW IF EXISTS public_profiles;
DROP VIEW IF EXISTS public_game_invites;

-- 3. POLÍTICA DE PROFILES - Simples, sem referências cruzadas
-- Usuário autenticado pode ver próprio perfil
CREATE POLICY profiles_select_own ON profiles
FOR SELECT USING (user_id = auth.uid());

-- 4. POLÍTICA DE GAME_INVITES - Sem recursão
-- Qualquer pessoa pode ver jogos abertos (marketplace público)
-- Usuário autenticado pode ver seus próprios jogos
CREATE POLICY game_invites_select_public ON game_invites
FOR SELECT USING (
  -- Jogos abertos são públicos (marketplace)
  status = 'open'
  -- OU é o criador (precisa de profile, mas usamos subquery segura)
  OR creator_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
  -- OU é o jogador matched
  OR matched_player_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
);

-- 5. POLÍTICA DE MATCH_REQUESTS - Sem recursão
CREATE POLICY match_requests_select_own ON match_requests
FOR SELECT USING (
  requester_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
  OR invite_id IN (
    SELECT id FROM game_invites 
    WHERE creator_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
  )
);

-- 6. Recriar VIEW public_game_invites - Acessível para todos
CREATE VIEW public_game_invites AS
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

-- Permitir acesso anônimo à view de jogos
GRANT SELECT ON public_game_invites TO anon, authenticated;

-- 7. Recriar VIEW public_profiles - Apenas para autenticados
CREATE VIEW public_profiles AS
SELECT 
  id,
  name,
  skill_level,
  city,
  neighborhood,
  games_played,
  average_rating
FROM profiles;

-- Apenas usuários autenticados podem ver perfis públicos
GRANT SELECT ON public_profiles TO authenticated;