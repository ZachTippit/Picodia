import { useMutation } from '@tanstack/react-query';
import { useSupabase } from '../SupabaseProvider';
import { useUser } from '@clerk/clerk-react';
import { useGetPuzzles } from './useGetPuzzle';

interface PuzzleProgressInput {
  progress: any;
  completed?: boolean;
}

export const useSavePuzzleProgress = () => {
  const supabase = useSupabase();

  const { user } = useUser();
  const { data: puzzleData } = useGetPuzzles();
  const puzzleId = puzzleData ? puzzleData[0].id : null;

  return useMutation({
    mutationFn: async (progressData: PuzzleProgressInput) => {

      const payload = {
        user_id: user?.id,
        puzzle_id: puzzleId,
        progress: JSON.stringify(progressData.progress),
        session_date: new Date().toISOString().split('T')[0],
        completed: progressData?.completed ?? false,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('puzzle_progress')
        .upsert(payload, { onConflict: 'user_id,puzzle_id,session_date' })
        .select();

      if (error) throw error;
      return data;
    },
  });
};
