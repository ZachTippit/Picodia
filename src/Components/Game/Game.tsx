import { use, useEffect, useMemo, useState } from 'react';
import { GameContext } from '../../GameContext';
import { Nonogram } from './Nonogram';
import type { PuzzleCellState } from './PuzzleGrid';
import PreGameCountdown from './PreGameCountdown';
import { useDailyPuzzle } from '@hooks/useDailyPuzzle';
import { useCurrentPuzzleAttempt } from '@hooks/useCurrentPuzzleAttempt';
import { useActiveSession } from '@hooks/useActiveSession';
import { AttemptMetadata } from '@hooks/useProfile';
import { cn } from '@utils/cn';

const Game = () => {
  const {
    state: { isGameStarted },
    actions: {
      setLives,
      setElapsedSeconds,
    },
  } = use(GameContext);
  const { data: activeAttemptData } = useCurrentPuzzleAttempt();
  
  const { data: activeSession } = useActiveSession();
  const { data: dailyPuzzle } = useDailyPuzzle();
  
  const activeAttempt = activeAttemptData;

  const isAttemptForToday = activeAttempt?.puzzle_id === dailyPuzzle?.id;
  const attemptMetadata = useMemo<AttemptMetadata | null>(() => {
    if (!activeAttempt?.metadata || typeof activeAttempt.metadata !== 'object') {
      return null;
    }
    return activeAttempt.metadata;
  }, [activeAttempt?.metadata]);

  const [puzzleVisible, setPuzzleVisible] = useState(false);

  useEffect(() => {
    if (isGameStarted) {
      const timeout = window.setTimeout(() => {
        setPuzzleVisible(true);
      }, 150);
      return () => clearTimeout(timeout);
    }

    setPuzzleVisible(false);
  }, [isGameStarted]);

  useEffect(() => {
    if(activeAttemptData){
      setLives(activeAttemptData.lives_remaining);
      setElapsedSeconds(Math.max(0, activeAttemptData.metadata?.elapsedSeconds || 0));
    }
  }, [activeAttemptData])

  const initialPuzzleGrid = useMemo<PuzzleCellState[][] | null>(() => {
    if (isAttemptForToday && attemptMetadata?.progress) {
      return attemptMetadata.progress as PuzzleCellState[][] | null;
    }

    return null;
  }, [activeSession?.active_puzzle_id, attemptMetadata, dailyPuzzle]);

  const activePuzzle = dailyPuzzle;

  return (
    <div className="relative min-h-[450px] flex items-center justify-center">
      <PreGameCountdown setPuzzleVisible={setPuzzleVisible}/>
      {isGameStarted ? (
        <div
          className={cn('w-full transition-opacity duration-500', puzzleVisible ? 'opacity-100' : 'opacity-0')}
        >
          <Nonogram puzzle={activePuzzle} initialGrid={initialPuzzleGrid} />
        </div>
      ) : null}
    </div>
  );
};

export default Game;
