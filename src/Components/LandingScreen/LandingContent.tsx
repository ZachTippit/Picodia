import React, { use, useEffect, useRef } from 'react';
import { GameContext } from '../../providers/GameContext';
import Button from './Button';
import Loading from './Loading';
import { useSupabaseAuth } from '../../SupabaseProvider';
import { useProfile } from '@hooks/useProfile';
import { useCurrentPuzzleAttempt } from '@hooks/useCurrentPuzzleAttempt';
import { useUI } from '@/providers/UIProvider';

  const primaryActionLabelOptions = {
    pending: 'Play',
    in_progress: 'Continue',
    completed: 'See Results',
  };

interface LandingContentProps {
  setIsClosing: React.Dispatch<React.SetStateAction<boolean>>;
}

const LandingContent = ({
  setIsClosing,
}: LandingContentProps) => {
  const {
    actions: { beginCountdown, startGame },
  } = use(GameContext);
  const { openLogin, openHowTo, closeLandingScreen } = useUI();

  const { user, loading: userLoading } = useSupabaseAuth();

  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: activeAttempt, isLoading: activeAttemptLoading } = useCurrentPuzzleAttempt();

  const [primaryActionLabel, setPrimaryActionLabel] = React.useState('Play');

  const playTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  const displayName = profile?.display_name ?? user?.email;
  const hasName = Boolean(displayName);

  const puzzleStatus = activeAttempt?.status ?? null;

  useEffect(() => {
    setPrimaryActionLabel(
      primaryActionLabelOptions[puzzleStatus as keyof typeof primaryActionLabelOptions] || 'Play'
    );
  }, [puzzleStatus]);

  const handlePlay = () => {
    if (puzzleStatus === 'in_progress') {
      startGame();
    } else {
      beginCountdown();
    }

    setIsClosing(true);
    // @ts-ignore
    playTimeoutRef.current = window.setTimeout(() => {
      closeLandingScreen();
      playTimeoutRef.current = null;
    }, 500);
  };

  const isContentLoading = userLoading || profileLoading || activeAttemptLoading;
  if(isContentLoading){
    return <Loading />
  }

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
        <Button onClick={openLogin} className="bg-blue-600 hover:bg-blue-700">
          Log In
        </Button>
      )}
      <Button onClick={openHowTo} className="bg-gray-600 hover:bg-gray-700">
        How to Play
      </Button>

      {/* <QuickStats /> */}
    </div>
  );
};

export default LandingContent;
