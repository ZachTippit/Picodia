import PuzzleGrid from "./PuzzleGrid";
import { RulesRow, RulesCol } from "./Rules";
import GameEndEffects from "./GameEndEffects";
import { cn } from "@/utils/cn";
import { getColumnRules } from "@/utils/ruleUtils";
import { useCurrentPuzzleAttempt } from "@/hooks/useCurrentPuzzleAttempt";
import { GameStatus } from "@/types/enums";
import { AnimatePresence, motion } from "framer-motion";

export const Nonogram = () => {
  const { data: currentAttempt } = useCurrentPuzzleAttempt();

  const rulesSource = currentAttempt?.solution ?? [];
  const rules = getColumnRules(rulesSource);
  const maxRuleLength = Math.max(...rules.map((col) => col.length), 0);
  const isGameOver = currentAttempt?.status === GameStatus.Completed;
  const colRuleHeightPx = !isGameOver ? maxRuleLength * 24 : 0;
  
  return (
    <div className="flex flex-col items-center gap-4 my-6">
      <GameEndEffects />
      <div className="flex items-start justify-center gap-0.5 w-full">
        <AnimatePresence>
          {!isGameOver && (
            <motion.div
              key="row-rules-left"
              className="flex flex-col items-end"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <div className="mb-2" style={{ height: `${maxRuleLength * 24 + 24}px` }} />
              <RulesRow className="mr-2" />
            </motion.div>
          )}
        </AnimatePresence>
        <div className={cn("flex flex-col items-start gap-0.5", isGameOver ? "items-center" : "")}>
          <div className="mb-2 w-full" style={{ minHeight: `${colRuleHeightPx}px` }}>
            <AnimatePresence>
              {!isGameOver && (
                <motion.div
                  key="col-rules"
                  className="w-full"
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  <RulesCol className="w-full" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.div layout>
            <PuzzleGrid />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
