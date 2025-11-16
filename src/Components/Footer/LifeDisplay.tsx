import { use } from "react";
import { GameContext } from "@/providers/GameContext";
// @ts-ignore
import { default as Heart } from "../../assets/heart.png";
// @ts-ignore
import { default as EmptyHeart } from "../../assets/empty-heart.png";
import { MAX_LIVES } from "@/utils/configs";

const LifeDisplay = () => {
  const { lives } = use(GameContext);

  const displayLives = () => {
    let hearts = Array(MAX_LIVES).fill(EmptyHeart);
    hearts = hearts.map((heart, index) => {
      if (index < lives) {
        heart = Heart;
      }
      return heart;
    });
    return hearts;
  };

  return (
    <div className="move-on-start-footer">
      <p className="text-center mb-2 font-bold">LIVES</p>
      <div className="flex flex-row gap-x-1">
        {displayLives().map((heart, index) => (
          <img className="life" src={heart} alt="Lives" key={`heart${index}`} />
        ))}
      </div>
    </div>
  );
};

export default LifeDisplay;
