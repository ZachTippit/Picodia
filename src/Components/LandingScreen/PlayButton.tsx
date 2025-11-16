import { useUI } from "@/providers/UIProvider";
import { useEffect, useState } from "react";
import Button from "./Button";
import { useCurrentPuzzleAttempt } from "@/hooks/useCurrentPuzzleAttempt";

const primaryActionLabelOptions = {
  pending: "Play",
  in_progress: "Continue",
  completed: "See Results",
};

const PlayButton = () => {
  const { closeLandingScreen, setShowCountdown } = useUI();

  const { data: activeAttempt } = useCurrentPuzzleAttempt();

  const [primaryActionLabel, setPrimaryActionLabel] = useState("Play");

  const puzzleStatus = activeAttempt?.status ?? null;

  const handlePlay = () => {
    if(puzzleStatus === "pending" || puzzleStatus === null) {
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
    <Button onClick={handlePlay} className="bg-green-600 hover:bg-green-700">
      {primaryActionLabel}
    </Button>
  );
};

export default PlayButton;
