import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const ANONYMOUS_USER_KEY = "play_finder_anonymous_user_id";

/**
 * Creates a Supabase client with the x-anonymous-user-id header set.
 * This header is required for RLS policies to work correctly.
 * 
 * Use this function instead of the default supabase client for all 
 * database operations that require ownership validation.
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  const anonymousUserId = localStorage.getItem(ANONYMOUS_USER_KEY) || '';
  
  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'x-anonymous-user-id': anonymousUserId,
      },
    },
  });
}

/**
 * Get the anonymous user ID from localStorage.
 */
export function getAnonymousUserId(): string {
  return localStorage.getItem(ANONYMOUS_USER_KEY) || '';
}
