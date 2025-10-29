import { useState } from 'react';
import { getColumnClues, getRowClues } from '../../lib/clueUtils';
import RowClues from './RowClues';
import ColClues from './ColClues';
import PuzzleGrid from './PuzzleGrid';
import { Puzzle } from '../../hooks/useGetPuzzle';

type CellState = 'filled' | 'empty' | 'marked';

interface NonogramProps {
  puzzle: Puzzle;
}

export const Nonogram = ({ puzzle }: NonogramProps) => {
  const solution = puzzle.puzzle_array;
  const size = solution.length;
  
  const [grid, setGrid] = useState<CellState[][]>(
    Array.from({ length: size }, () => Array(size).fill('empty'))
  );
  const rowClues = getRowClues(solution);
  const colClues = getColumnClues(solution);

  const toggleCell = (r: number, c: number) => {
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] =
        next[r][c] === 'filled' ? 'marked' : next[r][c] === 'marked' ? 'empty' : 'filled';
      return next;
    });
  };

  const checkSolved = () => {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (
          (solution[r][c] === 1 && grid[r][c] !== 'filled') ||
          (solution[r][c] === 0 && grid[r][c] === 'filled')
        ) {
          return false;
        }
      }
    }
    return true;
  };

  const isSolved = checkSolved();

  return (
    <div className="flex flex-col items-center gap-4 my-6">
      <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-0.5 items-start justify-start">
        {/* Top-left corner */}
        <div />
        {/* Column clues */}
        <ColClues colClues={colClues} />
        {/* Row clues */}
        <RowClues rowClues={rowClues}/>
        {/* Puzzle grid */}
        <PuzzleGrid grid={grid} toggleCell={toggleCell} isSolved={isSolved} />
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
