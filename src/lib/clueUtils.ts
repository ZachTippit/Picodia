export const getCluesFromLine = (line: number[]): number[] => {
  const clues: number[] = [];
  let count = 0;
  for (const cell of line) {
    if (cell === 1) count++;
    else if (count > 0) {
      clues.push(count);
      count = 0;
    }
  }
  if (count > 0) clues.push(count);
  return clues.length ? clues : [0];
}

export const getRowClues = (solution: number[][]): number[][] => {
  return solution.map(getCluesFromLine);
};

export const getColumnClues = (solution: number[][]): number[][] => {
  const cols = solution[0].length;
  const result: number[][] = [];
  for (let c = 0; c < cols; c++) {
    const column = solution.map((row) => row[c]);
    result.push(getCluesFromLine(column));
  }
  return result;
};