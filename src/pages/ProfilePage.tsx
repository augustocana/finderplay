import { ArrowLeft, User, LogOut, Star, Mail, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useAuth } from "@/hooks/useAuth";
import { useGameInvites } from "@/hooks/useGameInvites";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, isAuthenticated, signOut, updateProfile, requireAuth } = useAuth();
  const { myCreatedGames } = useGameInvites();
  
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(profile?.name || "");

  const handleSaveName = async () => {
    if (newName.trim().length < 2) {
      toast({
        title: "Nome muito curto",
        description: "Nome deve ter pelo menos 2 caracteres",
        variant: "destructive",
      });
      return;
    }
    
    const { error } = await updateProfile({ name: newName.trim() });
    if (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Tente novamente",
        variant: "destructive",
      });
      return;
    }
    
    setIsEditing(false);
    toast({
      title: "Nome atualizado!",
    });
  };

  const handleLogout = async () => {
    if (confirm("Tem certeza que deseja sair?")) {
      await signOut();
      navigate("/");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-40 glass border-b border-border/50 px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">Perfil</h1>
          </div>
        </header>

        <main className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Entre para ver seu perfil</h2>
          <p className="text-muted-foreground text-center mb-6 max-w-sm">
            Crie uma conta rápida para salvar seu histórico e gerenciar seus jogos
          </p>
          <Button variant="tennis" onClick={() => requireAuth()}>
            <LogIn className="w-4 h-4" />
            Entrar agora
          </Button>
        </main>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Meu Perfil</h1>
        </div>
      </header>

      {/* Content */}
      <main className="p-6 space-y-6">
        {/* Avatar e Nome */}
        <div className="card-elevated p-6 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
            <User className="w-10 h-10 text-primary-foreground" />
          </div>
          
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="input-field text-center"
                maxLength={100}
                autoFocus
              />
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button variant="tennis" onClick={handleSaveName}>
                  Salvar
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-foreground mb-1">{profile?.name}</h2>
              <p className="text-sm text-muted-foreground mb-2">
                {profile?.skill_level}ª classe • {profile?.neighborhood}, {profile?.city}
              </p>
              <Button variant="link" onClick={() => {
                setNewName(profile?.name || "");
                setIsEditing(true);
              }}>
                Editar nome
              </Button>
            </>
          )}
        </div>

        {/* Email */}
        <div className="card-elevated p-5">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground">Email da conta</p>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="card-elevated p-5">
          <h3 className="font-semibold text-foreground mb-4">Suas estatísticas</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-secondary/50 rounded-xl">
              <p className="text-2xl font-bold text-primary">{myCreatedGames.length}</p>
              <p className="text-xs text-muted-foreground">Criados</p>
            </div>
            <div className="text-center p-3 bg-secondary/50 rounded-xl">
              <p className="text-2xl font-bold text-primary">{profile?.games_played || 0}</p>
              <p className="text-xs text-muted-foreground">Jogados</p>
            </div>
            <div className="text-center p-3 bg-secondary/50 rounded-xl">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold text-primary">
                  {profile?.average_rating ? Number(profile.average_rating).toFixed(1) : "-"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Avaliação</p>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair da conta
          </Button>
        </div>

        {/* Info */}
        <div className="bg-secondary/30 rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground">
            🎾 Play Finder<br />
            Seu histórico é salvo na nuvem
          </p>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
