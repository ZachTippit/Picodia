import { PostgrestError } from "@supabase/supabase-js";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useSupabase } from "../SupabaseProvider";

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
      queryClient.invalidateQueries({ queryKey: ["active-session"] });
      queryClient.invalidateQueries({ queryKey: ["profile-stats"] });
    },
  });
};