import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Clock,
  Target,
  Calendar,
  Trophy,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlayFrequency, SkillLevel, DayOfWeek, TimeSlot } from "@/types/tennis";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";

const steps = [
  { id: 1, title: "Sobre você" },
  { id: 2, title: "Experiência" },
  { id: 3, title: "Localização" },
  { id: 4, title: "Disponibilidade" },
];

const frequencies: { value: PlayFrequency; label: string; description: string }[] = [
  { value: "iniciante", label: "Iniciante", description: "Estou começando" },
  { value: "casual", label: "Casual", description: "1-2x por mês" },
  { value: "regular", label: "Regular", description: "1-2x por semana" },
  { value: "competitivo", label: "Competitivo", description: "3x+ por semana" },
];

const skillLevels: { value: SkillLevel; label: string; description: string }[] = [
  { value: 1, label: "Classe 1", description: "Profissional - Alto nível" },
  { value: 2, label: "Classe 2", description: "Expert - Nível competitivo" },
  { value: 3, label: "Classe 3", description: "Avançado - Jogo consistente" },
  { value: 4, label: "Classe 4", description: "Intermediário - Peladas casuais" },
  { value: 5, label: "Classe 5", description: "Iniciante - Aprendendo o básico" },
];

const daysOfWeek: { value: DayOfWeek; label: string }[] = [
  { value: "seg", label: "Seg" },
  { value: "ter", label: "Ter" },
  { value: "qua", label: "Qua" },
  { value: "qui", label: "Qui" },
  { value: "sex", label: "Sex" },
  { value: "sab", label: "Sáb" },
  { value: "dom", label: "Dom" },
];

const timeSlots: { value: TimeSlot; label: string }[] = [
  { value: "manha", label: "Manhã" },
  { value: "tarde", label: "Tarde" },
  { value: "noite", label: "Noite" },
];

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, createProfile } = useProfile();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dominantHand: "direita" as "direita" | "esquerda" | "ambas",
    frequency: "" as PlayFrequency,
    yearsPlaying: 0,
    skillLevel: 3 as SkillLevel,
    city: "",
    neighborhood: "",
    maxTravelRadius: 10,
    availability: [] as { day: DayOfWeek; slots: TimeSlot[] }[],
  });

  // Redirect if not logged in or already has profile
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
    if (!profileLoading && profile) {
      navigate("/explore");
    }
  }, [user, profile, authLoading, profileLoading, navigate]);

  const updateForm = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDay = (day: DayOfWeek) => {
    setFormData((prev) => {
      const existing = prev.availability.find((a) => a.day === day);
      if (existing) {
        return {
          ...prev,
          availability: prev.availability.filter((a) => a.day !== day),
        };
      }
      return {
        ...prev,
        availability: [...prev.availability, { day, slots: ["manha", "tarde", "noite"] }],
      };
    });
  };

  const toggleSlot = (day: DayOfWeek, slot: TimeSlot) => {
    setFormData((prev) => {
      const dayAvail = prev.availability.find((a) => a.day === day);
      if (!dayAvail) return prev;

      const hasSlot = dayAvail.slots.includes(slot);
      const newSlots = hasSlot
        ? dayAvail.slots.filter((s) => s !== slot)
        : [...dayAvail.slots, slot];

      if (newSlots.length === 0) {
        return {
          ...prev,
          availability: prev.availability.filter((a) => a.day !== day),
        };
      }

      return {
        ...prev,
        availability: prev.availability.map((a) =>
          a.day === day ? { ...a, slots: newSlots } : a
        ),
      };
    });
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Complete onboarding - save to database
      setIsSubmitting(true);
      try {
        const { error } = await createProfile({
          name: formData.name,
          dominant_hand: formData.dominantHand,
          frequency: formData.frequency,
          years_playing: formData.yearsPlaying,
          skill_level: formData.skillLevel,
          city: formData.city,
          neighborhood: formData.neighborhood,
          max_travel_radius: formData.maxTravelRadius,
          availability: formData.availability,
        });

        if (error) {
          toast({
            title: "Erro ao salvar perfil",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Perfil criado! 🎾",
            description: "Bem-vindo ao Play Finder!",
          });
          navigate("/explore");
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Algo deu errado. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate("/");
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.trim().length >= 2 && formData.frequency;
      case 2:
        return formData.skillLevel;
      case 3:
        return formData.city.trim() && formData.neighborhood.trim();
      case 4:
        return formData.availability.length > 0;
      default:
        return true;
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50 px-6 py-4">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">{steps[step - 1].title}</h1>
            <p className="text-sm text-muted-foreground">Etapa {step} de 4</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-2">
          {steps.map((s) => (
            <div
              key={s.id}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                s.id <= step ? "gradient-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="p-6">
        <div className="max-w-lg mx-auto">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Seu nome
                </label>
                <input
                  type="text"
                  placeholder="Como você quer ser chamado?"
                  value={formData.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  className="input-field text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Mão dominante
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "direita", label: "Direita" },
                    { value: "esquerda", label: "Esquerda" },
                    { value: "ambas", label: "Ambas" },
                  ].map((hand) => (
                    <button
                      key={hand.value}
                      onClick={() => updateForm("dominantHand", hand.value)}
                      className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                        formData.dominantHand === hand.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="font-medium text-foreground">{hand.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Clock className="inline w-4 h-4 mr-1 text-primary" />
                  Com que frequência você joga?
                </label>
                <div className="space-y-3">
                  {frequencies.map((freq) => (
                    <button
                      key={freq.value}
                      onClick={() => updateForm("frequency", freq.value)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        formData.frequency === freq.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="font-semibold text-foreground">{freq.label}</span>
                      <span className="text-muted-foreground ml-2">{freq.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Trophy className="inline w-4 h-4 mr-1 text-primary" />
                  Há quanto tempo você joga? (anos)
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  placeholder="0"
                  value={formData.yearsPlaying || ""}
                  onChange={(e) => updateForm("yearsPlaying", parseInt(e.target.value) || 0)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Target className="inline w-4 h-4 mr-1 text-primary" />
                  Qual seu nível estimado?
                </label>
                <p className="text-sm text-muted-foreground mb-4">
                  Não se preocupe, o sistema ajusta automaticamente com o tempo
                </p>
                <div className="space-y-3">
                  {skillLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => updateForm("skillLevel", level.value)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        formData.skillLevel === level.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-foreground">{level.label}</span>
                          <p className="text-sm text-muted-foreground">{level.description}</p>
                        </div>
                        <div className={`level-badge level-${level.value}`}>{level.value}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <MapPin className="inline w-4 h-4 mr-1 text-primary" />
                  Cidade
                </label>
                <input
                  type="text"
                  placeholder="Ex: São Paulo"
                  value={formData.city}
                  onChange={(e) => updateForm("city", e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Bairro
                </label>
                <input
                  type="text"
                  placeholder="Ex: Pinheiros"
                  value={formData.neighborhood}
                  onChange={(e) => updateForm("neighborhood", e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Raio máximo de deslocamento: {formData.maxTravelRadius}km
                </label>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={formData.maxTravelRadius}
                  onChange={(e) => updateForm("maxTravelRadius", parseInt(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1km</span>
                  <span>50km</span>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Calendar className="inline w-4 h-4 mr-1 text-primary" />
                  Dias disponíveis para jogar
                </label>
                <p className="text-sm text-muted-foreground mb-4">
                  Selecione os dias e horários que você costuma ter livre
                </p>
                <div className="flex gap-2 flex-wrap mb-6">
                  {daysOfWeek.map((day) => {
                    const isSelected = formData.availability.some((a) => a.day === day.value);
                    return (
                      <button
                        key={day.value}
                        onClick={() => toggleDay(day.value)}
                        className={`w-12 h-12 rounded-xl font-medium transition-all duration-200 ${
                          isSelected
                            ? "gradient-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>

                {formData.availability.length > 0 && (
                  <div className="space-y-4">
                    {formData.availability.map((avail) => (
                      <div key={avail.day} className="card-elevated p-4">
                        <div className="font-medium text-foreground mb-3 capitalize">
                          {daysOfWeek.find((d) => d.value === avail.day)?.label}
                        </div>
                        <div className="flex gap-2">
                          {timeSlots.map((slot) => {
                            const isActive = avail.slots.includes(slot.value);
                            return (
                              <button
                                key={slot.value}
                                onClick={() => toggleSlot(avail.day, slot.value)}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  isActive
                                    ? "bg-primary/10 text-primary border border-primary"
                                    : "bg-secondary text-muted-foreground hover:text-secondary-foreground"
                                }`}
                              >
                                {slot.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8">
            <Button
              variant="tennis"
              size="lg"
              className="w-full"
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Salvando...
                </>
              ) : step === 4 ? (
                "Concluir cadastro"
              ) : (
                "Continuar"
              )}
              {!isSubmitting && <ChevronRight className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage;
