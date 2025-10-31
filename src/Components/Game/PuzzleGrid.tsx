import React, { use, useState } from "react";
import { cn } from "../../lib/cn";
import { GameContext } from "../../GameContext";
import { useSavePuzzleProgress } from "../../hooks/useSavePuzzleProgress";

interface PuzzleGridProps {
  solution: number[][];
}

const PuzzleGrid: React.FC<PuzzleGridProps> = ({ solution }) => {
  const { mutate: saveProgress } = useSavePuzzleProgress();
  const { actions: { loseLife } } = use(GameContext);
  const totalCorrect = solution.flat().filter((v) => v === 1).length;

  const [grid, setGrid] = useState(
    solution.map((row, r) =>
      row.map((value, c) => ({
        correct: value === 1,
        filled: false,
        incorrect: false,
        id: `${r}-${c}`,
      }))
    )
  );

  const [correctCount, setCorrectCount] = useState(0);

  const handleCellClick = (r: number, c: number) => {
    setGrid((prev) => {
      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      const cell = next[r][c];

      if (cell.filled || cell.incorrect) return prev;

      if (cell.correct) {
        cell.filled = true;
        requestAnimationFrame(() =>
          setCorrectCount((count) => {
            const newCount = count + 1;
            if (newCount === totalCorrect){
              saveProgress({ progress: next, completed: true });
              onSolved();
            }
            return newCount;
          })
        );
      } else {
        cell.incorrect = true;
        loseLife();
      }

      saveProgress({ progress: next });

      return next;
    });
  };

  const onSolved = () => {
    console.log("Puzzle solved!");
  }

  return (
    <div
      className="inline-block border-4 border-gray-800 rounded-md overflow-hidden 
                 shadow-[0_0_10px_rgba(0,0,0,0.2)]"
    >
      {grid.map((row, r) => (
        <div key={r} className="flex">
          {row.map((cell, c) => (
            <button
              key={cell.id}
              onClick={() => handleCellClick(r, c)}
              className={cn(
                "size-10 border border-gray-600 flex items-center justify-center transition-all select-none",
                cell.filled
                  ? "bg-gray-800"
                  : cell.incorrect
                  ? "bg-red-200"
                  : "bg-white hover:bg-gray-200"
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default PuzzleGrid;
