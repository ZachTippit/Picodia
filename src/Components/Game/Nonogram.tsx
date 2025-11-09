import { useState } from 'react';
import PuzzleGrid from './PuzzleGrid';
import {RulesRow, RulesCol } from './Rules';
import GameSummary from './GameSummary';
import Confetti from './Confetti';
import { useDailyPuzzle } from '@/hooks/useDailyPuzzle';

export const Nonogram = () => {
  const { data: dailyPuzzle } = useDailyPuzzle();
  
  const [isAreaExpanded, setIsAreaExpanded] = useState(false);
  const [shouldShowSummary, setShouldShowSummary] = useState(false);
  
  if (!dailyPuzzle) {
    return <div>Loading...</div>;
  }

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
        <RulesCol />
        {/* Row rules */}
        <RulesRow />
        {/* Puzzle grid */}
        <PuzzleGrid />
      </div>
    </div>
  );
};
