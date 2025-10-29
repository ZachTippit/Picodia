import React from 'react';

interface PuzzleGridProps {
    grid: ('filled' | 'empty' | 'marked')[][];
    toggleCell: (r: number, c: number) => void;
    isSolved: boolean;
}

const PuzzleGrid = ({ grid, toggleCell, isSolved }: PuzzleGridProps) => {
  return (
    <div
      className="inline-block border-4 border-gray-800 rounded-md overflow-hidden 
               shadow-[0_0_10px_rgba(0,0,0,0.2)]"
    >
      {grid.map((row, r) => (
        <div key={r} className="flex">
          {row.map((cell, c) => (
            <div
              key={c}
              onClick={() => toggleCell(r, c)}
              className={[
                'w-8 h-8 sm:w-10 sm:h-10 border border-gray-600 flex items-center justify-center cursor-pointer transition-all select-none',
                cell === 'filled'
                  ? 'bg-gray-800'
                  : cell === 'marked'
                    ? 'bg-gray-100 text-red-500 font-bold'
                    : 'bg-white hover:bg-gray-200',
              ].join(' ')}
            >
              {cell === 'marked' && '✕'}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PuzzleGrid;
