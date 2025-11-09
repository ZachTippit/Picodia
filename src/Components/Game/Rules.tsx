import { useDailyPuzzle } from "@/hooks/useDailyPuzzle";
import { getColumnRules, getRowRules } from "@/utils/ruleUtils";

const RulesRow = () => {
  const { data: dailyPuzzle } = useDailyPuzzle();
  const solution = dailyPuzzle.puzzle_array;
  const rules = getRowRules(solution);
  
  return (
    <div className="grid grid-rows-7 gap-y-0.5 mr-2">
      {rules.map((rule, r) => (
        <div key={r} className="flex justify-end items-center h-10 gap-x-2">
          {rule.map((num, i) => (
            <span key={i} className="text-xs leading-none mr-1">
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
  const solution = dailyPuzzle.puzzle_array;
  const rules = getColumnRules(solution);

  return (
    <div className="grid grid-cols-7 gap-x-0.5 mb-2">
      {rules.map((rule, c) => (
        <div key={c} className="flex flex-col items-center justify-end h-12 gap-y-2">
          {/* 👇 reverse order so top aligns with top of grid */}
          {rule
            .slice()
            .map((num, i) => (
              <span key={i} className="text-xs leading-none">
                {num}
              </span>
            ))}
        </div>
      ))}
    </div>
  );
};

export { RulesRow, RulesCol }
