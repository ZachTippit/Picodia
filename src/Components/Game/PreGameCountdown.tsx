import { use, useEffect, useRef, useState } from 'react';
import { GameContext } from '../../GameContext';
import { useStartPuzzle } from '@hooks/useStartPuzzle';
import { cn } from '@utils/cn';

interface PreGameCountdownProps {
  setPuzzleVisible: (visible: boolean) => void;
}

const PreGameCountdown = ({ setPuzzleVisible }: PreGameCountdownProps) => {
  const COUNTDOWN_STEP_DURATION = 1000;
  const GO_DISPLAY_DURATION = 1200;

  const {
    state: { isCountdownActive },
    actions: { endCountdown, startGame },
  } = use(GameContext);

  
  const [countdownValue, setCountdownValue] = useState<number>(3);
  const [go, setShowGo] = useState(false);
  const goTimeoutRef = useRef<number | null>(null);
  
  const { data } = useStartPuzzle({ enabled: go});
  
  useEffect(() => {
    return () => {
      if (goTimeoutRef.current) {
        clearTimeout(goTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isCountdownActive) {
      setShowGo(false);
      setPuzzleVisible(false);
      setCountdownValue(3);
    } else {
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
      }, GO_DISPLAY_DURATION);

      return () => {
        if (goTimeoutRef.current) {
          clearTimeout(goTimeoutRef.current);
          goTimeoutRef.current = null;
        }
      };
    }

    const timeout = window.setTimeout(() => {
      setCountdownValue((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
    }, COUNTDOWN_STEP_DURATION);
    return () => clearTimeout(timeout);
  }, [countdownValue, endCountdown, startGame]);

  const shouldShowCountdown = Boolean(isCountdownActive || countdownValue !== null || go);

  if (!shouldShowCountdown) {
    return null;
  }

  return (
    <div
      className={cn(
        'absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300 text-gray-900'
      )}
    >
      <span
        key={go ? 'go' : countdownValue}
        className="text-6xl font-bold tracking-widest countdown-number"
      >
        {go ? 'GO!' : countdownValue}
      </span>
    </div>
  );
};

export default PreGameCountdown;
