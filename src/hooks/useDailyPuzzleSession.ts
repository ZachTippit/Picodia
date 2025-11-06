import { useCallback } from 'react';
import { useSupabase } from '../SupabaseProvider';
import { useStartPuzzle } from './useProfile';
import type { PuzzleAttempt } from './useProfile';

export type DailyPuzzleState = 'start' | 'resume' | 'results' | 'unknown';

export interface DailyPuzzleSessionResult {
  state: DailyPuzzleState;
  attempt: PuzzleAttempt;
}

export const useDailyPuzzleSession = () => {
  const supabase = useSupabase();
  const startPuzzle = useStartPuzzle();

  const getOrCreateDailyAttempt = useCallback(
    async (puzzleId: string): Promise<DailyPuzzleSessionResult> => {
      if (!puzzleId) {
        throw new Error('Missing puzzle identifier');
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error('No authenticated user');
      }

      const today = new Date().toISOString().slice(0, 10);

      const { data: todaysAttempt, error } = await supabase
        .from('puzzle_attempts')
        .select('*')
        .eq('user_id', user.id)
        .eq('puzzle_id', puzzleId)
        .eq('attempt_date', today)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!todaysAttempt) {
        const newAttempt = await startPuzzle.mutateAsync(puzzleId);
        return { state: 'start', attempt: newAttempt as PuzzleAttempt };
      }

      if (todaysAttempt.status === 'in_progress') {
        return { state: 'resume', attempt: todaysAttempt as PuzzleAttempt };
      }

      if (todaysAttempt.status === 'completed') {
        return { state: 'results', attempt: todaysAttempt as PuzzleAttempt };
      }

      return { state: 'unknown', attempt: todaysAttempt as PuzzleAttempt };
    },
    [startPuzzle, supabase]
  );

  return { getOrCreateDailyAttempt };
};
