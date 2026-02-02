import { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDirectMessages } from "@/hooks/useDirectMessages";
import { useSimpleUser } from "@/hooks/useSimpleUser";

interface DirectChatModalProps {
  gameId: string;
  creatorId: string;
  creatorName: string;
  trigger?: React.ReactNode;
}

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const DirectChatModal = ({ gameId, creatorId, creatorName, trigger }: DirectChatModalProps) => {
  const { user } = useSimpleUser();
  const { getConversationWith, sendDirectMessage, refreshMessages } = useDirectMessages(gameId);
  const [open, setOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<ReturnType<typeof getConversationWith>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Atualizar mensagens quando modal abre ou a cada 3s
  useEffect(() => {
    if (open) {
      const updateMessages = () => {
        setMessages(getConversationWith(creatorId));
      };
      updateMessages();
      const interval = setInterval(updateMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [open, creatorId, getConversationWith]);

  // Scroll para o final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || newMessage.length > 500) return;

    const success = sendDirectMessage(newMessage.trim(), creatorId, creatorName);
    if (success) {
      setNewMessage("");
      setMessages(getConversationWith(creatorId));
    }
  };

  if (!user || user.id === creatorId) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            Falar com organizador
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Chat com {creatorName}
          </DialogTitle>
        </DialogHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[300px] bg-secondary/30 rounded-lg">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p className="text-sm">Nenhuma mensagem ainda.</p>
              <p className="text-xs mt-1">Tire suas dúvidas sobre o jogo!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.senderId === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      isOwn
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-background text-foreground rounded-bl-sm border"
                    }`}
                  >
                    <p className="text-sm break-words">{msg.content}</p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex gap-2 pt-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="input-field flex-1"
            maxLength={500}
          />
          <Button
            type="submit"
            variant="tennis"
            size="icon"
            disabled={!newMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
