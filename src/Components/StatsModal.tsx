import { use, useEffect, useMemo, useRef, useState } from 'react';
import { GameContext } from '../GameContext';
import { cn } from '../lib/cn';
import { useProfileQuery } from '../hooks/useProfile';

const TRANSITION_DURATION = 400;

type Phase = 'idle' | 'entering' | 'entered' | 'exiting';

const formatTime = (seconds: number | null | undefined) => {
  if (!seconds || Number.isNaN(seconds)) {
    return '--';
  }

  const wholeSeconds = Math.max(0, Math.round(seconds));
  const mins = Math.floor(wholeSeconds / 60);
  const secs = wholeSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatNumber = (value: number | null | undefined, digits = 0) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '--';
  }
  if (digits === 0) {
    return Math.round(value).toString();
  }
  return value.toFixed(digits);
};

const StatsModal = () => {
  const {
    state: { showStats, darkMode },
    actions: { toggleStats },
  } = use(GameContext);
  const { data: profile, isPending } = useProfileQuery();

  const [phase, setPhase] = useState<Phase>('idle');
  const [isMounted, setIsMounted] = useState(false);
  const enterTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  useEffect(() => {
    if (showStats) {
      if (exitTimerRef.current) {
        window.clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
      if (!isMounted) {
        setIsMounted(true);
      }
      if (enterTimerRef.current) {
        window.clearTimeout(enterTimerRef.current);
        enterTimerRef.current = null;
      }
      requestAnimationFrame(() => {
        setPhase('entering');
        enterTimerRef.current = window.setTimeout(() => {
          setPhase('entered');
          enterTimerRef.current = null;
        }, TRANSITION_DURATION);
      });
    } else if (isMounted) {
      if (enterTimerRef.current) {
        window.clearTimeout(enterTimerRef.current);
        enterTimerRef.current = null;
      }
      setPhase('exiting');
      exitTimerRef.current = window.setTimeout(() => {
        setIsMounted(false);
        setPhase('idle');
        exitTimerRef.current = null;
      }, TRANSITION_DURATION);
    }
  }, [showStats, isMounted]);

  useEffect(() => {
    return () => {
      if (enterTimerRef.current) {
        window.clearTimeout(enterTimerRef.current);
      }
      if (exitTimerRef.current) {
        window.clearTimeout(exitTimerRef.current);
      }
    };
  }, []);

  const stats = useMemo(() => {
    const gamesAttempted = profile?.games_played ?? 0;
    const gamesWon = profile?.wins ?? 0;
    const gamesLost = profile?.losses ?? 0;
    const gamesCompleted = gamesWon + gamesLost;
    const averageTimeSeconds =
      gamesCompleted > 0 ? (profile?.total_completed_time_seconds ?? 0) / gamesCompleted : null;
    const averageLives =
      gamesCompleted > 0 ? (profile?.total_completed_lives ?? 0) / gamesCompleted : null;

    return [
      { label: 'Games Attempted', value: formatNumber(gamesAttempted) },
      { label: 'Games Completed', value: formatNumber(gamesCompleted) },
      { label: 'Games Won', value: formatNumber(gamesWon) },
      { label: 'Games Lost', value: formatNumber(gamesLost) },
      {
        label: 'Avg. Completion Time',
        value: gamesCompleted > 0 ? formatTime(averageTimeSeconds) : '--',
      },
      {
        label: 'Avg. Lives Remaining',
        value: gamesCompleted > 0 ? formatNumber(averageLives, 1) : '--',
      },
    ];
  }, [profile]);

  if (!isMounted) {
    return null;
  }

  const handleClose = () => {
    toggleStats();
  };

  const isInteractive = phase === 'entering' || phase === 'entered';

  return (
    <div
      className={cn(
        'fixed inset-0 z-30 flex items-end justify-center px-4 py-6 sm:items-center',
        isInteractive ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    >
      <div
        className={cn(
          'absolute inset-0 stats-overlay-base',
          phase === 'entering' && 'stats-overlay-enter',
          phase === 'entered' && 'stats-overlay-entered',
          phase === 'exiting' && 'stats-overlay-exit'
        )}
        aria-hidden="true"
        onClick={handleClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="stats-modal-title"
        className={cn(
          'relative z-10 w-full max-w-sm rounded-3xl border p-6 text-center shadow-2xl',
          'stats-panel-base',
          phase === 'entering' && 'stats-panel-enter',
          phase === 'entered' && 'stats-panel-entered',
          phase === 'exiting' && 'stats-panel-exit',
          darkMode ? 'border-gray-700 bg-gray-900 text-gray-100' : 'border-gray-300 bg-white text-gray-900'
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <h1 id="stats-modal-title" className="mb-2 text-2xl font-semibold tracking-wide">
          PICODIA
        </h1>
        <h2
          className={cn(
            'text-lg font-semibold tracking-wide',
            darkMode ? 'text-gray-200' : 'text-gray-700'
          )}
        >
          Your Stats
        </h2>
        <div className="mt-6 flex flex-col gap-4">
          {isPending ? (
            <div className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>
              Loading stats…
            </div>
          ) : (
            stats.map((entry) => (
              <div
                key={entry.label}
                className={cn(
                  'flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-opacity duration-300',
                  darkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-700'
                )}
              >
                <span className="text-left">{entry.label}</span>
                <span className="text-right text-base font-semibold">{entry.value}</span>
              </div>
            ))
          )}
        </div>
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleClose}
            className="w-32 rounded-full bg-gray-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;
