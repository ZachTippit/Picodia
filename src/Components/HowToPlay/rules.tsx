export const rules: HowToPlayRule[] = [
  {
    id: "rule-1",
    description: (
      <p>
        Reveal the hidden shape without making more than <strong>3 mistakes</strong>. 
        You only get <strong>one chance a day</strong> to solve the daily puzzle!
      </p>
    ),
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

  {
    id: "rule-2",
    description: (
      <p>
        Each number tells you how many <strong>consecutive</strong> squares in that row or
        column must be filled. A “5” means five filled squares in a row with no gaps.
      </p>
    ),
    board: [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
    ],
    rowRules: [["", "", "5"], ["", "", "1"], ["", "", "1"], ["", "", "1"], ["", "", "1"]],
    colRules: [["5", "", ""], ["1", "", ""], ["1", "", ""], ["1", "", ""], ["1", "", ""]],
  },

  {
    id: "rule-3",
    description: (
      <p>
        Column clues work the same way. A <strong>“3”</strong> above a column means there are
        three consecutive filled squares somewhere in that column.
      </p>
    ),
    board: [
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
    rowRules: [["", "", "1"], ["", "", "1"], ["", "", "1"], ["", "", ""], ["", "", ""]],
    colRules: [["", "", ""], ["", "", ""], ["3", "", ""], ["", "", ""], ["", "", ""]],
  },

  {
    id: "rule-4",
    description: (
      <p>
        Multiple numbers mean multiple <strong>groups</strong> of filled squares. For example,
        “2 2” means two filled squares, a gap, then two filled squares again.
      </p>
    ),
    board: [
      [0, 0, 0, 0, 0],
      [1, 1, 0, 1, 1],
      [0, 0, 0, 0, 0],
      [1, 1, 1, 0, 1],
      [0, 0, 0, 0, 0],
    ],
    rowRules: [
      ["", "", ""],
      ["", "2", "2"],
      ["", "", ""],
      ["", "3", "1"],
      ["", "", ""],
    ],
    colRules: [
      ["", "1", "1"],
      ["", "1", "1"],
      ["", "", "1"],
      ["", "", "1"],
      ["", "1", "1"],
    ],
  },

  {
    id: "rule-5",
    description: (
      <p>
        A puzzle is solved when <strong>every row</strong> and <strong>every column</strong>{" "}
        satisfies all of its clues. When everything matches, the hidden shape appears!
      </p>
    ),
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
