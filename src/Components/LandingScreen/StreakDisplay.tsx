import { useCurrentPuzzleAttempt } from "@/hooks/useCurrentPuzzleAttempt";
import { useProfileStats } from "@/hooks/useProfileStats";
import { GameStatus } from "@/types/enums";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

const streakGroupVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut", delay: 0.45 } as const,
  },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2, ease: "easeIn" } as const },
};

const StreakDisplay = () => {
  const { data: currentPuzzleAttempt } = useCurrentPuzzleAttempt();
  const { data: userStats } = useProfileStats();

  const isPuzzleCompleted: boolean = currentPuzzleAttempt?.status === GameStatus.Completed;
  const streakColor =
    userStats?.current_streak > 0 && isPuzzleCompleted
      ? "text-orange-700"
      : "text-gray-500";

  return (
    <motion.div
      className="flex flex-col items-center gap-0.5 text-base text-gray-900 mt-8 max-w-48"
      variants={streakGroupVariants}
    >
      <span className="font-bold">Current Streak</span>
      <span className="w-full flex flex-row items-center justify-center gap-x-4">
        <Flame size={24} strokeWidth={3} className={streakColor} />
        <span className="text-2xl font-bold">{userStats?.current_streak ?? "—"}</span>
      </span>
      {
        userStats?.current_streak > 0 && !isPuzzleCompleted && (
            <span className={cn("text-sm font-medium italic")}>
                Complete the puzzle to maintain your streak!
            </span>
        )
      }
    </motion.div>
  );
};

export default StreakDisplay;
