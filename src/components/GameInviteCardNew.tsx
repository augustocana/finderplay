import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar, Clock, MapPin, Users, Edit2, Trash2, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { GameInvite } from "@/hooks/useGameInvites";
import { useAuth } from "@/hooks/useAuth";
import { formatClassRange } from "@/types/game";

interface GameInviteCardNewProps {
  game: GameInvite;
  onEdit?: (game: GameInvite) => void;
  onDelete?: (gameId: string) => Promise<{ error: Error | null }>;
}

export const GameInviteCardNew = ({ game, onEdit, onDelete }: GameInviteCardNewProps) => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const isCreator = profile?.id === game.creator_id;
  const gameDate = parseISO(game.date);
  const formattedDate = format(gameDate, "EEE, dd/MM", { locale: ptBR });

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    await onDelete(game.id);
    setIsDeleting(false);
  };

  const classRange = formatClassRange(
    game.level_range_min || game.desired_level,
    game.level_range_max || game.desired_level
  );

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {game.title || "Jogo de tênis"}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              por {game.creator_name}
            </p>
          </div>
          <Badge variant="outline" className="shrink-0">
            {game.game_type === "simples" ? "Simples" : "Duplas"}
          </Badge>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span className="capitalize">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0" />
            <span>{game.time_slot}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{game.neighborhood}, {game.city}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4 shrink-0" />
            <span>{classRange}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isCreator ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onEdit?.(game)}
              >
                <Edit2 className="h-4 w-4 mr-1" />
                Editar
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir jogo?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação não pode ser desfeita. Todas as solicitações pendentes serão canceladas.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              className="w-full"
              onClick={() => navigate(`/game/${game.id}`)}
            >
              Ver detalhes
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
