// Tipos simples para o MVP
export interface Game {
  id: string;
  title: string;
  sport: string;
  location: string;
  date: string;
  time: string;
  maxPlayers: number;
  currentPlayers: number;
  description?: string;
  creatorId: string;
  creatorName: string;
  participants: string[]; // lista de IDs
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
