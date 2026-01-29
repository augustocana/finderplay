import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Clock, Users, LogOut, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameChat } from "@/components/GameChat";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useGames } from "@/hooks/useGames";
import { useSimpleUser } from "@/hooks/useSimpleUser";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export const GameDetailsPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useSimpleUser();
  const { getGameById, joinGame, leaveGame } = useGames();
  const [showChat, setShowChat] = useState(false);

  const game = gameId ? getGameById(gameId) : null;

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground mb-2">Jogo não encontrado</h1>
          <Button variant="tennis" onClick={() => navigate("/games")}>
            Voltar aos jogos
          </Button>
        </div>
      </div>
    );
  }

  const isParticipating = user ? game.participants.includes(user.id) : false;
  const isCreator = user ? game.creatorId === user.id : false;
  const isFull = game.currentPlayers >= game.maxPlayers;

  const handleJoin = () => {
    const success = joinGame(game.id);
    if (success) {
      toast({
        title: "Você entrou no jogo! 🎾",
        description: "Agora você pode conversar com os outros participantes.",
      });
    }
  };

  const handleLeave = () => {
    const success = leaveGame(game.id);
    if (success) {
      toast({
        title: "Você saiu do jogo",
        description: "Esperamos te ver em outro jogo!",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{game.title}</h1>
            <p className="text-sm text-muted-foreground">por {game.creatorName}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {game.sport}
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="p-6 space-y-6">
        {/* Info Card */}
        <div className="card-elevated p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Local</p>
              <p className="font-medium text-foreground">{game.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <p className="font-medium text-foreground">{formatDate(game.date)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Horário</p>
              <p className="font-medium text-foreground">{game.time}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Jogadores</p>
              <p className={`font-medium ${isFull ? 'text-destructive' : 'text-foreground'}`}>
                {game.currentPlayers}/{game.maxPlayers} 
                {isFull ? " (lotado)" : ` (${game.maxPlayers - game.currentPlayers} vaga${game.maxPlayers - game.currentPlayers > 1 ? 's' : ''})`}
              </p>
            </div>
          </div>

          {game.description && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-1">Descrição</p>
              <p className="text-foreground">{game.description}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {!isParticipating && !isFull && (
            <Button variant="tennis" className="flex-1" onClick={handleJoin}>
              Participar do jogo
            </Button>
          )}

          {isParticipating && !isCreator && (
            <Button variant="outline" className="flex-1" onClick={handleLeave}>
              <LogOut className="w-4 h-4" />
              Sair do jogo
            </Button>
          )}

          {isParticipating && (
            <Button
              variant={showChat ? "secondary" : "tennis"}
              className="flex-1"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageCircle className="w-4 h-4" />
              {showChat ? "Ocultar chat" : "Ver chat"}
            </Button>
          )}

          {isCreator && (
            <span className="flex items-center justify-center px-4 text-sm font-medium text-primary">
              👑 Você é o organizador
            </span>
          )}
        </div>

        {/* Chat */}
        {isParticipating && showChat && (
          <div className="card-elevated overflow-hidden">
            <GameChat gameId={game.id} />
          </div>
        )}

        {/* Access Notice */}
        {!isParticipating && (
          <div className="bg-secondary/50 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">
              💬 Participe do jogo para acessar o chat com os outros jogadores
            </p>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default GameDetailsPage;
