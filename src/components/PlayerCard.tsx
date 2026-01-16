import { Star, MapPin, Trophy, Target, TrendingUp, Clock } from "lucide-react";
import { UserProfile, SkillLevel } from "@/types/tennis";

interface PlayerCardProps {
  player: UserProfile;
  onClick?: () => void;
}

const getLevelLabel = (level: SkillLevel) => {
  const labels: Record<SkillLevel, string> = {
    1: "Profissional",
    2: "Expert",
    3: "Avançado",
    4: "Intermediário",
    5: "Iniciante",
  };
  return labels[level];
};

const getLevelClass = (level: SkillLevel) => {
  const classes: Record<SkillLevel, string> = {
    1: "level-1",
    2: "level-2",
    3: "level-3",
    4: "level-4",
    5: "level-5",
  };
  return classes[level];
};

const getFrequencyLabel = (freq: string) => {
  const labels: Record<string, string> = {
    iniciante: "Iniciante",
    casual: "Casual",
    regular: "Regular",
    competitivo: "Competitivo",
  };
  return labels[freq] || freq;
};

export const PlayerCard = ({ player, onClick }: PlayerCardProps) => {
  return (
    <div
      className="card-elevated p-5 cursor-pointer hover:shadow-xl transition-all duration-300 animate-fade-in-up"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          {player.avatarUrl ? (
            <img
              src={player.avatarUrl}
              alt={player.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-xl">
              {player.name.charAt(0)}
            </div>
          )}
          {player.reliability >= 80 && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
              <Trophy className="w-3.5 h-3.5 text-success-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-foreground">{player.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>
              {player.neighborhood}, {player.city}
            </span>
          </div>
        </div>
      </div>

      {/* Level & Frequency */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`level-badge ${getLevelClass(player.skillLevel)}`}>
          <Target className="w-3.5 h-3.5" />
          Classe {player.skillLevel}
        </span>
        <span className="level-badge bg-secondary text-secondary-foreground">
          <Clock className="w-3.5 h-3.5" />
          {getFrequencyLabel(player.frequency)}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="stat-card">
          <div className="flex items-center gap-1 text-accent mb-1">
            <Star className="w-4 h-4 fill-accent" />
            <span className="font-bold">{player.averageRating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-muted-foreground">Avaliação</span>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-1 text-primary mb-1">
            <Trophy className="w-4 h-4" />
            <span className="font-bold">{player.gamesPlayed}</span>
          </div>
          <span className="text-xs text-muted-foreground">Jogos</span>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-1 text-success mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="font-bold">{player.winRate}%</span>
          </div>
          <span className="text-xs text-muted-foreground">Vitórias</span>
        </div>
      </div>
    </div>
  );
};
