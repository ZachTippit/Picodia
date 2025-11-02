import { useMemo } from 'react';
import { cn } from '../../lib/cn';

const answer = [
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0],
];

const rowClues = [[5], [1, 1], [5], [1], [1]];
const colClues = [[5], [1, 1], [1, 1], [1, 1], [3]];

interface GridProps {
    showClues: boolean;
    activeRule: number;
}
    
const Grid = ({ showClues, activeRule }: GridProps) => {

// Create 2D grid of objects with state
  const grid = useMemo(
    () =>
      answer.map((row, r) =>
        row.map((value, c) => ({
          correct: value === 1,
          filled: value === 1,
          id: `${r}-${c}`,
        }))
      ),
    []
  );

  const demoRows = [
    { clue: '5', cells: [1, 1, 1, 1, 1] },
    { clue: '1', cells: [1, 0, 0, 0, 0] },
    { clue: '1 1', cells: [1, 0, 0, 0, 1] },
  ];

  const demoColumns = [
    { clue: '3', cells: [1, 1, 1, 0, 0] },
    { clue: '3 1', cells: [1, 1, 1, 0, 1] },
  ];

  const plusBoard = [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
  ];

  const plusRowClues = ['', '', '3', '', ''];
  const plusColClues = ['', '', '3', '', ''];

  const showRuleOneDemo = showClues && activeRule === 0;
  const showRuleTwoDemo = showClues && activeRule === 1;
  const shouldShowStandardClues = showClues && !(showRuleOneDemo || showRuleTwoDemo);

  return (
    <div className="flex w-full flex-1 items-center justify-center">
      <div className="relative flex min-h-[150px] min-w-[150px] items-center justify-center">
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out',
            showRuleOneDemo || showRuleTwoDemo ? 'pointer-events-none opacity-0 scale-95' : 'opacity-100 scale-100'
          )}
        >
          <div
            className={cn(
              'grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-0.5 items-start justify-start transition-transform duration-700 ease-out',
              shouldShowStandardClues
                ? 'translate-x-[3px] translate-y-4 delay-75'
                : 'translate-x-0 translate-y-0 delay-0'
            )}
          >
            <div />
            <div
              className={cn(
                'transition-all duration-700 ease-out mb-1 origin-bottom',
                shouldShowStandardClues
                  ? 'grid grid-cols-5 gap-x-0.5 opacity-100 translate-y-0'
                  : 'pointer-events-none opacity-0 -translate-y-2 max-h-0 max-w-0 overflow-hidden'
              )}
            >
              {colClues.map((clue, c) => (
                <div key={c} className="flex h-5 flex-col items-center justify-end gap-y-2">
                  {clue
                    .slice()
                    .reverse()
                    .map((num, i) => (
                      <span key={i} className="text-xs leading-none">
                        {num}
                      </span>
                    ))}
                </div>
              ))}
            </div>
            <div
              className={cn(
                'transition-all duration-700 ease-out mr-1 origin-right',
                shouldShowStandardClues
                  ? 'grid grid-rows-5 gap-y-0.5 opacity-100 translate-x-0 max-w-[56px]'
                  : 'opacity-0 pointer-events-none -translate-x-2 max-w-0 overflow-hidden'
              )}
            >
              {rowClues.map((clue, r) => (
                <div key={r} className="flex h-5 items-center justify-end gap-x-2">
                  {clue.map((num, i) => (
                    <span key={i} className="mr-1 text-xs leading-none">
                      {num}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <div className="inline-block overflow-hidden rounded-md border-4 border-gray-800 shadow-[0_0_10px_rgba(0,0,0,0.2)]">
              {grid.map((row, r) => (
                <div key={r} className="flex">
                  {row.map((cell, c) => (
                    <button
                      key={cell.id}
                      className={cn(
                        'flex size-5 select-none items-center justify-center border border-gray-600 transition-all',
                        cell.filled ? 'bg-gray-800' : 'bg-white'
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out',
            showRuleOneDemo ? 'opacity-100 scale-100 delay-75' : 'pointer-events-none opacity-0 scale-95'
          )}
        >
          <div className="flex items-end gap-6">
            <div className="flex flex-col gap-3">
              {demoRows.map(({ clue, cells }, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-8 text-right text-xs font-semibold text-gray-600">{clue}</span>
                  <div className="flex gap-0.5">
                    {cells.map((cell, i) => (
                      <span
                        key={i}
                        className={cn(
                          'h-5 w-5 border border-gray-400 transition-colors duration-300',
                          cell ? 'bg-gray-800' : 'bg-white'
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-4">
              {demoColumns.map(({ clue, cells }, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600">{clue}</span>
                  <div className="flex flex-col gap-0.5">
                    {cells.map((cell, index) => (
                      <span
                        key={index}
                        className={cn(
                          'h-5 w-5 border border-gray-400 transition-colors duration-300',
                          cell ? 'bg-gray-800' : 'bg-white'
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out',
            showRuleTwoDemo ? 'opacity-100 scale-100 delay-75' : 'pointer-events-none opacity-0 scale-95'
          )}
        >
          <div
            className={cn(
              'grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-0.5 items-start justify-start'
            )}
          >
            <div />
            <div className="grid grid-cols-5 gap-x-0.5">
              {plusColClues.map((clue, idx) => (
                <div key={idx} className="flex h-5 flex-col items-center justify-end gap-y-2">
                  {clue && <span className="text-xs leading-none">{clue}</span>}
                </div>
              ))}
            </div>
            <div className="grid grid-rows-5 gap-y-0.5">
              {plusRowClues.map((clue, idx) => (
                <div key={idx} className="flex h-5 w-8 items-center justify-end gap-x-2">
                  {clue && <span className="text-xs leading-none">{clue}</span>}
                </div>
              ))}
            </div>
            <div className="inline-block overflow-hidden rounded-md border-4 border-gray-800 shadow-[0_0_10px_rgba(0,0,0,0.2)]">
              {plusBoard.map((row, rIdx) => (
                <div key={rIdx} className="flex">
                  {row.map((cell, cIdx) => (
                    <span
                      key={cIdx}
                      className={cn(
                        'h-5 w-5 border border-gray-400 transition-colors duration-300',
                        cell ? 'bg-gray-800' : 'bg-white'
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grid;
