import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { rules } from "./rules";

interface HowToPlayGridProps {
  activeRule: number;
}

const GRID_SIZE = 5;
const CLUE_LENGTH = 3;

const createEmptyClues = () =>
  Array.from({ length: GRID_SIZE }, () => Array.from({ length: CLUE_LENGTH }, () => ""));

const createEmptyBoard = (): HowToPlayCellState[][] =>
  Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => 0 as HowToPlayCellState)
  );

const CELL_COLORS = {
  filled: "#1F2937",
  empty: "#FFFFFF",
  disabled: "#E5E7EB",
};

const getCellColor = (value: HowToPlayCellState | number | boolean | undefined) => {
  if (value === 2) {
    return CELL_COLORS.disabled;
  }

  if (value === 1 || value === true) {
    return CELL_COLORS.filled;
  }

  return CELL_COLORS.empty;
};

const HowToPlayGrid = ({ activeRule }: HowToPlayGridProps) => {
  const rowRules = rules[activeRule]?.rowRules ?? createEmptyClues();
  const colRules = rules[activeRule]?.colRules ?? createEmptyClues();
  const board = rules[activeRule]?.board ?? createEmptyBoard();

  const maxRuleLength = Math.max(...colRules.map((col) => col.length), 0);

  const renderRowRules = (className?: string, isGhost?: boolean) => (
    <div
      className={cn("grid grid-rows-5 gap-y-1", className, {
        "invisible pointer-events-none select-none": isGhost,
      })}
      aria-hidden={isGhost}
    >
      {rowRules.map((clue, idx) => (
        <div key={idx} className="flex h-7 items-center justify-end gap-x-3">
          {clue.map((num, clueIdx) => (
            <span key={clueIdx} className="text-xs leading-none tracking-tight">
              {num}
            </span>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex items-center justify-center h-40">
      <div className="flex items-start justify-center gap-1">
        <div className="flex flex-col items-end gap-1">
          <div style={{ height: `${maxRuleLength * 24}px` }}/>
          {renderRowRules("mr-3")}
        </div>
        <div className="flex flex-col items-start gap-1">
          <div className="grid grid-cols-5 gap-x-2 mb-2 w-full">
            {colRules.map((clue, idx) => (
              <div key={idx} className="flex flex-col items-center justify-end gap-y-2">
                {clue
                  .slice()
                  .reverse()
                  .map((num, clueIdx) => (
                    <span key={clueIdx} className="text-xs leading-none tracking-tight">
                      {num}
                    </span>
                  ))}
              </div>
            ))}
          </div>
          <div className="inline-block overflow-hidden rounded-md border-4 border-gray-800 shadow-[0_0_10px_rgba(0,0,0,0.2)]">
            {board.map((row, rIdx) => (
              <div key={rIdx} className="flex">
                {row.map((cell, cIdx) => {
                  const cellColor = getCellColor(cell);
                  return (
                    <motion.span
                      key={cIdx}
                      className="size-8 border border-gray-400"
                      style={{ backgroundColor: cellColor }}
                      initial={false}
                      animate={{ backgroundColor: cellColor }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        {renderRowRules("ml-3", true)}
      </div>
    </div>
  );
};

export default HowToPlayGrid;
