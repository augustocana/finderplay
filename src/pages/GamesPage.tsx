import { useState, useMemo } from "react";
import { PlusCircle, Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/BottomNavigation";
import { GameFilters, GameFiltersState } from "@/components/GameFilters";
import { GameInviteCardNew } from "@/components/GameInviteCardNew";
import { CreateGameFormNew } from "@/components/CreateGameFormNew";
import { useGameInvites } from "@/hooks/useGameInvites";
import { useAuth } from "@/hooks/useAuth";
import { format, parseISO, isEqual, startOfDay } from "date-fns";

type TabType = "available" | "my-games";

// Helper to check if a time slot falls within a period
const isTimeInPeriod = (timeSlot: string, period: string): boolean => {
  const hour = parseInt(timeSlot.split(":")[0], 10);
  switch (period) {
    case "morning": return hour >= 6 && hour < 12;
    case "afternoon": return hour >= 12 && hour < 18;
    case "evening": return hour >= 18 && hour <= 22;
    default: return true;
  }
};

export const GamesPage = () => {
  const { profile } = useAuth();
  const { games, myCreatedGames, isLoading, deleteGame } = useGameInvites();
  
  const [activeTab, setActiveTab] = useState<TabType>("available");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGame, setEditingGame] = useState<any>(null);
  const [filters, setFilters] = useState<GameFiltersState>({
    skillLevel: "all",
    gameType: "all",
    date: undefined,
    timeSlot: "all",
  });

  // Filter games based on selected filters
  const filteredGames = useMemo(() => {
    const sourceGames = activeTab === "my-games" ? myCreatedGames : games;
    
    return sourceGames.filter((game) => {
      // Skill level filter
      if (filters.skillLevel !== "all") {
        const level = parseInt(filters.skillLevel, 10);
        const min = game.level_range_min || game.desired_level;
        const max = game.level_range_max || game.desired_level;
        if (level < min || level > max) return false;
      }
      
      // Game type filter
      if (filters.gameType !== "all" && game.game_type !== filters.gameType) {
        return false;
      }
      
      // Date filter
      if (filters.date) {
        const gameDate = startOfDay(parseISO(game.date));
        const filterDate = startOfDay(filters.date);
        if (!isEqual(gameDate, filterDate)) return false;
      }
      
      // Time slot filter
      if (filters.timeSlot !== "all" && !isTimeInPeriod(game.time_slot, filters.timeSlot)) {
        return false;
      }
      
      return true;
    });
  }, [games, myCreatedGames, activeTab, filters]);

  const { requireAuth, isAuthenticated } = useAuth();

  const handleCreateGame = () => {
    requireAuth(() => {
      setEditingGame(null);
      setShowCreateForm(true);
    });
  };

  const handleEditGame = (game: any) => {
    requireAuth(() => {
      setEditingGame(game);
      setShowCreateForm(true);
    });
  };

  const tabs = [
    { id: "available" as TabType, label: "Disponíveis", icon: Search, count: games.length },
    { id: "my-games" as TabType, label: "Meus jogos", icon: Calendar, count: myCreatedGames.length },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">Tênis</h1>
            {profile?.name && (
              <p className="text-sm text-muted-foreground truncate">
                Olá, {profile.name}! 👋
              </p>
            )}
          </div>
          
          <Button
            variant="tennis"
            size="sm"
            onClick={handleCreateGame}
            className="shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Criar jogo</span>
            <span className="sm:hidden">Criar</span>
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6">
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

      {/* Filters */}
      <div className="px-4 sm:px-6 py-4 border-b border-border/50">
        <GameFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      {/* Content */}
      <main className="p-4 sm:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Carregando jogos...</p>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {activeTab === "available" && "Nenhum jogo encontrado"}
              {activeTab === "my-games" && "Você ainda não criou jogos"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {activeTab === "available" && "Tente ajustar os filtros ou crie um jogo!"}
              {activeTab === "my-games" && "Crie um jogo e encontre parceiros"}
            </p>
            <Button variant="tennis" onClick={handleCreateGame}>
              <PlusCircle className="w-4 h-4" />
              Criar jogo
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGames.map((game) => (
              <GameInviteCardNew
                key={game.id}
                game={game}
                onEdit={handleEditGame}
                onDelete={deleteGame}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Game Modal */}
      {showCreateForm && (
        <CreateGameFormNew
          game={editingGame}
          onClose={() => {
            setShowCreateForm(false);
            setEditingGame(null);
          }}
          onSuccess={() => {
            setShowCreateForm(false);
            setEditingGame(null);
            setActiveTab("my-games");
          }}
        />
      )}

      <BottomNavigation />
    </div>
  );
};

export default GamesPage;
