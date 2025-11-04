import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSupabase, useSupabaseAuth } from '../SupabaseProvider';
import type { PostgrestError, User } from '@supabase/supabase-js';

export type PuzzleStatus = 'not_started' | 'in_progress' | 'completed';
export type PuzzleOutcome = 'win' | 'loss';

export interface Profile {
  id: string;
  games_played: number | null;
  wins: number | null;
  losses: number | null;
  current_streak: number | null;
  longest_streak: number | null;
  updated_at: string | null;
  current_puzzle_id: string | null;
  current_puzzle_status: PuzzleStatus | null;
  current_puzzle_date: string | null;
  current_puzzle_started_at: string | null;
  current_puzzle_completed_at: string | null;
  current_puzzle_outcome: PuzzleOutcome | null;
  current_puzzle_progress: unknown | null;
  current_puzzle_lives: number | null;
  current_puzzle_elapsed_seconds: number | null;
  total_completed_time_seconds: number | null;
  total_completed_lives: number | null;
  total_completed_games: number | null;
}

const buildProfileQueryKey = (userId: string | undefined) => ['profile', userId ?? null] as const;

const buildInsertPayload = (user: User | null): Record<string, unknown> => {
  const metadata = (user?.user_metadata ?? {}) as Record<string, unknown>;

  return {
    id: user?.id,
  };
};

export const useProfileQuery = () => {
  const supabase = useSupabase();
  const { user } = useSupabaseAuth();

  return useQuery<Profile | null, PostgrestError>({
    queryKey: buildProfileQueryKey(user?.id),
    enabled: Boolean(user),
    staleTime: 30_000,
    queryFn: async () => {
      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        return data as Profile;
      }

      const insertPayload = buildInsertPayload(user);

      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert([insertPayload])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      return insertData as Profile;
    },
  });
};

interface RecordGameStartVariables {
  puzzleId: string;
  initialLives?: number | null;
  elapsedSeconds?: number | null;
}

export const useRecordGameStart = () => {
  const supabase = useSupabase();
  const { user } = useSupabaseAuth();
  const queryClient = useQueryClient();

  return useMutation<Profile, unknown, RecordGameStartVariables>({
    mutationFn: async ({ puzzleId, initialLives = null, elapsedSeconds = null }) => {
      if (!user) {
        throw new Error('User must be signed in to record a game start.');
      }

      if (!puzzleId) {
        throw new Error('Missing puzzle identifier.');
      }

      const profileCacheKey = buildProfileQueryKey(user.id);
      const cachedProfile = queryClient.getQueryData<Profile | null>(profileCacheKey);

      let referenceProfile = cachedProfile;

      if (!referenceProfile) {
        const { data: fetchedProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        referenceProfile = fetchedProfile as Profile;
      }

      const today = new Date().toISOString().split('T')[0];

      const isSamePuzzle =
        referenceProfile?.current_puzzle_id === puzzleId &&
        referenceProfile?.current_puzzle_date === today;

      const isNewPuzzle = !isSamePuzzle || referenceProfile?.current_puzzle_status === 'completed';

      const nextGamesPlayed =
        (referenceProfile?.games_played ?? 0) + (isNewPuzzle ? 1 : 0);

      const { data, error } = await supabase
        .from('profiles')
        .update({
          games_played: nextGamesPlayed,
          current_puzzle_id: puzzleId,
          current_puzzle_status: 'in_progress',
          current_puzzle_date: today,
          current_puzzle_started_at: isNewPuzzle ? new Date().toISOString() : referenceProfile?.current_puzzle_started_at,
          current_puzzle_completed_at: isNewPuzzle ? null : referenceProfile?.current_puzzle_completed_at,
          current_puzzle_outcome: isNewPuzzle ? null : referenceProfile?.current_puzzle_outcome,
          current_puzzle_progress: isNewPuzzle ? null : referenceProfile?.current_puzzle_progress,
          current_puzzle_lives:
            isNewPuzzle
              ? initialLives
              : (typeof initialLives === 'number' ? initialLives : referenceProfile?.current_puzzle_lives),
          current_puzzle_elapsed_seconds:
            isNewPuzzle
              ? elapsedSeconds ?? 0
              : (typeof elapsedSeconds === 'number'
                  ? elapsedSeconds
                  : referenceProfile?.current_puzzle_elapsed_seconds ?? 0),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as Profile;
    },
    onSuccess: (data) => {
      if (!user) {
        return;
      }

      queryClient.setQueryData<Profile | null>(buildProfileQueryKey(user.id), data);
    },
    onError: (_error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to record game start');
    },
  });
};

interface SaveCurrentPuzzleProgressVariables {
  puzzleId: string;
  progress: unknown;
  completed?: boolean;
  lives?: number | null;
  elapsedSeconds?: number | null;
}

export const useSaveCurrentPuzzleProgress = () => {
  const supabase = useSupabase();
  const { user } = useSupabaseAuth();
  const queryClient = useQueryClient();

  return useMutation<Profile, unknown, SaveCurrentPuzzleProgressVariables>({
    mutationFn: async ({ puzzleId, progress, completed = false, lives = null, elapsedSeconds = null }) => {
      if (!user) {
        throw new Error('User must be signed in to save progress.');
      }

      if (!puzzleId) {
        throw new Error('Missing puzzle identifier.');
      }

      const profileCacheKey = buildProfileQueryKey(user.id);
      const cachedProfile = queryClient.getQueryData<Profile | null>(profileCacheKey);

      let referenceProfile = cachedProfile;

      if (!referenceProfile) {
        const { data: fetchedProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        referenceProfile = fetchedProfile as Profile;
      }

      const today = new Date().toISOString().split('T')[0];
      const isNewPuzzle =
        referenceProfile?.current_puzzle_id !== puzzleId ||
        referenceProfile?.current_puzzle_date !== today;

      const updatePayload: Record<string, unknown> = {
        current_puzzle_id: puzzleId,
        current_puzzle_date: today,
        current_puzzle_progress: progress ?? null,
        current_puzzle_status: completed ? 'completed' : 'in_progress',
        updated_at: new Date().toISOString(),
        current_puzzle_lives:
          typeof lives === 'number'
            ? lives
            : referenceProfile?.current_puzzle_lives ?? null,
        current_puzzle_elapsed_seconds:
          typeof elapsedSeconds === 'number'
            ? elapsedSeconds
            : referenceProfile?.current_puzzle_elapsed_seconds ?? 0,
      };

      if (!referenceProfile?.current_puzzle_started_at || isNewPuzzle) {
        updatePayload.current_puzzle_started_at = new Date().toISOString();
      }

      if (isNewPuzzle && !completed) {
        updatePayload.current_puzzle_completed_at = null;
        updatePayload.current_puzzle_outcome = null;
      }

      if (completed) {
        updatePayload.current_puzzle_completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as Profile;
    },
    onSuccess: (data) => {
      if (!user) {
        return;
      }

      queryClient.setQueryData<Profile | null>(buildProfileQueryKey(user.id), data);
    },
    onError: (_error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to save puzzle progress');
    },
  });
};

interface CompletePuzzleVariables {
  puzzleId: string;
  outcome: PuzzleOutcome;
  progress: unknown;
  livesRemaining: number;
  elapsedSeconds: number;
}

export const useCompletePuzzle = () => {
  const supabase = useSupabase();
  const { user } = useSupabaseAuth();
  const queryClient = useQueryClient();

  return useMutation<Profile, unknown, CompletePuzzleVariables>({
    mutationFn: async ({ puzzleId, outcome, progress, livesRemaining, elapsedSeconds }) => {
      if (!user) {
        throw new Error('User must be signed in to complete a puzzle.');
      }

      if (!puzzleId) {
        throw new Error('Missing puzzle identifier.');
      }

      const profileCacheKey = buildProfileQueryKey(user.id);
      const cachedProfile = queryClient.getQueryData<Profile | null>(profileCacheKey);

      let referenceProfile = cachedProfile;

      if (!referenceProfile) {
        const { data: fetchedProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        referenceProfile = fetchedProfile as Profile;
      }

      const today = new Date().toISOString().split('T')[0];
      const isSamePuzzle =
        referenceProfile?.current_puzzle_id === puzzleId &&
        referenceProfile?.current_puzzle_date === today;

      const alreadyCompletedSamePuzzle = Boolean(
        isSamePuzzle && referenceProfile?.current_puzzle_status === 'completed'
      );

      const sanitizedLives = Math.max(0, livesRemaining ?? 0);
      const sanitizedElapsedSeconds = Math.max(0, elapsedSeconds ?? 0);

      const prevWins = referenceProfile?.wins ?? 0;
      const prevLosses = referenceProfile?.losses ?? 0;
      const prevStreak = referenceProfile?.current_streak ?? 0;
      const prevLongest = referenceProfile?.longest_streak ?? 0;
      const prevTotalCompletedTime = referenceProfile?.total_completed_time_seconds ?? 0;
      const prevTotalCompletedLives = referenceProfile?.total_completed_lives ?? 0;
      const prevTotalCompletedGames = referenceProfile?.total_completed_games ?? 0;

      let nextWins = prevWins;
      let nextLosses = prevLosses;
      let nextStreak = prevStreak;
      let nextLongest = prevLongest;
      let nextTotalCompletedTime = prevTotalCompletedTime;
      let nextTotalCompletedLives = prevTotalCompletedLives;
      let nextTotalCompletedGames = prevTotalCompletedGames;

      if (!alreadyCompletedSamePuzzle) {
        if (outcome === 'win') {
          nextWins += 1;
          nextStreak = prevStreak + 1;
          nextLongest = Math.max(prevLongest, nextStreak);
        } else {
          nextLosses += 1;
          nextStreak = 0;
        }
        if (outcome === 'win') {
          nextTotalCompletedTime += sanitizedElapsedSeconds;
          nextTotalCompletedLives += sanitizedLives;
          nextTotalCompletedGames += 1;
        }
      } else if (referenceProfile?.current_puzzle_outcome !== outcome) {
        // If outcome flips (unlikely), adjust counts accordingly.
        if (outcome === 'win') {
          nextWins = prevWins + 1;
          nextLosses = Math.max(0, prevLosses - 1);
          nextStreak = prevStreak + 1;
          nextLongest = Math.max(prevLongest, nextStreak);
        } else {
          nextLosses = prevLosses + 1;
          nextWins = Math.max(0, prevWins - 1);
          nextStreak = 0;
        }
        // Do not adjust totals when flipping outcome; we assume the original completion stats remain authoritative.
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          wins: nextWins,
          losses: nextLosses,
          current_streak: nextStreak,
          longest_streak: nextLongest,
          current_puzzle_id: puzzleId,
          current_puzzle_date: today,
          current_puzzle_status: 'completed',
          current_puzzle_outcome: outcome,
          current_puzzle_completed_at: new Date().toISOString(),
          current_puzzle_progress: progress ?? null,
          current_puzzle_lives: sanitizedLives,
          current_puzzle_elapsed_seconds: sanitizedElapsedSeconds,
          total_completed_time_seconds: nextTotalCompletedTime,
          total_completed_lives: nextTotalCompletedLives,
          total_completed_games: nextTotalCompletedGames,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as Profile;
    },
    onSuccess: (data) => {
      if (!user) {
        return;
      }

      queryClient.setQueryData<Profile | null>(buildProfileQueryKey(user.id), data);
    },
    onError: (_error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to complete puzzle');
    },
  });
};

export const useResetCurrentPuzzle = () => {
  const supabase = useSupabase();
  const { user } = useSupabaseAuth();
  const queryClient = useQueryClient();

  return useMutation<Profile, unknown, void>({
    mutationFn: async () => {
      if (!user) {
        throw new Error('User must be signed in to reset the puzzle state.');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          current_puzzle_id: null,
          current_puzzle_status: 'not_started',
          current_puzzle_date: null,
          current_puzzle_started_at: null,
          current_puzzle_completed_at: null,
          current_puzzle_outcome: null,
          current_puzzle_progress: null,
          current_puzzle_lives: null,
          current_puzzle_elapsed_seconds: 0,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as Profile;
    },
    onSuccess: (data) => {
      if (!user) {
        return;
      }

      queryClient.setQueryData<Profile | null>(buildProfileQueryKey(user.id), data);
    },
    onError: (_error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to reset puzzle state');
    },
  });
};

export const useProfileHelpers = () => {
  const { data, isPending, isError, error } = useProfileQuery();

  return {
    profile: data,
    profileLoading: isPending,
    profileError: isError ? error : null,
  };
};
