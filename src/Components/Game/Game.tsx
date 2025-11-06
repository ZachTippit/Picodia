import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GameContext } from '../../GameContext';
import { useGetPuzzles } from '../../hooks/useGetPuzzle';
import { Nonogram } from './Nonogram';
import { cn } from '../../lib/cn';
import { AttemptMetadata, useActiveSession } from '../../hooks/useProfile';;
import { getStoredAnonProgress } from '../../hooks/useSavePuzzleProgress';
import type { PuzzleCellState } from './PuzzleGrid';
import PreGameCountdown from './PreGameCountdown';
import { useDailyPuzzle } from '../../hooks/useDailyPuzzle';

const Game = () => {
  const {
    state: { isGameStarted, maxLives },
    actions: {
      setLives,
      resetElapsedSeconds,
      setElapsedSeconds,
    },
  } = use(GameContext);
  const { data: activeSession } = useActiveSession();

  const { data: dailyPuzzle } = useDailyPuzzle();
  console.log("daily puzzle in Game component:", dailyPuzzle);

  const getTodayKey = useCallback(() => new Date().toISOString().split('T')[0], []);

  const activeAttemptRaw = activeSession?.puzzle_attempts ?? null;
  const activeAttempt = Array.isArray(activeAttemptRaw)
    ? activeAttemptRaw[0] ?? null
    : activeAttemptRaw;
  const todayKey = getTodayKey();
  const isAttemptForToday =
    Boolean(dailyPuzzle) &&
    (
      (activeAttempt?.puzzle_id === dailyPuzzle?.id && activeAttempt?.attempt_date === todayKey) ||
      activeSession?.active_puzzle_id === dailyPuzzle?.id
    );
  const attemptStatus = isAttemptForToday
    ? activeAttempt?.status ?? (activeSession?.current_attempt_id ? 'in_progress' : null)
    : null;
  const attemptMetadata = useMemo<AttemptMetadata | null>(() => {
    if (!activeAttempt?.metadata || typeof activeAttempt.metadata !== 'object') {
      return null;
    }
    return activeAttempt.metadata;
  }, [activeAttempt?.metadata]);

  const anonProgress = useMemo(() => {
    if (!dailyPuzzle) {
      return null;
    }

    const stored = getStoredAnonProgress();
    if (!stored) {
      return null;
    }

    const today = getTodayKey();
    if (stored.puzzleId !== dailyPuzzle.id || stored.puzzleDate !== today) {
      return null;
    }

    return stored;
  }, [dailyPuzzle, getTodayKey]);

  const [puzzleVisible, setPuzzleVisible] = useState(false);
  const hydrationKeyRef = useRef<string | null>(null);

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
    if (!dailyPuzzle) {
      return;
    }

    const hydrationTodayKey = getTodayKey();
    const hasAnonProgress = Boolean(anonProgress);
    const hydrationKey = `${dailyPuzzle.id}:${hydrationTodayKey}:${
      isAttemptForToday ? `attempt-${attemptStatus ?? 'unknown'}` : hasAnonProgress ? 'anon' : 'default'
    }:${attemptMetadata?.updatedAt ?? anonProgress?.updatedAt ?? 'na'}`;
    // const shouldForceHydration = startMode === 'new' && !isGameStarted;
    const shouldForceHydration = false;
    if (!shouldForceHydration && hydrationKeyRef.current === hydrationKey) {
      return;
    }

    if (isAttemptForToday && (attemptMetadata || attemptStatus)) {
      const derivedLives =
        typeof attemptMetadata?.lives === 'number'
          ? attemptMetadata.lives
          : activeAttempt?.lives_remaining ?? null;
      if (typeof derivedLives === 'number') {
        setLives(Math.max(0, Math.min(maxLives, derivedLives)));
      } else {
        setLives(maxLives);
      }

      const derivedElapsed =
        typeof attemptMetadata?.elapsedSeconds === 'number'
          ? attemptMetadata.elapsedSeconds
          : null;
      if (typeof derivedElapsed === 'number') {
        setElapsedSeconds(Math.max(0, derivedElapsed));
      } else {
        setElapsedSeconds(0);
      }

      // updateGameOver(attemptStatus === 'completed' || Boolean(attemptMetadata?.completed));
    } else if (hasAnonProgress) {
      setLives(
        typeof anonProgress?.lives === 'number'
          ? Math.max(0, Math.min(maxLives, anonProgress.lives))
          : maxLives
      );
      setElapsedSeconds(Math.max(0, anonProgress?.elapsedSeconds ?? 0));
      // updateGameOver(Boolean(anonProgress?.completed));
    } else {
      setLives(maxLives);
      resetElapsedSeconds();
      // updateGameOver(false);
    }

    hydrationKeyRef.current = hydrationKey;
  }, [
    activeAttempt?.lives_remaining,
    anonProgress,
    attemptMetadata,
    attemptStatus,
    dailyPuzzle,
    getTodayKey,
    isAttemptForToday,
    isGameStarted,
    maxLives,
    resetElapsedSeconds,
    setElapsedSeconds,
    setLives,
  ]);

  const initialPuzzleGrid = useMemo<PuzzleCellState[][] | null>(() => {
    if (!dailyPuzzle) {
      return null;
    }

    if (isAttemptForToday && attemptMetadata?.progress) {
      return attemptMetadata.progress as PuzzleCellState[][] | null;
    }

    if (anonProgress?.progress) {
      return (anonProgress.progress as PuzzleCellState[][] | null) ?? null;
    }

    return null;
  }, [activeSession?.active_puzzle_id, anonProgress, attemptMetadata, dailyPuzzle]);

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
