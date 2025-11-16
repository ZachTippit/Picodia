import React, { useState } from "react";
import Confetti from "./Confetti";
import GameSummary from "./GameSummary";

const GameEndEffects = () => {
  const [isAreaExpanded, setIsAreaExpanded] = useState(false);
  const [shouldShowSummary, setShouldShowSummary] = useState(false);
  return (
    <div>
      {" "}
      <Confetti setIsAreaExpanded={setIsAreaExpanded} setShouldShowSummary={setShouldShowSummary} />
      <GameSummary
        isAreaExpanded={isAreaExpanded}
        shouldShowSummary={shouldShowSummary}
        isWin={true}
      />
    </div>
  );
};

export default GameEndEffects;
