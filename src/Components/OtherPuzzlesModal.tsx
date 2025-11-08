import { use, useEffect, useMemo, useRef, useState } from 'react';
import { GameContext } from '../GameContext';
import { useGetPuzzles } from '@hooks/useGetPuzzles';
import { cn } from '@utils/cn';

const TRANSITION_DURATION = 400;

type Phase = 'idle' | 'entering' | 'entered' | 'exiting';

const DEFAULT_COMPLETION_STATUS = 'Incomplete';
const DEFAULT_COMPLETION_TIME = '13:05';
const DEFAULT_BEST_TIME = '09:47';
const DEFAULT_BEST_DATE = 'Jan 3, 2024';

const OtherPuzzlesModal = () => {
  const {
    state: { showOtherPuzzles },
    actions: { toggleOtherPuzzles },
  } = use(GameContext);
  const { data: puzzles, isPending } = useGetPuzzles();

  const [phase, setPhase] = useState<Phase>('idle');
  const [isMounted, setIsMounted] = useState(false);
  const enterTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  useEffect(() => {
    if (showOtherPuzzles) {
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
  }, [showOtherPuzzles, isMounted]);

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

  const entries = useMemo(() => puzzles ?? [], [puzzles]);

  if (!isMounted) {
    return null;
  }

  const handleClose = () => {
    toggleOtherPuzzles();
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
        aria-labelledby="other-puzzles-modal-title"
        className={cn(
          'relative z-10 flex w-full max-w-sm flex-col rounded-3xl border p-6 text-center shadow-2xl',
          'stats-panel-base overflow-hidden',
          phase === 'entering' && 'stats-panel-enter',
          phase === 'entered' && 'stats-panel-entered',
          phase === 'exiting' && 'stats-panel-exit',
          'border-gray-300 bg-white text-gray-900'
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <h1 id="other-puzzles-modal-title" className="mb-2 text-2xl font-semibold tracking-wide">
          PICODIA
        </h1>
        <h2
          className={cn(
            'text-lg font-semibold tracking-wide',
            'text-gray-700'
          )}
        >
          Other Puzzles
        </h2>
        <div className="mt-6 flex-1 overflow-hidden">
          {isPending ? (
            <div className={cn('text-smtext-gray-500')}>
              Loading puzzles…
            </div>
          ) : entries.length === 0 ? (
            <div className={cn('text-sm text-gray-500')}>
              No puzzles available yet.
            </div>
          ) : (
            <div className="max-h-[50vh] space-y-3 overflow-y-auto pr-1">
              {entries.map((puzzle) => (
                <div
                  key={puzzle.id}
                  className={cn(
                    'flex items-center gap-4 rounded-xl border px-4 py-3 text-left text-sm transition-opacity duration-300 border-gray-200 bg-gray-100 text-gray-800'
                  )}
                >
                  <div className="flex-shrink-0">
                    <div className="flex size-12 items-center justify-center rounded-md border border-black bg-gray-300 font-semibold text-gray-700">
                      {puzzle.day}
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-base font-semibold">Day {puzzle.day}</span>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-wide',
                          'bg-gray-200 text-gray-600'
                        )}
                      >
                        {DEFAULT_COMPLETION_STATUS}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Time to Complete:</span> {DEFAULT_COMPLETION_TIME}
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Best Time:</span>
                      {` ${DEFAULT_BEST_TIME} on ${DEFAULT_BEST_DATE}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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

export default OtherPuzzlesModal;
