import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface GameInvite {
  id: string;
  creator_id: string;
  game_type: string;
  title: string | null;
  date: string;
  time_slot: string;
  desired_level: number;
  level_range_min: number | null;
  level_range_max: number | null;
  city: string;
  neighborhood: string;
  court_name: string | null;
  court_address: string | null;
  notes: string | null;
  status: string;
  matched_player_id: string | null;
  created_at: string;
  // Joined profile data
  creator_name?: string;
}

export interface CreateGameData {
  title: string;
  game_type: "simples" | "duplas";
  date: string;
  time_slot: string;
  desired_level: number;
  level_range_min?: number;
  level_range_max?: number;
  city: string;
  neighborhood: string;
  court_name?: string;
  court_address?: string;
  notes?: string;
}

export const useGameInvites = () => {
  const { profile, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [games, setGames] = useState<GameInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all open games (works for both authenticated and anonymous users)
  const fetchGames = useCallback(async () => {
    try {
      if (isAuthenticated) {
        // Authenticated: use full table with creator profile join
        const { data, error } = await supabase
          .from("game_invites")
          .select(`
            *,
            profiles!game_invites_creator_id_fkey(name)
          `)
          .eq("status", "open")
          .order("date", { ascending: true })
          .order("time_slot", { ascending: true });

        if (error) {
          console.error("Error fetching games:", error);
          toast({
            title: "Erro ao carregar jogos",
            description: "Tente novamente mais tarde",
            variant: "destructive",
          });
          return;
        }

        const gamesWithCreator = (data || []).map((game: any) => ({
          ...game,
          creator_name: game.profiles?.name || "Jogador",
        }));
        setGames(gamesWithCreator);
      } else {
        // Anonymous: use public view with public_profiles join
        const { data, error } = await supabase
          .from("public_game_invites")
          .select(`
            *,
            public_profiles!game_invites_creator_id_fkey(name)
          `)
          .eq("status", "open")
          .order("date", { ascending: true })
          .order("time_slot", { ascending: true });

        if (error) {
          console.error("Error fetching public games:", error);
          toast({
            title: "Erro ao carregar jogos",
            description: "Tente novamente mais tarde",
            variant: "destructive",
          });
          return;
        }

        const gamesWithCreator = (data || []).map((game: any) => ({
          ...game,
          creator_name: game.public_profiles?.name || "Jogador",
        }));
        setGames(gamesWithCreator as GameInvite[]);
      }
    } catch (err) {
      console.error("Error fetching games:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, toast]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // Create a new game
  const createGame = async (data: CreateGameData) => {
    if (!profile) {
      return { error: new Error("Usuário não autenticado") };
    }

    // Validate
    if (!data.title?.trim() || data.title.length > 100) {
      return { error: new Error("Título inválido (máx 100 caracteres)") };
    }
    if (!data.city?.trim()) {
      return { error: new Error("Cidade é obrigatória") };
    }
    if (!data.neighborhood?.trim()) {
      return { error: new Error("Bairro é obrigatório") };
    }
    if (!data.date) {
      return { error: new Error("Data é obrigatória") };
    }
    if (!data.time_slot) {
      return { error: new Error("Horário é obrigatório") };
    }
    if (data.desired_level < 1 || data.desired_level > 6) {
      return { error: new Error("Classe inválida") };
    }

    try {
      const { data: newGame, error } = await supabase
        .from("game_invites")
        .insert({
          creator_id: profile.id,
          title: data.title.trim(),
          game_type: data.game_type,
          date: data.date,
          time_slot: data.time_slot,
          desired_level: data.desired_level,
          level_range_min: data.level_range_min || data.desired_level - 1,
          level_range_max: data.level_range_max || data.desired_level + 1,
          city: data.city.trim(),
          neighborhood: data.neighborhood.trim(),
          court_name: data.court_name?.trim() || null,
          court_address: data.court_address?.trim() || null,
          notes: data.notes?.trim() || null,
        })
        .select()
        .single();

      if (error) {
        return { error };
      }

      await fetchGames();
      toast({
        title: "Jogo criado!",
        description: "Agora é só esperar outros jogadores",
      });

      return { data: newGame, error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Update a game
  const updateGame = async (gameId: string, data: Partial<CreateGameData>) => {
    if (!profile) {
      return { error: new Error("Usuário não autenticado") };
    }

    try {
      const { error } = await supabase
        .from("game_invites")
        .update({
          title: data.title?.trim(),
          game_type: data.game_type,
          date: data.date,
          time_slot: data.time_slot,
          desired_level: data.desired_level,
          level_range_min: data.level_range_min,
          level_range_max: data.level_range_max,
          city: data.city?.trim(),
          neighborhood: data.neighborhood?.trim(),
          court_name: data.court_name?.trim() || null,
          court_address: data.court_address?.trim() || null,
          notes: data.notes?.trim() || null,
        })
        .eq("id", gameId)
        .eq("creator_id", profile.id);

      if (error) {
        return { error };
      }

      await fetchGames();
      toast({
        title: "Jogo atualizado!",
      });

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Delete a game
  const deleteGame = async (gameId: string) => {
    if (!profile) {
      return { error: new Error("Usuário não autenticado") };
    }

    try {
      const { error } = await supabase
        .from("game_invites")
        .delete()
        .eq("id", gameId)
        .eq("creator_id", profile.id);

      if (error) {
        return { error };
      }

      setGames((prev) => prev.filter((g) => g.id !== gameId));
      toast({
        title: "Jogo excluído",
      });

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Get games created by the current user
  const myCreatedGames = games.filter((g) => g.creator_id === profile?.id);

  // Get game by ID
  const getGameById = (id: string) => games.find((g) => g.id === id);

  return {
    games,
    myCreatedGames,
    isLoading,
    createGame,
    updateGame,
    deleteGame,
    getGameById,
    refetch: fetchGames,
  };
};
