import React, { use, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { GameContext } from "../../GameContext";
import { useSavePuzzleProgress } from "../../hooks/useSavePuzzleProgress";
import { useCompletePuzzle } from "../../hooks/useProfile";

interface PuzzleGridProps {
  solution: number[][];
  puzzleId: string;
  initialGrid?: PuzzleCellState[][] | null;
}

export interface PuzzleCellState {
  correct: boolean;
  filled: boolean;
  incorrect: boolean;
  id: string;
}

const PuzzleGrid: React.FC<PuzzleGridProps> = ({ solution, puzzleId, initialGrid = null }) => {
  const { mutate: saveProgress } = useSavePuzzleProgress();
  const completePuzzle = useCompletePuzzle();
  const {
    state: { lives, elapsedSeconds },
    actions: { loseLife, winGame },
  } = use(GameContext);
  const totalCorrect = solution.flat().filter((v) => v === 1).length;

  const createEmptyGrid = () =>
    solution.map((row, r) =>
      row.map((value, c) => ({
        correct: value === 1,
        filled: false,
        incorrect: false,
        id: `${r}-${c}`,
      }))
    );

  const normalizeSavedGrid = (saved: PuzzleCellState[][] | null): PuzzleCellState[][] | null => {
    if (!saved) {
      return null;
    }

    if (!Array.isArray(saved) || saved.length !== solution.length) {
      return null;
    }

    const normalized: PuzzleCellState[][] = [];

    for (let r = 0; r < solution.length; r += 1) {
      const row = saved[r];
      if (!Array.isArray(row) || row.length !== solution[r].length) {
        return null;
      }

      const normalizedRow: PuzzleCellState[] = row.map((cell, c) => {
        const fallbackId = `${r}-${c}`;
        return {
          correct: solution[r][c] === 1,
          filled: Boolean((cell as PuzzleCellState)?.filled),
          incorrect: Boolean((cell as PuzzleCellState)?.incorrect),
          id: (cell as PuzzleCellState)?.id ?? fallbackId,
        };
      });

      normalized.push(normalizedRow);
    }

    return normalized;
  };

  const deriveInitialGrid = useMemo(() => {
    const normalized = normalizeSavedGrid(initialGrid ?? null);
    return normalized ?? createEmptyGrid();
  }, [initialGrid, solution]);

  const countFilledCorrect = (gridState: PuzzleCellState[][]) =>
    gridState.reduce(
      (count, row) =>
        count +
        row.filter((cell) => cell.correct && cell.filled).length,
      0
    );

  const [grid, setGrid] = useState<PuzzleCellState[][]>(deriveInitialGrid);

  const [correctCount, setCorrectCount] = useState<number>(() =>
    countFilledCorrect(deriveInitialGrid)
  );
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    setGrid(deriveInitialGrid);
    setCorrectCount(countFilledCorrect(deriveInitialGrid));
    hasCompletedRef.current = false;
  }, [deriveInitialGrid]);

  const handleCellClick = (r: number, c: number) => {
    setGrid((prev) => {
      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      const cell = next[r][c];

      if (cell.filled || cell.incorrect) return prev;

      let nextLives = lives;
      let completed = false;

      if (cell.correct) {
        cell.filled = true;
        const filledCount = countFilledCorrect(next);
        setCorrectCount(filledCount);
        completed = filledCount === totalCorrect;
      } else {
        cell.incorrect = true;
        nextLives = Math.max(lives - 1, 0);
        loseLife();
        completed = nextLives <= 0;
      }

      saveProgress({
        progress: next,
        lives: nextLives,
        elapsedSeconds,
        completed,
      });

      if (completed && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        const outcome = cell.correct ? 'win' : 'loss';

        completePuzzle.mutate({
          puzzleId,
          outcome,
          progress: next,
          livesRemaining: nextLives,
          elapsedSeconds,
        });

        if (cell.correct) {
          winGame?.();
        }
      }

      return next;
    });
  };

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
