import { useCurrentPuzzleAttempt } from "@/hooks/useCurrentPuzzleAttempt";
import { useDailyPuzzle } from "@/hooks/useDailyPuzzle";
import { getColumnRules, getColumnRuleStatuses, getRowRules, getRowRuleStatuses } from "@/utils/ruleUtils";

const RulesRow = () => {
  const { data: dailyPuzzle } = useDailyPuzzle();
  const { data: currentAttempt } = useCurrentPuzzleAttempt();

  const rulesSource = currentAttempt?.progress ?? dailyPuzzle?.puzzle_array ?? [];
  const rules = getRowRules(rulesSource);
  const statuses = getRowRuleStatuses(rulesSource);
  
  return (
    <div className="grid grid-rows-7 gap-y-0.5 mr-2">
      {rules.map((rule, r) => (
        <div key={r} className="flex justify-end items-center h-10 gap-x-2">
          {rule.map((num, i) => (
            <span
              key={i}
              className={`text-xs leading-none mr-1 ${statuses[r]?.[i]?.satisfied ? "line-through opacity-60" : ""}`}
            >
              {num}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

const RulesCol = () => {
  const { data: dailyPuzzle } = useDailyPuzzle();
  const { data: currentAttempt } = useCurrentPuzzleAttempt();

  const rulesSource = currentAttempt?.progress ?? dailyPuzzle?.puzzle_array ?? [];
  const rules = getColumnRules(rulesSource);
  const statuses = getColumnRuleStatuses(rulesSource);

  return (
    <div className="grid grid-cols-7 gap-x-0.5 mb-2">
      {rules.map((rule, c) => (
        <div key={c} className="flex flex-col items-center justify-end h-12 gap-y-2">
          {/* 👇 reverse order so top aligns with top of grid */}
          {rule
            .slice()
            .map((num, i) => (
              <span
                key={i}
                className={`text-xs leading-none ${statuses[c]?.[i]?.satisfied ? "line-through opacity-60" : ""}`}
              >
                {num}
              </span>
            ))}
        </div>
      ))}
    </div>
  );
};

export { RulesRow, RulesCol }
