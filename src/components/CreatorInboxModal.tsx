import { useState, useRef, useEffect } from "react";
import { Send, Inbox, ArrowLeft } from "lucide-react";
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
import { DirectMessage } from "@/types/game";

interface CreatorInboxModalProps {
  gameId: string;
  trigger?: React.ReactNode;
}

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
};

export const CreatorInboxModal = ({ gameId, trigger }: CreatorInboxModalProps) => {
  const { user } = useSimpleUser();
  const { getUniqueConversations, getConversationWith, sendDirectMessage } = useDirectMessages(gameId);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);
  const [conversations, setConversations] = useState<ReturnType<typeof getUniqueConversations>>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Atualizar conversas
  useEffect(() => {
    if (open && user) {
      const updateData = () => {
        setConversations(getUniqueConversations(user.id));
        if (selectedUser) {
          setMessages(getConversationWith(selectedUser.id));
        }
      };
      updateData();
      const interval = setInterval(updateData, 3000);
      return () => clearInterval(interval);
    }
  }, [open, user, selectedUser, getUniqueConversations, getConversationWith]);

  // Scroll para o final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || newMessage.length > 500) return;

    const success = sendDirectMessage(newMessage.trim(), selectedUser.id, selectedUser.name);
    if (success) {
      setNewMessage("");
      setMessages(getConversationWith(selectedUser.id));
    }
  };

  const handleSelectConversation = (userId: string, userName: string) => {
    setSelectedUser({ id: userId, name: userName });
    setMessages(getConversationWith(userId));
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) setSelectedUser(null);
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Inbox className="w-4 h-4" />
            Mensagens
            {conversations.length > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {conversations.length}
              </span>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {selectedUser ? (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setSelectedUser(null)}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                Chat com {selectedUser.name}
              </>
            ) : (
              <>
                <Inbox className="w-5 h-5 text-primary" />
                Mensagens recebidas
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {!selectedUser ? (
          // Lista de conversas
          <div className="flex-1 overflow-y-auto space-y-2 min-h-[200px] max-h-[400px]">
            {conversations.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Inbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Nenhuma mensagem ainda.</p>
                <p className="text-xs mt-1">Jogadores interessados entrarão em contato aqui.</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.oderId}
                  onClick={() => handleSelectConversation(conv.oderId, conv.userName)}
                  className="w-full p-3 bg-secondary/50 hover:bg-secondary rounded-lg text-left transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{conv.userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(conv.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {conv.lastMessage}
                  </p>
                </button>
              ))
            )}
          </div>
        ) : (
          // Chat com usuário selecionado
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[300px] bg-secondary/30 rounded-lg">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-sm">Início da conversa</p>
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

            <form onSubmit={handleSend} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Responder..."
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
