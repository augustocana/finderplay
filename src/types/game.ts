// Tipos para o MVP de Tênis

export type GameType = "simples" | "duplas";

export type RequestStatus = "pending" | "accepted" | "rejected";

export interface JoinRequest {
  id: string;
  gameId: string;
  userId: string;
  userName: string;
  status: RequestStatus;
  createdAt: string;
}

export interface Game {
  id: string;
  title: string;
  gameType: GameType; // simples = 2 jogadores, duplas = 4 jogadores
  classMin: number; // 1-6, onde 1 é melhor
  classMax: number; // 1-6
  location: string;
  date: string;
  time: string;
  description?: string;
  creatorId: string;
  creatorName: string;
  // Participantes aceitos (inclui criador)
  participants: string[];
  participantNames: Record<string, string>;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  gameId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export interface SimpleUser {
  id: string;
  name: string;
}

// Helpers
export const getMaxPlayers = (gameType: GameType): number => {
  return gameType === "simples" ? 2 : 4;
};

export const formatClass = (classNum: number): string => {
  return `${classNum}ª classe`;
};

export const formatClassRange = (min: number, max: number): string => {
  if (min === max) return formatClass(min);
  return `${min}ª a ${max}ª classe`;
};
