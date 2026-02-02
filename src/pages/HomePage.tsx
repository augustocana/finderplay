import { Search, UserCheck, MessageCircle, ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useGames } from "@/hooks/useGames";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-tennis.jpg";
import type { Game } from "@/types/game";
import { formatClassRange, getMaxPlayers } from "@/types/game";
import { MapPin, Calendar, Clock, Users } from "lucide-react";

// Um único jogo de exemplo
const exampleGame: Game = {
  id: "example-1",
  title: "Simples no Ibirapuera",
  creatorId: "example-user",
  creatorName: "João Silva",
  gameType: "simples",
  classMin: 3,
  classMax: 4,
  date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  time: "08:00",
  location: "Quadra 2 - Parque Ibirapuera",
  description: "Procurando parceiro para treino matinal",
  participants: [],
  participantNames: {},
  createdAt: new Date().toISOString(),
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Hoje";
  if (date.toDateString() === tomorrow.toDateString()) return "Amanhã";
  
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
};

export const HomePage = () => {
  const navigate = useNavigate();
  const { availableGames } = useGames();

  const maxPlayers = getMaxPlayers(exampleGame.gameType);
  const currentPlayers = exampleGame.participants.length;
  const spotsLeft = maxPlayers - currentPlayers;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section - Primeira dobra limpa */}
      <section className="relative min-h-[60vh] flex flex-col justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Tênis" 
            className="w-full h-full object-cover"
          />
          {/* Overlay forte para garantir legibilidade em qualquer tela */}
          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* Content - apenas frase + botão */}
        <div className="relative z-10 px-6 py-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
            Encontre jogos de tênis<br />
            <span className="text-primary">perto de você</span>
          </h1>

          <p className="text-lg text-white/90 mb-8 max-w-sm mx-auto drop-shadow-md">
            Veja partidas próximas e peça para entrar
          </p>

          <Button 
            variant="tennis" 
            size="lg"
            onClick={() => navigate("/games")}
            className="shadow-xl"
          >
            <Search className="w-5 h-5" />
            Ver jogos na minha região
            <ArrowRight className="w-5 h-5" />
          </Button>

          {availableGames.length > 0 && (
            <p className="text-sm text-white/70 mt-4">
              {availableGames.length} jogo{availableGames.length > 1 ? 's' : ''} disponível{availableGames.length > 1 ? 'is' : ''} agora
            </p>
          )}
        </div>
      </section>

      {/* Como funciona - 3 passos visuais */}
      <section className="px-6 py-10 bg-background">
        <h2 className="text-lg font-bold text-foreground mb-6 text-center">
          Como funciona
        </h2>

        <div className="grid gap-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
              <Search className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xs font-bold text-primary">1.</span>
              <span className="text-sm font-medium text-foreground ml-1">Encontre jogos próximos</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xs font-bold text-primary">2.</span>
              <span className="text-sm font-medium text-foreground ml-1">Peça para entrar</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xs font-bold text-primary">3.</span>
              <span className="text-sm font-medium text-foreground ml-1">Combine pelo chat e jogue</span>
            </div>
          </div>
        </div>
      </section>

      {/* Exemplo de jogo - UM ÚNICO, discreto */}
      <section className="px-6 py-6">
        {/* Card de exemplo com estilo diferenciado */}
        <div className="relative bg-muted/50 rounded-2xl border border-dashed border-border p-4 opacity-80">
          {/* Badge de exemplo */}
          <Badge className="absolute -top-2 left-4 bg-muted text-muted-foreground text-xs border border-border">
            Exemplo
          </Badge>

          {/* Header do card */}
          <div className="flex items-center justify-between mt-2 mb-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-secondary text-secondary-foreground">
              <Users className="w-3 h-3" />
              {exampleGame.gameType === "simples" ? "Simples" : "Duplas"}
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-foreground text-base mb-1">
            {exampleGame.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            por {exampleGame.creatorName}
          </p>

          {/* Class */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/80 mb-3">
            <span className="text-sm">🎾</span>
            <span className="text-xs font-medium text-foreground">
              {formatClassRange(exampleGame.classMin, exampleGame.classMax)}
            </span>
          </div>

          {/* Date, Time, Location */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-secondary/50">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-foreground">{formatDate(exampleGame.date)}</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-secondary/50">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-foreground">{exampleGame.time}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{exampleGame.location}</span>
          </div>

          {/* Vagas */}
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {Array.from({ length: currentPlayers }).map((_, i) => (
                  <div key={i} className="w-5 h-5 rounded-full bg-primary/20 border-2 border-muted flex items-center justify-center">
                    <span className="text-[10px]">🎾</span>
                  </div>
                ))}
                {Array.from({ length: spotsLeft }).map((_, i) => (
                  <div key={i} className="w-5 h-5 rounded-full bg-secondary border-2 border-dashed border-muted" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {spotsLeft} vaga{spotsLeft > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Botão sem ação real */}
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => navigate("/games")}
          >
            <Eye className="w-4 h-4" />
            Ver jogos reais
          </Button>
        </div>
      </section>

      <BottomNavigation />
    </div>
  );
};

export default HomePage;
