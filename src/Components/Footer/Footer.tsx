import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@utils/cn";
import ResultsActions from "./ResultsActions";
import { useCurrentPuzzleAttempt } from "@/hooks/useCurrentPuzzleAttempt";
import { GameStatus } from "@/types/enums";
import LiveStats from "../Game/LiveStats";

const Footer = () => {

  const { data: currentPuzzleAttempt } = useCurrentPuzzleAttempt();
  const inProgress = currentPuzzleAttempt?.status === GameStatus.InProgress;
  const isGameOver = currentPuzzleAttempt?.status === GameStatus.Completed;
  const showLiveStats = inProgress;

  if(!currentPuzzleAttempt) return null;

  return (
    <div
      className={cn(
        "w-full border border-b-0 border-x-0 border-t-gray-300 bg-gray-200 transition-all duration-500",
        isGameOver ? "pt-6 pb-12" : "pt-6 pb-10"
      )}
    >
      <div className="flex flex-col w-full items-center justify-center gap-4">
        <AnimatePresence initial={false}>
          {showLiveStats && (
            <motion.div
              key="footer-live-stats"
              initial={{ opacity: 0, y: 8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 8, height: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full overflow-hidden"
              aria-hidden={!showLiveStats}
            >
              <div className="flex w-full items-center justify-center">
                <LiveStats />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <ResultsActions isGameOver={isGameOver} />
      </div>
    </div>
  );
};

export default Footer;
