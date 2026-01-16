import { useState } from "react";
import { Filter, MapPin, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameInviteCard } from "@/components/GameInviteCard";
import { BottomNavigation } from "@/components/BottomNavigation";
import { mockInvites } from "@/data/mockData";
import { SkillLevel } from "@/types/tennis";
import { toast } from "@/hooks/use-toast";

const levelFilters: { value: SkillLevel | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: 1, label: "Classe 1" },
  { value: 2, label: "Classe 2" },
  { value: 3, label: "Classe 3" },
  { value: 4, label: "Classe 4" },
  { value: 5, label: "Classe 5" },
];

export const ExplorePage = () => {
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredInvites = mockInvites.filter((invite) => {
    if (selectedLevel === "all") return true;
    return invite.desiredLevel === selectedLevel;
  });

  const handleInterest = (id: string) => {
    toast({
      title: "Interesse registrado! 🎾",
      description: "O organizador será notificado do seu interesse.",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Explorar</h1>
            <p className="text-sm text-muted-foreground">
              Encontre jogos perto de você
            </p>
          </div>
          <Button
            variant={showFilters ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="animate-fade-in-up">
            <div className="mb-3">
              <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                Nível
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
                {levelFilters.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setSelectedLevel(level.value)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                      selectedLevel === level.value
                        ? "gradient-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="p-6">
        {/* Location indicator */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <MapPin className="w-4 h-4 text-primary" />
          <span>São Paulo, SP</span>
          <Button variant="link" className="p-0 h-auto text-primary">
            Alterar
          </Button>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          {filteredInvites.length} jogo(s) disponível(is)
        </p>

        {/* Invites Grid */}
        <div className="space-y-4">
          {filteredInvites.map((invite, index) => (
            <div
              key={invite.id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <GameInviteCard invite={invite} onInterest={handleInterest} />
            </div>
          ))}
        </div>

        {filteredInvites.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum jogo encontrado
            </h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou criar seu próprio convite
            </p>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default ExplorePage;
