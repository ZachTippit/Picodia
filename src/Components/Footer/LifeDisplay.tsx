// @ts-ignore
import { default as Heart } from "../../assets/heart.png";
// @ts-ignore
import { default as EmptyHeart } from "../../assets/empty-heart.png";
import { useCurrentPuzzleAttempt } from "@/hooks/useCurrentPuzzleAttempt";
import { useMemo } from "react";

const LifeDisplay = () => {
  const { data: currentPuzzleAttempt } = useCurrentPuzzleAttempt();

  const { lives_remaining: lives, max_lives } = currentPuzzleAttempt;

  const displayLives = useMemo(() => {
    let hearts = Array(max_lives).fill(EmptyHeart);
    hearts = hearts.map((heart, index) => {
      if (index < lives) {
        heart = Heart;
      }
      return heart;
    });
    return hearts;
  }, [lives, max_lives]);

  return (
    <div className="move-on-start-footer">
      <p className="text-center mb-2 font-bold">LIVES</p>
      <div className="flex flex-row gap-x-1">
        {displayLives.map((heart, index) => (
          <img className="life" src={heart} alt="Lives" key={`heart${index}`} />
        ))}
      </div>
    </div>
  );
};

export default LifeDisplay;
