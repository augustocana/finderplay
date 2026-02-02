import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRatings } from "@/hooks/useRatings";
import { toast } from "@/hooks/use-toast";

interface RatingModalProps {
  gameId: string;
  ratedUserId: string;
  ratedUserName: string;
  trigger?: React.ReactNode;
  onRated?: () => void;
}

export const RatingModal = ({ 
  gameId, 
  ratedUserId, 
  ratedUserName, 
  trigger,
  onRated 
}: RatingModalProps) => {
  const { createRating, hasRated } = useRatings();
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [comment, setComment] = useState("");

  const alreadyRated = hasRated(gameId, ratedUserId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (stars === 0) {
      toast({
        title: "Selecione uma nota",
        description: "Clique nas estrelas para avaliar o jogador",
        variant: "destructive",
      });
      return;
    }

    const success = createRating(gameId, ratedUserId, ratedUserName, stars, comment);
    
    if (success) {
      toast({
        title: "Avaliação enviada! ⭐",
        description: `Você avaliou ${ratedUserName} com ${stars} estrela${stars > 1 ? 's' : ''}.`,
      });
      setOpen(false);
      setStars(0);
      setComment("");
      onRated?.();
    } else {
      toast({
        title: "Erro ao avaliar",
        description: "Você já avaliou este jogador neste jogo.",
        variant: "destructive",
      });
    }
  };

  if (alreadyRated) {
    return (
      <Button variant="ghost" size="sm" disabled className="gap-2 opacity-60">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        Já avaliado
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Star className="w-4 h-4" />
            Avaliar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Avaliar {ratedUserName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Stars */}
          <div className="flex justify-center gap-2 py-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setStars(star)}
                onMouseEnter={() => setHoverStars(star)}
                onMouseLeave={() => setHoverStars(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star 
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoverStars || stars)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>

          {stars > 0 && (
            <p className="text-center text-sm text-muted-foreground">
              {stars === 1 && "Ruim"}
              {stars === 2 && "Regular"}
              {stars === 3 && "Bom"}
              {stars === 4 && "Muito bom"}
              {stars === 5 && "Excelente!"}
            </p>
          )}

          {/* Comment */}
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              Comentário (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Como foi jogar com este jogador?"
              className="input-field w-full min-h-[80px] resize-none"
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground text-right mt-1">
              {comment.length}/200
            </p>
          </div>

          <Button type="submit" variant="tennis" className="w-full">
            Enviar avaliação
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
