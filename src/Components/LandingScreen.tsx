import { useUser } from '@clerk/clerk-react';
import { format } from 'date-fns/format';
import { cn } from '../lib/cn';
import { useEffect, useMemo, useRef, useState } from 'react';

const answer = [
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0],
];

const rowClues = [[5], [1, 1], [5], [1], [1]];
const colClues = [[5], [1, 1], [1, 1], [1, 1], [3]];

const howToPlayRules = [
  'Look at each row clue to see how many consecutive squares belong in that row.',
  'Column clues stack from top to bottom. Fill vertical runs to satisfy each number.',
  'Use temporary marks for blanks so you can track which cells must stay empty.'
];

interface LandingScreenProps {
  onPlay: () => void;
}

const LandingScreen = ({ onPlay }: LandingScreenProps) => {
  const { user } = useUser();

  const [showClues, setShowClues] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeRule, setActiveRule] = useState(0);
  const playTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  const toggleClues = () => {
    setShowClues((prev) => {
      const next = !prev;
      if (!next) {
        setActiveRule(0);
      }
      return next;
    });
  };

  const handlePlay = () => {
    if (isClosing) return;
    setIsClosing(true);
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

  const handlePrevRule = () => {
    setActiveRule((prev) => Math.max(0, prev - 1));
  };

  const handleNextRule = () => {
    setActiveRule((prev) => Math.min(howToPlayRules.length - 1, prev + 1));
  };

  // Create 2D grid of objects with state
  const grid = useMemo(
    () =>
      answer.map((row, r) =>
        row.map((value, c) => ({
          correct: value === 1,
          filled: value === 1,
          id: `${r}-${c}`,
        }))
      ),
    []
  );

  const hasName = Boolean(user?.firstName);

  console.log('user in LandingScreen:', user);
  return (
    <div
      className={cn(
        'absolute top-0 right-0 left-0 bottom-0 z-20 flex flex-col items-center bg-gray-200 transition-opacity duration-500 ease-in-out',
        isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      )}
    >
      <div className="relative flex h-full w-full max-w-sm flex-col items-center px-4 py-6">
        <h1 className="mb-4 text-2xl">PICODIA</h1>
        <div className="flex w-full flex-1 items-center justify-center">
          <div
            className={cn(
              'grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-0.5 items-start justify-start transition-transform duration-700 ease-out',
              showClues
                ? 'translate-x-[3px] translate-y-4 delay-75'
                : 'translate-x-0 translate-y-0 delay-0'
            )}
          >
            <div />
            <div
              className={cn(
                'transition-all duration-700 ease-out mb-1 origin-bottom',
                showClues
                  ? 'grid grid-cols-5 gap-x-0.5 opacity-100 translate-y-0'
                  : 'pointer-events-none opacity-0 -translate-y-2 max-h-0 max-w-0 overflow-hidden'
              )}
            >
              {colClues.map((clue, c) => (
                <div key={c} className="flex h-5 flex-col items-center justify-end gap-y-2">
                  {clue
                    .slice()
                    .reverse()
                    .map((num, i) => (
                      <span key={i} className="text-xs leading-none">
                        {num}
                      </span>
                    ))}
                </div>
              ))}
            </div>
            <div
              className={cn(
                'transition-all duration-700 ease-out mr-1 origin-right',
                showClues
                  ? 'grid grid-rows-5 gap-y-0.5 opacity-100 translate-x-0 max-w-[56px]'
                  : 'opacity-0 pointer-events-none -translate-x-2 max-w-0 overflow-hidden'
              )}
            >
              {rowClues.map((clue, r) => (
                <div key={r} className="flex h-5 items-center justify-end gap-x-2">
                  {clue.map((num, i) => (
                    <span key={i} className="mr-1 text-xs leading-none">
                      {num}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <div className="inline-block overflow-hidden rounded-md border-4 border-gray-800 shadow-[0_0_10px_rgba(0,0,0,0.2)]">
              {grid.map((row, r) => (
                <div key={r} className="flex">
                  {row.map((cell, c) => (
                    <button
                      key={cell.id}
                      className={cn(
                        'flex size-5 select-none items-center justify-center border border-gray-600 transition-all',
                        cell.filled ? 'bg-gray-800' : 'bg-white'
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={cn(
            'mt-5 flex w-full flex-col items-center gap-3 text-center transition-all duration-500 ease-out',
            showClues ? 'pointer-events-none -translate-y-3 opacity-0 hidden' : 'translate-y-0 opacity-100'
          )}
        >
          <div className="flex flex-col gap-1">
            <p className="font-bold">
              {hasName ? `Welcome back, ${user?.firstName}` : 'Welcome Back'}
            </p>
            <p className="text-sm text-gray-700">Solve the Nonogram</p>
            <p className="text-sm text-gray-700">Click play to start your day with a new puzzle!</p>
          </div>
          <button
            type="button"
            onClick={handlePlay}
            className="w-32 rounded-full bg-blue-500 px-4 py-2 text-white transition-opacity duration-500 ease-out hover:bg-blue-600"
          >
            Play
          </button>
          {user && (
            <button
              type="button"
              className="w-32 rounded-full bg-gray-500 px-4 py-2 text-white transition-opacity duration-500 ease-out hover:bg-gray-600"
            >
              Log In
            </button>
          )}
          {!showClues && (
            <button
              type="button"
              onClick={toggleClues}
              className="w-32 rounded-full bg-gray-500 px-4 py-2 text-white transition-opacity duration-500 ease-out hover:bg-gray-600"
            >
              How to Play
            </button>
          )}
          <div className="mt-4 flex flex-col gap-y-2 text-center">
            <p className="font-bold">{format(new Date(), 'MMMM dd, yyyy')}</p>
            <p className="text-sm text-gray-700">Your current streak: 5 days</p>
            <p className="text-sm text-gray-700">Your longest streak: 10 days</p>
            <p className="text-xs font-bold text-gray-700">By Zach Tippit</p>
          </div>
        </div>

        <div
          className={cn(
            'mt-5 flex w-full flex-col items-center gap-3 text-center transition-all duration-500 ease-out',
            showClues ? 'translate-y-0 opacity-100' : '-translate-y-3 pointer-events-none opacity-0'
          )}
        >
          <p className="min-h-[56px] text-sm leading-snug text-gray-700">{howToPlayRules[activeRule]}</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handlePrevRule}
              disabled={activeRule === 0}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full border border-gray-400 text-gray-700 transition-all duration-300',
                activeRule === 0 ? 'cursor-not-allowed opacity-40' : 'hover:bg-gray-200'
              )}
            >
              &larr;
            </button>
            <span className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Step {activeRule + 1}/{howToPlayRules.length}
            </span>
            <button
              type="button"
              onClick={handleNextRule}
              disabled={activeRule === howToPlayRules.length - 1}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full border border-gray-400 text-gray-700 transition-all duration-300',
                activeRule === howToPlayRules.length - 1
                  ? 'cursor-not-allowed opacity-40'
                  : 'hover:bg-gray-200'
              )}
            >
              &rarr;
            </button>
          </div>
        </div>

        <div
          className={cn(
            'mt-4 flex w-full justify-center transition-all duration-500 ease-out',
            showClues ? 'translate-y-1 opacity-100 pb-4' : 'translate-y-0 opacity-0 pointer-events-none'
          )}
        >
          <button
            type="button"
            onClick={toggleClues}
            className="w-32 rounded-full bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
          >
            {showClues ? 'Close How to Play' : 'How to Play'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
