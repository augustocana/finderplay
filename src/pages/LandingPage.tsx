import { ChevronRight, Trophy, Users, Target, Zap, Search, MessageCircle, Calendar, Star, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-tennis.jpg";

const features = [
  {
    icon: Target,
    title: "Encontre seu nível",
    description: "Sistema inteligente que refina seu nível técnico a cada partida",
  },
  {
    icon: Users,
    title: "Conecte-se",
    description: "Encontre parceiros de jogo na sua região e disponibilidade",
  },
  {
    icon: Trophy,
    title: "Evolua jogando",
    description: "Acompanhe seu progresso e melhore seu tênis de forma divertida",
  },
  {
    icon: Zap,
    title: "Marque fácil",
    description: "Crie convites em segundos e receba interessados rapidamente",
  },
];

// Phone frame component for mockups
const PhoneMockup = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative mx-auto ${className}`}>
    {/* Phone frame */}
    <div className="relative bg-foreground rounded-[2rem] p-2 shadow-2xl">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-foreground rounded-b-xl z-20" />
      {/* Screen */}
      <div className="relative bg-background rounded-[1.5rem] overflow-hidden">
        {/* Status bar */}
        <div className="h-7 bg-background flex items-center justify-between px-6 text-[10px] text-muted-foreground">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>
        {/* Content */}
        <div className="px-3 pb-4">
          {children}
        </div>
        {/* Home indicator */}
        <div className="h-5 flex items-center justify-center">
          <div className="w-24 h-1 bg-muted-foreground/30 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

const flowSteps = [
  {
    step: 1,
    title: "Crie seu convite",
    description: "Escolha dia, horário e local",
    mockup: (
      <PhoneMockup className="w-44">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-[8px] text-primary-foreground font-bold">JF</span>
            </div>
            <span className="text-xs font-semibold text-foreground">Novo Jogo</span>
          </div>
          <div className="h-7 bg-muted rounded-lg flex items-center px-2 text-[10px] gap-1">
            <Calendar className="w-3 h-3 text-primary" />
            <span>Sábado, 10h</span>
          </div>
          <div className="h-7 bg-muted rounded-lg flex items-center px-2 text-[10px] gap-1">
            <span>📍</span>
            <span>Pinheiros, SP</span>
          </div>
          <div className="h-7 bg-muted rounded-lg flex items-center px-2 text-[10px] gap-1">
            <span>🎾</span>
            <span>Classe 3</span>
          </div>
          <div className="h-7 rounded-lg gradient-primary flex items-center justify-center text-[10px] font-medium text-primary-foreground mt-2">
            Publicar Convite
          </div>
        </div>
      </PhoneMockup>
    ),
  },
  {
    step: 2,
    title: "Jogadores encontram",
    description: "Seu convite aparece para jogadores compatíveis",
    mockup: (
      <PhoneMockup className="w-44">
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground">Explorar</span>
            <Search className="w-3 h-3 text-muted-foreground" />
          </div>
          <div className="p-2 bg-accent/10 rounded-xl border border-accent/30">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">VÇ</span>
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-semibold">Seu convite</div>
                <div className="text-[8px] text-muted-foreground">Sáb 10h • Pinheiros</div>
              </div>
              <div className="text-[8px] text-accent font-medium">Novo!</div>
            </div>
          </div>
          <div className="p-2 bg-muted/50 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted" />
              <div className="flex-1 space-y-1">
                <div className="h-2 w-14 bg-muted-foreground/20 rounded" />
                <div className="h-1.5 w-20 bg-muted-foreground/10 rounded" />
              </div>
            </div>
          </div>
          <div className="p-2 bg-muted/30 rounded-xl opacity-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted" />
              <div className="flex-1 space-y-1">
                <div className="h-2 w-12 bg-muted-foreground/20 rounded" />
                <div className="h-1.5 w-16 bg-muted-foreground/10 rounded" />
              </div>
            </div>
          </div>
        </div>
      </PhoneMockup>
    ),
  },
  {
    step: 3,
    title: "Aceite e combine",
    description: "Aprove o parceiro e conversem pelo chat",
    mockup: (
      <PhoneMockup className="w-44">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-foreground mb-2">Solicitação</div>
          <div className="bg-muted/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">MR</span>
              </div>
              <div>
                <div className="text-[11px] font-semibold">Marcos R.</div>
                <div className="text-[9px] text-muted-foreground">Classe 3 • ⭐ 4.8</div>
              </div>
            </div>
            <div className="text-[9px] text-muted-foreground mb-3 bg-background rounded-lg p-2">
              "Opa! Vi seu convite, topo jogar! 🎾"
            </div>
            <div className="flex gap-2">
              <div className="flex-1 h-7 rounded-lg bg-destructive/20 text-destructive text-[10px] flex items-center justify-center font-medium">
                Recusar
              </div>
              <div className="flex-1 h-7 rounded-lg gradient-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
                Aceitar ✓
              </div>
            </div>
          </div>
        </div>
      </PhoneMockup>
    ),
  },
  {
    step: 4,
    title: "Jogue e avalie",
    description: "Registre o placar e evolua seu nível",
    mockup: (
      <PhoneMockup className="w-44">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-foreground text-center mb-2">Resultado</div>
          <div className="bg-muted/50 rounded-xl p-3">
            <div className="flex justify-center items-center gap-3 mb-3">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-1 flex items-center justify-center">
                  <span className="text-[9px] text-white font-bold">VÇ</span>
                </div>
                <div className="text-xl font-black text-primary">6</div>
              </div>
              <div className="text-lg text-muted-foreground font-light">×</div>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-muted mx-auto mb-1 flex items-center justify-center">
                  <span className="text-[9px] font-bold">MR</span>
                </div>
                <div className="text-xl font-black text-foreground">4</div>
              </div>
            </div>
            <div className="flex justify-center gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={`w-4 h-4 ${i <= 5 ? "text-yellow-500 fill-yellow-500" : "text-muted"}`} />
              ))}
            </div>
            <div className="text-[10px] text-center text-accent font-semibold bg-accent/10 rounded-full py-1">
              🎉 +15 pontos de nível!
            </div>
          </div>
        </div>
      </PhoneMockup>
    ),
  },
];

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-hero">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Tennis player serving"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 py-12">
          <div className="max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-sm font-medium">Novo app de tênis</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground mb-4 leading-tight animate-fade-in-up">
              Encontre seu
              <span className="text-gradient-primary"> parceiro </span>
              de quadra
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-muted-foreground mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Conecte-se com jogadores do seu nível, marque partidas facilmente 
              e evolua seu tênis a cada jogo.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Button
                variant="tennis"
                size="xl"
                onClick={() => navigate("/onboarding")}
              >
                Começar agora
                <ChevronRight className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => navigate("/explore")}
              >
                Explorar jogos
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-12 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div>
                <div className="text-3xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Jogadores ativos</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <div className="text-3xl font-bold text-foreground">1.2k</div>
                <div className="text-sm text-muted-foreground">Partidas marcadas</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <div className="text-3xl font-bold text-foreground">4.8</div>
                <div className="text-sm text-muted-foreground">Avaliação média</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Tudo que você precisa para jogar mais
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Play Finder simplifies match scheduling and helps you find 
              compatible players in your area.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="card-elevated p-6 text-center hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Level System Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-medium">Sistema de Nível</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Seu nível, <span className="text-gradient-primary">comprovado</span> em quadra
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Quanto mais você joga, mais preciso fica seu nível. Conquiste selos de confiança 
              e encontre adversários realmente compatíveis.
            </p>
          </div>

          {/* Level Progression Visual */}
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Iniciante */}
              <div className="card-elevated p-6 text-center relative overflow-hidden group hover:shadow-xl transition-all">
                <div className="absolute top-0 left-0 w-full h-1 bg-muted-foreground/20" />
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-2xl">🎾</span>
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">0-5 partidas</div>
                <h3 className="font-bold text-lg text-foreground mb-2">Nível Inicial</h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm mb-3">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                  <span>Estimado</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Baseado na sua autoavaliação. Jogue para confirmar!
                </p>
              </div>

              {/* Em Validação */}
              <div className="card-elevated p-6 text-center relative overflow-hidden group hover:shadow-xl transition-all border-accent/30">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-muted-foreground/20 via-accent to-muted-foreground/20" />
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center border-2 border-accent/50">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="text-xs text-accent uppercase tracking-wide mb-1 font-medium">6-15 partidas</div>
                <h3 className="font-bold text-lg text-foreground mb-2">Em Validação</h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm mb-3">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span>Calibrando</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  O sistema está aprendendo seu nível real com cada partida.
                </p>
                {/* Progress indicator */}
                <div className="mt-4 flex justify-center gap-1">
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className={`w-6 h-1.5 rounded-full ${i <= 3 ? 'bg-accent' : 'bg-muted'}`} />
                  ))}
                </div>
              </div>

              {/* Confirmado */}
              <div className="card-elevated p-6 text-center relative overflow-hidden group hover:shadow-xl transition-all border-primary/30 bg-gradient-to-b from-primary/5 to-transparent">
                <div className="absolute top-0 left-0 w-full h-1 gradient-primary" />
                <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🏆</span>
                </div>
                <div className="text-xs text-primary uppercase tracking-wide mb-1 font-medium">16+ partidas</div>
                <h3 className="font-bold text-lg text-foreground mb-2">Nível Confirmado</h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm mb-3 font-medium">
                  <Star className="w-3 h-3 fill-primary" />
                  <span>Verificado</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Seu nível foi comprovado! Adversários confiam no seu ranking.
                </p>
                {/* Badge */}
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                  <span className="text-primary text-sm font-semibold">Classe 3</span>
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">PRO</span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-12 grid sm:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-2 p-4">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Partidas equilibradas</strong><br />
                  Jogue contra quem está no seu nível
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 p-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Evolução justa</strong><br />
                  Seu nível sobe com vitórias reais
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 p-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Credibilidade</strong><br />
                  Selo de jogador verificado
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="card-elevated p-8 sm:p-12 text-center gradient-primary overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
                Pronto para jogar?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
                Crie seu perfil em menos de 2 minutos e comece a encontrar 
                parceiros de jogo hoje mesmo.
              </p>
              <Button
                variant="accent"
                size="xl"
                onClick={() => navigate("/onboarding")}
              >
                Criar meu perfil
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground mb-4">
              <span className="text-sm font-medium">Como funciona</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Marque seu jogo em 4 passos
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simples assim: crie, encontre, combine e jogue. Sem burocracia.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {flowSteps.map((item, index) => (
              <div
                key={item.step}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Step number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm z-10">
                  {item.step}
                </div>
                
                {/* Mockup */}
                <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
                  {item.mockup}
                </div>
                
                {/* Text */}
                <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                
                {/* Connector arrow (not on last item) */}
                {index < flowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/3 -right-4 text-muted-foreground/30">
                    <ChevronRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="tennis"
              size="xl"
              onClick={() => navigate("/onboarding")}
            >
              Quero jogar!
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          <p>© 2024 Play Finder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
