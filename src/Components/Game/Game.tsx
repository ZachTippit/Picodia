import { useEffect, useState } from "react";
import { Nonogram } from "./Nonogram";
import PreGameCountdown from "./PreGameCountdown";
import { cn } from "@utils/cn";
import { useUI } from "@/providers/UIProvider";
import { useCurrentPuzzleAttempt } from "@/hooks/useCurrentPuzzleAttempt";
import { GameStatus, PuzzleOutcome } from "@/types/enums";

const Game = () => {
  const { showCountdown } = useUI();
  const { data: currentAttempt } = useCurrentPuzzleAttempt();
  const [ puzzleVisible, setPuzzleVisible ] = useState(false);

  useEffect(() => {
    if (showCountdown) {
      setPuzzleVisible(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      setPuzzleVisible(true);
    }, 150);
    return () => clearTimeout(timeout);
  }, [showCountdown]);

  const isGameOver = currentAttempt?.status === GameStatus.Completed;
  const isWin = currentAttempt?.outcome === PuzzleOutcome.Win;

  return (
    <div className="relative min-h-[450px] flex flex-col items-center justify-start flex-1">
      {showCountdown && <PreGameCountdown setPuzzleVisible={setPuzzleVisible} />}
      <div
        className={cn(
          "w-full transition-opacity duration-500 flex flex-col items-center",
          puzzleVisible ? "opacity-100" : "opacity-0"
        )}
      >
        <Nonogram />
      </div>
      {
        isGameOver &&
        <div className="flex items-center justify-center w-full mt-6 min-h-[56px]">
          <div
            className={cn(
              "text-center transition-all duration-500",
              isGameOver ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
            )}
          >
            <p className="text-xl font-bold uppercase tracking-wide">
              {isWin ? "You Win!" : "You Lose"}
            </p>
          </div>
        </div>
      }
    </div>
  );
};

export default Game;
