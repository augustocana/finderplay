import { ArrowLeft, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useSimpleUser } from "@/hooks/useSimpleUser";
import { useGames } from "@/hooks/useGames";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const USER_KEY = "play_finder_user";
const GAMES_KEY = "play_finder_games";
const MESSAGES_KEY = "play_finder_messages";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, setUserName } = useSimpleUser();
  const { myCreatedGames, myParticipatingGames } = useGames();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");

  const handleSaveName = () => {
    if (newName.trim().length < 2) {
      toast({
        title: "Nome muito curto",
        description: "Nome deve ter pelo menos 2 caracteres",
        variant: "destructive",
      });
      return;
    }
    
    setUserName(newName.trim());
    setIsEditing(false);
    toast({
      title: "Nome atualizado!",
      description: "Seu nome foi alterado com sucesso.",
    });
  };

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair? Seus dados locais serão mantidos.")) {
      localStorage.removeItem(USER_KEY);
      navigate("/");
      window.location.reload();
    }
  };

  const handleClearData = () => {
    if (confirm("Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.")) {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(GAMES_KEY);
      localStorage.removeItem(MESSAGES_KEY);
      navigate("/");
      window.location.reload();
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
                maxLength={30}
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
              <h2 className="text-2xl font-bold text-foreground mb-1">{user?.name}</h2>
              <Button variant="link" onClick={() => setIsEditing(true)}>
                Editar nome
              </Button>
            </>
          )}
        </div>

        {/* Estatísticas */}
        <div className="card-elevated p-5">
          <h3 className="font-semibold text-foreground mb-4">Suas estatísticas</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-secondary/50 rounded-xl">
              <p className="text-2xl font-bold text-primary">{myCreatedGames.length}</p>
              <p className="text-sm text-muted-foreground">Jogos criados</p>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-xl">
              <p className="text-2xl font-bold text-primary">{myParticipatingGames.length}</p>
              <p className="text-sm text-muted-foreground">Participações</p>
            </div>
          </div>
        </div>

        {/* ID do usuário */}
        <div className="card-elevated p-5">
          <h3 className="font-semibold text-foreground mb-2">Seu ID</h3>
          <p className="text-xs text-muted-foreground break-all font-mono bg-secondary/50 p-2 rounded">
            {user?.id}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Este ID é usado para identificar você nos jogos e conversas.
          </p>
        </div>

        {/* Ações */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Trocar de conta
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleClearData}
          >
            Apagar todos os dados
          </Button>
        </div>

        {/* Info MVP */}
        <div className="bg-secondary/30 rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground">
            🚀 Play Finder MVP<br />
            Dados armazenados localmente no navegador
          </p>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
