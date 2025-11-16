import { useUI } from "@/providers/UIProvider";
import { useEffect, useState } from "react";
import Button from "./Button";
import { useClientBootstrap } from "@/hooks/useClientBootstrap";

const primaryActionLabelOptions = {
  pending: "Play",
  in_progress: "Continue",
  completed: "See Results",
};

const PlayButton = () => {
  const { closeLandingScreen, setShowCountdown } = useUI();

  const [primaryActionLabel, setPrimaryActionLabel] = useState("Play");

  const { data: clientBootstrap } = useClientBootstrap();

  const puzzleStatus = "pending";

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
