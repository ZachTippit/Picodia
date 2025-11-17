import { useUI } from "@/providers/UIProvider";
import { useEffect, useState } from "react";
import Button from "./Button";
import { GameStatus } from "@/types/enums";
import { useClientBootstrap } from "@/hooks/useClientBootstrap";

const primaryActionLabelOptions = {
  [GameStatus.Pending]: "Play",
  [GameStatus.InProgress]: "Continue",
  [GameStatus.Completed]: "See Results",
};

const PlayButton = () => {
  const { closeLandingScreen, setShowCountdown } = useUI();
  const { data: clientBootstrap } = useClientBootstrap();

  const [primaryActionLabel, setPrimaryActionLabel] = useState("Play");

  const puzzleStatus: GameStatus = clientBootstrap?.session?.latest_daily_attempt?.status;
  console.log("Puzzle Status:", puzzleStatus);

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
    <Button onClick={handlePlay} className="bg-green-600 hover:bg-green-700">
      {primaryActionLabel}
    </Button>
  );
};

export default PlayButton;
