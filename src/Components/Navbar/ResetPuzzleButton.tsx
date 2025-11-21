import MenuButton from './MenuButton';
import { useResetPuzzle } from '@/hooks/useResetPuzzle';

const ResetPuzzleButton = () => {
  const { resetPuzzle, isResetting } = useResetPuzzle();

  return (
    <MenuButton
      onClick={() => resetPuzzle()}
      disabled={isResetting}
      className="bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
    >
      {isResetting ? 'Resetting…' : 'Reset Puzzle'}
    </MenuButton>
  );
};

export default ResetPuzzleButton;
