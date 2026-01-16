import { useState } from "react";
import { ChevronRight, MapPin, Calendar, Clock, Target, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameType, SkillLevel, TimeSlot } from "@/types/tennis";

const skillLevels: { value: SkillLevel; label: string; description: string }[] = [
  { value: 1, label: "Classe 1", description: "Profissional - Alto nível" },
  { value: 2, label: "Classe 2", description: "Expert - Nível competitivo" },
  { value: 3, label: "Classe 3", description: "Avançado - Jogo consistente" },
  { value: 4, label: "Classe 4", description: "Intermediário - Peladas casuais" },
  { value: 5, label: "Classe 5", description: "Iniciante - Aprendendo o básico" },
];

const timeSlots: { value: TimeSlot; label: string; time: string }[] = [
  { value: "manha", label: "Manhã", time: "06:00 - 12:00" },
  { value: "tarde", label: "Tarde", time: "12:00 - 18:00" },
  { value: "noite", label: "Noite", time: "18:00 - 22:00" },
];

interface CreateInviteFormProps {
  onSubmit: (data: any) => void;
}

export const CreateInviteForm = ({ onSubmit }: CreateInviteFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    gameType: "simples" as GameType,
    date: "",
    timeSlot: "" as TimeSlot,
    desiredLevel: 3 as SkillLevel,
    neighborhood: "",
    city: "",
    maxRadius: 10,
    courtName: "",
    notes: "",
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else onSubmit(formData);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateForm = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-180px)]">
      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              s <= step ? "gradient-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Step Content */}
      <div className="flex-1">
        {step === 1 && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Tipo de jogo
            </h2>
            <p className="text-muted-foreground mb-6">
              Qual formato você quer jogar?
            </p>
            <div className="space-y-3">
              {[
                { value: "simples", label: "Simples", desc: "1 vs 1" },
                { value: "duplas", label: "Duplas", desc: "2 vs 2 (em breve)" },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => updateForm("gameType", type.value)}
                  disabled={type.value === "duplas"}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                    formData.gameType === type.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  } ${type.value === "duplas" ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span className="font-semibold text-foreground">{type.label}</span>
                  <span className="text-muted-foreground ml-2">{type.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              <Calendar className="inline w-6 h-6 mr-2 text-primary" />
              Quando?
            </h2>
            <p className="text-muted-foreground mb-6">
              Escolha a data e horário do jogo
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Data
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => updateForm("date", e.target.value)}
                className="input-field"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Clock className="inline w-4 h-4 mr-1 text-primary" />
                Período
              </label>
              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.value}
                    onClick={() => updateForm("timeSlot", slot.value)}
                    className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                      formData.timeSlot === slot.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-semibold text-foreground">{slot.label}</div>
                    <div className="text-xs text-muted-foreground">{slot.time}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              <Target className="inline w-6 h-6 mr-2 text-primary" />
              Nível desejado
            </h2>
            <p className="text-muted-foreground mb-6">
              Qual nível do adversário você busca?
            </p>
            <div className="space-y-3">
              {skillLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => updateForm("desiredLevel", level.value)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                    formData.desiredLevel === level.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-foreground">{level.label}</span>
                      <p className="text-sm text-muted-foreground">{level.description}</p>
                    </div>
                    <div className={`level-badge level-${level.value}`}>
                      {level.value}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              <MapPin className="inline w-6 h-6 mr-2 text-primary" />
              Localização
            </h2>
            <p className="text-muted-foreground mb-6">
              Onde você quer jogar?
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
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
                  Quadra (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Clube XYZ"
                  value={formData.courtName}
                  onChange={(e) => updateForm("courtName", e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <FileText className="inline w-4 h-4 mr-1 text-primary" />
                  Observações (opcional)
                </label>
                <textarea
                  placeholder="Ex: Jogo amistoso, treino leve..."
                  value={formData.notes}
                  onChange={(e) => updateForm("notes", e.target.value)}
                  className="input-field min-h-[100px] resize-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        {step > 1 && (
          <Button variant="outline" onClick={handleBack} className="flex-1">
            Voltar
          </Button>
        )}
        <Button
          variant="tennis"
          onClick={handleNext}
          className="flex-1"
          disabled={
            (step === 2 && (!formData.date || !formData.timeSlot)) ||
            (step === 4 && (!formData.city || !formData.neighborhood))
          }
        >
          {step === 4 ? "Criar convite" : "Próximo"}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
