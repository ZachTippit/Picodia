import { use, useState } from 'react';
import { useSelector } from 'react-redux';
import { GameContext } from '../GameContext';

interface PingProps {
  note: string;
}

const Ping = ({ note }: PingProps ) => {
  const { state: { startPing, didWin, hasPlayedToday } } = use(GameContext);
  const [close, setClose] = useState(false);

  return (
    <div
      id="clip-ping"
      className={
        'clip-anim-in ' +
        (hasPlayedToday || startPing
          ? 'played-ping '
          : (didWin ? 'win-ping ' : 'lose-ping ') + (close && 'clip-anim-out '))
      }
      onAnimationEnd={() => setTimeout(() => setClose(!close), 2000)}
    >
      {note}
    </div>
  );
};

export default Ping;
