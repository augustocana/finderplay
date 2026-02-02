import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useGameInvites, CreateGameData, GameInvite } from "@/hooks/useGameInvites";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateGameFormNewProps {
  game?: GameInvite | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateGameFormNew = ({ game, onClose, onSuccess }: CreateGameFormNewProps) => {
  const { profile } = useAuth();
  const { createGame, updateGame } = useGameInvites();
  const { toast } = useToast();
  
  const isEditing = !!game;
  
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(game?.title || "");
  const [gameType, setGameType] = useState<"simples" | "duplas">(
    (game?.game_type as "simples" | "duplas") || "simples"
  );
  const [date, setDate] = useState<Date | undefined>(
    game?.date ? new Date(game.date) : undefined
  );
  const [timeSlot, setTimeSlot] = useState(game?.time_slot || "");
  const [desiredLevel, setDesiredLevel] = useState(
    game?.desired_level?.toString() || profile?.skill_level?.toString() || "3"
  );
  const [city, setCity] = useState(game?.city || profile?.city || "");
  const [neighborhood, setNeighborhood] = useState(game?.neighborhood || profile?.neighborhood || "");
  const [courtName, setCourtName] = useState(game?.court_name || "");
  const [courtAddress, setCourtAddress] = useState(game?.court_address || "");
  const [notes, setNotes] = useState(game?.notes || "");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Digite um título");
      return;
    }
    if (!date) {
      setError("Selecione uma data");
      return;
    }
    if (!timeSlot) {
      setError("Selecione um horário");
      return;
    }
    if (!city.trim()) {
      setError("Digite a cidade");
      return;
    }
    if (!neighborhood.trim()) {
      setError("Digite o bairro");
      return;
    }

    const data: CreateGameData = {
      title: title.trim(),
      game_type: gameType,
      date: format(date, "yyyy-MM-dd"),
      time_slot: timeSlot,
      desired_level: parseInt(desiredLevel, 10),
      level_range_min: Math.max(1, parseInt(desiredLevel, 10) - 1),
      level_range_max: Math.min(6, parseInt(desiredLevel, 10) + 1),
      city: city.trim(),
      neighborhood: neighborhood.trim(),
      court_name: courtName.trim() || undefined,
      court_address: courtAddress.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    setIsLoading(true);
    
    const result = isEditing 
      ? await updateGame(game.id, data)
      : await createGame(data);
    
    setIsLoading(false);

    if (result.error) {
      setError(result.error.message || "Erro ao salvar. Tente novamente.");
      return;
    }

    onSuccess();
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar jogo" : "Criar novo jogo"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título do jogo</Label>
            <Input
              id="title"
              placeholder="Ex: Simples no Ibirapuera"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Tipo e Classe */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={gameType} onValueChange={(v) => setGameType(v as "simples" | "duplas")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simples">Simples</SelectItem>
                  <SelectItem value="duplas">Duplas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Classe</Label>
              <Select value={desiredLevel} onValueChange={setDesiredLevel}>
                <SelectTrigger>
                  <SelectValue />
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
          </div>

          {/* Data e Horário */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM", { locale: ptBR }) : "Escolha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                    className="pointer-events-auto"
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Horário</Label>
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha" />
                </SelectTrigger>
                <SelectContent>
                  {["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", 
                    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", 
                    "18:00", "19:00", "20:00", "21:00"].map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cidade e Bairro */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input
                placeholder="São Paulo"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label>Bairro</Label>
              <Input
                placeholder="Pinheiros"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                maxLength={100}
              />
            </div>
          </div>

          {/* Quadra (opcional) */}
          <div className="space-y-2">
            <Label>Quadra (opcional)</Label>
            <Input
              placeholder="Nome do clube ou quadra"
              value={courtName}
              onChange={(e) => setCourtName(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Endereço (opcional) */}
          <div className="space-y-2">
            <Label>Endereço (opcional)</Label>
            <Input
              placeholder="Rua, número"
              value={courtAddress}
              onChange={(e) => setCourtAddress(e.target.value)}
              maxLength={200}
            />
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label>Observações (opcional)</Label>
            <Textarea
              placeholder="Detalhes adicionais..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" variant="tennis" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : isEditing ? (
                "Salvar"
              ) : (
                "Criar jogo"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
