import React, { use, useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import { GameContext } from '../../GameContext';

interface PreGameCountdownProps {
  setPuzzleVisible: (visible: boolean) => void;
}

const PreGameCountdown = ({ setPuzzleVisible }: PreGameCountdownProps) => {
  const {
    state: { isCountdownActive },
    actions: { endCountdown, startGame, setStartPing },
  } = use(GameContext);

  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [go, setShowGo] = useState(false);
  const goTimeoutRef = useRef<number | null>(null);
  const pingTimeoutRef = useRef<number | null>(null);


  useEffect(() => {
    return () => {
      if (goTimeoutRef.current) {
        clearTimeout(goTimeoutRef.current);
      }
      if (pingTimeoutRef.current) {
        clearTimeout(pingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isCountdownActive) {
      setShowGo(false);
      setPuzzleVisible(false);
      setCountdownValue(3);
    } else {
      setCountdownValue(null);
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
        setStartPing(true);
        if (pingTimeoutRef.current) {
          clearTimeout(pingTimeoutRef.current);
        }
        pingTimeoutRef.current = window.setTimeout(() => {
          setStartPing(false);
          pingTimeoutRef.current = null;
        }, 5000);
      }, 600);

      return () => {
        if (goTimeoutRef.current) {
          clearTimeout(goTimeoutRef.current);
          goTimeoutRef.current = null;
        }
      };
    }

    const timeout = window.setTimeout(() => {
      setCountdownValue((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [countdownValue, endCountdown, setStartPing, startGame]);

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
        key={go ? 'go' : (countdownValue ?? 'blank')}
        className="text-6xl font-bold tracking-widest countdown-number"
      >
        {go ? 'GO!' : (countdownValue ?? 3)}
      </span>
    </div>
  );
};

export default PreGameCountdown;
