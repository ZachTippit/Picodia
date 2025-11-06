import React, { use, useRef } from 'react';
import { GameContext } from '../../GameContext';
import Button from './Button';
import { useSupabaseAuth } from '../../SupabaseProvider';
import { useActiveSession, useProfile } from '../../hooks/useProfile';

interface LandingContentProps {
  isClosing: boolean;
  setIsClosing: React.Dispatch<React.SetStateAction<boolean>>;
  onPlay: () => void;
  onShowHowTo: () => void;
  onOpenLogin: () => void;
}

const LandingContent = ({
  isClosing,
  setIsClosing,
  onPlay,
  onShowHowTo,
  onOpenLogin,
}: LandingContentProps) => {
  const {
    actions: { beginCountdown, startGame },
  } = use(GameContext);

  const { user } = useSupabaseAuth();
  const { data: profile } = useProfile();
  const { data: activeSession } = useActiveSession();

  const playTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  const displayName = profile?.display_name ?? user?.email;
  const hasName = Boolean(displayName);

  const playMode = activeSession?.puzzle_attempts?.[0].status;

  const primaryActionLabel =
    {
      in_progress: 'Continue',
      completed: 'See Results',
    }[playMode] ?? 'Play';

  const handlePlay = () => {
    if (playMode === 'in_progress') {
      startGame();
    } else {
      beginCountdown();
    }

    setIsClosing(true);
    // @ts-ignore
    playTimeoutRef.current = window.setTimeout(() => {
      onPlay();
      playTimeoutRef.current = null;
    }, 500);
  };

  return (
    <div className="flex w-full flex-col items-center gap-3 text-center">
      <div className="flex flex-col gap-1">
        <p className="font-bold">{hasName ? `Welcome back, ${displayName}` : 'Welcome Back'}</p>
        <p className="text-sm text-gray-700">Solve the Nonogram</p>
        <p className="text-sm text-gray-700">Click play to start your day with a new puzzle!</p>
      </div>
      <Button onClick={handlePlay} className="bg-green-600 hover:bg-green-700">
        {primaryActionLabel}
      </Button>
      {!user && (
        <Button onClick={onOpenLogin} className="bg-blue-600 hover:bg-blue-700">
          Log In
        </Button>
      )}
      <Button onClick={onShowHowTo} className="bg-gray-600 hover:bg-gray-700">
        How to Play
      </Button>

      {/* <QuickStats /> */}
    </div>
  );
};

export default LandingContent;
