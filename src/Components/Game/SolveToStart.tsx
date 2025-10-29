import { useState, useEffect, use } from "react";
import { GameContext } from "../../GameContext";
import { cn } from "../../lib/cn";
import StartCell from "./StartCell";
import Clues from "./Clues";

const answer = [
  [1, 1, 1],
  [1, 0, 0],
  [1, 0, 1],
];

const SolveToStart = () => {
  const {
    state: { preGameAnim },
    actions: {
      setPingHowTo,
      setPreGameAnim,
      setStartPing,
      startGame,
    },
  } = use(GameContext);

  const [correctSquares, setCorrectSquares] = useState(0);
  const winNum = 6; // 6 filled cells in `answer`

  // Create 2D grid of objects with state
  const [grid, setGrid] = useState(
    answer.map((row, r) =>
      row.map((value, c) => ({
        correct: value === 1,
        filled: false,
        id: `${r}-${c}`,
      }))
    )
  );

  const handleGuess = (r: number, c: number) => {
    setGrid((prev) => {
      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      const cell = next[r][c];

      // Prevent re-clicking already filled cells
      if (cell.filled) return prev;

      cell.filled = true;

      if (cell.correct) {
        setCorrectSquares((prevCount) => prevCount + 1);
      } else {
        wrongSolveToStart();
      }

      return next;
    });
  };

  useEffect(() => {
    console.log("correctSquares:", correctSquares);
    if (correctSquares === winNum) {
      handleWin();
    }
  }, [correctSquares]);

  const wrongSolveToStart = () => {
    setPingHowTo(true);
    setTimeout(() => setPingHowTo(false), 500);
  };

  const handleWin = () => {
    setPreGameAnim(true);
    setTimeout(() => {
      startGame();
      setPreGameAnim(false);
    }, 1200);
    setTimeout(() => setStartPing(true), 3000);
    setTimeout(() => setStartPing(false), 8000);
  };

  // Static clues (could be derived automatically if desired)
  const rowClues = [[3], [1], [2]];
  const colClues = [[3], [1, 1], [1, 1]];

  return (
    <div
      className={cn(
        "overflow-y-hidden flex flex-col items-center justify-center min-h-[550px] transition-all duration-700",
        preGameAnim ? "opacity-0 translate-x-12" : "opacity-100 translate-x-0"
      )}
    >
      <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-0.5 items-start justify-start">
        {/* Top-left corner */}
        <div />

        {/* Column clues */}
        <div className="grid grid-cols-3 gap-x-0.5">
          {colClues.map((clue, c) => (
            <div key={c} className="flex flex-col items-center justify-end h-10">
              {clue
                .slice()
                .reverse()
                .map((num, i) => (
                  <span key={i} className="text-xs leading-none">
                    {num}
                  </span>
                ))}
            </div>
          ))}
        </div>

        {/* Row clues */}
        <div className="grid grid-rows-3 gap-y-0.5">
          {rowClues.map((clue, r) => (
            <div
              key={r}
              className="flex justify-end items-center h-8 sm:h-10"
            >
              {clue.map((num, i) => (
                <span key={i} className="text-xs leading-none mr-1">
                  {num}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Actual 3x3 grid */}
        <div
          className="inline-block border-4 border-gray-800 rounded-md overflow-hidden 
                     shadow-[0_0_10px_rgba(0,0,0,0.2)]"
        >
          {grid.map((row, r) => (
            <div key={r} className="flex">
              {row.map((cell, c) => (
                <button
                  key={cell.id}
                  onClick={() => handleGuess(r, c)}
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 border border-gray-600 flex items-center justify-center transition-all select-none",
                    cell.filled
                      ? cell.correct
                        ? "bg-gray-800"
                        : "bg-red-200"
                      : "bg-white hover:bg-gray-200"
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolveToStart;
