import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Email inválido");
const otpSchema = z.string().length(6, "O código deve ter 6 dígitos").regex(/^\d+$/, "Apenas números");

type Step = "email" | "otp" | "profile";

export const AuthModal = () => {
  const { 
    showAuthModal, 
    setShowAuthModal, 
    signInWithOtp, 
    verifyOtp, 
    createProfile,
    user,
    profile,
    clearPendingAction 
  } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Profile fields
  const [name, setName] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");

  const resetForm = () => {
    setStep("email");
    setEmail("");
    setOtp("");
    setName("");
    setSkillLevel("");
    setCity("");
    setNeighborhood("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    clearPendingAction();
    setShowAuthModal(false);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      emailSchema.parse(email);
    } catch {
      setError("Email inválido");
      return;
    }

    setIsLoading(true);
    const { error } = await signInWithOtp(email);
    setIsLoading(false);

    if (error) {
      setError("Erro ao enviar código. Tente novamente.");
      return;
    }

    toast({
      title: "Código enviado!",
      description: `Verifique seu email ${email}`,
    });
    setStep("otp");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      otpSchema.parse(otp);
    } catch {
      setError("Código deve ter 6 dígitos");
      return;
    }

    setIsLoading(true);
    const { error } = await verifyOtp(email, otp);
    setIsLoading(false);

    if (error) {
      setError("Código inválido ou expirado. Tente novamente.");
      return;
    }

    // Check if user already has profile
    // If not, go to profile creation step
    // The auth state change will update the profile state
    setTimeout(() => {
      if (!profile) {
        setStep("profile");
      } else {
        handleClose();
        toast({
          title: "Bem-vindo de volta!",
          description: `Olá, ${profile.name}`,
        });
      }
    }, 500);
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Verificar se usuário está autenticado antes de criar perfil
    if (!user) {
      setError("Você precisa estar logado para criar um perfil. Faça login novamente.");
      setStep("email");
      return;
    }

    if (!name.trim()) {
      setError("Digite seu nome");
      return;
    }
    if (!skillLevel) {
      setError("Selecione sua classe");
      return;
    }
    if (!city.trim()) {
      setError("Digite sua cidade");
      return;
    }
    if (!neighborhood.trim()) {
      setError("Digite seu bairro");
      return;
    }

    setIsLoading(true);
    const { error: profileError } = await createProfile({
      name: name.trim(),
      skill_level: parseInt(skillLevel),
      city: city.trim(),
      neighborhood: neighborhood.trim(),
    });
    setIsLoading(false);

    if (profileError) {
      // Mensagens de erro específicas
      const errorMessage = profileError.message || "";
      if (errorMessage.includes("duplicate") || errorMessage.includes("already exists")) {
        setError("Você já possui um perfil. Atualize a página.");
      } else if (errorMessage.includes("not authenticated") || errorMessage.includes("JWT")) {
        setError("Sessão expirada. Faça login novamente.");
        setStep("email");
      } else if (errorMessage.includes("row-level security")) {
        setError("Erro de permissão. Faça login novamente.");
        setStep("email");
      } else {
        setError(`Erro ao criar perfil: ${errorMessage || "Tente novamente."}`);
      }
      console.error("Profile creation error:", profileError);
      return;
    }

    toast({
      title: "Conta criada!",
      description: "Agora você pode criar e participar de jogos",
    });
    resetForm();
    setShowAuthModal(false);
  };

  // If user is authenticated but has no profile, show profile step
  const effectiveStep = user && !profile ? "profile" : step;

  return (
    <Dialog open={showAuthModal} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md max-w-[calc(100vw-2rem)] mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {effectiveStep === "email" && "Entrar no Play Finder"}
            {effectiveStep === "otp" && "Digite o código"}
            {effectiveStep === "profile" && "Complete seu perfil"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {effectiveStep === "email" && "Criamos sua conta apenas para guardar seu histórico e seus jogos."}
            {effectiveStep === "otp" && `Enviamos um código de 6 dígitos para ${email}`}
            {effectiveStep === "profile" && "Só precisamos de algumas informações básicas"}
          </DialogDescription>
        </DialogHeader>

        {effectiveStep === "email" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  autoFocus
                  autoComplete="email"
                />
              </div>
            </div>
            
            {error && <p className="text-sm text-destructive">{error}</p>}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar código"
              )}
            </Button>
          </form>
        )}

        {effectiveStep === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="p-0 h-auto mb-2"
              onClick={() => setStep("email")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar
            </Button>
            
            <div className="space-y-2">
              <Label htmlFor="otp">Código de 6 dígitos</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="text-center text-2xl tracking-widest font-mono"
                autoFocus
                maxLength={6}
              />
            </div>
            
            {error && <p className="text-sm text-destructive">{error}</p>}
            
            <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar"
              )}
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              Não recebeu?{" "}
              <button 
                type="button"
                onClick={() => signInWithOtp(email)}
                className="text-primary underline"
              >
                Reenviar código
              </button>
            </p>
          </form>
        )}

        {effectiveStep === "profile" && (
          <form onSubmit={handleCreateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome ou apelido</Label>
              <Input
                id="name"
                type="text"
                placeholder="Como você quer ser chamado?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="skillLevel">Sua classe</Label>
              <Select value={skillLevel} onValueChange={setSkillLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua classe" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      {level}ª classe
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="São Paulo"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  type="text"
                  placeholder="Pinheiros"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  maxLength={100}
                />
              </div>
            </div>
            
            {error && <p className="text-sm text-destructive">{error}</p>}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar conta"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
