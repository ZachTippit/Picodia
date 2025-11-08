import { useState } from 'react';
import PuzzleGrid, { PuzzleCellState } from './PuzzleGrid';
import {RulesRow, RulesCol } from './Rules';
import GameSummary from './GameSummary';
import Confetti from './Confetti';
import { Puzzle } from '@hooks/useGetPuzzles';
import { getColumnRules, getRowRules } from '@utils/ruleUtils';

interface NonogramProps {
  puzzle: Puzzle;
  initialGrid?: PuzzleCellState[][] | null;
}

export const Nonogram = ({ puzzle, initialGrid = null }: NonogramProps) => {
  const solution = puzzle.puzzle_array;
  const rowRules = getRowRules(solution);
  const colRules = getColumnRules(solution);

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
        {/* Column rules */}
        <RulesCol rules={colRules} />
        {/* Row rules */}
        <RulesRow rules={rowRules} />
        {/* Puzzle grid */}
        <PuzzleGrid solution={solution} puzzleId={puzzle.id} initialGrid={initialGrid} />
      </div>
    </div>
  );
};
