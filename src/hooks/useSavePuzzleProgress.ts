import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '../SupabaseProvider';

export const useSavePuzzleProgress = () => {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ progress, elapsedSeconds }: { progress: any; elapsedSeconds: number }) => {
      const sanitized = JSON.parse(JSON.stringify(progress));
      const { data, error } = await supabase.rpc("save_progress", {
        _progress: sanitized,
        _elapsed_seconds: elapsedSeconds
      });

      if (error) throw error;

      return data;
    },

    onSuccess: (attempt) => {
      // Update React Query cache with fresh attempt data
      queryClient.setQueryData(
        ["currentPuzzleAttempt", attempt.user_id],
        attempt
      );
    }
  });
};
