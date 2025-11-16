import { useEffect, useState } from "react";
import { Nonogram } from "./Nonogram";
import PreGameCountdown from "./PreGameCountdown";
import { cn } from "@utils/cn";
import { useUI } from "@/providers/UIProvider";

const Game = () => {
  const { showCountdown } = useUI();
  const [puzzleVisible, setPuzzleVisible] = useState(false);

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

  return (
    <div className="relative min-h-[450px] flex items-center justify-center">
      {showCountdown && <PreGameCountdown setPuzzleVisible={setPuzzleVisible} />}
      <div
        className={cn(
          "w-full transition-opacity duration-500",
          puzzleVisible ? "opacity-100" : "opacity-0"
        )}
      >
        <Nonogram />
      </div>
    </div>
  );
};

export default Game;
