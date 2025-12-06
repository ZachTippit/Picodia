import PuzzleGrid from "./PuzzleGrid";
import { RulesRow, RulesCol } from "./Rules";
import GameEndEffects from "./GameEndEffects";
import { cn } from "@/utils/cn";
import { getColumnRules } from "@/utils/ruleUtils";
import { useCurrentPuzzleAttempt } from "@/hooks/useCurrentPuzzleAttempt";

export const Nonogram = () => {
  const { data: currentAttempt } = useCurrentPuzzleAttempt();

  const rulesSource = currentAttempt?.solution ?? [];
  const rules = getColumnRules(rulesSource);
  const maxRuleLength = Math.max(...rules.map((col) => col.length), 0);
  const rulesColHeightSpacer = `${"h-" + maxRuleLength * 6}`;
  
  return (
    <div className="flex flex-col items-center gap-4 my-6">
      <GameEndEffects />
      <div className="flex items-start justify-center gap-0.5">
        {/* Row rules */}
        <div className="flex flex-col items-end gap-0.5">
          <div className={cn("mb-2", rulesColHeightSpacer)} aria-hidden />
          <RulesRow className="mr-2" />
        </div>
        <div className="flex flex-col items-start gap-0.5">
          {/* Column rules */}
          <RulesCol className="mb-2 w-full" />
          {/* Puzzle grid */}
          <PuzzleGrid />
        </div>
        {/* Spacer to mirror row rules width so the grid centers horizontally */}
        <div className="flex flex-col items-start gap-0.5" aria-hidden>
          <div className="h-12 mb-2" />
          <RulesRow className="ml-2 invisible pointer-events-none select-none" />
        </div>
      </div>
    </div>
  );
};
