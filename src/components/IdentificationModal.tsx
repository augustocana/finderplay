import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSimpleUser } from "@/hooks/useSimpleUser";
import { X } from "lucide-react";

export const IdentificationModal = () => {
  const { 
    showIdentificationModal, 
    setShowIdentificationModal, 
    setUserName,
    clearPendingAction 
  } = useSimpleUser();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  if (!showIdentificationModal) return null;

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
    setName("");
    setError("");
  };

  const handleClose = () => {
    setShowIdentificationModal(false);
    clearPendingAction();
    setName("");
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-card rounded-2xl border border-border shadow-xl p-6 animate-scale-in">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
          <span className="text-3xl">🎾</span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-foreground text-center mb-2">
          Como você quer ser chamado?
        </h2>
        
        {/* Subtitle */}
        <p className="text-sm text-muted-foreground text-center mb-6">
          Usamos seu nome apenas para identificar você nos jogos e conversas.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Digite seu nome ou apelido"
              className="input-field w-full"
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
            Continuar
          </Button>
        </form>
      </div>
    </div>
  );
};
