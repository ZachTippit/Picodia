import GameClock from "./GameClock";
import { cn } from "@utils/cn";
import LifeDisplay from "./LifeDisplay";
import ResultsActions from "./ResultsActions";

const Footer = () => {

  const showLiveStats = true;

  return (
    <div className="w-full mb-8 pt-4 border border-b-0 border-x-0 border-t-gray-300">
      <div className="relative flex min-h-16 w-full items-center justify-center">
        <div
          className={cn(
            "flex w-full flex-row items-center justify-center transition-all duration-500",
            showLiveStats
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-2 pointer-events-none"
          )}
        >
          <div className="flex flex-row items-center gap-y-4 sm:flex-row sm:items-start sm:justify-center gap-x-24">
            <LifeDisplay />
            <GameClock />
          </div>
        </div>
        <ResultsActions />
      </div>
    </div>
  );
};

export default Footer;
