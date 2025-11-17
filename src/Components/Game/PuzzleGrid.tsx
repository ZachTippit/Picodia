import { use, useEffect, useMemo, useRef, useState } from "react";
import { GameContext } from "../../providers/GameContext";
import { useSavePuzzleProgress } from "@hooks/useSavePuzzleProgress";
import { countFilledCorrect, createEmptyGrid, normalizeSavedGrid } from "@utils/gridHelpers";
import { cn } from "@utils/cn";
import { useDailyPuzzle } from "@/hooks/useDailyPuzzle";
import { useFinishPuzzle } from "@/hooks/useFinishPuzzle";
import { usePuzzleInteractions, CellSelectionResult } from "@/hooks/usePuzzleInteractions";
import { motion } from "framer-motion";
import { cellVariants, gridVariants } from "@/animations";
import { PuzzleOutcome } from "@/types/enums";
import { useCurrentPuzzleAttempt } from "@/hooks/useCurrentPuzzleAttempt";

interface PuzzleCellState {
  correct: boolean;
  filled: boolean;
  incorrect: boolean;
  id: string;
}

const PuzzleGrid = () => {
  const { lives, elapsedSeconds, loseLife } = use(GameContext);

  const { mutate: saveProgress } = useSavePuzzleProgress();
  const { data: dailyPuzzle } = useDailyPuzzle();
  const { data: currentPuzzleAttempt } = useCurrentPuzzleAttempt();
  const { mutate: finishPuzzle } = useFinishPuzzle();

  const currentPuzzleAttemptId = currentPuzzleAttempt?.id ?? null;
  const savedProgress = currentPuzzleAttempt?.progress ?? null;

  // Solution grid for this puzzle (array of 1s and 0s)
  const solution = dailyPuzzle?.puzzle_array ?? [];

  // -------------------------------
  // 🧠 INITIAL GRID DERIVATION
  // Load saved grid if it exists, else empty grid
  // -------------------------------
  const deriveInitialGrid = useMemo(() => {
    const normalized = normalizeSavedGrid(savedProgress, solution);
    return normalized ?? createEmptyGrid(solution);
  }, [savedProgress, solution]);

  const [grid, setGrid] = useState<PuzzleCellState[][]>(deriveInitialGrid);
  const hasCompletedRef = useRef(false);

  const totalCorrect = solution.flat().filter((v) => v === 1).length;

  const isInteractionLocked = () => false;

  const handleCellSelection = (r: number, c: number): CellSelectionResult => {
    if (isInteractionLocked()) {
      return "ignored";
    }

    let pendingUpdate: {
      grid: PuzzleCellState[][];
      lives: number;
      completed: boolean;
      wasCorrect: boolean;
    } | null = null;

    let result: CellSelectionResult = "ignored";

    setGrid((prev) => {
      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      const cell = next[r][c];

      // Prevent re-filling or re-marking incorrect cells
      if (cell.filled || cell.incorrect) {
        return prev;
      }

      let nextLives = lives;
      let completed = false;

      // Correct move
      if (cell.correct) {
        cell.filled = true;
        const filledCount = countFilledCorrect(next);
        completed = filledCount === totalCorrect;
        result = "correct";

      // Incorrect move
      } else {
        cell.incorrect = true;
        nextLives = Math.max(lives - 1, 0);
        loseLife();
        completed = nextLives <= 0;
        result = "incorrect";
      }

      pendingUpdate = {
        grid: next,
        lives: nextLives,
        completed,
        wasCorrect: cell.correct,
      };

      return next;
    });

    if (!pendingUpdate) return result;

    const { grid: nextGrid, lives: nextLives, completed, wasCorrect } = pendingUpdate;

    // Save progress immediately
    if (currentPuzzleAttemptId) {
      saveProgress({
        attemptId: currentPuzzleAttemptId,
        data: {
          progress: nextGrid,
          lives: nextLives,
          elapsedSeconds,
          completed,
        },
      });
    }

    if (completed && !hasCompletedRef.current) {
      hasCompletedRef.current = true;

      const outcome = wasCorrect ? PuzzleOutcome.Win : PuzzleOutcome.Loss;

      if (currentPuzzleAttemptId) {
        finishPuzzle({
          attemptId: currentPuzzleAttemptId,
          wasSuccessful: outcome === PuzzleOutcome.Win,
          livesRemaining: nextLives,
        });
      }
    }

    return result;
  };

  // 🔁 Reset grid when we get new data from React Query
  useEffect(() => {
    setGrid(deriveInitialGrid);
    hasCompletedRef.current = false;
  }, [deriveInitialGrid]);

  // Hook for interactivity (drag-to-fill, etc.)
  const {
    grid: gridInteractions,
    cell: cellInteractions,
    resetDragState,
  } = usePuzzleInteractions({
    isInteractionLocked,
    handleCellSelection,
  });

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
                "size-10 border border-gray-600 flex items-center justify-center transition-all select-none",
                cell.filled
                  ? "bg-gray-800"
                  : cell.incorrect
                    ? "bg-red-200"
                    : "bg-white hover:bg-gray-200"
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
