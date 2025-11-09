import { use } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { GameContext } from '../../providers/GameContext';
import MenuButton from './MenuButton';
import { AttemptMetadata } from '@hooks/useProfile';
import { useActiveSession } from '@hooks/useActiveSession';
import { useCurrentPuzzleAttempt } from '@hooks/useCurrentPuzzleAttempt';
import { useSavePuzzleProgress } from '@hooks/useSavePuzzleProgress';

const ResetPuzzleButton = () => {
  const {
    state: { maxLives },
  } = use(GameContext);
  const { data: activeSession } = useActiveSession();
  const { mutateAsync: saveProgress, isPending: saveProgressPending } = useSavePuzzleProgress();

  const queryClient = useQueryClient();
  const { data: activeAttempt } = useCurrentPuzzleAttempt();

  const handleResetPuzzle = async () => {
    const attemptId = activeSession?.current_attempt_id ?? null;
    if (!attemptId) {
      return;
    }

    try {
      const defaultMetadata: AttemptMetadata = {
        puzzleId: activeAttempt?.puzzle_id,
        progress: null,
        lives: maxLives,
        elapsedSeconds: 0,
        completed: false,
        updatedAt: new Date().toISOString(),
      };

      await saveProgress({
        attemptId,
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
