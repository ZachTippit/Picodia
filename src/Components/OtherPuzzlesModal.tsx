import { useGetPuzzles } from "@hooks/useGetPuzzles";
import { cn } from "@utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { overlayVariants, panelVariants } from "@/animations";
import { useUI } from "@/providers/UIProvider";

const DEFAULT_COMPLETION_STATUS = "Incomplete";
const DEFAULT_COMPLETION_TIME = "13:05";
const DEFAULT_BEST_TIME = "09:47";
const DEFAULT_BEST_DATE = "Jan 3, 2024";

const OtherPuzzlesModal = () => {
  const { data: puzzles, isPending } = useGetPuzzles();
  const { showOtherPuzzles, toggleOtherPuzzles } = useUI();

  return (
    <AnimatePresence>
      {showOtherPuzzles && (
        <div className="fixed inset-0 z-30 flex items-end justify-center px-4 py-6 sm:items-center">
          <motion.div
            className="absolute inset-0 bg-neutral-950/30"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            aria-hidden="true"
            onClick={toggleOtherPuzzles}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="other-puzzles-modal-title"
            className="relative z-10 flex w-full max-w-sm flex-col rounded-3xl border p-6 text-center shadow-2xl overflow-hidden border-gray-300 bg-white text-gray-900"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(event) => event.stopPropagation()}
          >
            <h1 id="other-puzzles-modal-title" className="mb-2 text-2xl font-semibold tracking-wide">
              PICODIA
            </h1>
            <h2 className="text-lg font-semibold tracking-wide text-gray-700">
              Other Puzzles
            </h2>
            <div className="mt-6 flex-1 overflow-hidden">
              {isPending ? (
                <div className="text-sm text-gray-500">Loading puzzles…</div>
              ) : (
                <div className="max-h-[50vh] space-y-3 overflow-y-auto pr-1">
                  {puzzles.map((puzzle) => (
                    <div
                      key={puzzle.id}
                      className={cn(
                        "flex items-center gap-4 rounded-xl border px-4 py-3 text-left text-sm transition-opacity duration-300 border-gray-200 bg-gray-100 text-gray-800"
                      )}
                    >
                      <div className="shrink-0">
                        <div className="flex size-12 items-center justify-center rounded-md border border-black bg-gray-300 font-semibold text-gray-700">
                          {puzzle.day}
                        </div>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-base font-semibold">Day {puzzle.day}</span>
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-wide",
                              "bg-gray-200 text-gray-600"
                            )}
                          >
                            {DEFAULT_COMPLETION_STATUS}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Time to Complete:</span>{" "}
                          {DEFAULT_COMPLETION_TIME}
                        </div>
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Best Time:</span>
                          {` ${DEFAULT_BEST_TIME} on ${DEFAULT_BEST_DATE}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={toggleOtherPuzzles}
                className="w-32 rounded-full bg-gray-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-gray-600 cursor-pointer"
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

export default OtherPuzzlesModal;
