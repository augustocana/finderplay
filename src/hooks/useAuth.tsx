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
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, profileData: { name: string; skill_level: number; city: string; neighborhood: string }) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error: Error | null }>;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  pendingAction: (() => void) | null;
  requireAuth: (callback?: () => void) => boolean;
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

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error };
      }
      
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Sign up with email, password and profile data
  const signUp = async (
    email: string, 
    password: string, 
    profileData: { name: string; skill_level: number; city: string; neighborhood: string }
  ) => {
    try {
      // Validate input
      if (!profileData.name.trim() || profileData.name.length > 100) {
        return { error: new Error("Nome inválido") };
      }
      if (!profileData.city.trim() || profileData.city.length > 100) {
        return { error: new Error("Cidade inválida") };
      }
      if (!profileData.neighborhood.trim() || profileData.neighborhood.length > 100) {
        return { error: new Error("Bairro inválido") };
      }
      if (profileData.skill_level < 1 || profileData.skill_level > 6) {
        return { error: new Error("Classe inválida") };
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });
      
      if (authError) {
        return { error: authError };
      }

      // If user was created and we have a session, create profile
      if (authData.user && authData.session) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            user_id: authData.user.id,
            name: profileData.name.trim(),
            skill_level: profileData.skill_level,
            city: profileData.city.trim(),
            neighborhood: profileData.neighborhood.trim(),
            dominant_hand: "direita",
            frequency: "casual",
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          return { error: profileError };
        }

        // Fetch the new profile
        const newProfile = await fetchProfile(authData.user.id);
        setProfile(newProfile);
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

  // Reset password - send email
  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      if (error) {
        return { error };
      }
      
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Update password (after clicking reset link)
  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        return { error };
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
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
      updateProfile,
      showAuthModal,
      setShowAuthModal,
      pendingAction,
      requireAuth,
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
