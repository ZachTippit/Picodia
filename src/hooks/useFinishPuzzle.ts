import { useSupabase } from "../SupabaseProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface FinishPuzzleInput {
  progress: any;
  elapsedSeconds: number;
}

export const useFinishPuzzle = () => {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ progress, elapsedSeconds }: FinishPuzzleInput) => {
      const { data, error } = await supabase.rpc("finish_current_attempt", {
        _progress: progress,
        _elapsed_seconds: elapsedSeconds,
      });

      if (error) throw error;
      return data; // fully updated puzzle_attempt row
    },

    onSuccess: (attempt) => {
      // Update only the correct query key
      queryClient.setQueryData(["currentPuzzleAttempt", attempt.user_id], attempt);

      // Invalidate any dependent views
      queryClient.invalidateQueries({ queryKey: ["profileStats"] });
      queryClient.invalidateQueries({ queryKey: ["profile-stats"] });
      queryClient.invalidateQueries({ queryKey: ["active-session"] });
      queryClient.invalidateQueries({ queryKey: ["currentPuzzleAttempt"] });
    },
  });
};
