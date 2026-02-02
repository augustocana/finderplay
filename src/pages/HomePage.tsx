import { Search, UserCheck, MessageCircle, ChevronRight, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/GameCard";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Badge } from "@/components/ui/badge";
import { useGames } from "@/hooks/useGames";
import { useSimpleUser } from "@/hooks/useSimpleUser";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-tennis.jpg";

import type { Game } from "@/types/game";

// Jogos de exemplo para mostrar como funciona
const exampleGames: Game[] = [
  {
    id: "example-1",
    title: "Jogo na quadra do parque",
    creatorId: "example-user",
    creatorName: "João",
    gameType: "simples",
    classMin: 3,
    classMax: 4,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // amanhã
    time: "08:00",
    location: "Quadra do Parque Ibirapuera",
    description: "Procurando parceiro para treino matinal",
    participants: [],
    participantNames: {},
    createdAt: new Date().toISOString(),
  },
  {
    id: "example-2",
    title: "Duplas no clube",
    creatorId: "example-user-2",
    creatorName: "Maria",
    gameType: "duplas",
    classMin: 4,
    classMax: 5,
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // depois de amanhã
    time: "18:30",
    location: "Clube Atlético Paulistano",
    description: "Precisamos de mais 2 para completar a dupla",
    participants: ["p1"],
    participantNames: { p1: "Carlos" },
    createdAt: new Date().toISOString(),
  },
];

export const HomePage = () => {
  const navigate = useNavigate();
  const { user, requireIdentification } = useSimpleUser();
  const { 
    availableGames, 
    requestJoin, 
    getUserGameStatus,
    isLoading 
  } = useGames();

  const handleRequestJoin = (gameId: string) => {
    requireIdentification(() => {
      const success = requestJoin(gameId);
      if (success) {
        toast({
          title: "Solicitação enviada! 🎾",
          description: "Aguarde a aprovação do organizador.",
        });
      }
    });
  };

  // Mostrar no máximo 3 jogos reais na home
  const featuredGames = availableGames.slice(0, 3);
  const hasRealGames = featuredGames.length > 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section com melhor contraste */}
      <section className="relative overflow-hidden">
        {/* Background Image with Strong Overlay for readability */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Tênis" 
            className="w-full h-full object-cover"
          />
          {/* Overlay mais forte para garantir legibilidade */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/85 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 pt-12 pb-16">
          {/* Welcome Badge - só mostra se identificado */}
          {user?.name && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
              <span className="text-sm text-primary font-medium">👋 Olá, {user.name}!</span>
            </div>
          )}

          {/* Title - com sombra de texto para legibilidade */}
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4 animate-fade-in-up drop-shadow-sm">
            Encontre jogos de tênis{" "}
            <span className="text-gradient-primary">perto de você</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground mb-8 max-w-md animate-fade-in-up drop-shadow-sm" style={{ animationDelay: "0.1s" }}>
            Veja partidas próximas, peça para entrar e combine tudo pelo chat
          </p>

          {/* CTA Button */}
          <Button 
            variant="tennis" 
            size="lg"
            onClick={() => navigate("/games")}
            className="animate-fade-in-up shadow-glow"
            style={{ animationDelay: "0.2s" }}
          >
            <Search className="w-5 h-5" />
            Encontrar jogos
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-10">
        <h2 className="text-xl font-bold text-foreground mb-6 text-center">
          Como funciona
        </h2>

        <div className="grid gap-4">
          {/* Step 1 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-md">
              <Search className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">1</span>
                <h3 className="font-semibold text-foreground">Encontre jogos</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Jogos de tênis próximos, ordenados por data
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-md">
              <UserCheck className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">2</span>
                <h3 className="font-semibold text-foreground">Peça para entrar</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                O organizador aprova os participantes
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-md">
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">3</span>
                <h3 className="font-semibold text-foreground">Jogue e converse</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Chat direto com o criador e chat do jogo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Games Section - sempre mostra para explicar o produto */}
      <section className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              Exemplos de jogos
            </h2>
          </div>
          <Badge variant="secondary" className="bg-secondary/80 text-muted-foreground">
            Ilustrativo
          </Badge>
        </div>

        {/* Aviso de exemplo */}
        <div className="mb-4 p-3 rounded-xl bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground text-center">
            ✨ Veja como os jogos aparecem — encontre os reais na sua região abaixo
          </p>
        </div>

        <div className="space-y-4">
          {exampleGames.map((game) => (
            <div key={game.id} className="relative">
              {/* Badge de exemplo no card */}
              <div className="absolute -top-2 -right-2 z-10">
                <Badge className="bg-muted text-muted-foreground text-xs">
                  Exemplo
                </Badge>
              </div>
              <div className="opacity-75 pointer-events-none">
                <GameCard
                  game={game}
                  showRequestButton={false}
                  userStatus="not_requested"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA para jogos reais */}
      <section className="px-6 py-6">
        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
          <h3 className="text-lg font-bold text-foreground mb-2">
            Pronto para jogar?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Veja jogos reais criados por jogadores na sua região
          </p>
          <Button 
            variant="tennis" 
            size="lg"
            onClick={() => navigate("/games")}
            className="shadow-glow"
          >
            <Search className="w-5 h-5" />
            Ver jogos reais perto de mim
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Real Featured Games Section - só mostra se houver jogos reais */}
      {hasRealGames && (
        <section className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">
              🔥 Próximos jogos reais
            </h2>
            {availableGames.length > 3 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/games")}
                className="text-primary"
              >
                Ver todos
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Carregando jogos...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {featuredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  showRequestButton={true}
                  onRequestJoin={() => handleRequestJoin(game.id)}
                  userStatus={getUserGameStatus(game.id)}
                />
              ))}

              {/* Ver mais button */}
              {availableGames.length > 3 && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/games")}
                >
                  Ver todos os {availableGames.length} jogos
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </section>
      )}

      {/* Quick Stats */}
      <section className="px-6 py-6 mb-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-4 rounded-2xl bg-card border border-border">
            <div className="text-2xl font-bold text-primary mb-1">{availableGames.length}</div>
            <div className="text-xs text-muted-foreground">Jogos ativos</div>
          </div>
          <div className="text-center p-4 rounded-2xl bg-card border border-border">
            <div className="text-2xl font-bold text-primary mb-1">🎾</div>
            <div className="text-xs text-muted-foreground">Tênis</div>
          </div>
          <div className="text-center p-4 rounded-2xl bg-card border border-border">
            <div className="text-2xl font-bold text-primary mb-1">⚡</div>
            <div className="text-xs text-muted-foreground">Rápido</div>
          </div>
        </div>
      </section>

      <BottomNavigation />
    </div>
  );
};

export default HomePage;
