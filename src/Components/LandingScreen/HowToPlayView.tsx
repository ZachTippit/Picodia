import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import HowToPlayGrid from './HowToPlayGrid';

interface HowToPlayRule {
  id: string;
  text: string;
  showGrid?: boolean;
  showLoginButton?: boolean;
}

interface HowToPlayViewProps {
  onClose: () => void;
  onOpenLogin: () => void;
  isLoggedIn: boolean;
}

const TRANSITION_DURATION = 500;

const GRID_FADE_DURATION = 200;

const baseRules: HowToPlayRule[] = [
  {
    id: 'rule-1',
    text: 'Look at each row clue to see how many consecutive squares belong in that row.',
    showGrid: true,
  },
  {
    id: 'rule-2',
    text: 'Line up matching row and column clues to lock in the cells where they overlap.',
    showGrid: true,
  },
  {
    id: 'rule-3',
    text: 'Use temporary marks for blanks so you can track which cells must stay empty.',
    showGrid: true,
  },
];

const HowToPlayView = ({ onClose, onOpenLogin, isLoggedIn }: HowToPlayViewProps) => {
  const rules = useMemo<HowToPlayRule[]>(() => {
    if (isLoggedIn) {
      return baseRules;
    }

    return [
      ...baseRules,
      {
        id: 'rule-login',
        text: "Don't forget to log in to save and share results!",
        showGrid: false,
        showLoginButton: true,
      },
    ];
  }, [isLoggedIn]);

  const [activeRule, setActiveRule] = useState(0);
  const [renderedRule, setRenderedRule] = useState(0);
  const [gridVisible, setGridVisible] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const overlayTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const gridTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  useEffect(() => {
    setIsVisible(true);
    return () => {
      if (overlayTimeoutRef.current) {
        window.clearTimeout(overlayTimeoutRef.current);
      }
      if (gridTimeoutRef.current) {
        window.clearTimeout(gridTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (activeRule === renderedRule) return;
    setGridVisible(false);
    if (gridTimeoutRef.current) {
      window.clearTimeout(gridTimeoutRef.current);
    }
    gridTimeoutRef.current = window.setTimeout(() => {
      setRenderedRule(activeRule);
      if (rules[activeRule]?.showGrid !== false) {
        setGridVisible(true);
      }
      gridTimeoutRef.current = null;
    }, GRID_FADE_DURATION);
  }, [activeRule, renderedRule, rules]);

  useEffect(() => {
    const clampedActive = Math.min(activeRule, rules.length - 1);
    if (clampedActive !== activeRule) {
      setActiveRule(clampedActive);
      return;
    }

    const clampedRendered = Math.min(renderedRule, rules.length - 1);
    if (clampedRendered !== renderedRule) {
      setRenderedRule(clampedRendered);
      return;
    }

    setGridVisible(rules[clampedActive]?.showGrid !== false);
  }, [activeRule, renderedRule, rules]);

  const handlePrevRule = () => setActiveRule((prev) => Math.max(0, prev - 1));
  const handleNextRule = () => setActiveRule((prev) => Math.min(rules.length - 1, prev + 1));
  const handleClose = () => {
    setIsVisible(false);
    if (overlayTimeoutRef.current) {
      window.clearTimeout(overlayTimeoutRef.current);
    }
    overlayTimeoutRef.current = window.setTimeout(() => {
      setActiveRule(0);
      setRenderedRule(0);
      onClose();
    }, TRANSITION_DURATION);
  };

  return (
    <div
      className={cn(
        'absolute top-0 right-0 left-0 bottom-0 z-30 flex flex-col items-center bg-gray-200 px-4 py-6 transition-opacity duration-500 ease-in-out',
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <h1 className="mb-4 text-2xl">PICODIA</h1>
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 text-center">
        {rules[renderedRule]?.showGrid !== false && (
          <div
            className={cn(
              'transition-opacity duration-200 ease-in-out',
              gridVisible ? 'opacity-100' : 'opacity-0'
            )}
          >
            <HowToPlayGrid activeRule={renderedRule} />
          </div>
        )}
        <p className="max-w-xs text-sm leading-snug text-gray-700">{rules[activeRule]?.text}</p>
        {rules[activeRule]?.showLoginButton && (
          <button
            type="button"
            className="relative w-32 rounded-full bg-white px-4 py-2 text-gray-800 transition hover:bg-gray-300"
            onClick={onOpenLogin}
          >
            Log In
            <span
              aria-hidden="true"
              className="absolute top-0.5 right-0.5 block size-2 rounded-full bg-red-600 animate-pulse"
            />
          </button>
        )}
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
            Hint {activeRule + 1}/{rules.length}
          </span>
          <button
            type="button"
            onClick={handleNextRule}
            disabled={activeRule === rules.length - 1}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border border-gray-400 text-gray-700 transition-all duration-300',
              activeRule === rules.length - 1
                ? 'cursor-not-allowed opacity-40'
                : 'hover:bg-gray-200'
            )}
          >
            &rarr;
          </button>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="mt-6 w-32 rounded-full bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default HowToPlayView;
