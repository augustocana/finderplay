import { MapPin, Calendar, Clock, Target, ChevronRight, Star, TrendingUp } from "lucide-react";
import { GameInvite, SkillLevel } from "@/types/tennis";
import { Button } from "@/components/ui/button";

interface GameInviteCardProps {
  invite: GameInvite;
  onInterest: (id: string) => void;
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

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
};

const getTimeSlotLabel = (slot: string) => {
  const labels: Record<string, string> = {
    manha: "Manhã",
    tarde: "Tarde",
    noite: "Noite",
  };
  return labels[slot] || slot;
};

export const GameInviteCard = ({ invite, onInterest }: GameInviteCardProps) => {
  return (
    <div className="card-elevated p-5 animate-fade-in-up hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-lg">
            {invite.creator.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{invite.creator.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="w-3.5 h-3.5 text-accent fill-accent" />
              <span>{invite.creator.averageRating.toFixed(1)}</span>
              <span>•</span>
              <span>{invite.creator.gamesPlayed} jogos</span>
            </div>
          </div>
        </div>
        <span className={`level-badge ${getLevelClass(invite.desiredLevel)}`}>
          <Target className="w-3.5 h-3.5" />
          Classe {invite.desiredLevel}
        </span>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-foreground">{formatDate(invite.date)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-foreground">{getTimeSlotLabel(invite.timeSlot)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm col-span-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-foreground">
            {invite.neighborhood}, {invite.city}
            {invite.courtName && ` • ${invite.courtName}`}
          </span>
        </div>
      </div>

      {/* Notes */}
      {invite.notes && (
        <p className="text-sm text-muted-foreground mb-4 italic">"{invite.notes}"</p>
      )}

      {/* Interested Count */}
      {invite.interestedPlayers.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <TrendingUp className="w-4 h-4" />
          <span>{invite.interestedPlayers.length} interessado(s)</span>
        </div>
      )}

      {/* Action */}
      <Button
        variant="tennis"
        className="w-full"
        onClick={() => onInterest(invite.id)}
      >
        Tenho interesse
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
