import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '../SupabaseProvider';
import { useCurrentPuzzleAttempt } from './useCurrentPuzzleAttempt';

export const useStartPuzzle = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabase();
  const { data: currentAttempt } = useCurrentPuzzleAttempt();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      const id = currentAttempt?.id;
      if (!id) return;

      const { data, error } = await supabase
        .from('puzzle_attempts')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentPuzzleAttempt'] });
    },
  });
};
