import React from 'react';

interface RowCluesProps {
  rowClues: number[][];
}

const RowClues = ({rowClues}: RowCluesProps ) => {
  return (
    <div className="grid grid-rows-7 gap-y-0.5 mr-2">
      {rowClues.map((clue, r) => (
        <div key={r} className="flex justify-end items-center h-10 gap-x-2">
          {clue.map((num, i) => (
            <span key={i} className="text-xs leading-none mr-1">
              {num}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default RowClues;
