import { MessageCircle } from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";

export const ChatPage = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50 px-6 py-4">
        <h1 className="text-2xl font-bold text-foreground">Conversas</h1>
        <p className="text-sm text-muted-foreground">
          Chat com seus parceiros de jogo
        </p>
      </header>

      {/* Empty State */}
      <main className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6">
          <MessageCircle className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Nenhuma conversa ainda
        </h2>
        <p className="text-muted-foreground text-center max-w-sm">
          Quando você confirmar um jogo com outro jogador, a conversa aparecerá aqui.
        </p>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default ChatPage;
