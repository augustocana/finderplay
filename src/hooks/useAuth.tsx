import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  name: string;
  skill_level: number;
  city: string;
  neighborhood: string;
  games_played: number;
  average_rating: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithOtp: (email: string) => Promise<{ error: Error | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  createProfile: (data: { name: string; skill_level: number; city: string; neighborhood: string }) => Promise<{ error: Error | null }>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error: Error | null }>;
  requireAuth: (callback?: () => void) => boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  pendingAction: (() => void) | null;
  clearPendingAction: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const { toast } = useToast();

  const isAuthenticated = !!user && !!profile;

  // Fetch profile for authenticated user
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, skill_level, city, neighborhood, games_played, average_rating")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
        return null;
      }
      return data as Profile | null;
    } catch (err) {
      console.error("Error fetching profile:", err);
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile fetch with setTimeout to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id).then(setProfile);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id).then((p) => {
          setProfile(p);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // Send OTP to email (code only, no magic link)
  const signInWithOtp = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // Não passar emailRedirectTo para enviar APENAS código, sem link
          shouldCreateUser: true,
        },
      });
      
      if (error) {
        return { error };
      }
      
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Verify OTP code
  const verifyOtp = async (email: string, token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });
      
      if (error) {
        return { error };
      }
      
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    toast({
      title: "Você saiu",
      description: "Até a próxima!",
    });
  };

  // Create profile for new user
  const createProfile = async (data: { name: string; skill_level: number; city: string; neighborhood: string }) => {
    if (!user) {
      return { error: new Error("Usuário não autenticado") };
    }

    // Validate input
    if (!data.name.trim() || data.name.length > 100) {
      return { error: new Error("Nome inválido") };
    }
    if (!data.city.trim() || data.city.length > 100) {
      return { error: new Error("Cidade inválida") };
    }
    if (!data.neighborhood.trim() || data.neighborhood.length > 100) {
      return { error: new Error("Bairro inválido") };
    }
    if (data.skill_level < 1 || data.skill_level > 6) {
      return { error: new Error("Classe inválida") };
    }

    try {
      const { data: newProfile, error } = await supabase
        .from("profiles")
        .insert({
          user_id: user.id,
          name: data.name.trim(),
          skill_level: data.skill_level,
          city: data.city.trim(),
          neighborhood: data.neighborhood.trim(),
          dominant_hand: "direita",
          frequency: "casual",
        })
        .select("id, name, skill_level, city, neighborhood, games_played, average_rating")
        .single();

      if (error) {
        return { error };
      }

      setProfile(newProfile as Profile);
      setShowAuthModal(false);
      
      // Execute pending action if exists
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
      
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Update existing profile
  const updateProfile = async (data: Partial<Profile>) => {
    if (!user || !profile) {
      return { error: new Error("Usuário não autenticado") };
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("user_id", user.id);

      if (error) {
        return { error };
      }

      setProfile({ ...profile, ...data });
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Require auth - show modal if not authenticated
  const requireAuth = useCallback((callback?: () => void): boolean => {
    if (isAuthenticated) {
      callback?.();
      return true;
    }
    
    if (callback) {
      setPendingAction(() => callback);
    }
    setShowAuthModal(true);
    return false;
  }, [isAuthenticated]);

  const clearPendingAction = useCallback(() => {
    setPendingAction(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      isLoading,
      isAuthenticated,
      signInWithOtp,
      verifyOtp,
      signOut,
      createProfile,
      updateProfile,
      requireAuth,
      showAuthModal,
      setShowAuthModal,
      pendingAction,
      clearPendingAction,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
