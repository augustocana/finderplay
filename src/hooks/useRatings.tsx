import { useState, useEffect, useCallback } from "react";
import { PlayerRating } from "@/types/game";
import { useSimpleUser } from "./useSimpleUser";

const RATINGS_KEY = "play_finder_ratings";

export const useRatings = () => {
  const { user } = useSimpleUser();
  const [ratings, setRatings] = useState<PlayerRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar avaliações do localStorage
  const loadRatings = useCallback(() => {
    const stored = localStorage.getItem(RATINGS_KEY);
    if (stored) {
      try {
        setRatings(JSON.parse(stored));
      } catch {
        setRatings([]);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadRatings();
  }, [loadRatings]);

  // Salvar avaliações
  const saveRatings = (newRatings: PlayerRating[]) => {
    localStorage.setItem(RATINGS_KEY, JSON.stringify(newRatings));
    setRatings(newRatings);
  };

  // Criar avaliação
  const createRating = (
    gameId: string,
    ratedUserId: string,
    ratedUserName: string,
    stars: number,
    comment?: string
  ) => {
    if (!user) return false;
    if (stars < 1 || stars > 5) return false;

    // Verificar se já avaliou esse usuário nesse jogo
    const existingRating = ratings.find(
      r => r.gameId === gameId && r.raterId === user.id && r.ratedUserId === ratedUserId
    );
    if (existingRating) return false;

    const newRating: PlayerRating = {
      id: `rating-${Date.now()}`,
      gameId,
      raterId: user.id,
      raterName: user.name,
      ratedUserId,
      ratedUserName,
      stars,
      comment: comment?.trim(),
      createdAt: new Date().toISOString(),
    };

    saveRatings([...ratings, newRating]);
    return true;
  };

  // Verificar se já avaliou um usuário em um jogo
  const hasRated = (gameId: string, ratedUserId: string) => {
    if (!user) return false;
    return ratings.some(
      r => r.gameId === gameId && r.raterId === user.id && r.ratedUserId === ratedUserId
    );
  };

  // Obter avaliações recebidas por um usuário
  const getRatingsForUser = (userId: string) => {
    return ratings
      .filter(r => r.ratedUserId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  // Obter média de avaliações de um usuário
  const getAverageRating = (userId: string) => {
    const userRatings = ratings.filter(r => r.ratedUserId === userId);
    if (userRatings.length === 0) return null;
    
    const sum = userRatings.reduce((acc, r) => acc + r.stars, 0);
    return {
      average: sum / userRatings.length,
      count: userRatings.length,
    };
  };

  // Obter últimas N avaliações de um usuário
  const getRecentRatings = (userId: string, limit: number = 5) => {
    return getRatingsForUser(userId).slice(0, limit);
  };

  // Obter avaliações de um jogo específico
  const getRatingsForGame = (gameId: string) => {
    return ratings.filter(r => r.gameId === gameId);
  };

  // Obter jogos onde o usuário participou e pode avaliar
  const getGamesToRate = (userId: string, games: { id: string; participants: string[]; date: string; time: string }[]) => {
    const now = new Date();
    return games.filter(game => {
      const gameDateTime = new Date(`${game.date}T${game.time}`);
      const isPast = gameDateTime < now;
      const isParticipant = game.participants.includes(userId);
      return isPast && isParticipant;
    });
  };

  return {
    ratings,
    isLoading,
    createRating,
    hasRated,
    getRatingsForUser,
    getAverageRating,
    getRecentRatings,
    getRatingsForGame,
    getGamesToRate,
    refreshRatings: loadRatings,
  };
};
