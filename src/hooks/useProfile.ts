import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PostgrestError } from '@supabase/supabase-js';
import { useSupabase } from '../SupabaseProvider';

/* ============================================================
   Types
============================================================ */

export interface AttemptMetadata {
  puzzleId?: string | null;
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

export interface ProfileStats {
  user_id: string;
  games_played: number;
  wins: number;
  losses: number;
  current_streak: number;
  longest_streak: number;
  total_completed_games: number;
  total_completed_time_seconds: number;
  total_completed_lives: number;
  win_rate: number;
  completion_rate: number;
  updated_at: string;
}

export interface ActiveSession {
  user_id: string;
  current_attempt_id: string | null;
  active_puzzle_id: string | null;
  started_at: string;
  updated_at: string;
  puzzle_attempts: PuzzleAttempt | null;
}

/* ============================================================
   Query Keys
============================================================ */

const PROFILE_QUERY_KEY = ['profile'] as const;
const PROFILE_STATS_QUERY_KEY = ['profile-stats'] as const;
const ACTIVE_SESSION_QUERY_KEY = ['active-session'] as const;

/* ============================================================
   Helpers
============================================================ */

const getCurrentUserId = async (supabase: ReturnType<typeof useSupabase>) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  return user?.id ?? null;
};

/* ============================================================
   Hooks
============================================================ */

export const useProfile = () => {
  const supabase = useSupabase();

  return useQuery<Profile | null, PostgrestError>({
    queryKey: PROFILE_QUERY_KEY,
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

export const useProfileStats = () => {
  const supabase = useSupabase();

  return useQuery<ProfileStats | null, PostgrestError>({
    queryKey: PROFILE_STATS_QUERY_KEY,
    queryFn: async () => {
      const userId = await getCurrentUserId(supabase);
      if (!userId) return null;

      const { data, error } = await supabase
        .from('profile_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data ?? null;
    },
  });
};

export const useActiveSession = () => {
  const supabase = useSupabase();

  return useQuery<ActiveSession | null, PostgrestError>({
    queryKey: ACTIVE_SESSION_QUERY_KEY,
    queryFn: async () => {
      const userId = await getCurrentUserId(supabase);
      if (!userId) return null;

      const { data, error } = await supabase
        .from('profile_sessions')
        .select('*, puzzle_attempts(*)')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data ?? null;
    },
  });
};

export const useStartPuzzle = () => {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation<PuzzleAttempt, PostgrestError, string>({
    mutationFn: async (puzzleId) => {
      const userId = await getCurrentUserId(supabase);
      if (!userId) throw new Error('Not signed in');

      const today = new Date().toISOString().slice(0, 10);

      const { data: existingAttempt, error: existingError } = await supabase
        .from('puzzle_attempts')
        .select('*')
        .eq('user_id', userId)
        .eq('puzzle_id', puzzleId)
        .eq('attempt_date', today)
        .maybeSingle();

      if (existingError) throw existingError;
      if (existingAttempt) {
        return existingAttempt as PuzzleAttempt;
      }

      const payload = {
        user_id: userId,
        puzzle_id: puzzleId,
        attempt_date: today,
        status: 'in_progress' as const,
      };

      const { data, error } = await supabase
        .from('puzzle_attempts')
        .insert([payload])
        .select()
        .single();

      if (error) {
        if ('code' in error && error.code === '23505') {
          const { data: conflictAttempt, error: conflictError } = await supabase
            .from('puzzle_attempts')
            .select('*')
            .eq('user_id', userId)
            .eq('puzzle_id', puzzleId)
            .eq('attempt_date', today)
            .single();

          if (conflictError) throw conflictError;
          return conflictAttempt as PuzzleAttempt;
        }
        throw error;
      }
      return data as PuzzleAttempt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVE_SESSION_QUERY_KEY });
    },
  });
};

interface SaveProgressInput {
  attemptId: string;
  progress: AttemptMetadata | null;
}

export const useSaveProgress = () => {
  const supabase = useSupabase();

  return useMutation<PuzzleAttempt, PostgrestError, SaveProgressInput>({
    mutationFn: async ({ attemptId, progress }) => {
      const { data, error } = await supabase
        .from('puzzle_attempts')
        .update({ metadata: progress })
        .eq('id', attemptId)
        .select()
        .single();

      if (error) throw error;
      return data as PuzzleAttempt;
    },
  });
};

interface FinishPuzzleInput {
  attemptId: string;
  wasSuccessful: boolean;
  livesRemaining?: number;
  mistakesMade?: number;
}

export const useFinishPuzzle = () => {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation<PuzzleAttempt, PostgrestError, FinishPuzzleInput>({
    mutationFn: async ({
      attemptId,
      wasSuccessful,
      livesRemaining = 0,
      mistakesMade = 0,
    }) => {
      const { data, error } = await supabase
        .from('puzzle_attempts')
        .update({
          completed_at: new Date().toISOString(),
          was_successful: wasSuccessful,
          lives_remaining: livesRemaining,
          mistakes_made: mistakesMade,
          status: 'completed',
        })
        .eq('id', attemptId)
        .select()
        .single();

      if (error) throw error;
      return data as PuzzleAttempt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVE_SESSION_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROFILE_STATS_QUERY_KEY });
    },
  });
};

export const useResumePuzzle = (attemptId: string | null) => {
  const supabase = useSupabase();

  return useQuery<PuzzleAttempt | null, PostgrestError>({
    queryKey: ['resume', attemptId],
    queryFn: async () => {
      if (!attemptId) {
        return null;
      }

      const { data, error } = await supabase
        .from('puzzle_attempts')
        .select('*')
        .eq('id', attemptId)
        .maybeSingle();

      if (error) throw error;
      return (data ?? null) as PuzzleAttempt | null;
    },
  });
};
