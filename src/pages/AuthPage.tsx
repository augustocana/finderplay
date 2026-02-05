import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, ArrowLeft, Loader2, User } from "lucide-react";
import { z } from "zod";
import heroImage from "@/assets/hero-tennis.jpg";

const emailSchema = z.string().email("Email inválido");
const passwordSchema = z.string().min(6, "A senha deve ter pelo menos 6 caracteres");

type Step = "login" | "signup" | "forgot-password";

export const AuthPage = () => {
  const navigate = useNavigate();
  const { 
    isAuthenticated,
    isLoading: authLoading,
    signIn,
    signUp,
    resetPassword,
  } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<Step>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Profile fields (for signup)
  const [name, setName] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }

    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("invalid login credentials") || msg.includes("invalid_credentials")) {
        setError("Email ou senha incorretos");
      } else if (msg.includes("email not confirmed")) {
        setError("Confirme seu email antes de entrar. Verifique sua caixa de entrada.");
      } else {
        setError("Erro ao entrar. Tente novamente.");
      }
      return;
    }

    toast({
      title: "Bem-vindo!",
      description: "Login realizado com sucesso",
    });
    navigate("/");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
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
    const { error } = await signUp(email, password, {
      name: name.trim(),
      skill_level: parseInt(skillLevel),
      city: city.trim(),
      neighborhood: neighborhood.trim(),
    });
    setIsLoading(false);

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("already exists")) {
        setError("Este email já está cadastrado. Faça login.");
      } else if (msg.includes("password")) {
        setError("A senha deve ter pelo menos 6 caracteres");
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
      return;
    }

    toast({
      title: "Conta criada!",
      description: "Verifique seu email para confirmar o cadastro",
    });
    navigate("/");
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      emailSchema.parse(email);
    } catch {
      setError("Email inválido");
      return;
    }

    setIsLoading(true);
    const { error } = await resetPassword(email);
    setIsLoading(false);

    if (error) {
      setError("Erro ao enviar email. Tente novamente.");
      return;
    }

    toast({
      title: "Email enviado!",
      description: "Verifique sua caixa de entrada para redefinir a senha",
    });
    setStep("login");
    setEmail("");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Header */}
      <div className="relative h-40 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Tênis" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <h1 className="text-2xl font-bold text-white">Play Finder</h1>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 p-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {step === "login" && "Entrar"}
              {step === "signup" && "Criar conta"}
              {step === "forgot-password" && "Esqueci minha senha"}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {step === "login" && "Entre com seu email e senha"}
              {step === "signup" && "Preencha os dados para criar sua conta"}
              {step === "forgot-password" && "Enviaremos um link para redefinir sua senha"}
            </p>
          </div>

          {/* Login Form */}
          {step === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
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
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    autoComplete="current-password"
                  />
                </div>
              </div>
              
              {error && <p className="text-sm text-destructive">{error}</p>}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
              
              <div className="flex flex-col gap-2 text-center text-sm">
                <button 
                  type="button"
                  onClick={() => { setStep("forgot-password"); setError(""); }}
                  className="text-primary hover:underline"
                >
                  Esqueci minha senha
                </button>
                <p className="text-muted-foreground">
                  Não tem conta?{" "}
                  <button 
                    type="button"
                    onClick={() => { setStep("signup"); setError(""); }}
                    className="text-primary hover:underline"
                  >
                    Criar conta
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* Signup Form */}
          {step === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="p-0 h-auto mb-2"
                onClick={() => { setStep("login"); setError(""); }}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar ao login
              </Button>
              
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    autoComplete="email"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome ou apelido</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Como quer ser chamado?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    maxLength={100}
                  />
                </div>
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
                    Criando conta...
                  </>
                ) : (
                  "Criar conta"
                )}
              </Button>
            </form>
          )}

          {/* Forgot Password Form */}
          {step === "forgot-password" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="p-0 h-auto mb-2"
                onClick={() => { setStep("login"); setError(""); }}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar ao login
              </Button>
              
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reset-email"
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
                  "Enviar link de reset"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
