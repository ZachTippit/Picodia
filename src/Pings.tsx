import { use } from 'react';
import { GameContext } from './GameContext';

interface PingsProps {
    playedToday: boolean;
    goAlert: boolean;
    alert: boolean;
    gameOverNote?: string | false;
    whatIsIt?: string;
}

const Pings = (_props: PingsProps) => {
  use(GameContext);
  return null;
}

export default Pings
