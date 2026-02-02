import { Star } from "lucide-react";
import { useRatings } from "@/hooks/useRatings";

interface PlayerRatingsProps {
  userId: string;
  showRecent?: boolean;
  limit?: number;
}

export const PlayerRatings = ({ userId, showRecent = true, limit = 5 }: PlayerRatingsProps) => {
  const { getAverageRating, getRecentRatings } = useRatings();
  
  const averageData = getAverageRating(userId);
  const recentRatings = showRecent ? getRecentRatings(userId, limit) : [];

  if (!averageData) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Nenhuma avaliação ainda</p>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : star <= rating + 0.5
                ? "fill-yellow-400/50 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      {/* Média */}
      <div className="flex items-center justify-center gap-3 p-4 bg-secondary/50 rounded-xl">
        <div className="text-3xl font-bold text-foreground">
          {averageData.average.toFixed(1)}
        </div>
        <div>
          {renderStars(Math.round(averageData.average))}
          <p className="text-xs text-muted-foreground mt-1">
            {averageData.count} avaliação{averageData.count > 1 ? "ões" : ""}
          </p>
        </div>
      </div>

      {/* Avaliações recentes */}
      {showRecent && recentRatings.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Últimas avaliações</h4>
          {recentRatings.map((rating) => (
            <div key={rating.id} className="p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground">
                  {rating.raterName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(rating.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {renderStars(rating.stars)}
              </div>
              {rating.comment && (
                <p className="text-sm text-muted-foreground mt-2 italic">
                  "{rating.comment}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
