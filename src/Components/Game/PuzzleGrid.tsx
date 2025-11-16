import { use, useEffect, useMemo, useRef, useState } from "react";
import { GameContext } from "../../providers/GameContext";
import { useSavePuzzleProgress } from "@hooks/useSavePuzzleProgress";
import { useActiveSession } from "@hooks/useActiveSession";
import { createEmptyGrid, normalizeSavedGrid } from "@utils/gridHelpers";
import { cn } from "@utils/cn";
import { useDailyPuzzle } from "@/hooks/useDailyPuzzle";
import { useCurrentPuzzleAttempt } from "@/hooks/useCurrentPuzzleAttempt";
import { useFinishPuzzle } from "@/hooks/useFinishPuzzle";
import { usePuzzleInteractions, CellSelectionResult } from "@/hooks/usePuzzleInteractions";
import { motion } from "framer-motion";
import { cellVariants, gridVariants } from "@/animations";

const PuzzleGrid = () => {
  const { lives, elapsedSeconds, loseLife } = use(GameContext);

  const { mutate: saveProgress } = useSavePuzzleProgress();
  const { data: dailyPuzzle } = useDailyPuzzle();
  const { data: activeSession } = useActiveSession();
  const { data: activeAttempt } = useCurrentPuzzleAttempt();
  const { mutate: finishPuzzle } = useFinishPuzzle();

  const solution = dailyPuzzle?.puzzle_array || [[]];
  const totalCorrect = solution.flat().filter((v) => v === 1).length;

  const initialGrid = useMemo<PuzzleCellState[][] | null>(() => {
    // Your original code had this returning null; kept as-is
    return null;
  }, [activeSession?.active_puzzle_id, dailyPuzzle]);

  const deriveInitialGrid = useMemo(() => {
    const source = (initialGrid as PuzzleCellState[][] | string | null) ?? null;
    const normalized = normalizeSavedGrid(source, solution);
    return normalized ?? createEmptyGrid(solution);
  }, [initialGrid, solution]);

  const countFilledCorrect = (gridState: PuzzleCellState[][]) =>
    gridState.reduce(
      (count, row) => count + row.filter((cell) => cell.correct && cell.filled).length,
      0
    );

  const [grid, setGrid] = useState<PuzzleCellState[][]>(deriveInitialGrid);

  const hasCompletedRef = useRef(false);

  const isInteractionLocked = () => activeAttempt?.status === "completed";

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

      if (cell.filled || cell.incorrect) {
        return prev;
      }

      let nextLives = lives;
      let completed = false;

      if (cell.correct) {
        cell.filled = true;
        const filledCount = countFilledCorrect(next);
        completed = filledCount === totalCorrect;
        result = "correct";
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

    if (!pendingUpdate) {
      return result;
    }

    const { grid: nextGrid, lives: nextLives, completed, wasCorrect } = pendingUpdate;

    if (completed) {
      // Keep parity with original behavior: stop any active drag immediately
      resetDragState();
    }

    console.log("Active Session:", activeSession);

    console.log("Saving progress:", {
      attemptId: activeSession?.current_attempt_id ?? null,
      data: {
        progress: nextGrid,
        lives: nextLives,
        elapsedSeconds,
        completed,
      },
    });

    saveProgress({
      attemptId: activeSession?.current_attempt_id ?? null,
      data: {
        progress: nextGrid,
        lives: nextLives,
        elapsedSeconds,
        completed,
      },
    });

    if (completed && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      const outcome = wasCorrect ? "win" : "loss";

      const attemptId = activeSession?.current_attempt_id ?? null;
      if (attemptId) {
        finishPuzzle({
          attemptId,
          wasSuccessful: outcome === "win",
          livesRemaining: nextLives,
        });
      }

      // If you later add win/lose UI hooks, they can stay here.
    }

    return result;
  };

  useEffect(() => {
    setGrid(deriveInitialGrid);
    hasCompletedRef.current = false;
  }, [deriveInitialGrid]);

  // --- Keep game rule logic here; the hook only wires events/drag ---
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
      className="inline-block border-4 border-gray-800 rounded-md overflow-hidden 
                 shadow-[0_0_10px_rgba(0,0,0,0.2)]"
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
