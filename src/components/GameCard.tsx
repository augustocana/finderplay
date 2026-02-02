import { Game, getMaxPlayers, formatClassRange } from "@/types/game";
import { MapPin, Calendar, Clock, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface GameCardProps {
  game: Game;
  showRequestButton?: boolean;
  onRequestJoin?: () => void;
  userStatus?: "not_requested" | "pending" | "accepted" | "rejected" | "creator";
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Check if today
  if (date.toDateString() === today.toDateString()) {
    return "Hoje";
  }
  // Check if tomorrow
  if (date.toDateString() === tomorrow.toDateString()) {
    return "Amanhã";
  }
  
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
        return (
          <Badge className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/20">
            👑 Organizador
          </Badge>
        );
      case "accepted":
        return (
          <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/20">
            ✓ Aceito
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-warning/15 text-warning border-warning/30 hover:bg-warning/20">
            ⏳ Pendente
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="bg-destructive/15 text-destructive border-destructive/30">
            ✗ Recusado
          </Badge>
        );
      default:
        return null;
    }
  };

  const getGameTypeBadge = () => {
    const isSimples = game.gameType === "simples";
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
        isSimples 
          ? "bg-accent/20 text-accent-foreground border border-accent/30" 
          : "bg-primary/15 text-primary border border-primary/30"
      }`}>
        <Users className="w-3.5 h-3.5" />
        {isSimples ? "Simples" : "Duplas"}
      </div>
    );
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Header com tipo e status */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        {getGameTypeBadge()}
        {getStatusBadge()}
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {/* Title and Creator */}
        <div className="mb-3">
          <h3 className="font-bold text-foreground text-lg leading-tight mb-0.5">
            {game.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            por {game.creatorName}
          </p>
        </div>

        {/* Class Range - Highlighted */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary mb-3">
          <span className="text-lg">🎾</span>
          <span className="text-sm font-semibold text-foreground">
            {formatClassRange(game.classMin, game.classMax)}
          </span>
        </div>

        {/* Date, Time, Location Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Date */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50">
            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm font-medium text-foreground truncate">
              {formatDate(game.date)}
            </span>
          </div>
          {/* Time */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50">
            <Clock className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm font-medium text-foreground">
              {game.time}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm text-muted-foreground truncate">
            {game.location}
          </span>
        </div>

        {/* Spots Left */}
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div className="flex-1 flex items-center gap-2">
            <div className="flex -space-x-1">
              {Array.from({ length: currentPlayers }).map((_, i) => (
                <div 
                  key={i} 
                  className="w-6 h-6 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center"
                >
                  <span className="text-xs">🎾</span>
                </div>
              ))}
              {Array.from({ length: spotsLeft }).map((_, i) => (
                <div 
                  key={i} 
                  className="w-6 h-6 rounded-full bg-muted border-2 border-card border-dashed"
                />
              ))}
            </div>
            <span className={`text-sm font-medium ${isFull ? 'text-destructive' : 'text-foreground'}`}>
              {isFull ? "Completo" : `${spotsLeft} vaga${spotsLeft > 1 ? 's' : ''}`}
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
              Pedir para entrar
            </Button>
          )}
          
          {userStatus === "pending" && (
            <div className="flex-1 flex items-center justify-center px-3 py-2 rounded-xl bg-warning/10 border border-warning/20">
              <span className="text-sm font-medium text-warning">
                ⏳ Aguardando
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};