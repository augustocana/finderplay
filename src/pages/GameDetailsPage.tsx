import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Clock, Users, MessageCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useGameInvites } from "@/hooks/useGameInvites";
import { useAuth } from "@/hooks/useAuth";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const formatClassRange = (min: number, max: number): string => {
  if (min === max) return `${min}ª classe`;
  return `${min}ª a ${max}ª classe`;
};

export const GameDetailsPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { profile, isAuthenticated, requireAuth } = useAuth();
  const { getGameById } = useGameInvites();

  const game = gameId ? getGameById(gameId) : null;

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground mb-2">Jogo não encontrado</h1>
          <p className="text-muted-foreground mb-4">Este jogo pode ter sido excluído.</p>
          <Button variant="tennis" onClick={() => navigate("/games")}>
            Voltar aos jogos
          </Button>
        </div>
      </div>
    );
  }

  const isCreator = profile?.id === game.creator_id;
  const gameDate = parseISO(game.date);
  const formattedDate = format(gameDate, "EEEE, dd 'de' MMMM", { locale: ptBR });
  const classRange = formatClassRange(
    game.level_range_min || game.desired_level,
    game.level_range_max || game.desired_level
  );

  const handleRequestJoin = () => {
    requireAuth(() => {
      // TODO: Implementar solicitação de entrada
      console.log("Solicitar entrada no jogo:", gameId);
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">
              {game.title || "Jogo de tênis"}
            </h1>
            <p className="text-sm text-muted-foreground truncate">
              por {game.creator_name}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize shrink-0">
            {game.game_type === "simples" ? "Simples" : "Duplas"}
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 sm:p-6 space-y-6">
        {/* Info Card */}
        <div className="card-elevated p-5 space-y-4">
          {/* Classe */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-lg">🎾</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Nível aceito</p>
              <p className="font-medium text-foreground">{classRange}</p>
            </div>
          </div>

          {/* Local */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Local</p>
              <p className="font-medium text-foreground truncate">
                {game.neighborhood}, {game.city}
              </p>
              {(isCreator || game.matched_player_id === profile?.id) && game.court_name && (
                <p className="text-sm text-muted-foreground">{game.court_name}</p>
              )}
            </div>
          </div>

          {/* Data */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <p className="font-medium text-foreground capitalize">{formattedDate}</p>
            </div>
          </div>

          {/* Horário */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Horário</p>
              <p className="font-medium text-foreground">{game.time_slot}</p>
            </div>
          </div>

          {/* Observações */}
          {game.notes && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-1">Observações</p>
              <p className="text-foreground">{game.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isAuthenticated ? (
          <div className="card-elevated p-5 text-center">
            <LogIn className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-foreground font-medium mb-2">Entre para participar</p>
            <p className="text-sm text-muted-foreground mb-4">
              Faça login para solicitar entrada neste jogo
            </p>
            <Button variant="tennis" onClick={() => requireAuth()}>
              <LogIn className="w-4 h-4" />
              Entrar agora
            </Button>
          </div>
        ) : isCreator ? (
          <div className="card-elevated p-5">
            <div className="flex items-center gap-2 text-primary mb-3">
              <span className="text-lg">👑</span>
              <span className="font-medium">Você é o organizador</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Aguarde solicitações de entrada de outros jogadores.
            </p>
          </div>
        ) : (
          <Button variant="tennis" className="w-full" onClick={handleRequestJoin}>
            <MessageCircle className="w-4 h-4" />
            Solicitar entrada
          </Button>
        )}

        {/* Info notice */}
        <div className="bg-secondary/50 rounded-xl p-4 text-center">
          <p className="text-sm text-muted-foreground">
            💬 Após aprovação, você poderá ver detalhes completos e conversar com o organizador
          </p>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default GameDetailsPage;
