import { useState } from "react";
import { PlusCircle, Calendar, MapPin, Clock, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGames } from "@/hooks/useGames";
import { toast } from "@/hooks/use-toast";
import { GameType } from "@/types/game";

interface CreateGameFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateGameForm = ({ onClose, onSuccess }: CreateGameFormProps) => {
  const { createGame } = useGames();
  const [formData, setFormData] = useState({
    title: "",
    gameType: "simples" as GameType,
    classMin: 3,
    classMax: 5,
    location: "",
    date: "",
    time: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório";
    } else if (formData.title.length > 50) {
      newErrors.title = "Título deve ter no máximo 50 caracteres";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Local é obrigatório";
    } else if (formData.location.length > 100) {
      newErrors.location = "Local deve ter no máximo 100 caracteres";
    }

    if (!formData.date) {
      newErrors.date = "Data é obrigatória";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Data não pode ser no passado";
      }
    }

    if (!formData.time) {
      newErrors.time = "Horário é obrigatório";
    }

    if (formData.classMin < 1 || formData.classMin > 6) {
      newErrors.classMin = "Classe deve ser entre 1 e 6";
    }

    if (formData.classMax < 1 || formData.classMax > 6) {
      newErrors.classMax = "Classe deve ser entre 1 e 6";
    }

    if (formData.classMin > formData.classMax) {
      newErrors.classRange = "Classe mínima não pode ser maior que a máxima";
    }

    if (formData.description.length > 200) {
      newErrors.description = "Descrição deve ter no máximo 200 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const result = createGame({
      title: formData.title.trim(),
      gameType: formData.gameType,
      classMin: formData.classMin,
      classMax: formData.classMax,
      location: formData.location.trim(),
      date: formData.date,
      time: formData.time,
      description: formData.description.trim() || undefined,
    });

    if (result) {
      toast({
        title: "Jogo criado! 🎾",
        description: `${formData.gameType === "simples" ? "Simples (2 jogadores)" : "Duplas (4 jogadores)"} criado com sucesso.`,
      });
      onSuccess();
    }
  };

  const updateField = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-background w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-primary" />
            Criar jogo de tênis
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Título do jogo *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Ex: Partida amistosa no clube"
              className="input-field"
              maxLength={50}
            />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
          </div>

          {/* Tipo de jogo */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tipo de jogo *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateField("gameType", "simples")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.gameType === "simples"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-2xl mb-1">👤</div>
                <div className="font-semibold">Simples</div>
                <div className="text-xs text-muted-foreground">2 jogadores</div>
              </button>
              <button
                type="button"
                onClick={() => updateField("gameType", "duplas")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.gameType === "duplas"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-2xl mb-1">👥</div>
                <div className="font-semibold">Duplas</div>
                <div className="text-xs text-muted-foreground">4 jogadores</div>
              </button>
            </div>
          </div>

          {/* Classes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nível aceito (classes) *
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              1ª classe = mais avançado, 6ª classe = iniciante
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">De:</label>
                <select
                  value={formData.classMin}
                  onChange={(e) => updateField("classMin", parseInt(e.target.value))}
                  className="input-field"
                >
                  {[1, 2, 3, 4, 5, 6].map(c => (
                    <option key={c} value={c}>{c}ª classe</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Até:</label>
                <select
                  value={formData.classMax}
                  onChange={(e) => updateField("classMax", parseInt(e.target.value))}
                  className="input-field"
                >
                  {[1, 2, 3, 4, 5, 6].map(c => (
                    <option key={c} value={c}>{c}ª classe</option>
                  ))}
                </select>
              </div>
            </div>
            {errors.classRange && <p className="text-sm text-destructive mt-1">{errors.classRange}</p>}
          </div>

          {/* Local */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-primary" />
              Local *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="Ex: Clube Pinheiros, São Paulo"
              className="input-field"
              maxLength={100}
            />
            {errors.location && <p className="text-sm text-destructive mt-1">{errors.location}</p>}
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-primary" />
                Data *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => updateField("date", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="input-field"
              />
              {errors.date && <p className="text-sm text-destructive mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-1">
                <Clock className="w-4 h-4 text-primary" />
                Horário *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => updateField("time", e.target.value)}
                className="input-field"
              />
              {errors.time && <p className="text-sm text-destructive mt-1">{errors.time}</p>}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-1">
              <FileText className="w-4 h-4 text-primary" />
              Descrição (opcional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Ex: Procuro parceiros para treinar..."
              className="input-field min-h-[80px] resize-none"
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.description.length}/200 caracteres
            </p>
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="tennis" className="flex-1">
              Criar jogo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
