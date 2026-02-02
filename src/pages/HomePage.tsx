import { useState } from "react";
import { Search, UserCheck, MessageCircle, ChevronRight, Users, Calendar, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/GameCard";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useGames } from "@/hooks/useGames";
import { useSimpleUser } from "@/hooks/useSimpleUser";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-tennis.jpg";

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useSimpleUser();
  const { 
    availableGames, 
    requestJoin, 
    getUserGameStatus,
    isLoading 
  } = useGames();

  const handleRequestJoin = (gameId: string) => {
    const success = requestJoin(gameId);
    if (success) {
      toast({
        title: "Solicitação enviada! 🎾",
        description: "Aguarde a aprovação do organizador.",
      });
    }
  };

  // Mostrar no máximo 3 jogos na home
  const featuredGames = availableGames.slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Tênis" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 pt-12 pb-16">
          {/* Welcome Badge */}
          {user && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
              <span className="text-sm text-primary font-medium">👋 Olá, {user.name}!</span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4 animate-fade-in-up">
            Encontre jogos de tênis{" "}
            <span className="text-gradient-primary">perto de você</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground mb-8 max-w-md animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
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

      {/* Featured Games Section */}
      <section className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">
            Próximos jogos
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
        ) : featuredGames.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-2xl bg-secondary/50 border border-border">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum jogo disponível
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Seja o primeiro a criar um jogo!
            </p>
            <Button
              variant="tennis"
              onClick={() => navigate("/games")}
            >
              Criar jogo
            </Button>
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
