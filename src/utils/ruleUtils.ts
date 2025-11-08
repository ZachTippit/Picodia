export const getRulesFromLine = (line: number[]): number[] => {
  const rules: number[] = [];
  let count = 0;
  for (const cell of line) {
    if (cell === 1) count++;
    else if (count > 0) {
      rules.push(count);
      count = 0;
    }
  }
  if (count > 0) rules.push(count);
  return rules.length ? rules : [0];
}

export const getRowRules = (solution: number[][]): number[][] => {
  return solution.map(getRulesFromLine);
};

export const getColumnRules = (solution: number[][]): number[][] => {
  const cols = solution[0].length;
  const result: number[][] = [];
  for (let c = 0; c < cols; c++) {
    const column = solution.map((row) => row[c]);
    result.push(getRulesFromLine(column));
  }
  return result;
};