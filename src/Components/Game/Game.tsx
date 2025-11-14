import { use, useEffect, useState } from 'react';
import { GameContext } from '../../providers/GameContext';
import { Nonogram } from './Nonogram';
import PreGameCountdown from './PreGameCountdown';
import { cn } from '@utils/cn';

const Game = () => {
  const {
    state: { isGameStarted },
  } = use(GameContext);

  const [puzzleVisible, setPuzzleVisible] = useState(false);

  useEffect(() => {
    if (isGameStarted) {
      const timeout = window.setTimeout(() => {
        setPuzzleVisible(true);
      }, 150);
      return () => clearTimeout(timeout);
    }

    setPuzzleVisible(false);
  }, [isGameStarted]);

  return (
    <div className="relative min-h-[450px] flex items-center justify-center">
      <PreGameCountdown setPuzzleVisible={setPuzzleVisible}/>
      {isGameStarted ? (
        <div
          className={cn('w-full transition-opacity duration-500', puzzleVisible ? 'opacity-100' : 'opacity-0')}
        >
          <Nonogram />
        </div>
      ) : null}
    </div>
  );
};

export default Game;
