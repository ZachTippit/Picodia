import React, { use, useContext, useEffect, useMemo, useRef, useState } from "react";
import { GameContext } from "../../providers/GameContext";
import { useSavePuzzleProgress } from "@hooks/useSavePuzzleProgress";
import { useActiveSession } from "@hooks/useActiveSession";
import { createEmptyGrid, normalizeSavedGrid } from "@utils/gridHelpers";
import { cn } from "@utils/cn";
import { useDailyPuzzle } from "@/hooks/useDailyPuzzle";
import { useCurrentPuzzleAttempt } from "@/hooks/useCurrentPuzzleAttempt";
import { useFinishPuzzle } from "@/hooks/useFinishPuzzle";

//initialGrid?: PuzzleCellState[][] | null;

type CellSelectionResult = "ignored" | "correct" | "incorrect";

export interface PuzzleCellState {
  correct: boolean;
  filled: boolean;
  incorrect: boolean;
  id: string;
}

const PuzzleGrid = () => {
  const {
    state: { lives, elapsedSeconds },
    actions: { loseLife },
  } = use(GameContext);
  const { mutate: saveProgress } = useSavePuzzleProgress();
  const { data: dailyPuzzle } = useDailyPuzzle();
  const { data: activeSession } = useActiveSession();
  const { data: activeAttempt } = useCurrentPuzzleAttempt();
  const { mutate: finishPuzzle } = useFinishPuzzle();

  const solution = dailyPuzzle?.puzzle_array || [[]];

  const totalCorrect = solution.flat().filter((v) => v === 1).length;

  const initialGrid = useMemo<PuzzleCellState[][] | null>(() => {

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
  const activePointerIdRef = useRef<number | string | null>(null);
  const isDraggingRef = useRef(false);
  const draggedCellsRef = useRef<Set<string>>(new Set());
  const supportsPointerEvents = typeof window !== "undefined" && "PointerEvent" in window;

  const isInteractionLocked = () => activeAttempt?.status === "completed";

  useEffect(() => {
    setGrid(deriveInitialGrid);
    hasCompletedRef.current = false;
  }, [deriveInitialGrid]);

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
      resetDragState();
    }

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

      //updateGameOver(true);

      if (wasCorrect) {
        // add logic to win game
        //winGame?.();
      } else {
        //loseGame?.();
      }
    }

    return result;
  };

  const resetDragState = () => {
    activePointerIdRef.current = null;
    isDraggingRef.current = false;
    draggedCellsRef.current.clear();
  };

  const getCellFromElement = (element: Element | null) => {
    if (!element) {
      return null;
    }

    const cellButton = (element as HTMLElement).closest<HTMLButtonElement>("[data-row]");

    if (!cellButton) {
      return null;
    }

    const rowAttr = cellButton.getAttribute("data-row");
    const colAttr = cellButton.getAttribute("data-col");

    if (rowAttr === null || colAttr === null) {
      return null;
    }

    const r = Number(rowAttr);
    const c = Number(colAttr);

    if (Number.isNaN(r) || Number.isNaN(c)) {
      return null;
    }

    return { r, c };
  };

  const getCellFromPoint = (x: number, y: number) => {
    if (typeof document === "undefined") {
      return null;
    }
    const element = document.elementFromPoint(x, y);
    return getCellFromElement(element);
  };

  const processDragOverCell = (r: number, c: number, pointerId?: number | string | null) => {
    if (isInteractionLocked()) {
      resetDragState();
      return;
    }

    if (
      !isDraggingRef.current ||
      (pointerId !== undefined && pointerId !== null && activePointerIdRef.current !== pointerId)
    ) {
      return;
    }

    const cellKey = `${r}-${c}`;
    if (draggedCellsRef.current.has(cellKey)) {
      return;
    }

    const result = handleCellSelection(r, c);

    if (isInteractionLocked()) {
      resetDragState();
      return;
    }

    if (result === "incorrect") {
      resetDragState();
      return;
    }

    if (result === "correct") {
      draggedCellsRef.current.add(cellKey);
    }
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
    r: number,
    c: number
  ) => {
    event.preventDefault();

    if (isInteractionLocked()) {
      resetDragState();
      return;
    }

    const result = handleCellSelection(r, c);

    if (result !== "correct" || isInteractionLocked()) {
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
    if (isInteractionLocked()) {
      resetDragState();
      return;
    }

    processDragOverCell(r, c, event.pointerId);
  };

  const handlePointerEnd = (event: React.PointerEvent<Element>) => {
    if (!Number.isNaN(event.clientX) && !Number.isNaN(event.clientY)) {
      const cell = getCellFromPoint(event.clientX, event.clientY);
      if (cell) {
        handleCellSelection(cell.r, cell.c);
      }
    }

    if (activePointerIdRef.current === event.pointerId) {
      resetDragState();
    }
  };

  const handlePointerLeaveGrid = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) {
      return;
    }

    const relatedTarget = event.relatedTarget as Node | null;
    if (relatedTarget && event.currentTarget.contains(relatedTarget)) {
      return;
    }

    resetDragState();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isInteractionLocked()) {
      resetDragState();
      return;
    }

    if (!isDraggingRef.current || activePointerIdRef.current !== event.pointerId) {
      return;
    }

    const { clientX, clientY } = event;
    if (Number.isNaN(clientX) || Number.isNaN(clientY)) {
      return;
    }

    const cell = getCellFromPoint(clientX, clientY);
    if (!cell) {
      return;
    }

    processDragOverCell(cell.r, cell.c, event.pointerId);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLButtonElement>, r: number, c: number) => {
    if (supportsPointerEvents) {
      return;
    }

    event.preventDefault();

    if (isInteractionLocked()) {
      resetDragState();
      return;
    }

    const primaryTouch = event.changedTouches[0] ?? event.touches[0];
    if (!primaryTouch) {
      return;
    }

    const result = handleCellSelection(r, c);

    if (result !== "correct" || isInteractionLocked()) {
      resetDragState();
      return;
    }

    const cellKey = `${r}-${c}`;
    draggedCellsRef.current.add(cellKey);
    activePointerIdRef.current = primaryTouch.identifier;
    isDraggingRef.current = true;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (supportsPointerEvents) {
      return;
    }

    if (isInteractionLocked()) {
      resetDragState();
      return;
    }

    const activeId = activePointerIdRef.current;
    if (!isDraggingRef.current || activeId === null) {
      return;
    }

    let relevantTouch: Touch | null = null;
    for (let i = 0; i < event.changedTouches.length; i += 1) {
      const touch = event.changedTouches.item(i);
      if (touch && touch.identifier === activeId) {
        // @ts-ignore
        relevantTouch = touch;
        break;
      }
    }

    if (!relevantTouch) {
      return;
    }

    event.preventDefault();

    const cell = getCellFromPoint(relevantTouch.clientX, relevantTouch.clientY);
    if (!cell) {
      return;
    }

    processDragOverCell(cell.r, cell.c, activeId);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (supportsPointerEvents) {
      return;
    }

    const activeId = activePointerIdRef.current;
    if (activeId === null) {
      return;
    }

    for (let i = 0; i < event.changedTouches.length; i += 1) {
      const touch = event.changedTouches.item(i);
      if (touch && touch.identifier === activeId) {
        const cell = getCellFromPoint(touch.clientX, touch.clientY);
        if (cell) {
          handleCellSelection(cell.r, cell.c);
        }
        resetDragState();
        return;
      }
    }
  };

  return (
    <div
      className="inline-block border-4 border-gray-800 rounded-md overflow-hidden 
                 shadow-[0_0_10px_rgba(0,0,0,0.2)]"
      style={{ touchAction: "none" }}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={handlePointerLeaveGrid}
      onPointerMove={handlePointerMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
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
              onTouchStart={(event) => handleTouchStart(event, r, c)}
              data-row={r}
              data-col={c}
              disabled={isInteractionLocked()}
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
