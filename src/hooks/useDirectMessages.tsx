import { useState, useEffect, useCallback } from "react";
import { DirectMessage } from "@/types/game";
import { useSimpleUser } from "./useSimpleUser";

const DM_KEY = "play_finder_direct_messages";

export const useDirectMessages = (gameId: string) => {
  const { user } = useSimpleUser();
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar mensagens do localStorage
  const loadMessages = useCallback(() => {
    const stored = localStorage.getItem(DM_KEY);
    if (stored) {
      try {
        const allMessages: DirectMessage[] = JSON.parse(stored);
        // Filtrar mensagens deste jogo onde o usuário é sender ou receiver
        const gameMessages = allMessages.filter(
          m => m.gameId === gameId && 
          user && (m.senderId === user.id || m.receiverId === user.id)
        );
        setMessages(gameMessages.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ));
      } catch {
        setMessages([]);
      }
    }
    setIsLoading(false);
  }, [gameId, user]);

  useEffect(() => {
    loadMessages();
    
    // Polling simples a cada 3 segundos
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  // Enviar mensagem direta
  const sendDirectMessage = (content: string, receiverId: string, receiverName: string) => {
    if (!user || !content.trim()) return false;

    const newMessage: DirectMessage = {
      id: `dm-${Date.now()}`,
      gameId,
      senderId: user.id,
      senderName: user.name,
      receiverId,
      receiverName,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    // Carregar todas as mensagens existentes
    const stored = localStorage.getItem(DM_KEY);
    let allMessages: DirectMessage[] = [];
    if (stored) {
      try {
        allMessages = JSON.parse(stored);
      } catch {
        allMessages = [];
      }
    }

    // Adicionar nova mensagem
    allMessages.push(newMessage);
    localStorage.setItem(DM_KEY, JSON.stringify(allMessages));
    
    // Atualizar estado local
    setMessages(prev => [...prev, newMessage]);
    
    return true;
  };

  // Obter conversas únicas (para o criador ver quem está chamando)
  const getUniqueConversations = (creatorId: string) => {
    const stored = localStorage.getItem(DM_KEY);
    if (!stored) return [];

    try {
      const allMessages: DirectMessage[] = JSON.parse(stored);
      const gameMessages = allMessages.filter(m => m.gameId === gameId);
      
      // Agrupar por usuário (que não seja o criador)
      const conversationMap = new Map<string, { 
        oderId: string; 
        userName: string; 
        lastMessage: string; 
        lastMessageTime: string;
        unreadCount: number;
      }>();

      gameMessages.forEach(msg => {
        const otherId = msg.senderId === creatorId ? msg.receiverId : msg.senderId;
        const otherName = msg.senderId === creatorId ? msg.receiverName : msg.senderName;
        
        if (otherId !== creatorId) {
          const existing = conversationMap.get(otherId);
          if (!existing || new Date(msg.createdAt) > new Date(existing.lastMessageTime)) {
            conversationMap.set(otherId, {
              oderId: otherId,
              userName: otherName,
              lastMessage: msg.content,
              lastMessageTime: msg.createdAt,
              unreadCount: 0, // Simplificado para MVP
            });
          }
        }
      });

      return Array.from(conversationMap.values());
    } catch {
      return [];
    }
  };

  // Obter mensagens entre dois usuários específicos
  const getConversationWith = (otherUserId: string) => {
    const stored = localStorage.getItem(DM_KEY);
    if (!stored || !user) return [];

    try {
      const allMessages: DirectMessage[] = JSON.parse(stored);
      return allMessages
        .filter(m => 
          m.gameId === gameId && 
          ((m.senderId === user.id && m.receiverId === otherUserId) ||
           (m.senderId === otherUserId && m.receiverId === user.id))
        )
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } catch {
      return [];
    }
  };

  return {
    messages,
    isLoading,
    sendDirectMessage,
    refreshMessages: loadMessages,
    getUniqueConversations,
    getConversationWith,
  };
};
