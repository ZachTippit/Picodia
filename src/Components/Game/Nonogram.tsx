import { getColumnClues, getRowClues } from '../../lib/clueUtils';
import RowClues from './RowClues';
import ColClues from './ColClues';
import PuzzleGrid, { PuzzleCellState } from './PuzzleGrid';
import { Puzzle } from '../../hooks/useGetPuzzle';
import GameSummary from './GameSummary';
import Confetti from './Confetti';
import { useState } from 'react';

interface NonogramProps {
  puzzle: Puzzle;
  initialGrid?: PuzzleCellState[][] | null;
}

export const Nonogram = ({ puzzle, initialGrid = null }: NonogramProps) => {
  const solution = puzzle.puzzle_array;
  const rowClues = getRowClues(solution);
  const colClues = getColumnClues(solution);

  const [isAreaExpanded, setIsAreaExpanded] = useState(false);
  const [shouldShowSummary, setShouldShowSummary] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 my-6">
      <Confetti setIsAreaExpanded={setIsAreaExpanded} setShouldShowSummary={setShouldShowSummary} />
      <GameSummary
        isAreaExpanded={isAreaExpanded}
        shouldShowSummary={shouldShowSummary}
        isWin={true}
      />
      <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-0.5 items-start justify-start">
        {/* Top-left corner */}
        <div />
        {/* Column clues */}
        <ColClues colClues={colClues} />
        {/* Row clues */}
        <RowClues rowClues={rowClues} />
        {/* Puzzle grid */}
        <PuzzleGrid solution={solution} puzzleId={puzzle.id} initialGrid={initialGrid} />
      </div>
    </div>
  );
};
