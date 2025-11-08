import { useQuery } from '@tanstack/react-query';
import type { PostgrestError } from '@supabase/supabase-js';
import { useSupabase } from '../SupabaseProvider';
import { getCurrentUserId } from '../utils/hookHelper';

export interface AttemptMetadata {
  puzzleId?: number | null;
  progress?: unknown;
  lives?: number | null;
  elapsedSeconds?: number | null;
  completed?: boolean;
  updatedAt?: string;
}

export interface PuzzleAttempt {
  id: string;
  user_id: string;
  puzzle_id: string;
  attempt_date: string;
  started_at: string;
  completed_at: string | null;
  was_successful: boolean | null;
  lives_remaining: number | null;
  mistakes_made: number | null;
  status: 'in_progress' | 'completed' | 'voided';
  metadata: AttemptMetadata | null;
  duration_seconds: number | null;
}

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const supabase = useSupabase();

  return useQuery<Profile | null, PostgrestError>({
    queryKey: ["profile"],
    queryFn: async () => {
      const userId = await getCurrentUserId(supabase);
      if (!userId) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data as Profile;
    },
  });
};