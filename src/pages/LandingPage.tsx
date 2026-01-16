import { ChevronRight, Trophy, Users, Target, Zap } from "lucide-react";
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
              O TênisMate simplifica a marcação de partidas e te ajuda a encontrar 
              jogadores compatíveis na sua região.
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

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          <p>© 2024 TênisMate. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
