import { use, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { getColumnClues, getRowClues } from '../../lib/clueUtils';
import RowClues from './RowClues';
import ColClues from './ColClues';
import PuzzleGrid, { PuzzleCellState } from './PuzzleGrid';
import { Puzzle } from '../../hooks/useGetPuzzle';
import { GameContext } from '../../GameContext';
// @ts-ignore
import { default as Heart } from '../../assets/heart.png';
// @ts-ignore
import { default as EmptyHeart } from '../../assets/empty-heart.png';
import { useProfileQuery } from '../../hooks/useProfile';

const pad = (val: number) => {
  const value = Math.max(0, val);
  return value < 10 ? `0${value}` : `${value}`;
};

const formatElapsedTime = (totalSeconds: number) => {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${pad(minutes)}:${pad(seconds)}`;
};

const AREA_GROW_DELAY_MS = 450;
const RESULTS_SHOW_DELAY_MS = 750;
const CELEBRATION_START_DELAY_MS = 450;
const CELEBRATION_DURATION_MS = 4200;

type MutableCSSProperties = CSSProperties & Record<string, string | number>;

type CelebrationParticle = {
  id: string;
  style: MutableCSSProperties;
};

const CONFETTI_COLORS = ['#F87171', '#38BDF8', '#FBBF24', '#34D399', '#A78BFA', '#F97316'];

const createCelebrationParticles = (isWin: boolean): CelebrationParticle[] => {
  const count = isWin ? 45 : 30;

  return Array.from({ length: count }, (_, index) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 0.8;
    const duration = 2200 + Math.random() * 1600;
    const drift = (Math.random() - 0.5) * 40;
    const rotation = 0.8 + Math.random() * 1.8;
    const scale = 0.9 + Math.random() * 0.6;

    const style: MutableCSSProperties = {
      left: `${left}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}ms`,
    };

    style['--drift'] = `${drift}vw`;
    style['--scale'] = `${scale}`;

    if (isWin) {
      style.backgroundColor = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
      style['--rotation'] = `${rotation}`;
    } else {
      style.fontSize = `${1.1 + Math.random() * 0.7}rem`;
    }

    return {
      id: `${isWin ? 'win' : 'lose'}-${index}-${Math.random().toString(16).slice(2, 6)}`,
      style,
    };
  });
};

interface NonogramProps {
  puzzle: Puzzle;
  initialGrid?: PuzzleCellState[][] | null;
  puzzleId: string;
}

export const Nonogram = ({ puzzle, initialGrid = null, puzzleId }: NonogramProps) => {
  const {
    state: { gameOver, lives, maxLives, elapsedSeconds, didWin },
  } = use(GameContext);
  const solution = puzzle.puzzle_array;
  const rowClues = getRowClues(solution);
  const colClues = getColumnClues(solution);
  const sanitizedLives = Math.max(0, Math.min(maxLives, lives));
  const resultHearts = useMemo(
    () =>
      Array.from({ length: maxLives }, (_, index) =>
        index < sanitizedLives ? Heart : EmptyHeart
      ),
    [maxLives, sanitizedLives]
  );

  const { data: profile } = useProfileQuery();

  const [isAreaExpanded, setIsAreaExpanded] = useState(false);
  const [shouldShowSummary, setShouldShowSummary] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [particles, setParticles] = useState<CelebrationParticle[]>([]);

  useEffect(() => {
    let areaTimer: number | null = null;
    let summaryTimer: number | null = null;
    let celebrationStartTimer: number | null = null;
    let celebrationEndTimer: number | null = null;

    if (gameOver) {
      setIsAreaExpanded(false);
      setShouldShowSummary(false);
      setShowCelebration(false);

      setParticles(createCelebrationParticles(Boolean(didWin)));

      areaTimer = window.setTimeout(() => {
        setIsAreaExpanded(true);
      }, AREA_GROW_DELAY_MS);

      summaryTimer = window.setTimeout(() => {
        setShouldShowSummary(true);
      }, RESULTS_SHOW_DELAY_MS);

      celebrationStartTimer = window.setTimeout(() => {
        setShowCelebration(true);
      }, CELEBRATION_START_DELAY_MS);

      celebrationEndTimer = window.setTimeout(() => {
        setShowCelebration(false);
        setParticles([]);
      }, CELEBRATION_START_DELAY_MS + CELEBRATION_DURATION_MS);
    } else {
      setIsAreaExpanded(false);
      setShouldShowSummary(false);
      setShowCelebration(false);
      setParticles([]);
    }

    return () => {
      if (areaTimer) {
        window.clearTimeout(areaTimer);
      }
      if (summaryTimer) {
        window.clearTimeout(summaryTimer);
      }
      if (celebrationStartTimer) {
        window.clearTimeout(celebrationStartTimer);
      }
      if (celebrationEndTimer) {
        window.clearTimeout(celebrationEndTimer);
      }
    };
  }, [didWin, gameOver]);

  const showResultsSummary = shouldShowSummary;
  const maxHeightStyle = useMemo<CSSProperties>(
    () => ({
      maxHeight: isAreaExpanded ? '220px' : '0px',
    }),
    [isAreaExpanded]
  );

  const isWin = profile.current_puzzle_outcome === "win";
  const celebrationClass = isWin ? 'confetti-piece' : 'smiley-piece';

  return (
    <div className="flex flex-col items-center gap-4 my-6">
      {showCelebration && (
        <div className="celebration-overlay" aria-hidden="true">
          {particles.map((particle) => (
            <span
              key={particle.id}
              className={celebrationClass}
              aria-hidden="true"
              style={particle.style}
            >
              {isWin ? '<3' : ':('}
            </span>
          ))}
        </div>
      )}
      <div
        className="w-full overflow-hidden transition-[max-height] duration-500 ease-out"
        style={maxHeightStyle}
      >
        <div
          className={
            shouldShowSummary
              ? 'fade-in-fwd flex flex-col items-center gap-3 text-center'
              : 'flex flex-col items-center gap-3 text-center opacity-0'
          }
          aria-hidden={!shouldShowSummary}
        >
          <p className="text-base font-bold uppercase tracking-wide">{profile.current_puzzle_outcome === "win" ? 'You Won!' : 'You Lost'}</p>
          <div className="flex flex-row items-center justify-center gap-8">
            <div>
              <p className="text-sm font-semibold">Lives</p>
              <div className="mt-1 flex flex-row gap-x-1">
                {resultHearts.map((heart, index) => (
                  <img className="life" src={heart} alt="Lives remaining" key={`result-heart-${index}`} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold">Time</p>
              <div className="mt-1 text-lg font-mono">{formatElapsedTime(elapsedSeconds)}</div>
            </div>
          </div>
        </div>
      </div>
      {showResultsSummary && (
        <div className="h-2" aria-hidden="true" />
      )}
      <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-0.5 items-start justify-start">
        {/* Top-left corner */}
        <div />
        {/* Column clues */}
        <ColClues colClues={colClues} />
        {/* Row clues */}
        <RowClues rowClues={rowClues} />
        {/* Puzzle grid */}
        <PuzzleGrid solution={solution} puzzleId={puzzleId} initialGrid={initialGrid} />
      </div>

      {/* <button
        onClick={() => setGrid(Array.from({ length: size }, () => Array(size).fill('empty')))}
        className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
      >
        Reset
      </button> */}
    </div>
  );
};

