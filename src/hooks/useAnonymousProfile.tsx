import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAnonymousUser } from "./useAnonymousUser";
import { Json } from "@/integrations/supabase/types";

export interface AnonymousProfile {
  id: string;
  anonymous_user_id: string;
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

export const useAnonymousProfile = () => {
  const { anonymousUserId, isLoading: userLoading } = useAnonymousUser();
  const [profile, setProfile] = useState<AnonymousProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && anonymousUserId) {
      fetchProfile();
    } else if (!userLoading && !anonymousUserId) {
      setLoading(false);
    }
  }, [anonymousUserId, userLoading]);

  const fetchProfile = async () => {
    if (!anonymousUserId) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("anonymous_user_id", anonymousUserId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data as AnonymousProfile | null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData: Partial<AnonymousProfile>) => {
    if (!anonymousUserId) return { error: new Error("No anonymous user ID") };

    const { data, error } = await supabase
      .from("profiles")
      .insert({
        anonymous_user_id: anonymousUserId,
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

    setProfile(data as AnonymousProfile);
    return { data, error: null };
  };

  const updateProfile = async (profileData: Partial<AnonymousProfile>) => {
    if (!anonymousUserId || !profile) return { error: new Error("No profile to update") };

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

    setProfile(data as AnonymousProfile);
    return { data, error: null };
  };

  return { profile, loading: loading || userLoading, fetchProfile, createProfile, updateProfile, anonymousUserId };
};
