import { useState, useEffect } from "react";
import { Game, JoinRequest, GameType, getMaxPlayers } from "@/types/game";
import { useSimpleUser } from "./useSimpleUser";

const GAMES_KEY = "tennis_games";
const REQUESTS_KEY = "tennis_requests";

// Sem dados mock - apenas jogos reais criados pelos usuários
const initialGames: Game[] = [];

// Limpar dados antigos ao carregar (one-time cleanup)
const CACHE_VERSION = "v2";
const CACHE_VERSION_KEY = "tennis_cache_version";
if (typeof window !== "undefined") {
  const currentVersion = localStorage.getItem(CACHE_VERSION_KEY);
  if (currentVersion !== CACHE_VERSION) {
    localStorage.removeItem(GAMES_KEY);
    localStorage.removeItem(REQUESTS_KEY);
    localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION);
  }
}

export const useGames = () => {
  const { user } = useSimpleUser();
  const [games, setGames] = useState<Game[]>([]);
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do localStorage
  useEffect(() => {
    const storedGames = localStorage.getItem(GAMES_KEY);
    const storedRequests = localStorage.getItem(REQUESTS_KEY);
    
    if (storedGames) {
      try {
        setGames(JSON.parse(storedGames));
      } catch {
        setGames(initialGames);
        localStorage.setItem(GAMES_KEY, JSON.stringify(initialGames));
      }
    } else {
      setGames(initialGames);
      localStorage.setItem(GAMES_KEY, JSON.stringify(initialGames));
    }

    if (storedRequests) {
      try {
        setRequests(JSON.parse(storedRequests));
      } catch {
        setRequests([]);
      }
    }
    
    setIsLoading(false);
  }, []);

  // Salvar jogos
  const saveGames = (newGames: Game[]) => {
    localStorage.setItem(GAMES_KEY, JSON.stringify(newGames));
    setGames(newGames);
  };

  // Salvar requests
  const saveRequests = (newRequests: JoinRequest[]) => {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(newRequests));
    setRequests(newRequests);
  };

  // Criar novo jogo
  const createGame = (gameData: {
    title: string;
    gameType: GameType;
    classMin: number;
    classMax: number;
    location: string;
    date: string;
    time: string;
    description?: string;
  }) => {
    if (!user) return null;

    const newGame: Game = {
      ...gameData,
      id: `game-${Date.now()}`,
      creatorId: user.id,
      creatorName: user.name,
      participants: [user.id],
      participantNames: { [user.id]: user.name },
      createdAt: new Date().toISOString(),
    };

    const updatedGames = [newGame, ...games];
    saveGames(updatedGames);
    return newGame;
  };

  // Solicitar entrada em jogo
  const requestJoin = (gameId: string) => {
    if (!user) return false;

    const game = games.find(g => g.id === gameId);
    if (!game) return false;

    // Verificar se já é participante
    if (game.participants.includes(user.id)) return false;

    // Verificar se já tem solicitação pendente
    const existingRequest = requests.find(
      r => r.gameId === gameId && r.userId === user.id && r.status === "pending"
    );
    if (existingRequest) return false;

    const newRequest: JoinRequest = {
      id: `req-${Date.now()}`,
      gameId,
      userId: user.id,
      userName: user.name,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    saveRequests([...requests, newRequest]);
    return true;
  };

  // Aceitar solicitação (organizador)
  const acceptRequest = (requestId: string) => {
    if (!user) return false;

    const request = requests.find(r => r.id === requestId);
    if (!request) return false;

    const game = games.find(g => g.id === request.gameId);
    if (!game || game.creatorId !== user.id) return false;

    // Verificar se ainda há vagas
    const maxPlayers = getMaxPlayers(game.gameType);
    if (game.participants.length >= maxPlayers) return false;

    // Atualizar request
    const updatedRequests = requests.map(r =>
      r.id === requestId ? { ...r, status: "accepted" as const } : r
    );
    saveRequests(updatedRequests);

    // Adicionar participante ao jogo
    const updatedGames = games.map(g => {
      if (g.id === request.gameId) {
        return {
          ...g,
          participants: [...g.participants, request.userId],
          participantNames: { ...g.participantNames, [request.userId]: request.userName },
        };
      }
      return g;
    });
    saveGames(updatedGames);

    return true;
  };

  // Recusar solicitação (organizador)
  const rejectRequest = (requestId: string) => {
    if (!user) return false;

    const request = requests.find(r => r.id === requestId);
    if (!request) return false;

    const game = games.find(g => g.id === request.gameId);
    if (!game || game.creatorId !== user.id) return false;

    const updatedRequests = requests.map(r =>
      r.id === requestId ? { ...r, status: "rejected" as const } : r
    );
    saveRequests(updatedRequests);

    return true;
  };

  // Obter status do usuário em um jogo
  const getUserGameStatus = (gameId: string): "not_requested" | "pending" | "accepted" | "rejected" | "creator" => {
    if (!user) return "not_requested";

    const game = games.find(g => g.id === gameId);
    if (!game) return "not_requested";

    if (game.creatorId === user.id) return "creator";
    if (game.participants.includes(user.id)) return "accepted";

    const userRequest = requests.find(
      r => r.gameId === gameId && r.userId === user.id
    );
    if (!userRequest) return "not_requested";

    return userRequest.status;
  };

  // Obter solicitações pendentes para jogos que o usuário criou
  const getPendingRequestsForMyGames = () => {
    if (!user) return [];

    const myGameIds = games.filter(g => g.creatorId === user.id).map(g => g.id);
    return requests.filter(r => myGameIds.includes(r.gameId) && r.status === "pending");
  };

  // Filtros - apenas jogos futuros, ordenados por data/horário mais próximo
  const availableGames = games
    .filter(game => {
      const gameDateTime = new Date(`${game.date}T${game.time}`);
      const now = new Date();
      const maxPlayers = getMaxPlayers(game.gameType);
      // Apenas jogos futuros que ainda têm vagas
      return gameDateTime > now && game.participants.length < maxPlayers;
    })
    .sort((a, b) => {
      // Ordenar por data + horário mais próximo primeiro
      const dateTimeA = new Date(`${a.date}T${a.time}`).getTime();
      const dateTimeB = new Date(`${b.date}T${b.time}`).getTime();
      return dateTimeA - dateTimeB;
    });

  const myCreatedGames = user ? games.filter(game => game.creatorId === user.id) : [];
  
  const myParticipatingGames = user ? games.filter(game => 
    game.participants.includes(user.id) && game.creatorId !== user.id
  ) : [];

  const myPendingRequests = user ? requests.filter(
    r => r.userId === user.id && r.status === "pending"
  ) : [];

  return {
    games,
    availableGames,
    myCreatedGames,
    myParticipatingGames,
    myPendingRequests,
    requests,
    isLoading,
    createGame,
    requestJoin,
    acceptRequest,
    rejectRequest,
    getUserGameStatus,
    getPendingRequestsForMyGames,
    getGameById: (id: string) => games.find(g => g.id === id),
    getRequestsForGame: (gameId: string) => requests.filter(r => r.gameId === gameId),
  };
};
