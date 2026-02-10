
# Corrigir jogos que nao aparecem na lista

## Problema identificado

O hook `useGameInvites` tem dois caminhos de busca:
- **Autenticado**: consulta `game_invites` com join em `profiles` via FK -- funciona
- **Anonimo**: consulta `public_game_invites` com join em `public_profiles` via `!game_invites_creator_id_fkey` -- **FALHA SILENCIOSA**

A view `public_game_invites` nao possui foreign keys (views nao herdam constraints da tabela base). O PostgREST nao consegue resolver o join `!game_invites_creator_id_fkey` e retorna erro ou array vazio.

## Solucao

### 1. Corrigir o join anonimo no `useGameInvites.tsx`

Substituir o join por FK (que nao existe na view) por um approach manual:
- Buscar jogos de `public_game_invites` SEM join
- Buscar nomes dos criadores separadamente de `public_profiles` usando os `creator_id`s
- Fazer o merge no frontend

Alternativamente, usar o hint de coluna em vez do hint de FK:
```
public_game_invites.select('*, public_profiles!inner(name)')
```
Porem isso tambem pode falhar sem FK. A solucao mais robusta e buscar separadamente.

### 2. Alternativa mais simples: adicionar relacao explicita via PostgREST

Nao e possivel adicionar FK em views. A solucao correta e:

**Opcao A** (recomendada): Buscar jogos sem join e resolver nomes separadamente no frontend.

**Opcao B**: Criar uma funcao RPC no banco que retorna jogos com nome do criador, eliminando a necessidade de join no cliente.

### Plano de implementacao

**Arquivo: `src/hooks/useGameInvites.tsx`**

No bloco `else` (anonimo), mudar de:
```typescript
const { data, error } = await supabase
  .from("public_game_invites")
  .select(`*, public_profiles!game_invites_creator_id_fkey(name)`)
```

Para:
```typescript
// 1. Buscar jogos sem join
const { data, error } = await supabase
  .from("public_game_invites")
  .select("*")
  .eq("status", "open")
  .order("date", { ascending: true })
  .order("time_slot", { ascending: true });

if (error || !data) { /* handle error */ return; }

// 2. Buscar nomes dos criadores
const creatorIds = [...new Set(data.map(g => g.creator_id).filter(Boolean))];
let creatorsMap: Record<string, string> = {};

if (creatorIds.length > 0) {
  const { data: profiles } = await supabase
    .from("public_profiles")
    .select("id, name")
    .in("id", creatorIds);
  
  if (profiles) {
    creatorsMap = Object.fromEntries(profiles.map(p => [p.id, p.name]));
  }
}

// 3. Merge
const gamesWithCreator = data.map(game => ({
  ...game,
  creator_name: creatorsMap[game.creator_id] || "Jogador",
}));
```

**Arquivo: `src/hooks/useGameInvites.tsx`** (caminho autenticado)

Aplicar a mesma logica para o caminho autenticado, buscando de `game_invites` sem join e resolvendo nomes de `profiles` separadamente. Isso torna o codigo mais robusto e elimina dependencia de FK hints.

### Resultado esperado

- Jogos criados aparecem imediatamente na lista apos criacao (o `fetchGames` ja e chamado no `createGame`)
- Usuarios anonimos veem jogos abertos com nome do criador
- Usuarios autenticados veem jogos abertos com nome do criador
- Nenhum dado sensivel exposto (apenas `name` e `skill_level` via views)
