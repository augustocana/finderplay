export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      game_invites: {
        Row: {
          city: string
          court_address: string | null
          court_name: string | null
          created_at: string | null
          creator_id: string
          date: string
          desired_level: number
          game_type: string
          id: string
          level_range_max: number | null
          level_range_min: number | null
          matched_player_id: string | null
          max_radius: number | null
          neighborhood: string
          notes: string | null
          status: string
          time_slot: string
          updated_at: string | null
        }
        Insert: {
          city: string
          court_address?: string | null
          court_name?: string | null
          created_at?: string | null
          creator_id: string
          date: string
          desired_level: number
          game_type?: string
          id?: string
          level_range_max?: number | null
          level_range_min?: number | null
          matched_player_id?: string | null
          max_radius?: number | null
          neighborhood: string
          notes?: string | null
          status?: string
          time_slot: string
          updated_at?: string | null
        }
        Update: {
          city?: string
          court_address?: string | null
          court_name?: string | null
          created_at?: string | null
          creator_id?: string
          date?: string
          desired_level?: number
          game_type?: string
          id?: string
          level_range_max?: number | null
          level_range_min?: number | null
          matched_player_id?: string | null
          max_radius?: number | null
          neighborhood?: string
          notes?: string | null
          status?: string
          time_slot?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_invites_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_invites_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_invites_matched_player_id_fkey"
            columns: ["matched_player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_invites_matched_player_id_fkey"
            columns: ["matched_player_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      match_requests: {
        Row: {
          created_at: string | null
          id: string
          invite_id: string
          message: string | null
          requester_id: string
          status: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          invite_id: string
          message?: string | null
          requester_id: string
          status?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          invite_id?: string
          message?: string | null
          requester_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_requests_invite_id_fkey"
            columns: ["invite_id"]
            isOneToOne: false
            referencedRelation: "game_invites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          invite_id: string | null
          read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          invite_id?: string | null
          read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          invite_id?: string | null
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_invite_id_fkey"
            columns: ["invite_id"]
            isOneToOne: false
            referencedRelation: "game_invites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          availability: Json | null
          avatar_url: string | null
          average_rating: number | null
          city: string
          created_at: string | null
          dominant_hand: string
          frequency: string
          games_played: number | null
          gender: string | null
          has_taken_lessons: boolean | null
          id: string
          max_travel_radius: number | null
          name: string
          neighborhood: string
          reliability: number | null
          skill_level: number
          tournaments: number | null
          updated_at: string | null
          user_id: string
          win_rate: number | null
          years_playing: number | null
        }
        Insert: {
          age?: number | null
          availability?: Json | null
          avatar_url?: string | null
          average_rating?: number | null
          city: string
          created_at?: string | null
          dominant_hand?: string
          frequency?: string
          games_played?: number | null
          gender?: string | null
          has_taken_lessons?: boolean | null
          id?: string
          max_travel_radius?: number | null
          name: string
          neighborhood: string
          reliability?: number | null
          skill_level?: number
          tournaments?: number | null
          updated_at?: string | null
          user_id: string
          win_rate?: number | null
          years_playing?: number | null
        }
        Update: {
          age?: number | null
          availability?: Json | null
          avatar_url?: string | null
          average_rating?: number | null
          city?: string
          created_at?: string | null
          dominant_hand?: string
          frequency?: string
          games_played?: number | null
          gender?: string | null
          has_taken_lessons?: boolean | null
          id?: string
          max_travel_radius?: number | null
          name?: string
          neighborhood?: string
          reliability?: number | null
          skill_level?: number
          tournaments?: number | null
          updated_at?: string | null
          user_id?: string
          win_rate?: number | null
          years_playing?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      profiles_public: {
        Row: {
          availability: Json | null
          avatar_url: string | null
          average_rating: number | null
          city: string | null
          dominant_hand: string | null
          frequency: string | null
          games_played: number | null
          id: string | null
          name: string | null
          reliability: number | null
          skill_level: number | null
          win_rate: number | null
          years_playing: number | null
        }
        Insert: {
          availability?: Json | null
          avatar_url?: string | null
          average_rating?: number | null
          city?: string | null
          dominant_hand?: string | null
          frequency?: string | null
          games_played?: number | null
          id?: string | null
          name?: string | null
          reliability?: number | null
          skill_level?: number | null
          win_rate?: number | null
          years_playing?: number | null
        }
        Update: {
          availability?: Json | null
          avatar_url?: string | null
          average_rating?: number | null
          city?: string | null
          dominant_hand?: string | null
          frequency?: string | null
          games_played?: number | null
          id?: string | null
          name?: string | null
          reliability?: number | null
          skill_level?: number | null
          win_rate?: number | null
          years_playing?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
