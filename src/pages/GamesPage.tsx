import { useState } from "react";
import { PlusCircle, Search, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/GameCard";
import { CreateGameForm } from "@/components/CreateGameForm";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useGames } from "@/hooks/useGames";
import { useSimpleUser } from "@/hooks/useSimpleUser";
import { toast } from "@/hooks/use-toast";

type TabType = "available" | "my-games" | "participating";

export const GamesPage = () => {
  const { user } = useSimpleUser();
  const { availableGames, myCreatedGames, myParticipatingGames, joinGame, isLoading } = useGames();
  const [activeTab, setActiveTab] = useState<TabType>("available");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleJoin = (gameId: string) => {
    const success = joinGame(gameId);
    if (success) {
      toast({
        title: "Você entrou no jogo! 🎾",
        description: "Acesse os detalhes para ver o chat.",
      });
    }
  };

  const tabs = [
    { id: "available" as TabType, label: "Disponíveis", icon: Search, count: availableGames.length },
    { id: "my-games" as TabType, label: "Meus jogos", icon: Calendar, count: myCreatedGames.length },
    { id: "participating" as TabType, label: "Participando", icon: User, count: myParticipatingGames.length },
  ];

  const getCurrentGames = () => {
    switch (activeTab) {
      case "available":
        return availableGames;
      case "my-games":
        return myCreatedGames;
      case "participating":
        return myParticipatingGames;
      default:
        return [];
    }
  };

  const currentGames = getCurrentGames();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Jogos</h1>
            <p className="text-sm text-muted-foreground">
              Olá, {user?.name}! 👋
            </p>
          </div>
          <Button
            variant="tennis"
            size="sm"
            onClick={() => setShowCreateForm(true)}
          >
            <PlusCircle className="w-4 h-4" />
            Criar jogo
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "gradient-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                  isActive ? "bg-white/20" : "bg-muted"
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Content */}
      <main className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Carregando jogos...</p>
          </div>
        ) : currentGames.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {activeTab === "available" && "Nenhum jogo disponível"}
              {activeTab === "my-games" && "Você ainda não criou jogos"}
              {activeTab === "participating" && "Você não está em nenhum jogo"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {activeTab === "available" && "Seja o primeiro a criar um jogo!"}
              {activeTab === "my-games" && "Crie um jogo e encontre parceiros"}
              {activeTab === "participating" && "Participe de um jogo disponível"}
            </p>
            {activeTab !== "available" && (
              <Button
                variant="tennis"
                onClick={() => activeTab === "my-games" ? setShowCreateForm(true) : setActiveTab("available")}
              >
                {activeTab === "my-games" ? "Criar jogo" : "Ver jogos disponíveis"}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {currentGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                showJoinButton={activeTab === "available"}
                onJoin={() => handleJoin(game.id)}
                isParticipating={game.participants.includes(user?.id || "")}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Game Modal */}
      {showCreateForm && (
        <CreateGameForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            setActiveTab("my-games");
          }}
        />
      )}

      <BottomNavigation />
    </div>
  );
};

export default GamesPage;
