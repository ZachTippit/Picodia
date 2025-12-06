import { useElapsedTime } from "@/hooks/useElapsedTime";

const GameClock = () => {
  const elapsedSeconds = useElapsedTime();

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  return (
    <div className="fade-in-fwd move-on-start-footer ">
      <p className="text-center mb-2 font-bold">TIME</p>
      <div className="m-auto text-center">
        <label className="text-sm">{minutes.toString().padStart(2, "0")}</label>
        :
        <label className="text-sm">{seconds.toString().padStart(2, "0")}</label>
      </div>
    </div>
  );
};

export default GameClock;
