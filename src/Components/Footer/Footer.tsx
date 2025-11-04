import { use } from 'react';

// @ts-ignore
import { default as Heart } from '../../assets/heart.png';
// @ts-ignore
import { default as EmptyHeart } from '../../assets/empty-heart.png';
import { GameContext } from '../../GameContext';
import GameClock from './GameClock';
import { cn } from '../../lib/cn';
import { useSupabaseAuth } from '../../SupabaseProvider';

interface FooterProps {
  onOpenLogin?: () => void;
  onOpenLoginForResults?: () => void;
}

const Footer = ({ onOpenLogin, onOpenLoginForResults }: FooterProps) => {
  const {
    state: { isGameStarted, maxLives, lives, gameOver },
    actions: { toggleStats },
  } = use(GameContext);
  const { user } = useSupabaseAuth();
  const isLoggedIn = Boolean(user);

  const displayLives = () => {
    let hearts = Array(maxLives).fill(EmptyHeart);
    hearts = hearts.map((heart, index) => {
      if (index < lives) {
        heart = Heart;
      }
      return heart;
    });
    return hearts;
  }

  return (
    <div className="w-full mb-8 pt-4 overflow-y-hidden border border-b-0 border-x-0 border-t-gray-300">
      <div
        className={cn(
          'flex min-h-16 w-full flex-row items-center justify-center transition-opacity duration-500',
          isGameStarted ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="flex flex-row items-center gap-y-4 sm:flex-row sm:items-start sm:justify-center gap-x-24">
          <div className="move-on-start-footer">
            <p className="text-center mb-2 font-bold">LIVES</p>
            <div className="flex flex-row gap-x-1">
              {displayLives().map((heart, index) => (
                <img className="life" src={heart} alt="Lives" key={`heart${index}`} />
              ))}
            </div>
          </div>
          <GameClock />
        </div>
      </div>
      {isGameStarted && gameOver && (
        <div className="mt-4 flex flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={toggleStats}
            className="rounded-full bg-gray-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-gray-600"
          >
            See More Results
          </button>
          {!isLoggedIn && (
            <button
              type="button"
              onClick={() => onOpenLoginForResults?.() ?? onOpenLogin?.()}
              className="rounded-full bg-gray-600 px-4 py-2 text-white transition-colors duration-300 hover:bg-gray-700"
            >
              Log in to save results
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Footer;
