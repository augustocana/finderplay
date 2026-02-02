import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";
import { SimpleUser } from "@/types/game";

const USER_KEY = "play_finder_user";

interface SimpleUserContextType {
  user: SimpleUser | null;
  isLoading: boolean;
  setUserName: (name: string) => void;
  isFirstAccess: boolean;
  isIdentified: boolean;
  requireIdentification: (callback?: () => void) => boolean;
  showIdentificationModal: boolean;
  setShowIdentificationModal: (show: boolean) => void;
  pendingAction: (() => void) | null;
  clearPendingAction: () => void;
}

const SimpleUserContext = createContext<SimpleUserContextType | undefined>(undefined);

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const SimpleUserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstAccess, setIsFirstAccess] = useState(false);
  const [showIdentificationModal, setShowIdentificationModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const isIdentified = !!user?.name;

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsFirstAccess(false);
      } catch {
        setIsFirstAccess(true);
      }
    } else {
      setIsFirstAccess(true);
    }
    
    setIsLoading(false);
  }, []);

  const setUserName = (name: string) => {
    const newUser: SimpleUser = {
      id: user?.id || generateId(),
      name: name.trim(),
    };
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
    setIsFirstAccess(false);
    setShowIdentificationModal(false);
    
    // Execute pending action if exists
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const requireIdentification = useCallback((callback?: () => void): boolean => {
    if (isIdentified) {
      callback?.();
      return true;
    }
    
    if (callback) {
      setPendingAction(() => callback);
    }
    setShowIdentificationModal(true);
    return false;
  }, [isIdentified]);

  const clearPendingAction = useCallback(() => {
    setPendingAction(null);
  }, []);

  return (
    <SimpleUserContext.Provider value={{ 
      user, 
      isLoading, 
      setUserName, 
      isFirstAccess,
      isIdentified,
      requireIdentification,
      showIdentificationModal,
      setShowIdentificationModal,
      pendingAction,
      clearPendingAction
    }}>
      {children}
    </SimpleUserContext.Provider>
  );
};

export const useSimpleUser = () => {
  const context = useContext(SimpleUserContext);
  if (context === undefined) {
    throw new Error("useSimpleUser must be used within a SimpleUserProvider");
  }
  return context;
};
