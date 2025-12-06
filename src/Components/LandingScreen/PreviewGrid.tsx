import { useMemo } from 'react';
import { cn } from '@utils/cn';

const answer = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0],
];

const PreviewGrid = () => {
  const grid = useMemo(
    () =>
      answer.map((row, r) =>
        row.map((value, c) => ({
          filled: value === 1,
          id: `${r}-${c}`,
        }))
      ),
    []
  );

  return (
    <div className="flex w-full flex-1 items-center justify-center">
      <div
        className={cn('grid grid-cols-1 grid-rows-1 transition-transform duration-700 ease-out')}
      >
        <div className="inline-block overflow-hidden rounded-md border-4 border-gray-800 shadow-[0_0_10px_rgba(0,0,0,0.2)]">
          {grid.map((row, rIdx) => (
            <div key={rIdx} className="flex">
              {row.map((cell, cIdx) => (
                <span
                  key={`${rIdx}-${cIdx}`}
                  className={cn(
                    'flex size-3 select-none items-center justify-center border border-gray-600 transition-all',
                    cell.filled ? 'bg-gray-800' : 'bg-white'
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreviewGrid;
