import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@/SupabaseProvider';

export const useResetPuzzle = () => {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('reset_active_attempt');

      if (error) throw error;
      return data;
    },

    onSuccess: () => {
      // Invalidate anything that depends on session or attempts
      queryClient.invalidateQueries({ queryKey: ['currentPuzzleAttempt'] });
      queryClient.invalidateQueries({ queryKey: ['active-session'] });
      queryClient.invalidateQueries({ queryKey: ['daily-puzzle'] });
      window.location.reload();
    },

    onError: (err) => {
      console.error('Error resetting puzzle attempt:', err);
    },
  });

  return {
    resetPuzzle: mutation.mutateAsync,
    isResetting: mutation.isPending,
  };
};
