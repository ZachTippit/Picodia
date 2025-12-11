import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Nonogram } from "./Nonogram";
import PreGameCountdown from "./PreGameCountdown";
import { cn } from "@utils/cn";
import LiveStats from "./LiveStats";
import { useUI } from "@/providers/UIProvider";
import { useCurrentPuzzleAttempt } from "@/hooks/useCurrentPuzzleAttempt";
import { useProfileStats } from "@/hooks/useProfileStats";
import { GameStatus, PuzzleOutcome } from "@/types/enums";
import WinStreakTicker from "./WinStreakTicker";

const usePreviousNumber = (value: number | null) => {
  const ref = useRef<number | null>(null);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

const Game = () => {
  const { showCountdown } = useUI();
  const { data: currentAttempt } = useCurrentPuzzleAttempt();
  const {
    data: profileStats,
    isPending: isProfilePending,
    isFetching: isProfileFetching,
    refetch: refetchProfileStats,
  } = useProfileStats();
  const [ puzzleVisible, setPuzzleVisible ] = useState(false);

  useEffect(() => {
    if (showCountdown) {
      setPuzzleVisible(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      setPuzzleVisible(true);
    }, 150);
    return () => clearTimeout(timeout);
  }, [showCountdown]);

  const isGameOver = currentAttempt?.status === GameStatus.Completed;
  const isWin = currentAttempt?.outcome === PuzzleOutcome.Win;
  const currentStreak =
    typeof profileStats?.current_streak === "number" ? profileStats.current_streak : null;
  const previousStreak = usePreviousNumber(currentStreak);
  const isStreakLoading = isProfilePending || isProfileFetching;

  useEffect(() => {
    if (!(isGameOver && isWin)) return;

    // Give the backend a moment to persist the streak before refetching so the UI tick is visible.
    const timeoutId = window.setTimeout(() => {
      refetchProfileStats();
    }, 650);

    return () => clearTimeout(timeoutId);
  }, [isGameOver, isWin, refetchProfileStats]);

  return (
    <div className="relative h-full flex flex-col items-center justify-start flex-1">
      {showCountdown && <PreGameCountdown setPuzzleVisible={setPuzzleVisible} />}
      <div
        className={cn(
          "w-full transition-opacity duration-500 flex flex-col items-center justify-center grow",
          puzzleVisible ? "opacity-100" : "opacity-0"
        )}
      >
        <Nonogram />
      </div>
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            key="game-over-banner"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.4 }}
            className="flex w-full justify-center overflow-hidden h-full py-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="text-center"
            >
              <p className="text-xl font-bold uppercase tracking-wide">
                {isWin ? "You Win!" : "You Lose"}
              </p>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="mt-4 flex flex-col items-center gap-5"
              >
                <LiveStats />
                {isWin && (
                  <WinStreakTicker
                    currentStreak={currentStreak}
                    previousStreak={previousStreak}
                    isLoading={isStreakLoading}
                  />
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Game;
