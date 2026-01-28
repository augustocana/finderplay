import { useState, useEffect, useMemo } from "react";
import { getSupabaseClient } from "@/lib/supabaseWithAuth";
import { useAnonymousUser } from "./useAnonymousUser";
import { Json } from "@/integrations/supabase/types";
import { profileSchema, validateData } from "@/lib/validationSchemas";

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

  // Create supabase client with anonymous user header
  const supabase = useMemo(() => getSupabaseClient(), []);

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
        if (import.meta.env.DEV) {
          console.error("Error fetching profile:", error);
        }
      } else {
        setProfile(data as AnonymousProfile | null);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error fetching profile:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData: Partial<AnonymousProfile>) => {
    if (!anonymousUserId) return { error: new Error("No anonymous user ID") };

    // Validate input data
    const validationResult = validateData(profileSchema, {
      name: profileData.name || "",
      city: profileData.city || "",
      neighborhood: profileData.neighborhood || "",
      years_playing: profileData.years_playing,
      skill_level: profileData.skill_level || 3,
      frequency: profileData.frequency || "casual",
      dominant_hand: profileData.dominant_hand || "direita",
      max_travel_radius: profileData.max_travel_radius || 10,
      availability: profileData.availability,
    });

    if (!validationResult.success) {
      const errorResult = validationResult as { success: false; errors: string[] };
      return { error: new Error(errorResult.errors.join(", ")) };
    }

    const validatedData = validationResult.data;

    // Get fresh client to ensure header is current
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from("profiles")
      .insert({
        anonymous_user_id: anonymousUserId,
        name: validationResult.data.name,
        dominant_hand: validationResult.data.dominant_hand,
        frequency: validationResult.data.frequency,
        years_playing: validationResult.data.years_playing || 0,
        skill_level: validationResult.data.skill_level,
        city: validationResult.data.city,
        neighborhood: validationResult.data.neighborhood,
        max_travel_radius: validationResult.data.max_travel_radius || 10,
        availability: validationResult.data.availability || [],
      })
      .select()
      .single();

    if (error) {
      if (import.meta.env.DEV) {
        console.error("Error creating profile:", error);
      }
      return { error: new Error("Unable to create profile. Please try again.") };
    }

    setProfile(data as AnonymousProfile);
    return { data, error: null };
  };

  const updateProfile = async (profileData: Partial<AnonymousProfile>) => {
    if (!anonymousUserId || !profile) return { error: new Error("No profile to update") };

    // Get fresh client to ensure header is current
    const client = getSupabaseClient();

    const { data, error } = await client
      .from("profiles")
      .update(profileData)
      .eq("id", profile.id)
      .select()
      .single();

    if (error) {
      if (import.meta.env.DEV) {
        console.error("Error updating profile:", error);
      }
      return { error: new Error("Unable to update profile. Please try again.") };
    }

    setProfile(data as AnonymousProfile);
    return { data, error: null };
  };

  return { profile, loading: loading || userLoading, fetchProfile, createProfile, updateProfile, anonymousUserId };
};
