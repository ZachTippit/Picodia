import { cn } from '../../lib/cn';

interface HowToPlayGridProps {
  activeRule: number;
}

const ruleOneRows = [
  { clue: '5', cells: [1, 1, 1, 1, 1] },
  { clue: '1', cells: [1, 0, 0, 0, 0] },
  { clue: '1 1', cells: [1, 0, 0, 0, 1] },
];

const ruleOneCols = [
  { clue: ["3"], cells: [1, 1, 1, 0, 0] },
  { clue: ['3', '1'], cells: [1, 1, 1, 0, 1] },
];

const ruleTwoBoard = [
  [0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0],
];

const ruleTwoRowClues = ['', '', '3', '', ''];
const ruleTwoColClues = ['', '', '3', '', ''];

const previewAnswer = [
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0],
];

const previewRowClues = [[5], [1, 1], [5], [1], [1]];
const previewColClues = [[5], [1, 1], [1, 1], [1, 1], [3]];

const HowToPlayGrid = ({ activeRule }: HowToPlayGridProps) => {
  if (activeRule === 0) {
    return (
      <div className="flex items-end justify-center gap-6 h-40">
        <div className="flex flex-col gap-3">
          {ruleOneRows.map(({ clue, cells }, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-10 text-right text-xs font-semibold text-gray-600">{clue}</span>
              <div className="flex rounded-md border-4 border-gray-800 shadow-[0_0_10px_rgba(0,0,0,0.2)]">
                {cells.map((cell, cellIndex) => (
                  <span
                    key={cellIndex}
                    className={cn('h-5 w-5 border border-gray-400', cell ? 'bg-gray-800' : 'bg-white')}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-end gap-4">
          {ruleOneCols.map(({ clue, cells }, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              {clue.map((clueItem, clueIndex) => (
                <span key={clueIndex} className="text-xs font-semibold text-gray-600">
                  {clueItem}
                </span>
              ))}
              <div className="flex flex-col rounded-md border-4 border-gray-800 shadow-[0_0_10px_rgba(0,0,0,0.2)]">
                {cells.map((cell, cellIndex) => (
                  <span
                    key={cellIndex}
                    className={cn('h-5 w-5 border border-gray-400', cell ? 'bg-gray-800' : 'bg-white')}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeRule === 1) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-0.5">
          <div />
          <div className="grid grid-cols-5 gap-x-0.5">
            {ruleTwoColClues.map((clue, idx) => (
              <div key={idx} className="flex h-5 flex-col items-center justify-end gap-y-2">
                {clue && <span className="text-xs leading-none">{clue}</span>}
              </div>
            ))}
          </div>
          <div className="grid grid-rows-5 gap-y-0.5">
            {ruleTwoRowClues.map((clue, idx) => (
              <div key={idx} className="flex h-5 w-8 items-center justify-end gap-x-2">
                {clue && <span className="text-xs leading-none">{clue}</span>}
              </div>
            ))}
          </div>
          <div className="inline-block overflow-hidden rounded-md border-4 border-gray-800 shadow-[0_0_10px_rgba(0,0,0,0.2)]">
            {ruleTwoBoard.map((row, rIdx) => (
              <div key={rIdx} className="flex">
                {row.map((cell, cIdx) => (
                  <span
                    key={cIdx}
                    className={cn('h-5 w-5 border border-gray-400', cell ? 'bg-gray-800' : 'bg-white')}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeRule === 2) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-0.5">
          <div />
          <div className="grid grid-cols-5 gap-x-0.5 mb-1">
            {previewColClues.map((clue, idx) => (
              <div key={idx} className="flex h-5 flex-col items-center justify-end gap-y-2">
                {clue
                  .slice()
                  .reverse()
                  .map((num, clueIdx) => (
                    <span key={clueIdx} className="text-xs leading-none">
                      {num}
                    </span>
                  ))}
              </div>
            ))}
          </div>
          <div className="grid grid-rows-5 gap-y-0.5 mr-1">
            {previewRowClues.map((clue, idx) => (
              <div key={idx} className="flex h-5 items-center justify-end gap-x-2">
                {clue.map((num, clueIdx) => (
                  <span key={clueIdx} className="mr-1 text-xs leading-none">
                    {num}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="inline-block overflow-hidden rounded-md border-4 border-gray-800 shadow-[0_0_10px_rgba(0,0,0,0.2)]">
            {previewAnswer.map((row, rIdx) => (
              <div key={rIdx} className="flex">
                {row.map((cell, cIdx) => (
                  <span
                    key={cIdx}
                    className={cn('h-5 w-5 border border-gray-400', cell ? 'bg-gray-800' : 'bg-white')}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default HowToPlayGrid;
