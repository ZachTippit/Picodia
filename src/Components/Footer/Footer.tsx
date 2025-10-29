import { use } from 'react';

// @ts-ignore
import { default as Heart } from '../../assets/heart.png';
// @ts-ignore
import { default as EmptyHeart } from '../../assets/empty-heart.png';
import { GameContext } from '../../GameContext';
import SolvePuzzlePrompt from './SolvePuzzlePrompt';
import GameClock from './GameClock';

const Footer = () => {
  const { state: { isGameStarted, maxLives, lives } } = use(GameContext);

  const displayLives = () => {
    let hearts = Array(maxLives).fill(EmptyHeart);
    hearts = hearts.map((heart, index) => {
      if (index < lives) {
        console.log('setting heart at index', index);
        heart = Heart;
      }
      return heart;
    });
    console.log('hearts array:', hearts);
    return hearts;
  }

  return (
    <div className="w-full flex justify-around mb-8 pt-4 overflow-y-hidden transition-all duration-3000 border border-b-0 border-x-0 border-t-gray-300">
      {!isGameStarted ? (
        <SolvePuzzlePrompt />
      ) : (
        <>
          <div className="move-on-start-footer">
            <p className="text-center mb-2 font-bold">LIVES</p>
            <div className="flex flex-row gap-x-1">
              {displayLives().map((heart, index) => (
                <img className="life" src={heart} alt="Lives" key={`heart${index}`} />
              ))}
            </div>
            <div id="lives" className="flex justify-center mt-2">
              {/* {[...Array(maxLives)].map((life, index) => (
                <>
                  {hasPlayedToday ? (
                    <>
                      {index >= localStorage.prevLives ? (
                        <img
                          className="life vibrate-1"
                          src={EmptyHeart}
                          alt="Lives"
                          key={`no-heart${index}`}
                        />
                      ) : (
                        <img className="life" src={Heart} alt="Lives" key={`heart${index}`} />
                      )}
                    </>
                  ) : (
                    <>
                      {index >= lives ? (
                        <img
                          className="life vibrate-1"
                          src={EmptyHeart}
                          alt="Lives"
                          key={`no-heart${index}`}
                        />
                      ) : (
                        <img className="life" src={Heart} alt="Lives" key={`heart${index}`} />
                      )}
                    </>
                  )}
                </>
              ))} */}
            </div>
          </div>
          <GameClock />
        </>
      )}
    </div>
  );
};

export default Footer;
