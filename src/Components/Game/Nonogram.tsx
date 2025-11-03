import { getColumnClues, getRowClues } from '../../lib/clueUtils';
import RowClues from './RowClues';
import ColClues from './ColClues';
import PuzzleGrid, { PuzzleCellState } from './PuzzleGrid';
import { Puzzle } from '../../hooks/useGetPuzzle';

interface NonogramProps {
  puzzle: Puzzle;
  initialGrid?: PuzzleCellState[][] | null;
  puzzleId: string;
}

export const Nonogram = ({ puzzle, initialGrid = null, puzzleId }: NonogramProps) => {
  const solution = puzzle.puzzle_array;
  const rowClues = getRowClues(solution);
  const colClues = getColumnClues(solution);

  return (
    <div className="flex flex-col items-center gap-4 my-6">
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
