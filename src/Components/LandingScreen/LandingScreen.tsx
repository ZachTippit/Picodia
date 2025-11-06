import { cn } from '../../lib/cn';
import { use, useEffect, useMemo, useRef, useState } from 'react';
import PreviewGrid from './PreviewGrid';
import { useSupabaseAuth } from '../../SupabaseProvider';
import { GameContext } from '../../GameContext';
import { useActiveSession, useProfile } from '../../hooks/useProfile';
import { useGetPuzzles } from '../../hooks/useGetPuzzle';
import QuickStats from './QuickStats';
import Button from './Button';
import Loading from './Loading';
import LandingContent from './LandingContent';

interface LandingScreenProps {
  onPlay: () => void;
  onShowHowTo: () => void;
  onOpenLogin: () => void;
}

const LandingScreen = ({ onPlay, onShowHowTo, onOpenLogin }: LandingScreenProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const { user } = useSupabaseAuth();
  const { isPending: profilePending } = useProfile();
  const { isPending: puzzlesPending } = useGetPuzzles();
  const profileLoading = Boolean(user) && profilePending;
  const isContentLoading = puzzlesPending || profileLoading;

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
          <Loading />
        ) : (
          <LandingContent
            onPlay={onPlay}
            onShowHowTo={onShowHowTo}
            onOpenLogin={onOpenLogin}
            isClosing={isClosing}
            setIsClosing={setIsClosing}
          />
        )}
      </div>
    </div>
  );
};

export default LandingScreen;
