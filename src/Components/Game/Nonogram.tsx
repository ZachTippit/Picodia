import PuzzleGrid from './PuzzleGrid';
import {RulesRow, RulesCol } from './Rules';
import GameEndEffects from './GameEndEffects';
import { useDailyPuzzle } from '@/hooks/useDailyPuzzle';

export const Nonogram = () => {
  
  return (
    <div className="flex flex-col items-center gap-4 my-6">
      <GameEndEffects />
      <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-0.5 items-start justify-start">
        {/* Top-left corner */}
        <div />
        {/* Column rules */}
        <RulesCol />
        {/* Row rules */}
        <RulesRow />
        {/* Puzzle grid */}
        <PuzzleGrid />
      </div>
    </div>
  );
};
