import { useProfileStats } from "@hooks/useProfileStats";
import { AnimatePresence, motion } from "framer-motion";
import { panelVariants } from "@/animations";
import { formatTime } from "@/utils/statHelpers";
import { useUI } from "@/providers/UIProvider";
import Underlay from "./Underlay";

const Stats = () => {
  const { showStats, toggleStats } = useUI();
  const { data: profileStats, isPending } = useProfileStats();

  if(!profileStats){
    return null;
  };

  const gamesAttempted = profileStats?.games_played ?? 0;
  const gamesWon = profileStats?.wins ?? 0;
  const gamesLost = profileStats?.losses ?? 0;
  const gamesCompleted = gamesWon + gamesLost;
  const averageTimeSeconds =
    gamesCompleted > 0
      ? (profileStats?.total_completed_time_seconds ?? 0) / gamesCompleted
      : null;
  const averageLives =
    gamesCompleted > 0 ? (profileStats?.total_completed_lives ?? 0) / gamesCompleted : null;

  const stats = [
    { label: "Games Attempted", value: gamesAttempted },
    { label: "Games Completed", value: gamesCompleted },
    { label: "Games Won", value: gamesWon },
    { label: "Games Lost", value: gamesLost },
    {
      label: "Avg. Completion Time",
      value: gamesCompleted > 0 ? formatTime(averageTimeSeconds) : "--",
    },
    {
      label: "Avg. Lives Remaining",
      value: gamesCompleted > 0 ? averageLives?.toFixed(1) : "--",
    },
  ];

  return (
    <AnimatePresence>
      {showStats && (
        <div className="fixed inset-0 z-30 flex items-end justify-center px-4 py-6 sm:items-center">
          <Underlay />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="stats-modal-title"
            className="relative z-10 w-full max-w-sm rounded-3xl border p-6 text-center shadow-2xl border-gray-300 bg-white text-gray-900"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(event) => event.stopPropagation()}
          >
            <h1 id="stats-modal-title" className="mb-2 text-2xl font-semibold tracking-wide">
              PICODIA
            </h1>
            <h2 className="text-lg font-semibold tracking-wide text-gray-700">Your Stats</h2>
            <div className="mt-6 flex flex-col gap-4">
              {isPending ? (
                <div className="text-sm text-gray-500">Loading stats…</div>
              ) : (
                stats.map((entry) => (
                  <div
                    key={entry.label}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-opacity duration-300 bg-gray-100 text-gray-700"
                  >
                    <span className="text-left">{entry.label}</span>
                    <span className="text-right text-base font-semibold">{entry.value}</span>
                  </div>
                ))
              )}
            </div>
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={toggleStats}
                className="w-32 rounded-full bg-gray-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Stats;
