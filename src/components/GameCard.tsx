import { Game, getMaxPlayers, formatClassRange } from "@/types/game";
import { MapPin, Calendar, Clock, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface GameCardProps {
  game: Game;
  showRequestButton?: boolean;
  onRequestJoin?: () => void;
  userStatus?: "not_requested" | "pending" | "accepted" | "rejected" | "creator";
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
};

export const GameCard = ({ game, showRequestButton = true, onRequestJoin, userStatus = "not_requested" }: GameCardProps) => {
  const navigate = useNavigate();
  const maxPlayers = getMaxPlayers(game.gameType);
  const currentPlayers = game.participants.length;
  const spotsLeft = maxPlayers - currentPlayers;
  const isFull = spotsLeft <= 0;

  const getStatusBadge = () => {
    switch (userStatus) {
      case "creator":
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">👑 Organizador</span>;
      case "accepted":
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-600">✓ Aceito</span>;
      case "pending":
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-600">⏳ Pendente</span>;
      case "rejected":
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-destructive/20 text-destructive">✗ Recusado</span>;
      default:
        return null;
    }
  };

  return (
    <div className="card-elevated p-4 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground text-lg">{game.title}</h3>
          <p className="text-sm text-muted-foreground">por {game.creatorName}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
            {game.gameType}
          </span>
          {getStatusBadge()}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-4">
        {/* Classe */}
        <div className="flex items-center gap-2 text-sm">
          <span className="w-4 h-4 flex items-center justify-center text-primary font-bold">🎾</span>
          <span className="text-foreground font-medium">{formatClassRange(game.classMin, game.classMax)}</span>
        </div>
        
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
            {currentPlayers}/{maxPlayers} jogadores
            {!isFull && <span className="text-muted-foreground"> ({spotsLeft} vaga{spotsLeft > 1 ? 's' : ''})</span>}
            {isFull && <span className="text-destructive"> (completo)</span>}
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
        
        {showRequestButton && userStatus === "not_requested" && !isFull && (
          <Button
            variant="tennis"
            className="flex-1"
            onClick={onRequestJoin}
          >
            Solicitar entrada
          </Button>
        )}
        
        {userStatus === "pending" && (
          <span className="flex-1 flex items-center justify-center text-sm font-medium text-yellow-600">
            ⏳ Aguardando aprovação
          </span>
        )}
      </div>
    </div>
  );
};
