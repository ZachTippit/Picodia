import { use } from 'react';
import { GameContext } from '../../GameContext';
import { useGetPuzzles } from '../../hooks/useGetPuzzle';
import { Nonogram } from './Nonogram';
import SolveToStart from '../Game/SolveToStart';

const Game2 = () => {
  const { state: { isGameStarted }, actions } = use(GameContext);

  const { data: puzzles } = useGetPuzzles();
  if (!puzzles) return <div>Loading...</div>;

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

export default Game2;
