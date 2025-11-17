import { useQueryClient } from '@tanstack/react-query';
import MenuButton from './MenuButton';
import { useSavePuzzleProgress } from '@hooks/useSavePuzzleProgress';
import { MAX_LIVES } from '@/utils/configs';
import { useCurrentPuzzleAttempt } from '@/hooks/useCurrentPuzzleAttempt';

const ResetPuzzleButton = () => {
  const { data: currentPuzzleAttempt } = useCurrentPuzzleAttempt();
  const { mutateAsync: saveProgress, isPending: saveProgressPending } = useSavePuzzleProgress();

  const currentPuzzleAttemptId = currentPuzzleAttempt?.id || null;

  const queryClient = useQueryClient();

  const handleResetPuzzle = async () => {
    if (!currentPuzzleAttemptId) {
      return;
    }

    try {
      const defaultMetadata: AttemptMetadata = {
        puzzleId: currentPuzzleAttemptId,
        progress: null,
        lives: MAX_LIVES,
        elapsedSeconds: 0,
        completed: false,
        updatedAt: new Date().toISOString(),
      };

      await saveProgress({
        attemptId: currentPuzzleAttemptId,
        data: { progress: defaultMetadata },
      });
      await queryClient.invalidateQueries({ queryKey: ['active-session'] });
      window.location.reload();
    } catch (error) {
      console.error('Failed to reset puzzle', error);
    }
  };

  return (
    <MenuButton
      onClick={handleResetPuzzle}
      disabled={saveProgressPending}
      className="bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
    >
      {saveProgressPending ? 'Resetting…' : 'Reset Puzzle'}
    </MenuButton>
  );
};

export default ResetPuzzleButton;
