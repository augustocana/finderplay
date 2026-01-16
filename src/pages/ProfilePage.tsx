import {
  Settings,
  ChevronRight,
  Star,
  Trophy,
  TrendingUp,
  MapPin,
  Clock,
  Target,
  Calendar,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/BottomNavigation";
import { mockPlayers } from "@/data/mockData";
import { SkillLevel } from "@/types/tennis";

const currentUser = mockPlayers[0]; // Using first mock player as current user

const getLevelLabel = (level: SkillLevel) => {
  const labels: Record<SkillLevel, string> = {
    1: "Profissional",
    2: "Expert",
    3: "Avançado",
    4: "Intermediário",
    5: "Iniciante",
  };
  return labels[level];
};

const getFrequencyLabel = (freq: string) => {
  const labels: Record<string, string> = {
    iniciante: "Iniciante",
    casual: "Casual",
    regular: "Regular",
    competitivo: "Competitivo",
  };
  return labels[freq] || freq;
};

export const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="relative">
        {/* Cover */}
        <div className="h-32 gradient-primary" />

        {/* Profile Info */}
        <div className="px-6 -mt-16">
          <div className="flex items-end gap-4 mb-4">
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-4xl border-4 border-background shadow-lg">
                {currentUser.name.charAt(0)}
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-md">
                <Edit2 className="w-4 h-4 text-accent-foreground" />
              </button>
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold text-foreground">
                {currentUser.name}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>
                  {currentUser.neighborhood}, {currentUser.city}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* Level Badge */}
          <div className="flex items-center gap-3 mb-6">
            <span className={`level-badge level-${currentUser.skillLevel}`}>
              <Target className="w-4 h-4" />
              Classe {currentUser.skillLevel} - {getLevelLabel(currentUser.skillLevel)}
            </span>
            <span className="level-badge bg-secondary text-secondary-foreground">
              <Clock className="w-4 h-4" />
              {getFrequencyLabel(currentUser.frequency)}
            </span>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="px-6 mb-8">
        <div className="grid grid-cols-4 gap-3">
          <div className="stat-card">
            <div className="flex items-center gap-1 text-accent mb-1">
              <Star className="w-5 h-5 fill-accent" />
              <span className="text-xl font-bold">{currentUser.averageRating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-muted-foreground">Avaliação</span>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-1 text-primary mb-1">
              <Trophy className="w-5 h-5" />
              <span className="text-xl font-bold">{currentUser.gamesPlayed}</span>
            </div>
            <span className="text-xs text-muted-foreground">Jogos</span>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-1 text-success mb-1">
              <TrendingUp className="w-5 h-5" />
              <span className="text-xl font-bold">{currentUser.winRate}%</span>
            </div>
            <span className="text-xs text-muted-foreground">Vitórias</span>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-1 text-primary mb-1">
              <Calendar className="w-5 h-5" />
              <span className="text-xl font-bold">{currentUser.reliability}%</span>
            </div>
            <span className="text-xs text-muted-foreground">Confiável</span>
          </div>
        </div>
      </section>

      {/* Menu Sections */}
      <section className="px-6 space-y-4">
        {/* My Games */}
        <div className="card-elevated overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">Meus jogos</div>
                <div className="text-sm text-muted-foreground">
                  Histórico e próximas partidas
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* My Invites */}
        <div className="card-elevated overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">Meus convites</div>
                <div className="text-sm text-muted-foreground">
                  Convites criados e recebidos
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                2 novos
              </span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </button>
        </div>

        {/* Edit Profile */}
        <div className="card-elevated overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Edit2 className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">Editar perfil</div>
                <div className="text-sm text-muted-foreground">
                  Disponibilidade, localização, nível
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Settings */}
        <div className="card-elevated overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">Configurações</div>
                <div className="text-sm text-muted-foreground">
                  Notificações, privacidade, conta
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </section>

      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
