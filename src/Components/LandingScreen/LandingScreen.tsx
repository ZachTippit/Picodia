import { format } from 'date-fns/format';
import { cn } from '../../lib/cn';
import { use, useEffect, useMemo, useRef, useState } from 'react';
import PreviewGrid from './PreviewGrid';
import { useSupabaseAuth } from '../../SupabaseProvider';
import { GameContext } from '../../GameContext';
import { useProfileQuery, useResetCurrentPuzzle } from '../../hooks/useProfile';
import { useGetPuzzles } from '../../hooks/useGetPuzzle';

interface LandingScreenProps {
  onPlay: () => void;
  onShowHowTo: () => void;
  onOpenLogin: () => void;
}

const LandingScreen = ({ onPlay, onShowHowTo, onOpenLogin }: LandingScreenProps) => {
  const { user } = useSupabaseAuth();
  const profileQuery = useProfileQuery();
  const profile = profileQuery.data;
  const profileLoading = Boolean(user) && (profileQuery.isPending || profileQuery.isFetching);
  const resetCurrentPuzzle = useResetCurrentPuzzle();
  const { data: puzzles, isPending: puzzlesPending } = useGetPuzzles();
  const {
    actions: { beginCountdown, startGame, setStartMode },
  } = use(GameContext);

  const [isClosing, setIsClosing] = useState(false);
  const playTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  const metadata = (user?.user_metadata ?? {}) as Record<string, string | undefined>;
  const displayName =
    profile?.display_name ??
    metadata.full_name ??
    metadata.name ??
    user?.email ??
    null;
  const hasName = Boolean(displayName);
  const gamesPlayed = profile?.games_played ?? 0;
  const currentStreak = profile?.current_streak ?? 0;
  const longestStreak = profile?.longest_streak ?? 0;
  const shouldShowStats = Boolean(user);
  const dailyPuzzle = puzzles?.[0];
  const todayKey = new Date().toISOString().split('T')[0];
  const hasTodaysPuzzle =
    Boolean(profile && dailyPuzzle && profile.current_puzzle_id === dailyPuzzle.id) &&
    profile?.current_puzzle_date === todayKey;
  const isContentLoading = puzzlesPending || profileLoading;

  const playMode = useMemo<'new' | 'continue' | 'results'>(() => {
    if (!user || profileLoading || !hasTodaysPuzzle || !profile?.current_puzzle_status) {
      return 'new';
    }

    if (profile.current_puzzle_status === 'in_progress') {
      return 'continue';
    }

    if (profile.current_puzzle_status === 'completed') {
      return 'results';
    }

    return 'new';
  }, [hasTodaysPuzzle, profile, profileLoading, user]);

  const primaryActionLabel = useMemo(() => {
    switch (playMode) {
      case 'continue':
        return 'Continue';
      case 'results':
        return 'See Results';
      default:
        return 'Play';
    }
  }, [playMode]);

  const handlePlay = () => {
    if (isClosing || isContentLoading) return;

    setStartMode(playMode);

    if (playMode === 'new') {
      beginCountdown();
    } else {
      startGame();
    }

    setIsClosing(true);
    // @ts-ignore
    playTimeoutRef.current = window.setTimeout(() => {
      onPlay();
      playTimeoutRef.current = null;
    }, 500);
  };

  useEffect(
    () => () => {
      if (playTimeoutRef.current) {
        window.clearTimeout(playTimeoutRef.current);
        playTimeoutRef.current = null;
      }
    },
    []
  );

  const handleReset = () => {
    if (resetCurrentPuzzle.isPending) {
      return;
    }

    resetCurrentPuzzle.mutate();
  };

  const showDevResetButton = import.meta.env.DEV && Boolean(user);

  return (
    <div
      className={cn(
        'absolute top-0 right-0 left-0 bottom-0 z-20 flex flex-col items-center bg-gray-200 transition-opacity duration-500 ease-in-out',
        isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      )}
    >
      <div className="relative flex h-full w-full max-w-sm flex-col items-center px-4 py-6 gap-y-12">
        <h1 className="mb-4 text-2xl">PICODIA</h1>

        <PreviewGrid />

        {isContentLoading ? (
          <div className="flex w-full flex-1 items-center justify-center text-center">
            <div className="flex flex-col items-center gap-3 text-gray-600">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-600" />
              <p className="text-sm font-medium">Loading today&apos;s puzzle…</p>
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-3 text-center">
            <div className="flex flex-col gap-1">
              <p className="font-bold">{hasName ? `Welcome back, ${displayName}` : 'Welcome Back'}</p>
              <p className="text-sm text-gray-700">Solve the Nonogram</p>
              <p className="text-sm text-gray-700">Click play to start your day with a new puzzle!</p>
            </div>
            <button
              type="button"
              onClick={handlePlay}
              className="w-32 rounded-full bg-green-600 px-4 py-2 text-white transition-opacity duration-500 ease-out hover:bg-green-700"
            >
              {primaryActionLabel}
            </button>
            {!user && (
              <button
                type="button"
                onClick={onOpenLogin}
                className="w-32 rounded-full bg-gray-500 px-4 py-2 text-white transition-opacity duration-500 ease-out hover:bg-gray-600"
              >
                Log In
              </button>
            )}
            <button
              type="button"
              onClick={onShowHowTo}
              className="w-32 rounded-full bg-gray-500 px-4 py-2 text-white transition-opacity duration-500 ease-out hover:bg-gray-600"
            >
              How to Play
            </button>
            <div className="mt-4 flex flex-col gap-y-2 text-center">
              <p className="font-bold">{format(new Date(), 'MMMM dd, yyyy')}</p>
              {shouldShowStats ? (
                <>
                  <p className="text-sm text-gray-700">
                    Games played: {gamesPlayed}
                  </p>
                  <p className="text-sm text-gray-700">
                    Current streak: {currentStreak} day{currentStreak === 1 ? '' : 's'}
                  </p>
                  <p className="text-sm text-gray-700">
                    Longest streak: {longestStreak} day{longestStreak === 1 ? '' : 's'}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-700">Sign in to start tracking your streak.</p>
              )}
              <p className="text-xs font-bold text-gray-700">By Zach Tippit</p>
              {showDevResetButton && (
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={resetCurrentPuzzle.isPending}
                  className="mt-3 w-32 rounded-full bg-red-500 px-4 py-2 text-white transition-opacity duration-500 ease-out hover:bg-red-600 disabled:opacity-60"
                >
                  {resetCurrentPuzzle.isPending ? 'Resetting...' : 'Reset (dev)'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingScreen;
