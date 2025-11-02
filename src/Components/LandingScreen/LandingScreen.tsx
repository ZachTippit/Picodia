import { useUser } from '@clerk/clerk-react';
import { format } from 'date-fns/format';
import { cn } from '../../lib/cn';
import { useEffect, useRef, useState } from 'react';
import PreviewGrid from './PreviewGrid';
import LoginOverlay from './LoginOverlay';

interface LandingScreenProps {
  onPlay: () => void;
  onShowHowTo: () => void;
}

const LandingScreen = ({ onPlay, onShowHowTo }: LandingScreenProps) => {
  const { user } = useUser();

  const [isClosing, setIsClosing] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const playTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);

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

        <div className="flex w-full flex-col items-center gap-3 text-center">
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
          <button
            type="button"
            onClick={openLogin}
            className="w-32 rounded-full bg-gray-500 px-4 py-2 text-white transition-opacity duration-500 ease-out hover:bg-gray-600"
          >
            Log In
          </button>
          <button
            type="button"
            onClick={onShowHowTo}
            className="w-32 rounded-full bg-gray-500 px-4 py-2 text-white transition-opacity duration-500 ease-out hover:bg-gray-600"
          >
            How to Play
          </button>
          <div className="mt-4 flex flex-col gap-y-2 text-center">
            <p className="font-bold">{format(new Date(), 'MMMM dd, yyyy')}</p>
            <p className="text-sm text-gray-700">Your current streak: 5 days</p>
            <p className="text-sm text-gray-700">Your longest streak: 10 days</p>
            <p className="text-xs font-bold text-gray-700">By Zach Tippit</p>
          </div>
        </div>
      </div>
      <LoginOverlay isOpen={showLogin} onClose={closeLogin} />
    </div>
  );
};

export default LandingScreen;
