import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GameContext } from '../../GameContext';
import { useGetPuzzles } from '../../hooks/useGetPuzzle';
import { Nonogram } from './Nonogram';
import { cn } from '../../lib/cn';
import { useProfileQuery, useRecordGameStart } from '../../hooks/useProfile';
import { useSupabaseAuth } from '../../SupabaseProvider';
import type { PuzzleCellState } from './PuzzleGrid';

const Game = () => {
  const {
    state: { isGameStarted, isCountdownActive, darkMode, lives, maxLives, elapsedSeconds, startMode },
    actions: { startGame, endCountdown, setStartPing, setLives, resetElapsedSeconds, setElapsedSeconds, updateGameOver },
  } = use(GameContext);
  const { user } = useSupabaseAuth();
  const { mutate: recordGameStart } = useRecordGameStart();
  const { data: profile } = useProfileQuery();

  const { data: puzzles } = useGetPuzzles();
  const dailyPuzzle = puzzles?.[0];

  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [showGo, setShowGo] = useState(false);
  const [puzzleVisible, setPuzzleVisible] = useState(false);
  const goTimeoutRef = useRef<number | null>(null);
  const pingTimeoutRef = useRef<number | null>(null);
  const hasRecordedStartRef = useRef(false);
  const hydrationKeyRef = useRef<string | null>(null);
  const getTodayKey = useCallback(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => {
    if (isCountdownActive) {
      setShowGo(false);
      setPuzzleVisible(false);
      setCountdownValue(3);
    } else {
      setCountdownValue(null);
      setShowGo(false);
    }
  }, [isCountdownActive]);

  useEffect(() => {
    if (countdownValue === null) {
      return;
    }

    if (countdownValue === 0) {
      setShowGo(true);
      if (goTimeoutRef.current) {
        clearTimeout(goTimeoutRef.current);
      }
      goTimeoutRef.current = window.setTimeout(() => {
        setShowGo(false);
        setCountdownValue(null);
        endCountdown();
        startGame();
        setStartPing(true);
        if (pingTimeoutRef.current) {
          clearTimeout(pingTimeoutRef.current);
        }
        pingTimeoutRef.current = window.setTimeout(() => {
          setStartPing(false);
          pingTimeoutRef.current = null;
        }, 5000);
      }, 600);

      return () => {
        if (goTimeoutRef.current) {
          clearTimeout(goTimeoutRef.current);
          goTimeoutRef.current = null;
        }
      };
    }

    const timeout = window.setTimeout(() => {
      setCountdownValue((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [countdownValue, endCountdown, setStartPing, startGame]);

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
    return () => {
      if (goTimeoutRef.current) {
        clearTimeout(goTimeoutRef.current);
      }
      if (pingTimeoutRef.current) {
        clearTimeout(pingTimeoutRef.current);
      }
    };
  }, []);

  const shouldShowCountdown = Boolean(
    isCountdownActive || countdownValue !== null || showGo
  );

  useEffect(() => {
    if (!user || !dailyPuzzle) {
      hasRecordedStartRef.current = false;
      return;
    }

    if (startMode === 'results') {
      hasRecordedStartRef.current = false;
      return;
    }

    if (isGameStarted && !hasRecordedStartRef.current) {
      recordGameStart({
        puzzleId: dailyPuzzle.id,
        initialLives: lives,
        elapsedSeconds,
      });
      hasRecordedStartRef.current = true;
    }

    if (!isGameStarted) {
      hasRecordedStartRef.current = false;
    }
  }, [dailyPuzzle, elapsedSeconds, isGameStarted, lives, recordGameStart, startMode, user]);

  useEffect(() => {
    if (!dailyPuzzle) {
      return;
    }

    const todayKey = getTodayKey();
    const profilePuzzleId = profile?.current_puzzle_id ?? null;
    const profilePuzzleDate = profile?.current_puzzle_date ?? null;
    const isProfileForToday = profilePuzzleId === dailyPuzzle.id && profilePuzzleDate === todayKey;
    const hydrationKey = `${dailyPuzzle.id}:${todayKey}:${isProfileForToday ? 'progress' : 'default'}`;

    if (hydrationKeyRef.current === hydrationKey) {
      return;
    }

    if (isProfileForToday) {
      if (typeof profile?.current_puzzle_lives === 'number') {
        setLives(profile.current_puzzle_lives);
      } else {
        setLives(maxLives);
      }

      if (typeof profile?.current_puzzle_elapsed_seconds === 'number') {
        setElapsedSeconds(profile.current_puzzle_elapsed_seconds);
      } else {
        setElapsedSeconds(0);
      }
      if (profile?.current_puzzle_status === 'completed') {
        updateGameOver(true);
      } else {
        updateGameOver(false);
      }
    } else {
      setLives(maxLives);
      resetElapsedSeconds();
      updateGameOver(false);
    }

    hydrationKeyRef.current = hydrationKey;
  }, [dailyPuzzle, getTodayKey, maxLives, profile, resetElapsedSeconds, setElapsedSeconds, setLives, updateGameOver]);

  useEffect(() => {
    if (startMode === 'results') {
      updateGameOver(true);
    }
  }, [startMode, updateGameOver]);

  const initialPuzzleGrid = useMemo<PuzzleCellState[][] | null>(() => {
    if (!dailyPuzzle) {
      return null;
    }

    const todayKey = getTodayKey();
    const isProfileForToday =
      profile?.current_puzzle_id === dailyPuzzle.id && profile?.current_puzzle_date === todayKey;

    if (!isProfileForToday) {
      return null;
    }

    return (profile?.current_puzzle_progress as PuzzleCellState[][] | null) ?? null;
  }, [dailyPuzzle, getTodayKey, profile]);

  return (
    <div className="relative min-h-[450px] flex items-center justify-center">
      {shouldShowCountdown && (
        <div
          className={cn(
            'absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300',
            darkMode ? 'text-gray-100' : 'text-gray-900'
          )}
          style={{ backgroundColor: darkMode ? 'var(--dark-bg)' : 'var(--light-bg)' }}
        >
          <span
            key={showGo ? 'go' : countdownValue ?? 'blank'}
            className="text-6xl font-bold tracking-widest countdown-number"
          >
            {showGo ? 'GO!' : countdownValue ?? 3}
          </span>
        </div>
      )}

      {isGameStarted && dailyPuzzle ? (
        <div
          className={cn(
            'w-full transition-opacity duration-500',
            puzzleVisible ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Nonogram puzzle={dailyPuzzle} puzzleId={dailyPuzzle.id} initialGrid={initialPuzzleGrid} />
        </div>
      ) : null}

      {!isGameStarted && !shouldShowCountdown && (
        <div className="text-sm text-gray-500">Press Play to start today&apos;s puzzle.</div>
      )}

      {isGameStarted && !dailyPuzzle && (
        <div className="text-sm text-gray-500">Loading puzzle…</div>
      )}
    </div>
  );
};

export default Game;
