
interface ColCluesProps {
  colClues: number[][];
}

const ColClues = ({ colClues }: ColCluesProps) => {
  return (
    <div className="grid grid-cols-7 gap-x-0.5 mb-2">
      {colClues.map((clue, c) => (
        <div key={c} className="flex flex-col items-center justify-end h-12 gap-y-2">
          {/* 👇 reverse order so top aligns with top of grid */}
          {clue
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

export default ColClues;
