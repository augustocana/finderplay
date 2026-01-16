import { ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreateInviteForm } from "@/components/CreateInviteForm";
import { BottomNavigation } from "@/components/BottomNavigation";
import { toast } from "@/hooks/use-toast";

export const CreateGamePage = () => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (data: any) => {
    console.log("New invite:", data);
    setIsSuccess(true);
    toast({
      title: "Convite criado! 🎾",
      description: "Aguarde interessados entrarem em contato.",
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center animate-scale-in">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Convite criado!
          </h1>
          <p className="text-muted-foreground mb-8 max-w-sm">
            Seu convite está disponível para outros jogadores.
            Você será notificado quando alguém demonstrar interesse.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              variant="tennis"
              size="lg"
              onClick={() => navigate("/explore")}
            >
              Ver jogos disponíveis
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsSuccess(false);
              }}
            >
              Criar outro convite
            </Button>
          </div>
        </div>
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
          <div>
            <h1 className="text-xl font-bold text-foreground">Criar convite</h1>
            <p className="text-sm text-muted-foreground">
              Encontre seu próximo adversário
            </p>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="p-6">
        <CreateInviteForm onSubmit={handleSubmit} />
      </main>

      <BottomNavigation />
    </div>
  );
};

export default CreateGamePage;
