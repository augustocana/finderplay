import { useState, useEffect, useCallback } from "react";
import { ChatMessage } from "@/types/game";
import { useSimpleUser } from "./useSimpleUser";

const MESSAGES_KEY = "play_finder_messages";

export const useChat = (gameId: string) => {
  const { user } = useSimpleUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar mensagens do localStorage
  const loadMessages = useCallback(() => {
    const stored = localStorage.getItem(MESSAGES_KEY);
    if (stored) {
      try {
        const allMessages: ChatMessage[] = JSON.parse(stored);
        const gameMessages = allMessages.filter(m => m.gameId === gameId);
        setMessages(gameMessages.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ));
      } catch {
        setMessages([]);
      }
    }
    setIsLoading(false);
  }, [gameId]);

  useEffect(() => {
    loadMessages();
    
    // Atualizar mensagens a cada 3 segundos (polling simples)
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  // Enviar mensagem
  const sendMessage = (content: string) => {
    if (!user || !content.trim()) return false;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      gameId,
      senderId: user.id,
      senderName: user.name,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    // Carregar todas as mensagens existentes
    const stored = localStorage.getItem(MESSAGES_KEY);
    let allMessages: ChatMessage[] = [];
    if (stored) {
      try {
        allMessages = JSON.parse(stored);
      } catch {
        allMessages = [];
      }
    }

    // Adicionar nova mensagem
    allMessages.push(newMessage);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages));
    
    // Atualizar estado local
    setMessages(prev => [...prev, newMessage]);
    
    return true;
  };

  return {
    messages,
    isLoading,
    sendMessage,
    refreshMessages: loadMessages,
  };
};
