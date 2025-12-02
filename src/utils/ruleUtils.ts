type RuleCell = number | { correct?: boolean; filled?: boolean } | null | undefined;
type RuleGrid = RuleCell[][] | string | null | undefined;
type ProgressCell = { correct: boolean; filled: boolean };

interface RuleStatus {
  count: number;
  satisfied: boolean;
}

const isCellWithCorrect = (cell: unknown): cell is { correct?: boolean } => {
  return typeof cell === "object" && cell !== null && "correct" in (cell as Record<string, unknown>);
};

const isCellWithFilled = (cell: unknown): cell is { filled?: boolean } => {
  return typeof cell === "object" && cell !== null && "filled" in (cell as Record<string, unknown>);
};

const normalizeGrid = (grid: RuleGrid): number[][] => {
  if (!grid) return [];

  const parsed = typeof grid === "string"
    ? (() => {
        try {
          return JSON.parse(grid);
        } catch {
          return [];
        }
      })()
    : grid;

  if (!Array.isArray(parsed)) return [];

  const normalized: number[][] = [];

  for (const row of parsed) {
    if (!Array.isArray(row)) return [];

    normalized.push(
      row.map((cell) => {
        if (typeof cell === "number") return cell === 1 ? 1 : 0;
        if (isCellWithCorrect(cell)) return cell.correct ? 1 : 0;
        return 0;
      })
    );
  }

  return normalized;
};

const normalizeProgressGrid = (grid: RuleGrid): ProgressCell[][] => {
  if (!grid) return [];

  const parsed = typeof grid === "string"
    ? (() => {
        try {
          return JSON.parse(grid);
        } catch {
          return [];
        }
      })()
    : grid;

  if (!Array.isArray(parsed)) return [];

  const normalized: ProgressCell[][] = [];

  for (const row of parsed) {
    if (!Array.isArray(row)) return [];

    normalized.push(
      row.map((cell) => {
        const correct = typeof cell === "number" ? cell === 1 : isCellWithCorrect(cell) ? Boolean(cell.correct) : false;
        const filled =
          typeof cell === "number"
            ? false // numeric grid = solution only; user hasn't filled anything yet
            : isCellWithFilled(cell)
              ? Boolean(cell.filled)
              : false;

        return { correct, filled };
      })
    );
  }

  return normalized;
};

const getRuleStatusesFromLine = (line: ProgressCell[]): RuleStatus[] => {
  const runs: RuleStatus[] = [];
  let count = 0;
  let allFilled = true;

  const pushRun = () => {
    runs.push({ count, satisfied: allFilled });
    count = 0;
    allFilled = true;
  };

  for (const cell of line) {
    if (cell.correct) {
      count += 1;
      allFilled = allFilled && cell.filled;
    } else if (count > 0) {
      pushRun();
    }
  }

  if (count > 0) {
    pushRun();
  }

  if (!runs.length) {
    return [{ count: 0, satisfied: true }];
  }

  return runs;
};

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
};

export const getRowRules = (grid: RuleGrid): number[][] => {
  const normalized = normalizeGrid(grid);
  return normalized.map(getRulesFromLine);
};

export const getColumnRules = (grid: RuleGrid): number[][] => {
  const normalized = normalizeGrid(grid);
  if (normalized.length === 0 || normalized[0].length === 0) return [];

  const cols = normalized[0].length;
  const result: number[][] = [];
  for (let c = 0; c < cols; c++) {
    const column = normalized.map((row) => row[c] ?? 0);
    result.push(getRulesFromLine(column));
  }
  return result;
};

export const getRowRuleStatuses = (grid: RuleGrid): RuleStatus[][] => {
  const normalized = normalizeProgressGrid(grid);
  return normalized.map(getRuleStatusesFromLine);
};

export const getColumnRuleStatuses = (grid: RuleGrid): RuleStatus[][] => {
  const normalized = normalizeProgressGrid(grid);
  if (normalized.length === 0 || normalized[0].length === 0) return [];

  const cols = normalized[0].length;
  const result: RuleStatus[][] = [];
  for (let c = 0; c < cols; c++) {
    const column = normalized.map((row) => row[c] ?? { correct: false, filled: false });
    result.push(getRuleStatusesFromLine(column));
  }
  return result;
};
