export type PlayFrequency = 'iniciante' | 'casual' | 'regular' | 'competitivo';
export type SkillLevel = 1 | 2 | 3 | 4 | 5;
export type GameType = 'simples' | 'duplas';
export type DayOfWeek = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom';
export type TimeSlot = 'manha' | 'tarde' | 'noite';

export interface Availability {
  day: DayOfWeek;
  slots: TimeSlot[];
}

export interface UserProfile {
  id: string;
  name: string;
  age?: number;
  gender?: 'masculino' | 'feminino' | 'outro';
  dominantHand: 'direita' | 'esquerda' | 'ambas';
  frequency: PlayFrequency;
  yearsPlaying?: number;
  hasTakenLessons?: boolean;
  tournaments?: number;
  city: string;
  neighborhood: string;
  maxTravelRadius: number; // em km
  availability: Availability[];
  skillLevel: SkillLevel;
  avatarUrl?: string;
  gamesPlayed: number;
  winRate: number;
  averageRating: number;
  reliability: number; // 0-100
  createdAt: Date;
}

export interface GameInvite {
  id: string;
  creatorId: string;
  creator: UserProfile;
  gameType: GameType;
  date: Date;
  timeSlot: TimeSlot;
  desiredLevel: SkillLevel;
  levelRange?: [SkillLevel, SkillLevel];
  city: string;
  neighborhood: string;
  maxRadius: number;
  courtName?: string;
  courtAddress?: string;
  notes?: string;
  status: 'open' | 'matched' | 'completed' | 'cancelled';
  interestedPlayers: string[];
  matchedPlayerId?: string;
  createdAt: Date;
}

export interface GameResult {
  id: string;
  inviteId: string;
  player1Id: string;
  player2Id: string;
  score: {
    player1Sets: number;
    player2Sets: number;
    sets: Array<{ player1: number; player2: number }>;
  };
  duration: number; // em minutos
  player1Rating: number; // 1-5
  player2Rating: number;
  player1LevelPerception: 'abaixo' | 'compativel' | 'acima';
  player2LevelPerception: 'abaixo' | 'compativel' | 'acima';
  completedAt: Date;
}

export interface MatchRequest {
  id: string;
  inviteId: string;
  requesterId: string;
  requester: UserProfile;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}
