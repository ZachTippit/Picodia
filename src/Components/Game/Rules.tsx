import type { HTMLAttributes } from "react";
import { motion } from "framer-motion";
import { useCurrentPuzzleAttempt } from "@/hooks/useCurrentPuzzleAttempt";
import { cn } from "@/utils/cn";
import {
  getColumnRules,
  getColumnRuleStatuses,
  getRowRules,
  getRowRuleStatuses,
} from "@/utils/ruleUtils";

const RuleNumber = ({ value, done }: { value: number; done?: boolean }) => (
  <div className="relative flex items-center justify-center min-w-[0.75rem] mr-0 sm:mr-1">
    <span className={cn("text-sm sm:text-base font-bold leading-none", done ? "text-gray-500" : "")}>
      {value}
    </span>
    <motion.div
      className="absolute left-0 right-0 top-1/2 h-[2px] bg-current"
      style={{ transformOrigin: "left center" }}
      initial={false}
      animate={{ scaleX: done ? 1 : 0, opacity: done ? 0.85 : 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    />
  </div>
);

const RulesRow = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  const { data: currentAttempt } = useCurrentPuzzleAttempt();

  const rulesSource = currentAttempt?.solution ?? [];
  const rules = getRowRules(rulesSource);
  const statuses = getRowRuleStatuses(rulesSource);

  return (
    <div className={cn("grid grid-rows-7 gap-y-0.5", className)} {...props}>
      {rules.map((rule, r) => (
        <div key={r} className="flex justify-end items-center h-10 gap-x-1 sm:gap-x-2">
          {rule.map((num, i) => (
            <RuleNumber key={i} value={num} done={statuses[r]?.[i]?.satisfied} />
          ))}
        </div>
      ))}
    </div>
  );
};

const RulesCol = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  const { data: currentAttempt } = useCurrentPuzzleAttempt();

  const rulesSource = currentAttempt?.solution ?? [];
  const rules = getColumnRules(rulesSource);
  const statuses = getColumnRuleStatuses(rulesSource);

  return (
    <div className={cn("grid grid-cols-7 gap-x-0.5", className)} {...props}>
      {rules.map((rule, c) => (
        <div key={c} className="flex flex-col items-center justify-end h-12 gap-y-2">
          {/* 👇 reverse order so top aligns with top of grid */}
          {rule.slice().map((num, i) => (
            <RuleNumber key={i} value={num} done={statuses[c]?.[i]?.satisfied} />
          ))}
        </div>
      ))}
    </div>
  );
};

export { RulesRow, RulesCol };
