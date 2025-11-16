import { use, useEffect } from "react";
import { GameContext } from "../../providers/GameContext";

const pad = (val: number) => {
  const value = Math.max(0, val);
  return value < 10 ? `0${value}` : `${value}`;
};

const GameClock = () => {
  const { elapsedSeconds, incrementElapsedSeconds } = use(GameContext);

  useEffect(() => {
    const interval = window.setInterval(() => {
      incrementElapsedSeconds();
    }, 1000);

    return () => window.clearInterval(interval);
  }, [incrementElapsedSeconds]);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  return (
    <div className="fade-in-fwd move-on-start-footer ">
      <p className="text-center mb-2 font-bold">TIME</p>
      <div className="m-auto text-center">
        <label className="text-sm">{pad(minutes)}</label>
        <label className="text-sm">:</label>
        <label className="text-sm">{pad(seconds)}</label>
      </div>
    </div>
  );
};

export default GameClock;
