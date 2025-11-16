import { useMutation } from '@tanstack/react-query';
import { useSupabase } from '../SupabaseProvider';

const sanitizeProgress = (progress: unknown) => {
  if (progress === null || progress === undefined) return null;
  try {
    return JSON.parse(JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to serialize puzzle progress for storage.', error);
    return null;
  }
};

export const useSavePuzzleProgress = () => {
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async ({ attemptId, data }: { attemptId: string; data: PuzzleProgressInput }) => {
      const sanitized = sanitizeProgress(data.progress);

      const update: Record<string, any> = {
        progress: sanitized,
        lives_remaining: data.lives ?? null,
        elapsed_seconds: data.elapsedSeconds ?? null,
        updated_at: new Date().toISOString().slice(0, 10),
      };

      if (data.completed) {
        update.status = 'completed';
        update.completed_at = new Date().toISOString();
      }

      const { error } = await supabase.from('puzzle_attempts').update(update).eq('id', attemptId);

      if (error) {
        console.error('Failed to save puzzle progress:', error);
        throw error;
      }
    },
  });
};
