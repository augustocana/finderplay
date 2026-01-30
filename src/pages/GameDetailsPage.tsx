import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Clock, Users, MessageCircle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameChat } from "@/components/GameChat";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useGames } from "@/hooks/useGames";
import { useSimpleUser } from "@/hooks/useSimpleUser";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { getMaxPlayers, formatClassRange } from "@/types/game";

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
  const { 
    getGameById, 
    getRequestsForGame, 
    requestJoin, 
    acceptRequest, 
    rejectRequest,
    getUserGameStatus 
  } = useGames();
  const [showChat, setShowChat] = useState(false);

  const game = gameId ? getGameById(gameId) : null;
  const gameRequests = gameId ? getRequestsForGame(gameId) : [];
  const pendingRequests = gameRequests.filter(r => r.status === "pending");

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

  const userStatus = getUserGameStatus(game.id);
  const isCreator = userStatus === "creator";
  const isAccepted = userStatus === "accepted" || isCreator;
  const maxPlayers = getMaxPlayers(game.gameType);
  const currentPlayers = game.participants.length;
  const isFull = currentPlayers >= maxPlayers;

  const handleRequestJoin = () => {
    const success = requestJoin(game.id);
    if (success) {
      toast({
        title: "Solicitação enviada! 🎾",
        description: "Aguarde a aprovação do organizador.",
      });
    }
  };

  const handleAccept = (requestId: string) => {
    const success = acceptRequest(requestId);
    if (success) {
      toast({
        title: "Jogador aceito! ✅",
        description: "O jogador agora pode acessar o chat.",
      });
    }
  };

  const handleReject = (requestId: string) => {
    const success = rejectRequest(requestId);
    if (success) {
      toast({
        title: "Solicitação recusada",
        description: "O jogador foi notificado.",
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
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
            {game.gameType}
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="p-6 space-y-6">
        {/* Info Card */}
        <div className="card-elevated p-5 space-y-4">
          {/* Classe */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg">🎾</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nível aceito</p>
              <p className="font-medium text-foreground">{formatClassRange(game.classMin, game.classMax)}</p>
            </div>
          </div>

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
                {currentPlayers}/{maxPlayers} 
                {isFull ? " (completo)" : ` (${maxPlayers - currentPlayers} vaga${maxPlayers - currentPlayers > 1 ? 's' : ''})`}
              </p>
            </div>
          </div>

          {/* Lista de participantes */}
          {game.participants.length > 0 && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Participantes:</p>
              <div className="flex flex-wrap gap-2">
                {game.participants.map(id => (
                  <span key={id} className="px-3 py-1 bg-secondary rounded-full text-sm">
                    {game.participantNames[id]}
                    {id === game.creatorId && " 👑"}
                  </span>
                ))}
              </div>
            </div>
          )}

          {game.description && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-1">Descrição</p>
              <p className="text-foreground">{game.description}</p>
            </div>
          )}
        </div>

        {/* Pending Requests (only for creator) */}
        {isCreator && pendingRequests.length > 0 && (
          <div className="card-elevated p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-600 flex items-center justify-center text-sm">
                {pendingRequests.length}
              </span>
              Solicitações pendentes
            </h3>
            <div className="space-y-3">
              {pendingRequests.map(request => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{request.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      Solicitado em {new Date(request.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-green-600 hover:bg-green-100"
                      onClick={() => handleAccept(request.id)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => handleReject(request.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {userStatus === "not_requested" && !isFull && (
            <Button variant="tennis" className="flex-1" onClick={handleRequestJoin}>
              Solicitar entrada
            </Button>
          )}

          {userStatus === "pending" && (
            <div className="flex-1 text-center py-3 bg-yellow-500/10 rounded-lg">
              <p className="text-yellow-600 font-medium">⏳ Aguardando aprovação</p>
            </div>
          )}

          {userStatus === "rejected" && (
            <div className="flex-1 text-center py-3 bg-destructive/10 rounded-lg">
              <p className="text-destructive font-medium">✗ Solicitação recusada</p>
            </div>
          )}

          {isAccepted && (
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
        {isAccepted && showChat && (
          <div className="card-elevated overflow-hidden">
            <GameChat gameId={game.id} />
          </div>
        )}

        {/* Access Notice */}
        {!isAccepted && (
          <div className="bg-secondary/50 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">
              💬 Solicite entrada e aguarde aprovação do organizador para acessar o chat
            </p>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default GameDetailsPage;
