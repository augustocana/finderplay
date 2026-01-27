import { useState, useEffect, createContext, useContext, ReactNode } from "react";

const ANONYMOUS_USER_KEY = "play_finder_anonymous_user_id";

interface AnonymousUserContextType {
  anonymousUserId: string;
  isLoading: boolean;
}

const AnonymousUserContext = createContext<AnonymousUserContextType | undefined>(undefined);

function generateUUID(): string {
  // Use crypto.randomUUID if available, otherwise fallback
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const AnonymousUserProvider = ({ children }: { children: ReactNode }) => {
  const [anonymousUserId, setAnonymousUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we already have an anonymous user ID in localStorage
    let storedId = localStorage.getItem(ANONYMOUS_USER_KEY);
    
    if (!storedId) {
      // Generate a new anonymous user ID
      storedId = generateUUID();
      localStorage.setItem(ANONYMOUS_USER_KEY, storedId);
    }
    
    setAnonymousUserId(storedId);
    setIsLoading(false);
  }, []);

  return (
    <AnonymousUserContext.Provider value={{ anonymousUserId, isLoading }}>
      {children}
    </AnonymousUserContext.Provider>
  );
};

export const useAnonymousUser = () => {
  const context = useContext(AnonymousUserContext);
  if (context === undefined) {
    throw new Error("useAnonymousUser must be used within an AnonymousUserProvider");
  }
  return context;
};
