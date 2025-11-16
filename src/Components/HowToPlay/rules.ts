export type HowToPlayCellState = 0 | 1 | 2;

export interface HowToPlayRule {
  id: string;
  text: string;
  showLoginButton?: boolean;
  board?: HowToPlayCellState[][];
  rowRules?: (string | number)[][];
  colRules?: (string | number)[][];
}

const rules: HowToPlayRule[] = [
  {
    id: "rule-1",
    text: "Look at each row clue to see how many consecutive squares belong in that row.",
    board: [
      [1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
    rowRules: [
      ["", "", "5"],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
  },
  {
    id: "rule-2",
    text: "Look at each row clue to see how many consecutive squares belong in that row.",
    board: [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
    ],
    rowRules: [
      ["", "", "5"],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
    colRules: [
      ["5", "", ""],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
  },
  {
    id: "rule-3",
    text: "Look at each row clue to see how many consecutive squares belong in that row.",
    board: [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
    ],
    rowRules: [
      ["", "", "5"],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
    colRules: [
      ["5", "", ""],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
      ["3", "", ""],
    ],
  },
  {
    id: "rule-4",
    text: "Look at each row clue to see how many consecutive squares belong in that row.",
    board: [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
    ],
    rowRules: [
      ["", "", "5"],
      ["", "1", "1"],
      ["", "", "5"],
      ["", "", "1"],
      ["", "", "1"],
    ],
    colRules: [
      ["5", "", ""],
      ["1", "1", ""],
      ["1", "1", ""],
      ["1", "1", ""],
      ["3", "", ""],
    ],
  },
];

export { rules };
