import { useState } from "react";
import Confetti from "./Confetti";
import { useCurrentPuzzleAttempt } from "@/hooks/useCurrentPuzzleAttempt";

const GameEndEffects = () => {
  const [, setIsAreaExpanded] = useState(false);
  const [, setShouldShowSummary] = useState(false);

  const { data: currentPuzzleAttempt } = useCurrentPuzzleAttempt();

  if(!currentPuzzleAttempt) return null;

  return (
    <Confetti setIsAreaExpanded={setIsAreaExpanded} setShouldShowSummary={setShouldShowSummary} />
  );
};

export default GameEndEffects;
