const createEmptyGrid = (solution: number[][]) =>
  solution.map((row, r) =>
    row.map((value, c) => ({
      correct: value === 1,
      filled: false,
      incorrect: false,
      id: `${r}-${c}`,
    }))
  );

const normalizeSavedGrid = (
  saved: PuzzleCellState[][] | string | null,
  solution: number[][]
): PuzzleCellState[][] | null => {
  if (!saved) {
    return null;
  }

  let parsed: PuzzleCellState[][];

  if (typeof saved === "string") {
    try {
      parsed = JSON.parse(saved) as PuzzleCellState[][];
    } catch (error) {
      console.error("Unable to parse saved puzzle grid.", error);
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

const countFilledCorrect = (gridState: PuzzleCellState[][]) =>
  gridState.reduce(
    (count, row) => count + row.filter((cell) => cell.correct && cell.filled).length,
    0
  );

export { createEmptyGrid, normalizeSavedGrid, countFilledCorrect };
