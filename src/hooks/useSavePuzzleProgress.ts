import { useSupabaseAuth } from '../SupabaseProvider';
import { useGetPuzzles } from './useGetPuzzle';
import { useSaveCurrentPuzzleProgress } from './useProfile';

interface PuzzleProgressInput {
  progress: any;
  completed?: boolean;
  lives?: number | null;
  elapsedSeconds?: number | null;
}

export const useSavePuzzleProgress = () => {
  const { user } = useSupabaseAuth();
  const { data: puzzleData } = useGetPuzzles();
  const puzzleId = puzzleData ? puzzleData[0]?.id ?? null : null;
  const saveCurrentPuzzleProgress = useSaveCurrentPuzzleProgress();

  type MutationOptions = Parameters<typeof saveCurrentPuzzleProgress.mutate>[1];

  const mutate = (progressData: PuzzleProgressInput, options?: MutationOptions) => {
    if (!puzzleId || !user) {
      return;
    }

    saveCurrentPuzzleProgress.mutate(
      {
        puzzleId,
        progress: progressData.progress,
        completed: progressData?.completed ?? false,
        lives: progressData?.lives ?? null,
        elapsedSeconds: progressData?.elapsedSeconds ?? null,
      },
      options
    );
  };

  const mutateAsync = (progressData: PuzzleProgressInput, options?: MutationOptions) => {
    if (!puzzleId || !user) {
      return Promise.reject(new Error('Unable to save progress without an authenticated user and puzzle.'));
    }

    return saveCurrentPuzzleProgress.mutateAsync(
      {
        puzzleId,
        progress: progressData.progress,
        completed: progressData?.completed ?? false,
        lives: progressData?.lives ?? null,
        elapsedSeconds: progressData?.elapsedSeconds ?? null,
      },
      options
    );
  };

  return {
    ...saveCurrentPuzzleProgress,
    mutate,
    mutateAsync,
  };
};
