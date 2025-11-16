import { cn } from '@utils/cn';

const howToPlayRules = [
  'Look at each row clue to see how many consecutive squares belong in that row.',
  'Line up matching row and column rules to lock in the cells where they overlap.',
  'Use temporary marks for blanks so you can track which cells must stay empty.',
];

interface HowToPlayProps {
  showRules: boolean;
  activeRule: number;
  onRuleChange: (next: number) => void;
}

const HowToPlay = ({ showRules, activeRule, onRuleChange }: HowToPlayProps) => {
  const handlePrevRule = () => {
    onRuleChange(Math.max(0, activeRule - 1));
  };

  const handleNextRule = () => {
    onRuleChange(Math.min(howToPlayRules.length - 1, activeRule + 1));
  };
  return (
    <div
      className={cn(
        'mt-5 flex w-full flex-col items-center gap-3 text-center transition-all duration-500 ease-out',
        showRules ? 'translate-y-0 opacity-100' : '-translate-y-3 pointer-events-none opacity-0'
      )}
    >
      <p className="min-h-14 text-sm leading-snug text-gray-700">{howToPlayRules[activeRule]}</p>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handlePrevRule}
          disabled={activeRule === 0}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full border border-gray-400 text-gray-700 transition-all duration-300',
            activeRule === 0 ? 'cursor-not-allowed opacity-40' : 'hover:bg-gray-200'
          )}
        >
          &larr;
        </button>
        <span className="text-xs uppercase tracking-[0.3em] text-gray-500">
          Step {activeRule + 1}/{howToPlayRules.length}
        </span>
        <button
          type="button"
          onClick={handleNextRule}
          disabled={activeRule === howToPlayRules.length - 1}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full border border-gray-400 text-gray-700 transition-all duration-300',
            activeRule === howToPlayRules.length - 1
              ? 'cursor-not-allowed opacity-40'
              : 'hover:bg-gray-200'
          )}
        >
          &rarr;
        </button>
      </div>
    </div>
  );
};

export default HowToPlay;
