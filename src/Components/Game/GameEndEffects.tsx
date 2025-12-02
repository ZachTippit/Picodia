import { useEffect, useState } from "react";
import Confetti from "./Confetti";
import GameSummary from "./GameSummary";
import { useCurrentPuzzleAttempt } from "@/hooks/useCurrentPuzzleAttempt";
import { GameStatus } from "@/types/enums";

const GameEndEffects = () => {
  const [isAreaExpanded, setIsAreaExpanded] = useState(false);
  const [shouldShowSummary, setShouldShowSummary] = useState(false);

  const { data: currentPuzzleAttempt } = useCurrentPuzzleAttempt();

  const isGameOver = currentPuzzleAttempt?.status === GameStatus.Completed;

  useEffect(() => {
    if (isGameOver) {
      setIsAreaExpanded(true);
      setShouldShowSummary(true);
    }
  }, [isGameOver]);

  if(!currentPuzzleAttempt) return null;

  return (
    <div>
      {" "}
      <Confetti setIsAreaExpanded={setIsAreaExpanded} setShouldShowSummary={setShouldShowSummary} />
      <GameSummary
        isAreaExpanded={isAreaExpanded}
        shouldShowSummary={shouldShowSummary}
      />
    </div>
  );
};

export default GameEndEffects;
