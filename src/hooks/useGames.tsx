import { useState, useEffect } from "react";
import { Game } from "@/types/game";
import { useSimpleUser } from "./useSimpleUser";

const GAMES_KEY = "play_finder_games";

// Dados mock iniciais para demonstração
const initialGames: Game[] = [
  {
    id: "game-1",
    title: "Pelada de sábado",
    sport: "Tênis",
    location: "Clube Pinheiros, São Paulo",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: "09:00",
    maxPlayers: 4,
    currentPlayers: 2,
    description: "Jogo amistoso para iniciantes e intermediários",
    creatorId: "demo-user-1",
    creatorName: "Ricardo",
    participants: ["demo-user-1", "demo-user-2"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "game-2",
    title: "Treino de domingo",
    sport: "Tênis",
    location: "Quadra Municipal, Moema",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: "14:00",
    maxPlayers: 2,
    currentPlayers: 1,
    description: "Procuro parceiro para treinar saque",
    creatorId: "demo-user-2",
    creatorName: "Ana",
    participants: ["demo-user-2"],
    createdAt: new Date().toISOString(),
  },
];

export const useGames = () => {
  const { user } = useSimpleUser();
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar jogos do localStorage
  useEffect(() => {
    const stored = localStorage.getItem(GAMES_KEY);
    if (stored) {
      try {
        setGames(JSON.parse(stored));
      } catch {
        setGames(initialGames);
        localStorage.setItem(GAMES_KEY, JSON.stringify(initialGames));
      }
    } else {
      setGames(initialGames);
      localStorage.setItem(GAMES_KEY, JSON.stringify(initialGames));
    }
    setIsLoading(false);
  }, []);

  // Salvar jogos no localStorage sempre que mudar
  const saveGames = (newGames: Game[]) => {
    localStorage.setItem(GAMES_KEY, JSON.stringify(newGames));
    setGames(newGames);
  };

  // Criar novo jogo
  const createGame = (gameData: Omit<Game, 'id' | 'creatorId' | 'creatorName' | 'currentPlayers' | 'participants' | 'createdAt'>) => {
    if (!user) return null;

    const newGame: Game = {
      ...gameData,
      id: `game-${Date.now()}`,
      creatorId: user.id,
      creatorName: user.name,
      currentPlayers: 1,
      participants: [user.id],
      createdAt: new Date().toISOString(),
    };

    const updatedGames = [newGame, ...games];
    saveGames(updatedGames);
    return newGame;
  };

  // Participar de um jogo
  const joinGame = (gameId: string) => {
    if (!user) return false;

    const updatedGames = games.map(game => {
      if (game.id === gameId && !game.participants.includes(user.id) && game.currentPlayers < game.maxPlayers) {
        return {
          ...game,
          participants: [...game.participants, user.id],
          currentPlayers: game.currentPlayers + 1,
        };
      }
      return game;
    });

    saveGames(updatedGames);
    return true;
  };

  // Sair de um jogo
  const leaveGame = (gameId: string) => {
    if (!user) return false;

    const updatedGames = games.map(game => {
      if (game.id === gameId && game.participants.includes(user.id) && game.creatorId !== user.id) {
        return {
          ...game,
          participants: game.participants.filter(id => id !== user.id),
          currentPlayers: game.currentPlayers - 1,
        };
      }
      return game;
    });

    saveGames(updatedGames);
    return true;
  };

  // Filtrar jogos
  const availableGames = games.filter(game => {
    const gameDate = new Date(game.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return gameDate >= today && game.currentPlayers < game.maxPlayers;
  });

  const myCreatedGames = user ? games.filter(game => game.creatorId === user.id) : [];
  
  const myParticipatingGames = user ? games.filter(game => 
    game.participants.includes(user.id) && game.creatorId !== user.id
  ) : [];

  return {
    games,
    availableGames,
    myCreatedGames,
    myParticipatingGames,
    isLoading,
    createGame,
    joinGame,
    leaveGame,
    getGameById: (id: string) => games.find(g => g.id === id),
  };
};
