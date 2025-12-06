import { useUI } from "@/providers/UIProvider";
import { useEffect, useState } from "react";
import Button from "./Button";
import { GameStatus } from "@/types/enums";
import { useCurrentPuzzleAttempt } from "@/hooks/useCurrentPuzzleAttempt";

const primaryActionLabelOptions = {
  [GameStatus.Pending]: "Play",
  [GameStatus.InProgress]: "Continue",
  [GameStatus.Completed]: "See Results",
};

const PlayButton = () => {
  const { closeLandingScreen, setShowCountdown } = useUI();
  const { data: currentPuzzleAttempt } = useCurrentPuzzleAttempt();

  const [primaryActionLabel, setPrimaryActionLabel] = useState("Play");

  const puzzleStatus: GameStatus = currentPuzzleAttempt?.status;

  const handlePlay = () => {
    if(puzzleStatus === GameStatus.Pending || puzzleStatus === null) {
      setShowCountdown(true);
    }
    closeLandingScreen();
  };

  useEffect(() => {
    setPrimaryActionLabel(
      primaryActionLabelOptions[puzzleStatus as keyof typeof primaryActionLabelOptions] || "Play"
    );
  }, [puzzleStatus]);

  return (
    <Button onClick={handlePlay} className="bg-gray-900 text-white">
      {primaryActionLabel}
    </Button>
  );
};

export default PlayButton;
