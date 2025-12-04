import { useEffect, useMemo, useRef, useState } from "react";
import { useSavePuzzleProgress } from "@hooks/useSavePuzzleProgress";
import { countFilledCorrect, createEmptyGrid, normalizeSavedGrid } from "@utils/gridHelpers";
import { cn } from "@utils/cn";
import { useDailyPuzzle } from "@/hooks/useDailyPuzzle";
import { useFinishPuzzle } from "@/hooks/useFinishPuzzle";
import { usePuzzleInteractions, CellSelectionResult } from "@/hooks/usePuzzleInteractions";
import { motion } from "framer-motion";
import { cellVariants, gridVariants } from "@/animations";
import { GameStatus } from "@/types/enums";
import { useCurrentPuzzleAttempt } from "@/hooks/useCurrentPuzzleAttempt";
import { useLoseLife } from "@/hooks/useLoseLife";
import { useElapsedTime } from "@/hooks/useElapsedTime";

interface PuzzleCellState {
  correct: boolean;
  filled: boolean;
  incorrect: boolean;
  id: string;
}

const PuzzleGrid = () => {
  const { data: dailyPuzzle } = useDailyPuzzle();
  const { data: currentAttempt } = useCurrentPuzzleAttempt();
  const elapsedSeconds = useElapsedTime(currentAttempt);
  const { mutateAsync: saveProgress } = useSavePuzzleProgress();
  const { loseLife } = useLoseLife();
  const { mutate: finishPuzzle } = useFinishPuzzle();

  const lives = currentAttempt?.lives_remaining ?? 0;
  const savedProgress = currentAttempt?.progress ?? null;
  const solution = dailyPuzzle?.puzzle_array ?? [];

  const deriveInitialGrid = useMemo(() => {
    const normalized = normalizeSavedGrid(savedProgress, solution);
    return normalized ?? createEmptyGrid(solution);
  }, [savedProgress, solution]);

  const [grid, setGrid] = useState<PuzzleCellState[][]>(deriveInitialGrid);
  const hasCompletedRef = useRef(false);

  const totalCorrect = solution.flat().filter((v) => v === 1).length;

  const rowComplete = useMemo(
    () => grid.map((row) => row.every((cell) => !cell.correct || cell.filled)),
    [grid]
  );

  const colComplete = useMemo(() => {
    if (grid.length === 0) return [];
    const cols = grid[0].length;
    return Array.from({ length: cols }, (_, c) =>
      grid.every((row) => !row[c].correct || row[c].filled)
    );
  }, [grid]);

  const isInteractionLocked = () => currentAttempt?.status === GameStatus.Completed || lives <= 0;

  const handleCellSelection = (r: number, c: number): CellSelectionResult => {
    if (isInteractionLocked()) return "ignored";

    let wasCorrect = false;

    // 1. Compute nextGrid manually (so it's fresh & not stale)
    let nextGrid: PuzzleCellState[][] = grid.map((row) => row.map((cell) => ({ ...cell })));

    const cell = nextGrid[r][c];

    const cellMarked = rowComplete[r] || colComplete[c];
    if (cell.filled || cell.incorrect || cellMarked) return "ignored";

    if (cell.correct) {
      cell.filled = true;
      wasCorrect = true;
    } else {
      cell.incorrect = true;
    }

    // 2. Apply UI update immediately
    setGrid(nextGrid);

    // 3. Fire backend updates (using NEXT GRID, not stale grid)
    (async () => {
      try {
        await saveProgress({
          progress: nextGrid, // IMPORTANT: fresh derived grid
          elapsedSeconds,
        });

        if (!wasCorrect) {
          const updatedAttempt = await loseLife();
          if (updatedAttempt.status === "completed") {
            hasCompletedRef.current = true;
          }
        } else {
          const filledCount = countFilledCorrect(nextGrid);
          const isComplete = filledCount === totalCorrect;

          if (isComplete && !hasCompletedRef.current) {
            hasCompletedRef.current = true;
            finishPuzzle({ progress: nextGrid, elapsedSeconds });
          }
        }
      } catch (err) {
        console.error("Async puzzle update failed:", err);
      }
    })();

    // 4. Return immediately for smooth UX
    return wasCorrect ? "correct" : "incorrect";
  };

  useEffect(() => {
    setGrid(deriveInitialGrid);
    hasCompletedRef.current = false;
  }, [deriveInitialGrid]);

  //
  // Interaction utilities (drag-based)
  //
  const { grid: gridInteractions, cell: cellInteractions } = usePuzzleInteractions({
    isInteractionLocked,
    handleCellSelection,
  });

  //
  // Render
  //
  return (
    <motion.div
      {...gridInteractions}
      className="inline-block border-4 border-gray-800 rounded-md overflow-hidden shadow-[0_0_10px_rgba(0,0,0,0.2)]"
      variants={gridVariants}
      initial="hidden"
      animate="visible"
      layout
    >
      {grid.map((row, r) => (
        <div key={r} className="flex">
          {row.map((cell, c) => (
            <motion.button
              key={cell.id}
              {...cellInteractions(r, c)}
              type="button"
              disabled={isInteractionLocked()}
              className={cn(
                "size-10 border border-gray-600 flex items-center justify-center transition-all bg-white",
                {
                  "bg-gray-800": cell.filled,
                  "bg-red-200": cell.incorrect,
                  "bg-gray-200": !cell.filled && !cell.incorrect && (rowComplete[r] || colComplete[c]),
                  "select-none": cell.filled || cell.incorrect || (rowComplete[r] || colComplete[c]),
                  "cursor-pointer hover:bg-gray-200":
                    !cell.filled && !cell.incorrect && !(rowComplete[r] || colComplete[c]),
                }
              )}
              variants={cellVariants}
              initial="idle"
              animate={cell.filled ? "filled" : cell.incorrect ? "incorrect" : "idle"}
              transition={{ duration: 0.2, ease: "easeOut" }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      ))}
    </motion.div>
  );
};

export default PuzzleGrid;
