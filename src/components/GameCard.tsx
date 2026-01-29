import { Game } from "@/types/game";
import { MapPin, Calendar, Clock, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface GameCardProps {
  game: Game;
  showJoinButton?: boolean;
  onJoin?: () => void;
  isParticipating?: boolean;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
};

export const GameCard = ({ game, showJoinButton = true, onJoin, isParticipating }: GameCardProps) => {
  const navigate = useNavigate();
  const spotsLeft = game.maxPlayers - game.currentPlayers;
  const isFull = spotsLeft <= 0;

  return (
    <div className="card-elevated p-4 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground text-lg">{game.title}</h3>
          <p className="text-sm text-muted-foreground">por {game.creatorName}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {game.sport}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-foreground">{game.location}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-foreground">{formatDate(game.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-foreground">{game.time}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-primary" />
          <span className={`font-medium ${isFull ? 'text-destructive' : 'text-foreground'}`}>
            {game.currentPlayers}/{game.maxPlayers} jogadores
            {!isFull && <span className="text-muted-foreground"> ({spotsLeft} vaga{spotsLeft > 1 ? 's' : ''})</span>}
            {isFull && <span className="text-destructive"> (lotado)</span>}
          </span>
        </div>
      </div>

      {/* Description */}
      {game.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {game.description}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => navigate(`/game/${game.id}`)}
        >
          Ver detalhes
          <ChevronRight className="w-4 h-4" />
        </Button>
        
        {showJoinButton && !isParticipating && !isFull && (
          <Button
            variant="tennis"
            className="flex-1"
            onClick={onJoin}
          >
            Participar
          </Button>
        )}
        
        {isParticipating && (
          <span className="flex-1 flex items-center justify-center text-sm font-medium text-primary">
            ✓ Você participa
          </span>
        )}
      </div>
    </div>
  );
};
