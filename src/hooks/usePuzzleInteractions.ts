// src/hooks/usePuzzleInteractions.ts
import { useRef, useMemo } from "react";

export type CellSelectionResult = "ignored" | "correct" | "incorrect";

interface UsePuzzleInteractionsArgs {
  /** Your game rule handler – must return "ignored" | "correct" | "incorrect" */
  handleCellSelection: (r: number, c: number) => CellSelectionResult;
  /** Lock check – when true, all interactions are ignored and drag state is reset */
  isInteractionLocked: () => boolean;
}

/**
 * Centralizes all pointer/touch/drag interactions for the puzzle grid.
 * Returns grid-level props and a per-cell prop factory for easy spreading.
 */
export function usePuzzleInteractions({
  handleCellSelection,
  isInteractionLocked,
}: UsePuzzleInteractionsArgs) {
  // Drag state
  const activePointerIdRef = useRef<number | string | null>(null);
  const isDraggingRef = useRef(false);
  const draggedCellsRef = useRef<Set<string>>(new Set());

  // Feature detection
  const supportsPointerEvents = useMemo(
    () => typeof window !== "undefined" && "PointerEvent" in window,
    []
  );

  const resetDragState = () => {
    activePointerIdRef.current = null;
    isDraggingRef.current = false;
    draggedCellsRef.current.clear();
  };

  // --- Helpers to resolve DOM->cell coordinates ----
  const getCellFromElement = (element: Element | null) => {
    if (!element) return null;
    const cellButton = (element as HTMLElement).closest<HTMLButtonElement>("[data-row]");
    if (!cellButton) return null;

    const rowAttr = cellButton.getAttribute("data-row");
    const colAttr = cellButton.getAttribute("data-col");
    if (rowAttr === null || colAttr === null) return null;

    const r = Number(rowAttr);
    const c = Number(colAttr);
    if (Number.isNaN(r) || Number.isNaN(c)) return null;

    return { r, c };
  };

  const getCellFromPoint = (x: number, y: number) => {
    if (typeof document === "undefined") return null;
    const element = document.elementFromPoint(x, y);
    return getCellFromElement(element);
  };

  const processDragOverCell = (
    r: number,
    c: number,
    pointerId?: number | string | null
  ) => {
    if (isInteractionLocked()) {
      resetDragState();
      return;
    }

    if (
      !isDraggingRef.current ||
      (pointerId !== undefined &&
        pointerId !== null &&
        activePointerIdRef.current !== pointerId)
    ) {
      return;
    }

    const cellKey = `${r}-${c}`;
    if (draggedCellsRef.current.has(cellKey)) return;

    const result = handleCellSelection(r, c);

    // If locked after selection or the result was incorrect, end the drag
    if (isInteractionLocked() || result === "incorrect") {
      resetDragState();
      return;
    }

    if (result === "correct") {
      draggedCellsRef.current.add(cellKey);
    }
  };

  // --------------- Pointer handlers (mouse/stylus/touch w/ PointerEvent) ---------------
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
    // Commit a final cell if we ended on one
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
    if (!isDraggingRef.current) return;

    const relatedTarget = event.relatedTarget as Node | null;
    if (relatedTarget && event.currentTarget.contains(relatedTarget)) {
      return; // still inside the grid
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
    if (Number.isNaN(clientX) || Number.isNaN(clientY)) return;

    const cell = getCellFromPoint(clientX, clientY);
    if (!cell) return;

    processDragOverCell(cell.r, cell.c, event.pointerId);
  };

  // -------------------- Touch handlers (fallback when no PointerEvent) --------------------
  const handleTouchStart = (
    event: React.TouchEvent<HTMLButtonElement>,
    r: number,
    c: number
  ) => {
    if (supportsPointerEvents) return; // Pointer events cover touch already

    event.preventDefault();

    if (isInteractionLocked()) {
      resetDragState();
      return;
    }

    const primaryTouch = event.changedTouches[0] ?? event.touches[0];
    if (!primaryTouch) return;

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
    if (supportsPointerEvents) return;
    if (isInteractionLocked()) {
      resetDragState();
      return;
    }

    const activeId = activePointerIdRef.current;
    if (!isDraggingRef.current || activeId === null) return;

    let relevantTouch: Touch | null = null;
    for (let i = 0; i < event.changedTouches.length; i += 1) {
      const touch = event.changedTouches.item(i);
      if (touch && touch.identifier === activeId) {
        // @ts-ignore: TS can't narrow TouchList.item nullability well here
        relevantTouch = touch;
        break;
      }
    }

    if (!relevantTouch) return;

    event.preventDefault();

    const cell = getCellFromPoint(relevantTouch.clientX, relevantTouch.clientY);
    if (!cell) return;

    processDragOverCell(cell.r, cell.c, activeId);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (supportsPointerEvents) return;

    const activeId = activePointerIdRef.current;
    if (activeId === null) return;

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

  // -------------------- Public props you can spread --------------------
  const grid = {
    onPointerUp: handlePointerEnd,
    onPointerCancel: handlePointerEnd,
    onPointerLeave: handlePointerLeaveGrid,
    onPointerMove: handlePointerMove,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchEnd,
    style: { touchAction: "none" as const },
  };

  const cell = (r: number, c: number) => ({
    onClick: () => handleCellSelection(r, c),
    onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) =>
      handlePointerDown(event, r, c),
    onPointerEnter: (event: React.PointerEvent<HTMLButtonElement>) =>
      handlePointerEnter(event, r, c),
    onPointerUp: handlePointerEnd,
    onPointerCancel: handlePointerEnd,
    onTouchStart: (event: React.TouchEvent<HTMLButtonElement>) =>
      handleTouchStart(event, r, c),
    "data-row": r,
    "data-col": c,
  });

  return {
    grid,
    cell,
    resetDragState, // exposed so the parent can reset immediately on local "completed"
  };
}