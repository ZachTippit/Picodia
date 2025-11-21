import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '../SupabaseProvider';
import { useCurrentPuzzleAttempt } from './useCurrentPuzzleAttempt';

interface UseStartPuzzleOptions {
  enabled?: boolean;
  attemptId?: string | null;
}

/**
 * Marks the current or provided attempt as 'in_progress'.
 * Use with `enabled: isGameStarted` to auto-run when gameplay begins.
 */
export const useStartPuzzle = ({ enabled = false, attemptId }: UseStartPuzzleOptions = {}) => {
  const supabase = useSupabase();
  const { data: currentPuzzleAttempt } = useCurrentPuzzleAttempt();

  const currentPuzzleAttemptId = currentPuzzleAttempt?.id ?? null;

  return useQuery({
    queryKey: ['startPuzzle', attemptId ?? currentPuzzleAttemptId],
    enabled, // <-- only runs when enabled = true
    queryFn: async () => {
      const targetId = attemptId ?? currentPuzzleAttemptId;
      if (!targetId) return null;

      const { data, error } = await supabase
        .from('puzzle_attempts')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString(),
        })
        .eq('id', targetId)
        .select('*')
        .single();

      if (error) {
        console.error('Failed to mark attempt as in_progress:', error);
        throw error;
      }

      return data;
    },
    staleTime: Infinity,
    gcTime: 0,
  });
};