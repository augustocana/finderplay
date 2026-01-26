import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { Json } from "@/integrations/supabase/types";

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  age: number | null;
  gender: string | null;
  dominant_hand: string;
  frequency: string;
  years_playing: number | null;
  has_taken_lessons: boolean | null;
  tournaments: number | null;
  city: string;
  neighborhood: string;
  max_travel_radius: number;
  availability: Json;
  skill_level: number;
  avatar_url: string | null;
  games_played: number;
  win_rate: number;
  average_rating: number;
  reliability: number;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData: Partial<Profile>) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("profiles")
      .insert({
        user_id: user.id,
        name: profileData.name || "",
        dominant_hand: profileData.dominant_hand || "direita",
        frequency: profileData.frequency || "casual",
        years_playing: profileData.years_playing || 0,
        skill_level: profileData.skill_level || 3,
        city: profileData.city || "",
        neighborhood: profileData.neighborhood || "",
        max_travel_radius: profileData.max_travel_radius || 10,
        availability: profileData.availability || [],
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating profile:", error);
      return { error };
    }

    setProfile(data);
    return { data, error: null };
  };

  const updateProfile = async (profileData: Partial<Profile>) => {
    if (!user || !profile) return { error: new Error("Not authenticated or no profile") };

    const { data, error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", profile.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return { error };
    }

    setProfile(data);
    return { data, error: null };
  };

  return { profile, loading, fetchProfile, createProfile, updateProfile };
};
