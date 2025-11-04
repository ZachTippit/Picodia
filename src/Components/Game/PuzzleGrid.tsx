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

type CellSelectionResult = "ignored" | "correct" | "incorrect";

export interface PuzzleCellState {
  correct: boolean;
  filled: boolean;
  incorrect: boolean;
  id: string;
}

const PuzzleGrid: React.FC<PuzzleGridProps> = ({ solution, puzzleId, initialGrid = null }) => {
  const { mutate: saveProgress } = useSavePuzzleProgress(puzzleId);
  const { mutate: completePuzzle } = useCompletePuzzle();
  const {
    state: { lives, elapsedSeconds },
    actions: { loseLife, winGame, updatePrevGameArray },
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

  const normalizeSavedGrid = (
    saved: PuzzleCellState[][] | string | null
  ): PuzzleCellState[][] | null => {
    if (!saved) {
      return null;
    }

    let parsed: PuzzleCellState[][];

    if (typeof saved === 'string') {
      try {
        parsed = JSON.parse(saved) as PuzzleCellState[][];
      } catch (error) {
        console.error('Unable to parse saved puzzle grid.', error);
        return null;
      }
    } else {
      parsed = saved;
    }

    if (!Array.isArray(parsed) || parsed.length !== solution.length) {
      return null;
    }

    const normalized: PuzzleCellState[][] = [];

    for (let r = 0; r < solution.length; r += 1) {
      const row = parsed[r];
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
    const source = (initialGrid as PuzzleCellState[][] | string | null) ?? null;
    const normalized = normalizeSavedGrid(source);
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
  const activePointerIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const draggedCellsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    setGrid(deriveInitialGrid);
    setCorrectCount(countFilledCorrect(deriveInitialGrid));
    updatePrevGameArray(deriveInitialGrid);
    hasCompletedRef.current = false;
  }, [deriveInitialGrid, updatePrevGameArray]);

  const handleCellSelection = (r: number, c: number): CellSelectionResult => {
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
        setCorrectCount(filledCount);
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

      updatePrevGameArray(next);

      return next;
    });

    if (!pendingUpdate) {
      return result;
    }

    const { grid: nextGrid, lives: nextLives, completed, wasCorrect } = pendingUpdate;

    saveProgress({
      progress: nextGrid,
      lives: nextLives,
      elapsedSeconds,
      completed,
    });

    if (completed && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      const outcome = wasCorrect ? 'win' : 'loss';

      completePuzzle({
        puzzleId,
        outcome,
        progress: nextGrid,
        livesRemaining: nextLives,
        elapsedSeconds,
      });

      if (wasCorrect) {
        winGame?.();
      }
    }

    return result;
  };

  const resetDragState = () => {
    activePointerIdRef.current = null;
    isDraggingRef.current = false;
    draggedCellsRef.current.clear();
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
    r: number,
    c: number
  ) => {
    event.preventDefault();
    const result = handleCellSelection(r, c);

    if (result !== "correct") {
      resetDragState();
      return;
    }

    const cellKey = `${r}-${c}`;
    draggedCellsRef.current.add(cellKey);
    activePointerIdRef.current = event.pointerId;
    isDraggingRef.current = true;
  };

  const handlePointerEnter = (
    event: React.PointerEvent<HTMLButtonElement>,
    r: number,
    c: number
  ) => {
    if (
      !isDraggingRef.current ||
      activePointerIdRef.current !== event.pointerId
    ) {
      return;
    }

    const cellKey = `${r}-${c}`;
    if (draggedCellsRef.current.has(cellKey)) {
      return;
    }

    const result = handleCellSelection(r, c);

    if (result === "incorrect") {
      resetDragState();
      return;
    }

    if (result === "correct") {
      draggedCellsRef.current.add(cellKey);
    }
  };

  const handlePointerEnd = (event: React.PointerEvent<Element>) => {
    if (activePointerIdRef.current === event.pointerId) {
      resetDragState();
    }
  };

  const handlePointerLeaveGrid = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!isDraggingRef.current) {
      return;
    }

    const relatedTarget = event.relatedTarget as Node | null;
    if (relatedTarget && event.currentTarget.contains(relatedTarget)) {
      return;
    }

    resetDragState();
  };

  return (
    <div
      className="inline-block border-4 border-gray-800 rounded-md overflow-hidden 
                 shadow-[0_0_10px_rgba(0,0,0,0.2)]"
      style={{ touchAction: "none" }}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={handlePointerLeaveGrid}
    >
      {grid.map((row, r) => (
        <div key={r} className="flex">
          {row.map((cell, c) => (
            <button
              key={cell.id}
              onClick={() => handleCellSelection(r, c)}
              onPointerDown={(event) => handlePointerDown(event, r, c)}
              onPointerEnter={(event) => handlePointerEnter(event, r, c)}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
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
