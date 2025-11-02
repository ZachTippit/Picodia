import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import HowToPlayGrid from './HowToPlayGrid';

const howToPlayRules = [
  'Look at each row clue to see how many consecutive squares belong in that row.',
  'Line up matching row and column clues to lock in the cells where they overlap.',
  'Use temporary marks for blanks so you can track which cells must stay empty.',
];

interface HowToPlayViewProps {
  onClose: () => void;
}

const TRANSITION_DURATION = 500;

const GRID_FADE_DURATION = 200;

const HowToPlayView = ({ onClose }: HowToPlayViewProps) => {
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
      setGridVisible(true);
      gridTimeoutRef.current = null;
    }, GRID_FADE_DURATION);
  }, [activeRule, renderedRule]);

  const handlePrevRule = () => setActiveRule((prev) => Math.max(0, prev - 1));
  const handleNextRule = () => setActiveRule((prev) => Math.min(howToPlayRules.length - 1, prev + 1));
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
        <div
          className={cn(
            'transition-opacity duration-200 ease-in-out',
            gridVisible ? 'opacity-100' : 'opacity-0'
          )}
        >
          <HowToPlayGrid activeRule={renderedRule} />
        </div>
        <p className="max-w-xs text-sm leading-snug text-gray-700">{howToPlayRules[activeRule]}</p>
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
