import { use } from 'react';
import { GameContext } from '../../GameContext';
import { useGetPuzzles } from '../../hooks/useGetPuzzle';
import { Nonogram } from './Nonogram';
import SolveToStart from '../SolveToStart';

const Game = () => {
  const { state: { isGameStarted }, actions } = use(GameContext);

  const { data: puzzles } = useGetPuzzles();
  if (!puzzles) return <div className="min-h-[450px] flex flex-row items-center justify-center">Loading...</div>;

  const dailyPuzzle = puzzles[0];
  console.log('puzzles data in Game2:', puzzles);
  return (
    <div>
      {
        !isGameStarted ? 
        <SolveToStart /> 
        :
        <Nonogram puzzle={dailyPuzzle} />
      }
    </div>
  );
};

export default Game;
