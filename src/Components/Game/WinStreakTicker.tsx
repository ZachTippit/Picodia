import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame } from "lucide-react";

type WinStreakTickerProps = {
  currentStreak: number | null;
  previousStreak: number | null;
  isLoading: boolean;
};

type RollingNumberProps = {
  value: number;
  previousValue: number | null;
};

const RollingNumber = ({ value, previousValue }: RollingNumberProps) => {
  const shouldAnimate = previousValue !== null && previousValue !== value;
  const direction = previousValue !== null && previousValue > value ? -1 : 1;

  return (
    <div className="relative h-12 min-w-[68px] overflow-hidden rounded-2xl bg-gray-900 px-4 text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]">
      <AnimatePresence initial={false} custom={direction}>
        <motion.span
          key={value}
          custom={direction}
          initial={
            shouldAnimate
              ? { y: direction > 0 ? "-100%" : "100%", opacity: 0 }
              : { y: 0, opacity: 1 }
          }
          animate={{ y: 0, opacity: 1 }}
          exit={
            shouldAnimate
              ? { y: direction > 0 ? "100%" : "-100%", opacity: 0 }
              : { opacity: 0 }
          }
          transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center text-3xl font-black leading-none"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

const WinStreakTicker = ({ currentStreak, previousStreak, isLoading }: WinStreakTickerProps) => {
  const fallbackPrevious = useMemo(() => {
    if (previousStreak !== null) {
      return previousStreak;
    }
    if (currentStreak !== null && currentStreak > 0) {
      return currentStreak - 1;
    }
    return null;
  }, [currentStreak, previousStreak]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
      className="flex flex-col items-center gap-2 text-gray-900"
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">
        Current Streak
      </span>
      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white/80 px-4 py-2 shadow-sm">
        <Flame size={22} strokeWidth={3} className="text-orange-700" />
        {currentStreak !== null ? (
          <RollingNumber value={currentStreak} previousValue={fallbackPrevious} />
        ) : (
          <span className="text-lg font-semibold text-gray-500">
            {isLoading ? "…" : "—"}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default WinStreakTicker;
