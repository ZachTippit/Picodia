import { useUser } from '@clerk/clerk-react';
import { format } from 'date-fns/format';
import { cn } from '../../lib/cn';
import { useEffect, useRef, useState } from 'react';
import Grid from './Grid';
import HowToPlay from './HowToPlay';

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
    //@ts-ignore
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
        
        <Grid showClues={showClues} activeRule={activeRule}/>

        <div
          className={cn(
            'mt-5 flex w-full flex-col items-center gap-3 text-center transition-all duration-500 ease-out',
            showClues
              ? 'pointer-events-none -translate-y-3 opacity-0 hidden'
              : 'translate-y-0 opacity-100'
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

        <HowToPlay
          showClues={showClues}
          activeRule={activeRule}
          onRuleChange={(next) => setActiveRule(next)}
        />

        <div
          className={cn(
            'mt-4 flex w-full justify-center transition-all duration-500 ease-out',
            showClues
              ? 'translate-y-1 opacity-100 pb-4'
              : 'translate-y-0 opacity-0 pointer-events-none'
          )}
        >
          <button
            type="button"
            onClick={toggleClues}
            className="w-32 rounded-full bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
          >
            {showClues ? 'Close' : 'How to Play'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
