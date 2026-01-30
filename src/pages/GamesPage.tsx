import { useState } from "react";
import { PlusCircle, Search, Calendar, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/GameCard";
import { CreateGameForm } from "@/components/CreateGameForm";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useGames } from "@/hooks/useGames";
import { useSimpleUser } from "@/hooks/useSimpleUser";
import { toast } from "@/hooks/use-toast";

type TabType = "available" | "my-games" | "participating" | "pending";

export const GamesPage = () => {
  const { user } = useSimpleUser();
  const { 
    availableGames, 
    myCreatedGames, 
    myParticipatingGames, 
    myPendingRequests,
    getPendingRequestsForMyGames,
    requestJoin, 
    getUserGameStatus,
    isLoading 
  } = useGames();
  const [activeTab, setActiveTab] = useState<TabType>("available");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const pendingForMe = getPendingRequestsForMyGames();

  const handleRequestJoin = (gameId: string) => {
    const success = requestJoin(gameId);
    if (success) {
      toast({
        title: "Solicitação enviada! 🎾",
        description: "Aguarde a aprovação do organizador.",
      });
    }
  };

  const tabs = [
    { id: "available" as TabType, label: "Disponíveis", icon: Search, count: availableGames.length },
    { id: "my-games" as TabType, label: "Meus jogos", icon: Calendar, count: myCreatedGames.length, badge: pendingForMe.length },
    { id: "participating" as TabType, label: "Participando", icon: User, count: myParticipatingGames.length },
    { id: "pending" as TabType, label: "Pendentes", icon: Bell, count: myPendingRequests.length },
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
            <h1 className="text-2xl font-bold text-foreground">Tênis</h1>
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
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 ${
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
                {/* Badge para solicitações pendentes */}
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
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
        ) : activeTab === "pending" ? (
          // Aba de solicitações pendentes
          myPendingRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhuma solicitação pendente
              </h3>
              <p className="text-muted-foreground">
                Suas solicitações de entrada aparecerão aqui
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myPendingRequests.map((request) => (
                <div key={request.id} className="card-elevated p-4">
                  <p className="text-sm text-muted-foreground">
                    Aguardando aprovação para:
                  </p>
                  <p className="font-medium text-foreground">
                    Jogo ID: {request.gameId}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Solicitado em: {new Date(request.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))}
            </div>
          )
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
                showRequestButton={activeTab === "available"}
                onRequestJoin={() => handleRequestJoin(game.id)}
                userStatus={getUserGameStatus(game.id)}
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
