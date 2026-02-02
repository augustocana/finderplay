import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSimpleUser } from "@/hooks/useSimpleUser";

export const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { setUserName } = useSimpleUser();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim().length < 2) {
      setError("Nome deve ter pelo menos 2 caracteres");
      return;
    }
    
    if (name.trim().length > 30) {
      setError("Nome deve ter no máximo 30 caracteres");
      return;
    }

    setUserName(name.trim());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        {/* Logo/Title */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-4xl">🎾</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Play Finder</h1>
          <p className="text-muted-foreground">
            Encontre parceiros para jogar tênis
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label className="block text-sm font-medium text-foreground mb-2">
              Como você quer ser chamado?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Digite seu nome ou apelido"
              className="input-field"
              maxLength={30}
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive mt-1">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="tennis"
            size="lg"
            className="w-full"
            disabled={!name.trim()}
          >
            Começar a jogar
          </Button>
        </form>

        <p className="text-xs text-muted-foreground mt-6">
          Seu nome será usado para identificar você nos jogos e conversas
        </p>
      </div>
    </div>
  );
};
