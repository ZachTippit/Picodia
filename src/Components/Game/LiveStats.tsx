import { cn } from "@/utils/cn";
import GameClock from "../Footer/GameClock";
import LifeDisplay from "../Footer/LifeDisplay";

type LiveStatsProps = {
  className?: string;
};

const LiveStats = ({ className }: LiveStatsProps) => {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-center gap-y-4 sm:flex-row sm:items-start sm:justify-center gap-x-24",
        className
      )}
    >
      <LifeDisplay />
      <GameClock />
    </div>
  );
};

export default LiveStats;
