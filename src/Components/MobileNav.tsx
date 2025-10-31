import { use } from "react";
// @ts-ignore
import { default as Stats } from '../assets/graph.png';
// @ts-ignore
import { default as Settings } from '../assets/setting.png';
import { GameContext } from '../GameContext';

const MobileNav = () => {
    const { actions: { toggleStats, toggleSettings } } = use(GameContext);
  return (
    <div className="visible sm:invisible flex absolute bottom-0 left-0 right-0 h-16 border border-x-0 border-b-0 border-gray-800 bg-gray-100 items-center justify-around">
        <img
          src={Stats}
          alt="Stats icon"
          onClick={toggleStats}
          className="w-8"
        />
        <img
          src={Settings}
          alt="Settings icon"
          onClick={toggleSettings}
          className="w-8"
        />
    </div>
  )
}

export default MobileNav