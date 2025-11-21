import { CSSProperties, use, useMemo } from "react";
import { useCurrentPuzzleAttempt } from "@/hooks/useCurrentPuzzleAttempt";
// @ts-ignore
import { default as Heart } from "../../assets/heart.png";
// @ts-ignore
import { default as EmptyHeart } from "../../assets/empty-heart.png";
import { useElapsedTime } from "@/hooks/useElapsedTime";

const pad = (val: number) => {
  const value = Math.max(0, val);
  return value < 10 ? `0${value}` : `${value}`;
};

const formatElapsedTime = (totalSeconds: number) => {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${pad(minutes)}:${pad(seconds)}`;
};

interface GameSummaryProps {
  isAreaExpanded: boolean;
  shouldShowSummary: boolean;
}

const GameSummary = ({ isAreaExpanded, shouldShowSummary }: GameSummaryProps) => {
  const { data: currentPuzzleAttempt } = useCurrentPuzzleAttempt();
  const elapsedSeconds = useElapsedTime(currentPuzzleAttempt);

  const { lives_remaining: lives, max_lives, outcome } = currentPuzzleAttempt;

  const isWin = outcome === "win";

  const resultHearts = useMemo(
    () => Array.from({ length: max_lives }, (_, index) => (index < lives ? Heart : EmptyHeart)),
    [lives, max_lives]
  );

  const maxHeightStyle = useMemo<CSSProperties>(
    () => ({
      maxHeight: isAreaExpanded ? "220px" : "0px",
    }),
    [isAreaExpanded]
  );

  return (
    <div
      className="w-full overflow-hidden transition-[max-height] duration-500 ease-out"
      style={maxHeightStyle}
    >
      <div
        className={
          shouldShowSummary
            ? "fade-in-fwd flex flex-col items-center gap-3 text-center"
            : "flex flex-col items-center gap-3 text-center opacity-0"
        }
        aria-hidden={!shouldShowSummary}
      >
        <p className="text-base font-bold uppercase tracking-wide">
          {isWin ? "You Won!" : "You Lost"}
        </p>
        <div className="flex flex-row items-center justify-center gap-8">
          <div>
            <p className="text-sm font-semibold">Lives</p>
            <div className="mt-1 flex flex-row gap-x-1">
              {resultHearts.map((heart, index) => (
                <img
                  className="life"
                  src={heart}
                  alt="Lives remaining"
                  key={`result-heart-${index}`}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold">Time</p>
            <div className="mt-1 text-lg font-mono">{formatElapsedTime(elapsedSeconds)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSummary;
