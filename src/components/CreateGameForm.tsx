import { useState } from "react";
import { PlusCircle, Calendar, MapPin, Clock, Users, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGames } from "@/hooks/useGames";
import { toast } from "@/hooks/use-toast";

interface CreateGameFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateGameForm = ({ onClose, onSuccess }: CreateGameFormProps) => {
  const { createGame } = useGames();
  const [formData, setFormData] = useState({
    title: "",
    sport: "Tênis",
    location: "",
    date: "",
    time: "",
    maxPlayers: 2,
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

    if (formData.maxPlayers < 2 || formData.maxPlayers > 20) {
      newErrors.maxPlayers = "Número de jogadores deve ser entre 2 e 20";
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
      sport: formData.sport,
      location: formData.location.trim(),
      date: formData.date,
      time: formData.time,
      maxPlayers: formData.maxPlayers,
      description: formData.description.trim() || undefined,
    });

    if (result) {
      toast({
        title: "Jogo criado! 🎾",
        description: "Seu jogo está disponível para outros jogadores.",
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
            Criar novo jogo
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
              placeholder="Ex: Pelada de sábado"
              className="input-field"
              maxLength={50}
            />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
          </div>

          {/* Esporte */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Esporte *
            </label>
            <select
              value={formData.sport}
              onChange={(e) => updateField("sport", e.target.value)}
              className="input-field"
            >
              <option value="Tênis">Tênis</option>
              <option value="Beach Tennis">Beach Tennis</option>
              <option value="Padel">Padel</option>
            </select>
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

          {/* Número de jogadores */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-1">
              <Users className="w-4 h-4 text-primary" />
              Número máximo de jogadores *
            </label>
            <input
              type="number"
              value={formData.maxPlayers}
              onChange={(e) => updateField("maxPlayers", parseInt(e.target.value) || 2)}
              min={2}
              max={20}
              className="input-field"
            />
            {errors.maxPlayers && <p className="text-sm text-destructive mt-1">{errors.maxPlayers}</p>}
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
              placeholder="Ex: Jogo amistoso para iniciantes..."
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
